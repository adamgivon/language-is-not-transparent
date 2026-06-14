// /app/api/sendMessage/route.ts
// ===========================================================
// Executes the ASSISTANT turn for a prepared prompt.
// Fixes applied: FAISS audit fields, idempotency re-check in TX,
// defensive anchorSelection handling, envelope shape, empty-text guard,
// parallelized distance computations, structured-ish errors.
// ===========================================================

// /app/api/sendMessage/route.ts
// ===========================================================
// Executes the ASSISTANT turn for a prepared prompt.
// All fixes integrated: P0-P2 from canonical fix list
// ===========================================================

// /app/api/sendMessage/route.ts
// ===========================================================
// Executes the ASSISTANT turn for a prepared prompt.
// All fixes integrated: P0-P2 from canonical fix list
// ===========================================================

import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import OpenAI from "openai";

import { prisma, logRequestSnapshot, logItemAnchors } from "@/lib/db/logs";
import type { Item } from "@prisma/client";
import { getMCPVector, getIndexMeta } from "@/services/mcp/vector";
import { DELIMS, parseFaissVersion } from "@/config/anchoring";
import { errorResponse } from "@/lib/utils/errors";
import { checkRateLimit } from "@/lib/utils/rateLimit";
import { timeouts } from "@/lib/utils/timeout";
import {
  extractResponseText,
  HTTPStatus,
  ItemRole,
  ItemType,
} from "@/types/openai";

import type { RequestEnvelope } from "@/data_contracts/RequestEnvelope";
import type { StoredRequestPayload } from "@/data_contracts/PersistenceShapes";

// ============================================================================
// HELPERS
// ============================================================================

function hashInstructions(s: string): string {
  const norm = s.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "");
  return crypto.createHash("sha256").update(norm, "utf8").digest("hex");
}

function parseEchoedAnchors(text: string): {
  anchors: string[];
  weights: Record<string, number>;
} {
  const start = text.indexOf(DELIMS.start);
  const end = text.indexOf(DELIMS.end, start + DELIMS.start.length);
  if (start < 0 || end < 0) return { anchors: [], weights: {} };

  const block = text.slice(start, end);
  const wMatch = block.match(/Weights:\s*([^\n]+)/i);
  const aMatch = block.match(/ActiveAnchors:\s*([^\n]+)/i);

  const weights: Record<string, number> = {};
  if (wMatch) {
    for (const kv of wMatch[1].split(",").map((s) => s.trim())) {
      const [k, v] = kv.split("=");
      const num = Number(v);
      if (k && Number.isFinite(num)) weights[k.trim().toLowerCase()] = num;
    }
  }

  const anchors = aMatch
    ? aMatch[1]
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    : [];

  return { anchors, weights };
}

const ALLOWED_TOOLS = new Set(["mcp_raw", "web_search", "code_interpreter"]);
function filterTools(tools: any[] | null | undefined): any[] | null {
  if (!Array.isArray(tools)) return null;
  return tools.filter(
    (t) => t && typeof t === "object" && ALLOWED_TOOLS.has(t?.name)
  );
}

/**
 * P1.7: Trim instructions for storage
 */

function stripAnchoringBlock(instructions: string): string {
  const start = instructions.indexOf(DELIMS.start);
  const end = instructions.indexOf(DELIMS.end, start + DELIMS.start.length);
  if (start >= 0 && end > start) {
    return (
      instructions.slice(0, start) + instructions.slice(end + DELIMS.end.length)
    );
  }
  return instructions;
} // new code

function trimForStorage(instructions: string): {
  anchoringSummary: {
    version: string;
    anchors: string[];
    weights: Record<string, number>;
  };
} {
  const start = instructions.indexOf(DELIMS.start);
  const end = instructions.indexOf(DELIMS.end);

  if (start < 0 || end < 0) {
    return {
      anchoringSummary: { version: "unknown", anchors: [], weights: {} },
    };
  }

  const block = instructions.slice(start, end);
  const vMatch = block.match(/Version:\s*([^\n]+)/i);
  const aMatch = block.match(/ActiveAnchors:\s*([^\n]+)/i);
  const wMatch = block.match(/Weights:\s*([^\n]+)/i);

  const version = vMatch?.[1]?.trim() ?? "unknown";
  const anchors = aMatch?.[1]?.split(",").map((s) => s.trim()) ?? [];
  const weights: Record<string, number> = {};

  if (wMatch) {
    for (const kv of wMatch[1].split(",")) {
      const [k, v] = kv.split("=").map((s) => s.trim());
      if (k && v) weights[k] = Number(v);
    }
  }

  return {
    anchoringSummary: { version, anchors, weights },
  };
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export async function POST(req: NextRequest) {
  let embeddingDone = false;
  let indexedVectorId: string | null = null;
  let numericId: number | null = null;
  let assistantItemId: string | null = null;

  // Declare variables at function scope for error handler access
  let sessionId: string = "";
  let turnId: string = "";
  let projectId: string = "";

  try {
    const body = await req.json();
    const {
      projectId: reqProjectId,
      sessionId: reqSessionId,
      turnId: reqTurnId,
      userText,
      instructionsString,
      model,
      temperature,
      top_p: topP,
      max_output_tokens: maxOutputTokens,
      presence_penalty: presencePenalty,
      frequency_penalty: frequencyPenalty,
      tools,
      tool_choice,
      reasoning,
      toggles,
      metadata,
    } = body as {
      projectId: string;
      sessionId: string;
      turnId: string;
      userText: string;
      instructionsString: string;
      model?: string;
      temperature?: number;
      top_p?: number;
      max_output_tokens?: number;
      presence_penalty?: number;
      frequency_penalty?: number;
      tools?: any[] | null;
      tool_choice?: any | null;
      reasoning?: any | null;
      toggles?: any | null;
      metadata?: any | null;
    };

    // Assign to function-scope variables
    projectId = reqProjectId;
    sessionId = reqSessionId;
    turnId = reqTurnId;

    // === Input validation ===
    if (!projectId || !sessionId || !turnId) {
      return errorResponse(
        "INVALID_INPUT",
        "Missing required identifiers (projectId, sessionId, turnId)",
        HTTPStatus.BAD_REQUEST
      );
    }
    // if (!instructionsString || typeof instructionsString !== "string") {
    // ✅ FIX: Allow empty instructionsString for control mode (it's a string, just empty)

    if (typeof instructionsString !== "string") {
      return errorResponse(
        "INVALID_INPUT",
        // "instructionsString is required; call /api/prompts first",
        "instructionsString must be a string; call /api/prompts first",
        HTTPStatus.BAD_REQUEST
      );
    }
    if (!userText || !userText.trim()) {
      return errorResponse(
        "EMPTY_USER_TEXT",
        "userText cannot be empty",
        HTTPStatus.BAD_REQUEST
      );
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

    // === Resolve session pointers ===
    const sess = await timeouts.dbQuery(
      prisma.session.findUnique({
        where: { id: sessionId },
        select: {
          conversationId: true,
          projectId: true,
          name: true, // ✅ ADD
          anchoringConfig: true, //new - fetch session config
          project: {
            // ✅ ADD
            select: {
              name: true,
              responseIndexId: true,
            },
          },
          embeddingContext: true,
        },
      })
    );

    if (!sess) {
      return errorResponse(
        "SESSION_NOT_FOUND",
        "Session not found",
        HTTPStatus.NOT_FOUND
      );
    }
    if (!sess.conversationId) {
      return errorResponse(
        "MISSING_CONVERSATION_ID",
        "Missing conversationId on session",
        HTTPStatus.INTERNAL_ERROR
      );
    }
    if (!sess.project.responseIndexId) {
      return errorResponse(
        "MISSING_FAISS_INDEX",
        "Missing faissResponsesIndexId in session",
        HTTPStatus.INTERNAL_ERROR
      );
    }
    if (projectId && sess.projectId && projectId !== sess.projectId) {
      return errorResponse(
        "PROJECT_MISMATCH",
        "projectId mismatch with session",
        HTTPStatus.UNPROCESSABLE
      );
    }

    const authoritativeProjectId = sess.projectId || projectId;

    if (!sess.project?.name) {
      return errorResponse(
        "MISSING_PROJECT_NAME",
        "Project name not found",
        HTTPStatus.INTERNAL_ERROR
      );
    }
    if (!sess.name) {
      return errorResponse(
        "MISSING_SESSION_NAME",
        "Session name not found",
        HTTPStatus.INTERNAL_ERROR
      );
    }

    const projectName = sess.project!.name; // ✅ ADD
    const sessionName = sess.name; // ✅ ADD

    const embCtx = (sess.embeddingContext as any) ?? {};
    const embeddingModel = embCtx.model ?? "text-embedding-3-large";

    const sessionConfig = (sess.anchoringConfig as any) ?? {};
    const selectionMethod = sessionConfig.selectionMethod ?? "semantic";

    // === P0.3: Check idempotency BEFORE expensive operations ===
    const existingCheck = await prisma.item.findFirst({
      where: { sessionId, turnId, role: ItemRole.ASSISTANT },
      select: { id: true, contentJson: true },
    });

    if (existingCheck) {
      const text = (existingCheck.contentJson as any)?.text ?? "";
      return NextResponse.json({ turnId, text });
    }

    // === Fetch USER item + anchors ===
    const userItem = await timeouts.dbQuery(
      prisma.item.findFirst({
        where: { sessionId, turnId, role: ItemRole.USER },
        select: {
          id: true,
          promptVectorId: true,
          newPromptVectorId: true,
          anchorSelection: true,
          anchorWeights: true,
          retrievedVectorIds: true,
          contentJson: true,
        },
      })
    );

    if (!userItem) {
      return errorResponse(
        "NO_USER_ITEM",
        "No prepared USER item; call /api/prompts first",
        HTTPStatus.BAD_REQUEST
      );
    }

    // === Determine if this turn is anchored ===
    const isAnchored = Boolean(
      instructionsString && instructionsString.trim().length > 0
    );

    // === Fetch ALL anchors for forensics (needed in BOTH modes) ===
    // In anchored mode: use anchors from ItemAnchor (selected + structural)
    // In control mode: fetch ALL anchors from projectVersion

    let allDistanceAnchors: Array<{
      id: string;
      name: string;
      vectorId: string | null;
    }> = [];

    if (isAnchored) {
      // Anchored: Use anchors that were selected during Phase 1
      const existingItemAnchors = await timeouts.dbQuery(
        prisma.itemAnchor.findMany({
          where: { itemId: userItem.id },
          select: { anchorChunkId: true, anchorName: true },
        })
      );

      const anchorChunkIds = existingItemAnchors.map((ia) => ia.anchorChunkId);

      allDistanceAnchors = await timeouts.dbQuery(
        prisma.anchorChunk.findMany({
          where: {
            id: { in: anchorChunkIds },
          },
          select: { id: true, name: true, vectorId: true },
        })
      );
    } else {
      // Control: Fetch ALL anchors from project's anchor system for comparison
      const project = await timeouts.dbQuery(
        prisma.project.findUnique({
          where: { id: authoritativeProjectId },
          select: {
            anchorSystem: {
              select: { name: true },
            },
          },
        })
      );

      const projectVersion = project?.anchorSystem?.name;

      allDistanceAnchors = await timeouts.dbQuery(
        prisma.anchorChunk.findMany({
          where: {
            version: projectVersion,
          },
          select: { id: true, name: true, vectorId: true },
        })
      );
    }

    // new - Extract protocols and anchors from structured anchorSelection (works for all modes)
    const anchorSelection = userItem.anchorSelection as any;

    // Handle both old array format (if any exists) and new object format
    let selectedProtocols: string[] = [];
    let selectedAnchors: string[] = [];

    if (
      anchorSelection &&
      typeof anchorSelection === "object" &&
      !Array.isArray(anchorSelection)
    ) {
      // New structured format: { protocols: [...], anchors: [...] }
      selectedProtocols = anchorSelection.protocols ?? [];
      selectedAnchors = anchorSelection.anchors ?? [];
    } else if (Array.isArray(anchorSelection)) {
      // Old array format (backwards compatibility)
      selectedAnchors = anchorSelection;
    }

    const selectedNames: string[] = [...selectedProtocols, ...selectedAnchors]; //new - combine for filtering

    // Filter for Item.distances: selected + protocols
    const anchorChunksForItem = allDistanceAnchors.filter((c) =>
      selectedNames.includes(c.name)
    );

    // Filter for comparisons: ALL with vectorIds (for ItemAnchor forensics)
    const anchorChunksForAnchorRows = allDistanceAnchors.filter(
      (c) => c.vectorId
    );

    // ✅ anchorWeights is already stored by name (Fix 2)
    const weightsByName =
      (userItem.anchorWeights as Record<string, number>) ?? {};
    const activeAnchorNames = anchorChunksForItem
      .filter((c) => selectedNames.includes(c.name)) // Only selected for echo
      .map((c) => c.name.toLowerCase())
      .filter(Boolean);

    // Add essence header instruction for semantic mode
    const ESSENCE_INSTRUCTION = `
  ---
  RESPONSE FORMAT REQUIREMENT: Begin with a concise essence block (max 70 words) capturing: core concepts (max 2 sentences), key constraints/tensions (max 1 sentence), your approach (max 1 sentence), and a brief real-world example if
  applicable. Write it as an integrated natural flowing text, not labeled sections, and exclude the criteria names.
  Format:
  \`\`\`ESSENCE
  [Your integrated summary here - max 70 words]
  \`\`\`
  Then provide your full detailed response below.
`;

    const finalUserText = userText + ESSENCE_INSTRUCTION;
      // isAnchored && selectionMethod === "semantic"
       // ? userText + ESSENCE_INSTRUCTION
       // : userText;

    // P2.6: Build envelope with consistent shape
    const envelope: RequestEnvelope = {
      conversation_id: sess.conversationId,
      system: { instructions: instructionsString },
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: finalUserText }],
        },
      ],
      tools: filterTools(tools) as any[] | null,
      tool_choice: tool_choice ?? null,
      reasoning: reasoning ?? null,
      toggles: toggles ?? {
        model: model ?? null,
        temperature: temperature ?? null,
        top_p: topP ?? null,
        max_output_tokens: maxOutputTokens ?? null,
        presence_penalty: presencePenalty ?? null,
        frequency_penalty: frequencyPenalty ?? null,
        reasoning_effort: reasoning?.effort ?? null,
        mode: "anchored",
        stream: null,
        store: true,
      },
      metadata: metadata ?? null,
      text: { verbosity: "low" },
    };

    // === P1.3: Call OpenAI with timeout ===
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const resp = await timeouts.openai(
      openai.responses.create({
        model: model || process.env.OPENAI_RESPONSE_MODEL || "gpt-4.1-mini",
        conversation: sess.conversationId,
        instructions: instructionsString,
        input: [
          {
            role: "user",
            content: [{ type: "input_text", text: finalUserText }],
          },
        ],
        temperature: temperature ?? undefined,
        // top_p: topP ?? undefined,
        max_output_tokens: maxOutputTokens ?? undefined,
        store: toggles?.store ?? body.store ?? true, // ✅ FIX: fallback to body.store
        truncation: "auto",
        text: { verbosity: "low" },
        tools: envelope.tools ?? undefined,
        tool_choice: envelope.tool_choice ?? undefined,
        reasoning:
          reasoning ??
          (body.reasoning_effort
            ? { effort: body.reasoning_effort }
            : undefined), // ✅ FIX: fallback to body.reasoning_effort
        metadata: envelope.metadata ?? undefined,
      })
    );

    // P2.2: Extract text with type safety
    const assistantText = extractResponseText(resp);
    // ✅ Extract OpenAI IDs from response
    const openaiResponseId = (resp as any).id ?? null;
    const openaiItemId = (resp as any).output?.[0]?.id ?? null;

    // P2.3: Guard against empty response
    if (!assistantText || !assistantText.trim()) {
      console.error("Empty assistant response for turn", turnId);

      // Get seq for this item
      const maxSeqResult = await prisma.item.aggregate({
        _max: { seq: true },
        where: { sessionId },
      });
      const nextSeq = (maxSeqResult._max.seq ?? -1) + 1;

      const emptyItem = await prisma.item.create({
        data: {
          sessionId,
          projectName, // ✅ ADD
          sessionName, // ✅ ADD
          role: ItemRole.ASSISTANT,
          type: ItemType.MESSAGE,
          seq: nextSeq,
          contentJson: { text: "" },
          turnId,
          anchored: false,
          meta: {
            empty_response: true,
            error: "Model returned empty response",
          },
        },
      });

      return NextResponse.json(
        {
          code: "EMPTY_RESPONSE",
          message: "Model returned empty response",
          turnId,
        },
        { status: HTTPStatus.BAD_GATEWAY }
      );
    }

    // === P1.2: Two-phase pattern (embed+index, then DB) ===
    // Phase 1: Embed & Index
    const vecSvc = await getMCPVector();
    const emb = await timeouts.embedding(vecSvc.embed(assistantText));
    embeddingDone = true;

    const idxMeta = await timeouts.faissIndex(
      getIndexMeta(authoritativeProjectId, sess.project.responseIndexId)
    );
    numericId = idxMeta.ntotal;
    const faissDim = embCtx.dim ?? emb.vector.length;

    await timeouts.faissIndex(
      vecSvc.index(
        authoritativeProjectId,
        sess.project.responseIndexId,
        "responses",
        emb.vectorId,
        emb.vector,
        { itemId: null }
      )
    );
    indexedVectorId = emb.vectorId;

    // Phase 2: DB writes in transaction
    const result = await timeouts.dbTransaction(
      prisma.$transaction(
        async (tx) => {
          // P0.3: Re-check idempotency inside transaction
          const existing = await tx.item.findFirst({
            where: { sessionId, turnId, role: ItemRole.ASSISTANT },
            select: { id: true, contentJson: true },
          });

          if (existing) {
            assistantItemId = existing.id;
            const text = (existing.contentJson as any)?.text ?? "";
            return { turnId, text };
          }

          // P0.2: Get next seq
          const maxSeqResult = await tx.item.aggregate({
            _max: { seq: true },
            where: { sessionId },
          });
          const nextSeq = (maxSeqResult._max.seq ?? -1) + 1;

          // P0.1: Create ASSISTANT Item with full FAISS audit fields
          const assistantItem = await tx.item.create({
            data: {
              sessionId,
              projectName, // ✅ ADD
              sessionName, // ✅ ADD
              itemId: openaiItemId,
              responseId: openaiResponseId,
              role: ItemRole.ASSISTANT,
              type: ItemType.MESSAGE,
              seq: nextSeq,
              contentJson: { text: assistantText },
              turnId,
              anchored: isAnchored,
              responseVectorId: emb.vectorId,
              // FAISS audit fields
              faissIndexName: "responses",
              faissIndexVersion: parseFaissVersion(
                sess.project.responseIndexId
              ),
              faissDim: faissDim,
              embeddingModel: embeddingModel,
              distances: {},
              meta: { echo_match: null },
            },
          });
          assistantItemId = assistantItem.id;

          const protocolNames: string[] = selectedProtocols;
          const protocolNamesLower = protocolNames.map((p: string) =>
            p.toLowerCase()
          );

          // === Create ItemAnchor rows for control mode (forensics) ===

          if (!isAnchored) {
            // In control mode, create ItemAnchor rows for ALL anchors
            const anchorRows = allDistanceAnchors.map((anchor, index) => ({
              itemId: userItem.id,
              projectName,
              sessionName,
              contentJson: index === 0 ? userItem.contentJson : null, // Only first row gets content
              anchorChunkId: anchor.id,
              anchorName: anchor.name,
              weight: null, // No weights in control mode
              promptSimilarity: null, // Will be filled during distance computation
              responseSimilarity: null,
              activationDelta: null,
              alwaysIncluded: protocolNamesLower.includes(
                anchor.name.toLowerCase()
              ), //new - mark protocols
            }));

            if (anchorRows.length > 0) {
              await tx.itemAnchor.createMany({ data: anchorRows as any });
            }
          }
          // P1.5: Parallelize distance computations
          const promptVectorId =
            userItem.newPromptVectorId || userItem.promptVectorId!;

          const anchorChunks = allDistanceAnchors.filter((c) => c.vectorId);

          const prompt_to_anchor: Record<string, number> = {};
          const response_to_anchor: Record<string, number> = {};

          // Create separate maps for ALL anchors (ItemAnchor updates)
          const prompt_to_anchor_all: Record<string, number> = {};
          const response_to_anchor_all: Record<string, number> = {};

          // Batch all comparisons in parallel (using ALL anchors)
          const comparisons = anchorChunksForAnchorRows.map(async (a) => {
            const [pSim, rSim] = await Promise.all([
              timeouts.faissCompare(
                vecSvc.compare(
                  authoritativeProjectId,
                  promptVectorId,
                  a.vectorId!,
                  "prompts",
                  "anchors"
                )
              ),
              timeouts.faissCompare(
                vecSvc.compare(
                  authoritativeProjectId,
                  emb.vectorId,
                  a.vectorId!,
                  "responses",
                  "anchors"
                )
              ),
            ]);
            return { id: a.id, name: a.name, pSim, rSim };
          });

          const results = await Promise.all(comparisons);
          for (const r of results) {
            const name = r.name.toLowerCase();
            prompt_to_anchor_all[name] = r.pSim;
            response_to_anchor_all[name] = r.rSim;
          }

          // Create filtered subset for Item.distances in correct order
          // Order: protocols first (in their order), then anchors (in their order)
          const orderedNames = [...selectedProtocols, ...selectedAnchors]; //new - use ordered list
          for (const name of orderedNames) {
            //new - iterate in correct order
            const nameLower = name.toLowerCase();
            if (prompt_to_anchor_all[nameLower] !== undefined) {
              //new - check if exists
              prompt_to_anchor[nameLower] = prompt_to_anchor_all[nameLower];
              response_to_anchor[nameLower] = response_to_anchor_all[nameLower];
            }
          }

          const prompt_to_response = await timeouts.faissCompare(
            vecSvc.compare(
              authoritativeProjectId,
              promptVectorId,
              emb.vectorId,
              "prompts",
              "responses"
            )
          );

          // Update item with distances
          await tx.item.update({
            where: { id: assistantItem.id },
            data: {
              distances: isAnchored
                ? {
                    prompt_to_anchor, // ✅ Keys are names
                    response_to_anchor, // ✅ Keys are names
                    prompt_to_response,
                  }
                : {
                    prompt_to_response,
                  },
            },
          });

          // Update ItemAnchor rows
          const promptAnchors = await tx.itemAnchor.findMany({
            where: {
              itemId: userItem.id,
              // ✅ NO filter - get ALL ItemAnchor rows for this item
            },
          });

          // ✅ UPDATE existing ItemAnchors (don't create new ones)
          if (promptAnchors.length > 0) {
            const updatePromises = promptAnchors.map((ia) => {
              const name = (ia.anchorName || "").toLowerCase();
              const rSim = response_to_anchor_all[name] ?? null;
              const pSim =
                ia.promptSimilarity ?? prompt_to_anchor_all[name] ?? null;
              const delta = pSim !== null && rSim !== null ? rSim - pSim : null;

              return tx.itemAnchor.update({
                where: { id: ia.id },
                data: {
                  promptSimilarity: pSim,
                  responseSimilarity: rSim,
                  activationDelta: delta,
                },
              });
            });

            await Promise.all(updatePromises);
          }
          // Echo verification
          const echoed = parseEchoedAnchors(assistantText);
          const instructionsHash = hashInstructions(instructionsString);

          const expectedNames = activeAnchorNames.join(",");
          const echoedNames = echoed.anchors.join(",");
          const namesMatch = echoedNames === expectedNames;

          const weightsMatch = Object.entries(weightsByName).every(
            ([k, v]) => echoed.weights[k] === v
          );
          const echo_match = namesMatch && weightsMatch;

          // P1.7: Trim system for storage
          const trimmed = trimForStorage(instructionsString);

          const storedReq: StoredRequestPayload = {
            conversation_id: envelope.conversation_id,
            system: trimmed,
            input: envelope.input,
            tools: envelope.tools,
            tool_choice: envelope.tool_choice,
            reasoning: envelope.reasoning,
            toggles: envelope.toggles,
            metadata: envelope.metadata,
          };

          console.log("DEBUG: About to log request snapshot");
          console.log("Response object keys:", Object.keys(resp));
          console.log("Response size estimate:", JSON.stringify(resp).length);

          // new - Add protocols to the stripped instructions metadata
          // const strippedInstructions = stripAnchoringBlock(instructionsString);
          // const protocolsLine = `Protocols: ${
          //   protocolNames.join(", ") || "none"
          // }`;
          // const lines = strippedInstructions.split("\n");
          // const instructionsWithProtocols = [
          //   ...lines.slice(0, 2),
          //   protocolsLine,
          //   ...lines.slice(2),
          // ].join("\n"); //new - insert after line 1 (Version)

          // const trimmedPayload = {
          //   ...envelope,
          //   system: { instructions: instructionsWithProtocols },
          // };

          // const trimmedResponse = {
          //   ...resp,
          //   instructions: instructionsWithProtocols,
          // };

          const strippedInstructions = stripAnchoringBlock(instructionsString);

          const trimmedPayload = {
            ...envelope,
            system: { instructions: strippedInstructions }, //new - no need to add protocols, already in metadata
          };

          const trimmedResponse = {
            ...resp,
            instructions: strippedInstructions, //new - no need to add protocols, already in metadata
          };

          await logRequestSnapshot({
            sessionId,
            tx,
            projectName, // ✅ ADD
            sessionName, // ✅ ADD
            payload: trimmedPayload, // changed code
            response: trimmedResponse, // changed code
            model,
            temperature,
            topP,
            maxOutputTokens,
            presencePenalty,
            frequencyPenalty,
            anchoredMode: isAnchored ? "anchored" : "control",
            reasoningEffort: reasoning?.effort?.toUpperCase?.() || undefined,
            instructionsHash,
            meta: {
              echo_match,
              store: toggles?.store ?? body.store ?? true, // ✅ ADD: store toggle
              stream: toggles?.stream ?? body.stream ?? false, // ✅ ADD: stream toggle
              mode: isAnchored ? "anchored" : "control", // ✅ ADD: mode toggle
            },
          });

          // Store echo result on assistant item
          await tx.item.update({
            where: { id: assistantItem.id },
            data: {
              meta: {
                ...((assistantItem.meta as any) ?? {}),
                echo_match,
              },
            },
          });

          return { turnId, text: assistantText };
        },
        {
          timeout: 60000,
          maxWait: 5000,
        }
      )
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Error in /api/sendMessage:", err);

    // P1.2: Log orphaned vector for cleanup
    // Note: We don't unindex individual vectors (policy: use versioned indices)
    // Orphaned vectors will be cleaned up during next index reset
    if (indexedVectorId && !assistantItemId) {
      console.error(
        `Orphaned FAISS vector detected: ${indexedVectorId} (numericId: ${numericId}) in session ${sessionId}. ` +
          `This vector was indexed but the DB write failed. It will be cleaned up during the next index reset.`
      );
    }

    // P0.7: Handle unique constraint violations
    if (err.code === "P2002" && err.meta?.target?.includes("sessionId")) {
      const existing = await prisma.item.findFirst({
        where: { sessionId, turnId, role: ItemRole.ASSISTANT },
        select: { contentJson: true },
      });
      if (existing) {
        const text = (existing.contentJson as any)?.text ?? "";
        return NextResponse.json({ turnId, text });
      }
    }

    // Handle timeout errors
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
