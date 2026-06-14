// Shared constants for /api/prompts and /api/sendMessage

// FAISS search parameters
// Utility functions for anchoring system
// NOTE: Configuration values should come from session config, not from here

// These are ONLY used by lib/anchoring/defaults.ts to generate initial configs
// DO NOT use these in runtime selection logic
export const ANCHOR_K_DEFAULT = 19; // new code - comment: only for defaults.ts
export const ANCHOR_K_DEFAULT_MAX = 100;
export const ANCHOR_SIM_FLOOR = 0.2; // new code - comment: only for defaults.ts
export const ANCHOR_MAX_SELECTED = 7; // new code - comment: only for defaults.ts
export const SOVEREIGNTY_FLOOR = 0.1; // new code - comment: only for defaults.ts
export const TRUTH_FLOOR = 0.1; // new code - comment: only for defaults.ts
export const DEFAULT_FORCED_PROTOCOLS = ["protocols", "harmony"]; // new code - add this
export const WEIGHT_PREC = 4;
export const LLM_SELECTION_MODEL = "gpt-5-mini";

// Delimiters for instructions string
export const DELIMS = {
  start: "ANCHORING_START",
  end: "ANCHORING_END",
  footerTag: "[RETRIEVAL_CONTEXT v1]",
} as const;

// Codifier version
export const CODIFIER_VERSION = "14_experiment";

/**
 * Clamp k value to valid range
 * @param k - Requested k value
 * @param nTotal - Total vectors in index
 * @returns Clamped k value
 */
export function clampK(k: number, nTotal: number): number {
  return Math.max(1, Math.min(k ?? ANCHOR_K_DEFAULT, Math.max(1, nTotal)));
}

/**
 * Round number to specified decimal places
 * @param x - Number to round
 * @param dp - Decimal places (default: WEIGHT_PREC)
 * @returns Rounded number
 */
export function roundToDp(x: number, dp = WEIGHT_PREC): number {
  const f = 10 ** dp;
  return Math.round((x + Number.EPSILON) * f) / f;
}

/**
 * Max-normalize weights (divide by maximum value)
 * @param rec - Record of weights
 * @returns Normalized record
 * (?) should it be deprecated? Should I use sumNormalize instead for proper weight distribution?
 */
export function maxNormalize(
  rec: Record<string, number>
): Record<string, number> {
  const m = Math.max(0, ...Object.values(rec));
  if (m <= 0) return rec;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(rec)) out[k] = v / m;
  return out;
}

/**
 * Sum-normalize weights (divide by sum so weights total 1.0)
 * @param rec - Record of weights
 * @returns Normalized record with weights summing to 1.0
 */
export function sumNormalize(
  rec: Record<string, number>
): Record<string, number> {
  const sum = Object.values(rec).reduce((acc, v) => acc + v, 0);
  if (sum <= 0) return rec;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(rec)) out[k] = v / sum;
  return out;
}

/**
 * Apply floor constraints to forced anchors with space recalculation
 *
 * Algorithm:
 * 1. Identify which forced anchors are below their floors
 * 2. Bump those anchors to their floor values
 * 3. Calculate remaining space: 1.0 - (sum of all floor values)
 * 4. Renormalize non-forced anchors proportionally to fit remaining space
 *
 * @param weights - Record of weights by anchor name (already normalized)
 * @param forcedAnchors - Record of anchor names with their minimum floor values
 * @returns Updated weights with floors applied and space recalculated
 */
export function applyFloors(
  weights: Record<string, number>,
  forcedAnchors: Record<string, number> = {
    sovereignty: SOVEREIGNTY_FLOOR,
    truth: TRUTH_FLOOR,
  } // NEW CODE: default to original behavior
): Record<string, number> {
  const out = { ...weights };

  // NEW CODE: Apply floors to all forced anchors
  let totalFloorSpace = 0;
  const belowFloorAnchors: string[] = [];

  for (const [anchorName, floorValue] of Object.entries(forcedAnchors)) {
    const currentWeight = out[anchorName] ?? 0;

    if (currentWeight < floorValue) {
      out[anchorName] = floorValue;
      belowFloorAnchors.push(anchorName);
    }

    totalFloorSpace += out[anchorName];
  }

  // NEW CODE: If no anchors were below floor, return as-is
  if (belowFloorAnchors.length === 0) {
    return weights;
  }

  // NEW CODE: Calculate remaining space for non-forced anchors
  const remainingSpace = 1.0 - totalFloorSpace;

  // NEW CODE: Get non-forced anchor keys
  const forcedKeys = Object.keys(forcedAnchors).map((k) => k.toLowerCase());
  const otherKeys = Object.keys(out).filter(
    (k) => !forcedKeys.includes(k.toLowerCase())
  );

  // NEW CODE: Renormalize non-forced anchors to fit remaining space
  if (otherKeys.length > 0 && remainingSpace > 0) {
    const otherSum = otherKeys.reduce((sum, k) => sum + out[k], 0);

    if (otherSum > 0) {
      const scaleFactor = remainingSpace / otherSum;
      for (const key of otherKeys) {
        out[key] = out[key] * scaleFactor;
      }
    }
  }

  return out;
}

/**
 * Compose the full instructions string with structural and contextual anchors
 * Structural anchors are always active with full authority
 * Contextual anchors are dynamically weighted based on semantic relevance
 * @param params - Composition parameters
 * @returns Formatted instructions string with delimiters (all content within delimiters)
 */
export function composeInstructionsString(params: {
  mode: "anchored" | "control";
  version: string;
  protocolsText: string;
  protocolNames: string []; 
  dynamicWeights: Record<string, number>;
  dynamicAnchors: string[];
  dynamicAnchorsText: string;
}): string {
  // const weightsLine = Object.entries(params.dynamicWeights)
  //   .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  //   .map(([k, v]) => `${k}=${v}`)
  //   .join(", ");
  // const activeLine = params.dynamicAnchors.join(", ");

  const weightsLine = params.dynamicAnchors //new - use array order instead of sorting by weight
    .map((name) => `${name}=${params.dynamicWeights[name]}`) //new - map names to weight strings
    .join(", ");
  const activeLine = params.dynamicAnchors.join(", ");

  return [
    // ✅ Metadata BEFORE delimiter
    `AnchoredMode: ${params.mode}`,
    `Version: ${params.version}`,
    `Protocols: ${params.protocolNames.join(", ")}`, 
    `Anchor Names: ${activeLine}`,
    `AnchorWeights: ${weightsLine}`,
    "",
    // ✅ Content inside delimiters
    DELIMS.start,
    "## CORE STRUCTURAL PROTOCOLS (Always Active)",
    params.protocolsText,
    "",
    "",
    "## CONTEXTUALLY SELECTED ANCHORS",
    params.dynamicAnchorsText,
    DELIMS.end,
  ].join("\n");
}

/**
 * Parse FAISS version from index ID
 * @param id - Index ID (e.g., "prompts_v2_3072")
 * @returns Version number or undefined
 */
export function parseFaissVersion(
  id: string | null | undefined
): number | undefined {
  if (!id) return undefined;
  const m = id.match(/_v(\d+)_/i);
  return m ? Number(m[1]) : undefined;
}
