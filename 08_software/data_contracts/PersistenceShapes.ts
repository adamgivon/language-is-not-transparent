import { AnchoringSummary, RequestEnvelope } from "./RequestEnvelope";

// >>> BEGIN types/PersistenceShapes.ts
export type StoredRequestPayload = Omit<RequestEnvelope, "system"> & {
  system: { anchoringSummary: AnchoringSummary }; // trimmed; no large anchor text
};

export type StoredResponsePayload = {
  conversation_id: string;
  response: any; // OpenAI envelope, but with system.instructions trimmed to anchoringSummary if echoed
  anchoringSummary: AnchoringSummary;
};

export type DistanceSet = {
  prompt_to_anchor: Record<string, number>;   // per active anchor
  response_to_anchor: Record<string, number>; // per active anchor
  prompt_to_response: number;
};

export type ItemMeta = {
  promptVectorId?: string;
  responseVectorId?: string;
  anchorSelection?: string[]; // chosen anchors this turn
  anchorWeights?: Record<string, number>;
  distances?: DistanceSet;
};
// <<< END types/PersistenceShapes.ts
