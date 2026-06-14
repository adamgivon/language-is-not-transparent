export interface AnchoringConfig {
    // Metadata
    configVersion: "1.0";
    createdAt: string;

    // Selection parameters
    k: number;                      // Retrieval count
    maxSelected: number | null;     // null = all passing threshold
    simFloor: number;               // 0-1
    weightPrecision: number;        // new code - decimal places for weight rounding (e.g., 4)


    // Selection mode
    selectionMethod: "semantic" | "manual" | "llm_chosen";

    // Forced configuration
    forcedAnchors: {                // Anchors that must be included with minimum weights
      [name: string]: number;       // e.g., { "sovereignty": 0.10, "truth": 0.10 }
    };
    forcedProtocols: string[];      // Structural anchors (no weights)

    // Manual mode
    manualWeights: {
      [name: string]: number;       // Used when selectionMethod = "manual"
    } | null;

    // Injection order
    customOrder: {
      enabled: boolean;
      fullOrder: string[] | null;   // Full custom order (manual mode only)
    };

    // LLM-chosen mode
    llmConfig: {
      primaryModel: string;         // From env: PRIMARY_LLM_MODEL
    } | null;
  }
