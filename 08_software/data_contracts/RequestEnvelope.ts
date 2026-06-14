// >>> BEGIN types/RequestEnvelope.ts
export type ToggleConfig = {
  model: string | null;
  temperature: number | null;
  top_p: number | null;
  max_output_tokens: number | null;
  presence_penalty: number | null;
  frequency_penalty: number | null;
  reasoning_effort: "low" | "medium" | "high" | null;
  mode: "anchored" | "control" | null;
  stream: boolean | null;
  store: boolean | true;
};

export type AnchoringSummary = {
  version: string;
  anchors: string[]; // e.g., ["sovereignty","truth","science"]
  weights: Record<string, number>; // same keys as anchors
};

export type RequestEnvelope = {
  conversation_id: string | null;
  system: { instructions: string }; // string per Conversations API
  input: Array<{
    role: "user";
    content: Array<{ type: "input_text"; text: string }>;
  }>;
  tools: any[] | null;
  tool_choice: any | null;
  reasoning: { effort: ToggleConfig["reasoning_effort"] } | null;
  toggles: ToggleConfig; // explicit nulls allowed
  metadata?: Record<string, any> | null;
  text?: { verbosity: "low" | "medium" | "high" };
};
// <<< END types/RequestEnvelope.ts
