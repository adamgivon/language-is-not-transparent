// === /lib/db/logs.ts ===
// Prisma DB logging utilities for Anchoring Experiment

import { PrismaClient, ReasoningEffort } from "@prisma/client";

const basePrisma = new PrismaClient();

export const prisma = basePrisma.$extends({
  query: {
    anchorChunk: {
      async create({ args, query }) {
        if (args.data.name) {
          args.data.name = args.data.name.toLowerCase();
        }
        return query(args);
      },
      async update({ args, query }) {
        if (args.data.name) {
          if (typeof args.data.name === "string") {
            args.data.name = args.data.name.toLowerCase();
          } else if (
            typeof args.data.name === "object" &&
            "set" in args.data.name
          ) {
            (args.data.name as { set: string }).set = (
              args.data.name as { set: string }
            ).set.toLowerCase();
          }
        }
        return query(args);
      },
      async upsert({ args, query }) {
        if (args.create?.name) {
          args.create.name = args.create.name.toLowerCase();
        }
        if (args.update?.name) {
          if (typeof args.update.name === "string") {
            args.update.name = args.update.name.toLowerCase();
          } else if (
            typeof args.update.name === "object" &&
            "set" in args.update.name
          ) {
            (args.update.name as { set: string }).set = (
              args.update.name as { set: string }
            ).set.toLowerCase();
          }
        }
        return query(args);
      },
    },
  },
});

export type IndexName = "anchors" | "prompts" | "responses";

// ==================================================
// RequestSnapshot logging
// ==================================================
/**
 * Logs a request/response pair (trimmed envelope) into RequestSnapshot.
 */
export async function logRequestSnapshot(params: {
  sessionId: string;
  projectName: string; // ✅ ADD
  sessionName: string; // ✅ ADD
  responseId?: string;
  payload: object;
  response: object;
  model?: string;
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  anchoredMode?: string; // "anchored" | "control"
  anchoringSummary?: object; // { anchor_version, anchors:[{id, weight}] }
  reasoningEffort?: ReasoningEffort | "LOW" | "MEDIUM" | "HIGH";
  instructionsHash?: string;
  meta?: object;
  tx?: any;
}) {
  const client = params.tx || prisma;
  const {
    sessionId,
    responseId,
    payload,
    response,
    model,
    temperature,
    topP,
    maxOutputTokens,
    presencePenalty,
    frequencyPenalty,
    anchoredMode,
    anchoringSummary,
    reasoningEffort,
    instructionsHash,
    meta,
  } = params;

  const reasoningEffortEnum =
    typeof reasoningEffort === "string"
      ? (reasoningEffort.toUpperCase() as ReasoningEffort)
      : reasoningEffort;

  await client.requestSnapshot.create({
    data: {
      sessionId,
      projectName: params.projectName, // ✅ ADD
      sessionName: params.sessionName, // ✅ ADD
      responseId,
      payloadJson: payload,
      responseJson: response,
      model,
      temperature,
      topP,
      maxOutputTokens,
      presencePenalty,
      frequencyPenalty,
      anchoredMode,
      anchoringSummary,
      reasoningEffort: reasoningEffortEnum,
      instructionsHash,
      meta,
    },
  });
}

// ==================================================
// Item logging
// ==================================================
/**
 * Logs an Item entry for a single prompt or response turn.
 * - Called after OpenAI call returns or before response generation.
 */
export async function logItem(params: {
  sessionId: string;
  projectName: string; // ✅ ADD
  sessionName: string; // ✅ ADD
  itemId?: string;
  responseId?: string;
  role: "USER" | "ASSISTANT" | "TOOL" | "SYSTEM" | "DEVELOPER";
  type: "MESSAGE" | "TOOL_CALL" | "REASONING";
  seq: number;
  contentJson: object;
  turnId?: string;
  promptVectorId?: string;
  responseVectorId?: string;
  anchored?: boolean;
  anchorSelection?: string[];
  anchorWeights?: Record<string, number>;
  distances?: Record<string, number>;
  meta?: object;
}) {
  const {
    sessionId,
    projectName, // ✅ ADD
    sessionName, // ✅ ADD
    itemId,
    responseId,
    role,
    type,
    seq,
    contentJson,
    turnId,
    promptVectorId,
    responseVectorId,
    anchored,
    anchorSelection,
    anchorWeights,
    distances,
    meta,
  } = params;

  const newItem = await prisma.item.create({
    data: {
      sessionId,
      projectName, // ✅ ADD
      sessionName, // ✅ ADD
      itemId,
      responseId,
      role,
      type,
      seq,
      contentJson,
      turnId,
      promptVectorId,
      responseVectorId,
      anchored,
      anchorSelection,
      anchorWeights,
      distances,
      meta,
    },
  });

  return newItem;
}

// ==================================================
// ItemAnchor logging
// ==================================================
/**
 * Logs scalar anchor metrics for a given Item (assistant turn).
 */
export async function logItemAnchors(params: {
  itemId: string;
  projectName: string; // ✅ ADD
  sessionName: string; // ✅ ADD
  anchors: {
    anchorChunkId: string;
    anchorName: string;
    weight?: number;
    promptSimilarity?: number;
    responseSimilarity?: number;
    activationDelta?: number;
    alwaysIncluded?: boolean;
  }[];
}) {
  const { itemId, anchors } = params;
  if (!anchors || anchors.length === 0) return;

  await prisma.itemAnchor.createMany({
    data: anchors.map((a) => ({
      itemId,
      projectName: params.projectName, // ✅ ADD
      sessionName: params.sessionName, // ✅ ADD
      anchorChunkId: a.anchorChunkId,
      anchorName: a.anchorName,
      weight: a.weight,
      promptSimilarity: a.promptSimilarity,
      responseSimilarity: a.responseSimilarity,
      activationDelta: a.activationDelta,
      alwaysIncluded: a.alwaysIncluded,
    })),
  });
}

// ==================================================
// JudgeEvaluation logging
// ==================================================
/**
 * Logs model-based evaluation for an Item.
 */
export async function logJudgeEvaluation(params: {
  itemId: string;
  projectName?: string; // ✅ ADD (optional because JudgeEvaluation has these nullable)
  sessionName?: string; //
  overallAdherence?: number;
  codifierScores?: Record<string, number>;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  judgeModel?: string;
  judgePromptHash?: string;
}) {
  const {
    itemId,
    projectName,
    sessionName,
    overallAdherence,
    codifierScores,
    strengths,
    weaknesses,
    recommendations,
    judgeModel,
    judgePromptHash,
  } = params;

  await prisma.judgeEvaluation.create({
    data: {
      itemId,
      projectName,
      sessionName,
      overallAdherence,
      codifierScores,
      strengths,
      weaknesses,
      recommendations,
      judgeModel,
      judgePromptHash,
    },
  });
}
