import type { AnchoringConfig } from "@/types/anchoring_config";

/**
 * Generate default anchoring config for a new session
 * @param anchorCount - Total number of anchors in the system
 * @returns Default configuration
 */
export function getDefaultAnchoringConfig(
  anchorCount: number
): AnchoringConfig {
  return {
    configVersion: "1.0",
    createdAt: new Date().toISOString(),
    // isProjectDefault: false,

    // Selection parameters
    k: anchorCount, // Retrieve all available anchors
    maxSelected: null, // No limit, all passing threshold
    simFloor: 0.2, // Current default threshold
    weightPrecision: 2, // new code - 4 decimal places (0.1234)

    // Selection mode
    selectionMethod: "semantic",

    // Forced configuration
    forcedAnchors: {}, // new code - empty, user selects via checkboxes
    forcedProtocols: [], // new code - empty, user selects via checkboxes

    // Manual mode (not used in semantic)
    manualWeights: null,

    // Injection order (default: weight-descending)
    customOrder: {
      enabled: false,
      fullOrder: null,
    },

    // LLM-chosen mode (not used in semantic)
    llmConfig: null,
  };
}
