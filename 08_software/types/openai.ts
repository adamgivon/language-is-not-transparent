// types/openai.ts
// Type definitions for OpenAI Responses API

/**
 * Content block in OpenAI response
 */
export interface OpenAIResponseContent {
  type: string;
  text?: string;
}

/**
 * Output item in OpenAI response
 */
export interface OpenAIResponseOutput {
  role?: string;
  content?: OpenAIResponseContent[];
}

/**
 * OpenAI Responses API response structure
 */
export interface OpenAIResponse {
  id: string;
  object: string;
  created?: number;
  model?: string;
  output_text?: string;  // SDK helper field
  output?: OpenAIResponseOutput[];
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
}

/**
 * Type guard to check if response is valid OpenAI response
 */
export function isOpenAIResponse(resp: unknown): resp is OpenAIResponse {
  return (
    typeof resp === 'object' &&
    resp !== null &&
    'id' in resp &&
    ('output_text' in resp || 'output' in resp)
  );
}

/**
 * Safely extract text from OpenAI response
 * Tries SDK helper first, then manual extraction
 * @param resp - OpenAI response object
 * @returns Extracted text or empty string
 */
export function extractResponseText(resp: unknown): string {
  if (!isOpenAIResponse(resp)) {
    console.error("Invalid OpenAI response format:", resp);
    return "";
  }
  
  // Try SDK helper first
  if (typeof resp.output_text === 'string' && resp.output_text.trim()) {
    return resp.output_text.trim();
  }
  
  // Fallback to manual extraction
  const output = resp.output ?? [];
  for (const item of output) {
    const content = item.content ?? [];
    for (const c of content) {
      if (c.type === 'output_text' && typeof c.text === 'string' && c.text.trim()) {
        return c.text.trim();
      }
    }
  }
  
  return "";
}

/**
 * HTTP status codes used in API responses
 */
export enum HTTPStatus {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  UNPROCESSABLE = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_ERROR = 500,
  BAD_GATEWAY = 502,
  GATEWAY_TIMEOUT = 504,
}

/**
 * Item roles
 */
export enum ItemRole {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
  SYSTEM = "SYSTEM",
  TOOL = "TOOL",
  DEVELOPER = "DEVELOPER",
  REASONING = "REASONING",
}

/**
 * Item types
 */
export enum ItemType {
  MESSAGE = "MESSAGE",
  TOOL_CALL = "TOOL_CALL",
  REASONING = "REASONING",
}