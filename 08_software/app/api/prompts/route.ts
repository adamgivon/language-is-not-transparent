// /app/api/prompts/route.ts
// ===========================================================
// Prepares & persists the USER turn (no model call).
// All fixes integrated: P0-P2 from canonical fix list
// ===========================================================

import { NextRequest, NextResponse } from "next/server";

import {
  ANCHOR_K_DEFAULT,
  ANCHOR_K_DEFAULT_MAX,
  ANCHOR_SIM_FLOOR,
  composeInstructionsString,
  parseFaissVersion,
} from "@/config/anchoring";

import { prisma } from "@/lib/db/logs";
import { getMCPVector, getIndexMeta } from "@/services/mcp/vector";
import { errorResponse } from "@/lib/utils/errors";
import { checkRateLimit } from "@/lib/utils/rateLimit";
import { timeouts } from "@/lib/utils/timeout";
import { HTTPStatus, ItemRole, ItemType } from "@/types/openai";
import { createItemAnchorRows } from "@/lib/anchoring/forensics";
import { selectAnchorsManually } from "@/lib/anchoring/selection-manual";
import { selectAnchorsWithLLM } from "@/lib/anchoring/selection-llm";
import { selectAnchorsSemanticly } from "@/lib/anchoring/selection-semantic";
import {
  extractTextFromContentJson,
  extractEssenceHeader,
  combineEssenceAndPrompt,
} from "@/lib/utils/contentExtraction";

// ============================================================================
// MAIN HANDLER
// ============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("=== /API/PROMPTS CALLED ===");
    console.log("Body:", JSON.stringify(body, null, 2));
    const { projectId, sessionId, turnId, userText, k, mode } = body as {
      projectId: string;
      sessionId: string;
      turnId: string;
      userText: string;
      k?: number;
      mode?: "anchored" | "control";
    };

    const isAnchored = mode === "anchored" || mode === undefined;

    // === P0: Input validation ===
    if (!projectId || !sessionId || !turnId) {
      return errorResponse(
        "INVALID_INPUT",
        "Missing required fields: projectId, sessionId, turnId",
        HTTPStatus.BAD_REQUEST
      );
    }

    // P2.9: Harden empty userText check
    if (!userText || !userText.trim()) {
      return errorResponse(
        "EMPTY_USER_TEXT",
        "userText cannot be empty or whitespace",
        HTTPStatus.BAD_REQUEST
      );
    }
    const trimmedUserText = userText.trim();

    // P1.4: Validate k parameter
    let kValue = ANCHOR_K_DEFAULT;
    if (k !== undefined) {
      if (!Number.isInteger(k) || k < 1) {
        return errorResponse(
          "INVALID_K",
          "k must be a positive integer",
          HTTPStatus.BAD_REQUEST
        );
      }
      if (k > ANCHOR_K_DEFAULT_MAX) {
        return errorResponse(
          "K_TOO_LARGE",
          `k must be ≤ ${ANCHOR_K_DEFAULT_MAX}`,
          HTTPStatus.BAD_REQUEST
        );
      }
      kValue = k;
    }

    // P2.5: Rate limiting
    const rl = checkRateLimit(`session:${sessionId}`);
    if (!rl.allowed) {
      return NextResponse.json(
        {
          code: "RATE_LIMITED",
          message: "Too many requests for this session. Try again shortly.",
          retryAfter: 60,
        },
        {
          status: HTTPStatus.TOO_MANY_REQUESTS,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rl.resetAt),
          },
        }
      );
    }

    // === Resolve session config ===
    const session = await timeouts.dbQuery(
      prisma.session.findUnique({
        where: { id: sessionId },
        select: {
          projectId: true,
          name: true, // ✅ ADD: Get session name
          project: {
            select: {
              name: true,
              anchorIndexId: true,
              promptIndexId: true,
              responseIndexId: true,
            },
          },
          embeddingContext: true,
          anchoringConfig: true,
        },
      })
    );

    if (!session) {
      return errorResponse(
        "SESSION_NOT_FOUND",
        "Session not found",
        HTTPStatus.NOT_FOUND
      );
    }
    if (
      !session.project.anchorIndexId ||
      !session.project.promptIndexId ||
      !session.project.responseIndexId
    ) {
      return errorResponse(
        "MISSING_FAISS_INDEX",
        "Project missing FAISS index IDs",
        HTTPStatus.INTERNAL_ERROR
      );
    }

    const authoritativeProjectId = session.projectId || projectId;

    if (!session.project || !session.project.name) {
      return errorResponse(
        "MISSING_PROJECT_NAME",
        "Project name not found",
        HTTPStatus.INTERNAL_ERROR
      );
    }
    if (!session.name) {
      return errorResponse(
        "MISSING_SESSION_NAME",
        "Session name not found",
        HTTPStatus.INTERNAL_ERROR
      );
    }
    const projectName = session.project.name; // ✅ ADD
    const sessionName = session.name; // ✅ ADD
    const embCtx = (session.embeddingContext as any) ?? {};
    const embeddingModel = embCtx.model ?? "text-embedding-3-large";
    const faissIndexVersion = parseFaissVersion(session.project.promptIndexId);

    // Store non-null versions for use in transaction
    const faissAnchorsIndexId = session.project.anchorIndexId!;
    const faissPromptsIndexId = session.project.promptIndexId!;

    // NEW CODE: Fetch session config
    const sessionConfig = session.anchoringConfig as any;
    console.log("=== SESSION CONFIG DEBUG ===");
    console.log("Session ID:", sessionId);
    console.log("Session Name:", session.name);
    console.log("Session Config:", JSON.stringify(sessionConfig, null, 2));

    if (!sessionConfig) {
      return errorResponse(
        "NO_CONFIG",
        "Session has no anchoring config. Create session with config first.",
        HTTPStatus.BAD_REQUEST
      );
    }

    // Extract config values
    const CONFIG_K = sessionConfig.k ?? ANCHOR_K_DEFAULT;
    const CONFIG_MAX_SELECTED = sessionConfig.maxSelected;
    const CONFIG_SIM_FLOOR = sessionConfig.simFloor ?? ANCHOR_SIM_FLOOR;
    const CONFIG_WEIGHT_PRECISION = sessionConfig.weightPrecision ?? 4; // new code - extract precision
    const CONFIG_SELECTION_METHOD = sessionConfig.selectionMethod ?? "semantic";
    const CONFIG_FORCED_ANCHORS = sessionConfig.forcedAnchors ?? {};
    const CONFIG_FORCED_PROTOCOLS = sessionConfig.forcedProtocols ?? [];
    console.log("=== EXTRACTED CONFIG VALUES ===");
    console.log("Selection Method:", CONFIG_SELECTION_METHOD);
    console.log("Max Selected:", CONFIG_MAX_SELECTED);
    console.log("Forced Anchors:", CONFIG_FORCED_ANCHORS);
    console.log("Forced Protocols:", CONFIG_FORCED_PROTOCOLS);
    console.log("===============================");

    // ✅ NEW: Fetch project's anchor system version BEFORE transaction
    const projectData = await timeouts.dbQuery(
      prisma.project.findUnique({
        where: { id: authoritativeProjectId },
        select: {
          anchorSystem: {
            select: { name: true },
          },
        },
      })
    );

    if (!projectData?.anchorSystem) {
      return errorResponse(
        "MISSING_ANCHOR_SYSTEM",
        "Project has no anchor system configured",
        HTTPStatus.INTERNAL_ERROR
      );
    }

    const projectVersion = projectData.anchorSystem.name;
    console.log(`Using project anchor version: ${projectVersion}`);

    // === P0.3 + P0.7: Idempotency with transaction ===
    const result = await timeouts.dbTransaction(
      prisma.$transaction(
        async (tx: any) => {
          // Re-check idempotency inside transaction
          const existing = await tx.item.findFirst({
            where: { sessionId, turnId, role: ItemRole.USER },
            select: {
              id: true,
              anchored: true,
              anchorSelection: true,
              anchorWeights: true,
              meta: true,
            },
          });

          if (existing) {
            // P1.1: Return cached instructionsString
            const cached = (existing.meta as any)?.instructionsString;
            if (cached) {
              return { turnId, instructionsString: cached };
            }

            // Control-mode items have no anchors - return empty instructions
            if (existing.anchored === false) {
              return { turnId, instructionsString: "" };
            }

            // P0.5: Recompose using stored anchorSelection order
            const anchorSelection = existing.anchorSelection as any;
            let selectedProtocols: string[] = [];
            let selectedAnchors: string[] = [];

            //new - handle structured anchorSelection format
            if (
              anchorSelection &&
              typeof anchorSelection === "object" &&
              !Array.isArray(anchorSelection)
            ) {
              selectedProtocols = anchorSelection.protocols ?? [];
              selectedAnchors = anchorSelection.anchors ?? [];
            } else if (Array.isArray(anchorSelection)) {
              //new - old format (backwards compatibility) - no protocols, all anchors
              selectedAnchors = anchorSelection;
            }

            if (
              selectedProtocols.length === 0 &&
              selectedAnchors.length === 0
            ) {
              return errorResponse(
                "NO_ANCHORS_SELECTED",
                "Existing item has no anchor selection",
                HTTPStatus.INTERNAL_ERROR
              );
            }

            //new - fetch protocol chunks (preserving stored order)
            const protocolChunks =
              selectedProtocols.length > 0
                ? ((await tx.anchorChunk.findMany({
                    where: {
                      name: { in: selectedProtocols },
                      version: projectVersion,
                    },
                    select: { name: true, text: true },
                  })) as Array<{ name: string; text: string }>)
                : [];

            //new - sort protocol chunks by stored order (selectedProtocols array)
            const sortedProtocolChunks = protocolChunks.sort((a, b) => {
              const indexA = selectedProtocols.indexOf(a.name);
              const indexB = selectedProtocols.indexOf(b.name);
              return indexA - indexB;
            });

            const protocolsText = sortedProtocolChunks
              .map((c) => c.text)
              .join("\n\n");
            const protocolNames = sortedProtocolChunks.map((c) => c.name);

            //new - fetch anchor chunks (preserving stored order)
            const anchorChunks =
              selectedAnchors.length > 0
                ? ((await tx.anchorChunk.findMany({
                    where: {
                      name: { in: selectedAnchors },
                      version: projectVersion,
                    },
                    select: { name: true, text: true },
                  })) as Array<{ name: string; text: string }>)
                : [];

            //new - sort anchor chunks by stored order (selectedAnchors array)
            const dynamicChunks = anchorChunks.sort((a, b) => {
              const indexA = selectedAnchors.indexOf(a.name);
              const indexB = selectedAnchors.indexOf(b.name);
              return indexA - indexB;
            });

            //new - get weights by name (already stored by name)
            const weightsByName =
              (existing.anchorWeights as Record<string, number>) ?? {};

            const dynamicAnchorsText = dynamicChunks
              .map((c) => c.text)
              .join("\n\n");
            const dynamicWeights: Record<string, number> = {};
            for (const c of dynamicChunks) {
              dynamicWeights[c.name.toLowerCase()] =
                weightsByName[c.name.toLowerCase()] ?? 0;
            }

            const instructionsString = composeInstructionsString({
              mode: "anchored",
              version: projectVersion,
              protocolsText,
              protocolNames: sortedProtocolChunks.map((c) => c.name), //new - pass protocol names
              dynamicWeights,
              dynamicAnchors: dynamicChunks.map((c) => c.name.toLowerCase()),
              dynamicAnchorsText,
            });

            return { turnId, instructionsString };
          }

          // === Fresh path (not idempotent) ===

          // P0.2: Get next seq
          const maxSeqResult = await tx.item.aggregate({
            _max: { seq: true },
            where: { sessionId },
          });
          const nextSeq = (maxSeqResult._max.seq ?? -1) + 1;

          // === Step 1: Fetch previous ASSISTANT response (for essence extraction) ===
          //new - Only for semantic mode, get previous response for essence header
          let essenceText: string | null = null;
          let previousResponseText: string | null = null;

          if (CONFIG_SELECTION_METHOD === "semantic") {
            //new - Get the most recent ASSISTANT item in this session
            const previousAssistant = await tx.item.findFirst({
              where: {
                sessionId,
                role: ItemRole.ASSISTANT,
              },
              orderBy: { seq: "desc" },
              select: { contentJson: true },
            });

            if (previousAssistant) {
              //new - Extract text from contentJson
              previousResponseText = extractTextFromContentJson(
                previousAssistant.contentJson
              );
              //new - Try to extract essence header
              essenceText = extractEssenceHeader(previousResponseText);

              if (essenceText) {
                console.log(
                  `[Essence] Extracted ${essenceText.length} chars from previous response`
                );
              } else {
                console.log(
                  "[Essence] No essence header found in previous response, using prompt-only"
                );
              }
            } else {
              console.log(
                "[Essence] No previous response found (first turn), using prompt-only"
              );
            }
          }

          // === Step 2: Create TWO embeddings ===
          const vecSvc = await getMCPVector();

          //new - Embedding 1: Prompt-only (for forensics)
          const promptEmb = await timeouts.embedding(
            vecSvc.embed(trimmedUserText)
          );

          //new - Embedding 2: Combined essence + prompt (for anchor selection in semantic mode)
          let newPromptEmb: {
            vectorId: string;
            vector: Float32Array;
          } | null = null;
          if (CONFIG_SELECTION_METHOD === "semantic") {
            const combinedText = combineEssenceAndPrompt(
              essenceText,
              trimmedUserText
            );
            console.log(
              `[DEBUG COMBINED TEXT] Length: ${combinedText.length} chars`
            );
            console.log(`[DEBUG COMBINED TEXT] Content:`, combinedText);

            newPromptEmb = await timeouts.embedding(vecSvc.embed(combinedText));
            console.log(
              `[Essence] Created combined embedding from ${combinedText.length} chars`
            );
          }

          // === Step 3: Index both embeddings ===

          const idxMeta = await timeouts.faissIndex(
            getIndexMeta(authoritativeProjectId, faissPromptsIndexId)
          );

          const faissDim = embCtx.dim ?? promptEmb.vector.length;
          let numericPromptId = idxMeta.ntotal;

          //new - Index prompt-only embedding (forensic)
          try {
            await timeouts.faissIndex(
              vecSvc.index(
                authoritativeProjectId,
                faissPromptsIndexId,
                "prompts",
                promptEmb.vectorId,
                promptEmb.vector,
                { itemId: null, type: "prompt-only" }
              )
            );
            console.log(`[FAISS] Indexed prompt-only at ID ${numericPromptId}`);
          } catch (err: any) {
            console.error("FAISS indexing failed:", err);
            throw new Error(`Failed to index prompt vector: ${err.message}`);
          }

          //new - Index combined embedding (if semantic mode)
          if (newPromptEmb) {
            numericPromptId = numericPromptId + 1; //new - increment for next vector
            try {
              await timeouts.faissIndex(
                vecSvc.index(
                  authoritativeProjectId,
                  faissPromptsIndexId,
                  "prompts",
                  newPromptEmb.vectorId,
                  newPromptEmb.vector,
                  { itemId: null, type: "essence+prompt" }
                )
              );
              console.log(`[FAISS] Indexed combined at ID ${numericPromptId}`);
            } catch (err: any) {
              console.error("FAISS indexing (combined) failed:", err);
              throw new Error(
                `Failed to index combined vector: ${err.message}`
              );
            }
          }

          // let indexed = false;
          // try {
          //   await timeouts.faissIndex(
          //     vecSvc.index(
          //       authoritativeProjectId,
          //       faissPromptsIndexId,
          //       "prompts",
          //       promptEmb.vectorId,
          //       promptEmb.vector,
          //       numericPromptId,
          //       { itemId: null }
          //     )
          //   );
          //   indexed = true;
          // } catch (err: any) {
          //   console.error("FAISS indexing failed:", err);
          //   throw new Error(`Failed to index prompt vector: ${err.message}`);
          // }

          // === Initialize variables for both modes ===
          let instructionsString = "";
          let selectedNames: string[] = [];
          let rounded: Record<string, number> = {};
          let retrievedVectorIds: string[] = [];
          let llmSelectionData: any = null;
          let protocolNames: string[] = []; //new - track protocol names

          // === Anchor selection (only in anchored mode) ===
          if (isAnchored) {
            // new code - route by selection method using refactored modules
            if (CONFIG_SELECTION_METHOD === "manual") {
              const result = await selectAnchorsManually(
                tx,
                sessionConfig,
                projectVersion,
                CONFIG_FORCED_PROTOCOLS
              );
              instructionsString = result.instructionsString;
              selectedNames = result.selectedNames;
              rounded = result.rounded;
              retrievedVectorIds = result.retrievedVectorIds;
              protocolNames = result.protocolNames; //new - extract protocol names
            } else if (CONFIG_SELECTION_METHOD === "llm_chosen") {
              const result = await selectAnchorsWithLLM(
                tx,
                sessionId,
                trimmedUserText,
                sessionConfig,
                projectVersion,
                CONFIG_MAX_SELECTED,
                CONFIG_FORCED_ANCHORS,
                CONFIG_FORCED_PROTOCOLS
              );
              instructionsString = result.instructionsString;
              selectedNames = result.selectedNames;
              rounded = result.rounded;
              retrievedVectorIds = result.retrievedVectorIds;
              llmSelectionData = result.llmResponseData;
              protocolNames = result.protocolNames; //new - extract protocol names
            } else if (CONFIG_SELECTION_METHOD === "semantic") {
              const embToUse = newPromptEmb || promptEmb;
              console.log(
                "[DEBUG] Semantic selection using vectorId:",
                embToUse.vectorId
              );
              const result = await selectAnchorsSemanticly(
                tx,
                vecSvc,
                newPromptEmb || promptEmb, //new - use combined if available, fallback to prompt-only
                authoritativeProjectId,
                projectVersion,
                CONFIG_SIM_FLOOR,
                CONFIG_MAX_SELECTED,
                CONFIG_FORCED_ANCHORS,
                CONFIG_FORCED_PROTOCOLS,
                CONFIG_WEIGHT_PRECISION
              );
              instructionsString = result.instructionsString;
              selectedNames = result.selectedNames;
              rounded = result.rounded;
              retrievedVectorIds = result.retrievedVectorIds;
              protocolNames = result.protocolNames; //new - extract protocol names
            } else {
              throw new Error(
                `Unsupported selection method: ${CONFIG_SELECTION_METHOD}`
              );
            }

            // NEW CODE: Create ItemAnchor rows (outside selection blocks, for all modes)
            const anchorRows = await createItemAnchorRows(
              tx,
              projectVersion,
              projectName,
              sessionName,
              selectedNames,
              rounded,
              promptEmb.vectorId,
              authoritativeProjectId,
              newPromptEmb?.vectorId ?? null, //new - pass combined vector ID
              vecSvc,
              protocolNames
            );

            // NEW CODE: End of selection method routing

            // P0.4: Create USER Item with full FAISS audit fields
            const userItem = await tx.item.create({
              data: {
                sessionId,
                projectName,
                sessionName,
                role: ItemRole.USER,
                type: ItemType.MESSAGE,
                seq: nextSeq,
                contentJson: { text: trimmedUserText },
                turnId,
                anchored: true,
                // FAISS audit fields
                promptVectorId: promptEmb.vectorId,
                newPromptVectorId: newPromptEmb?.vectorId || null, //new - combined embedding (semantic only)
                faissIndexName: "prompts",
                faissIndexVersion: faissIndexVersion,
                faissDim: faissDim,
                embeddingModel: embeddingModel,
                // Anchoring forensics
                anchorSelection: {
                  protocols: protocolNames,
                  anchors: selectedNames,
                }, //new - include protocols in selection
                anchorWeights: rounded,
                retrievedVectorIds: retrievedVectorIds,
                meta:
                  CONFIG_SELECTION_METHOD === "llm_chosen" && llmSelectionData
                    ? { llmSelection: llmSelectionData }
                    : {},
              },
            });

            // Set itemId for anchor rows and create them
            if (anchorRows.length > 0) {
              const anchorRowsWithItemId = anchorRows.map((row, index) => ({
                ...row,
                itemId: userItem.id,
                contentJson: index === 0 ? userItem.contentJson : null, // Only first row gets content
              }));
              await tx.itemAnchor.createMany({
                data: anchorRowsWithItemId as any,
              });
            }
          } else {
            // === Control mode: Create USER item without anchors ===
            const userItem = await tx.item.create({
              data: {
                sessionId,
                projectName,
                sessionName,
                role: ItemRole.USER,
                type: ItemType.MESSAGE,
                seq: nextSeq,
                contentJson: { text: trimmedUserText },
                turnId,
                anchored: false,
                // FAISS audit fields
                promptVectorId: promptEmb.vectorId,
                faissIndexName: "prompts",
                faissIndexVersion: faissIndexVersion,
                faissDim: faissDim,
                embeddingModel: embeddingModel,
                // Empty anchoring forensics
                anchorSelection: [],
                anchorWeights: {},
                retrievedVectorIds: [],
                meta: {
                  version: projectVersion,
                  mode: "control",
                  anchorNames: [],
                  anchorWeights: {},
                },
              },
            });
          }

          return { turnId, instructionsString };
        },
        {
          timeout: 60000,
          maxWait: 5000,
        }
      )
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Error in /api/prompts:", err);

    // Handle specific error codes
    if (err.message?.includes("NO_VIABLE_ANCHORS")) {
      return errorResponse(
        "NO_VIABLE_ANCHORS",
        "No anchors available for selection",
        HTTPStatus.UNPROCESSABLE
      );
    }

    if (err.message?.includes("timed out")) {
      return errorResponse("TIMEOUT", err.message, HTTPStatus.GATEWAY_TIMEOUT);
    }

    return errorResponse(
      "INTERNAL_ERROR",
      err.message,
      HTTPStatus.INTERNAL_ERROR
    );
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * P1.6: Fetch protocols and harmony anchor texts
 */
async function fetchProtocolsAndHarmony(
  tx: any,
  version: string
): Promise<{ protocolsText: string; harmonyText: string }> {
  const [protocolsChunk, harmonyChunk] = await Promise.all([
    tx.anchorChunk.findFirst({
      where: { version: version, name: "protocols" },
      select: { text: true },
    }),
    tx.anchorChunk.findFirst({
      where: { version: version, name: "harmony" },
      select: { text: true },
    }),
  ]);

  const protocolsText =
    protocolsChunk?.text ??
    "## PROTOCOLS\n[Protocols text missing from database]";
  const harmonyText =
    harmonyChunk?.text ?? "## HARMONY\n[Harmony text missing from database]";

  return { protocolsText, harmonyText };
}
