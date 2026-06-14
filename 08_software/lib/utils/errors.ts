// lib/utils/errors.ts
// Structured error response utilities

import { NextResponse } from "next/server";

/**
 * Error codes used throughout the API
 */
export type ErrorCode =
  | "SESSION_NOT_FOUND"
  | "MISSING_FAISS_INDEX"
  | "MISSING_CONVERSATION_ID"
  | "MISSING_PROJECT_NAME"   
  | "MISSING_SESSION_NAME"      
  | "MISSING_ANCHOR_SYSTEM"
  | "NO_CONFIG"    
  | "PROJECT_MISMATCH"
  | "INVALID_INPUT"
  | "INVALID_K"
  | "K_TOO_LARGE"
  | "EMPTY_USER_TEXT"
  | "FAISS_INDEX_FAILED"
  | "NO_USER_ITEM"
  | "NO_ANCHORS_SELECTED"
  | "NO_VIABLE_ANCHORS"
  | "DUPLICATE_ANCHOR_NAME"
  | "EMPTY_RESPONSE"
  | "OPENAI_TIMEOUT"
  | "TIMEOUT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

/**
 * Create a structured error response
 * @param code - Error code
 * @param message - Human-readable error message
 * @param status - HTTP status code
 * @returns NextResponse with structured error
 */
export function errorResponse(
  code: ErrorCode,
  message: string,
  status: number
): NextResponse {
  return NextResponse.json(
    {
      code,
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}