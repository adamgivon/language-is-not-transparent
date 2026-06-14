// lib/utils/timeout.ts
// Timeout utilities for external API calls

/**
 * Wrap a promise with a timeout
 * @param promise - The promise to wrap
 * @param timeoutMs - Timeout in milliseconds
 * @param operation - Description of the operation (for error messages)
 * @returns Promise that rejects if timeout is exceeded
 * @throws Error with timeout message if exceeded
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation: string = "Operation"
): Promise<T> {
  let timeoutHandle: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(`${operation} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutHandle!);
    return result;
  } catch (err) {
    clearTimeout(timeoutHandle!);
    throw err;
  }
}

/**
 * Timeout configurations for different operation types
 */
export const TIMEOUTS = {
  // Embedding operations (typically fast)
  EMBEDDING: 30000,        // 30 seconds
  
  // FAISS operations
  FAISS_SEARCH: 20000,     // 20 seconds
  FAISS_INDEX: 15000,      // 15 seconds
  FAISS_COMPARE: 10000,    // 10 seconds
  
  // OpenAI API calls (can be slow for long responses)
  OPENAI_REQUEST: 120000,  // 120 seconds (2 minutes)
  
  // Database operations
  DB_QUERY: 30000,         // 30 seconds
  DB_TRANSACTION: 60000,   // 60 seconds
  
  // MCP operations
  MCP_GENERAL: 30000,      // 30 seconds
} as const;

/**
 * Convenience wrappers for common timeout scenarios
 */
export const timeouts = {
  /**
   * Wrap an embedding call with timeout
   */
  embedding: <T>(promise: Promise<T>) => 
    withTimeout(promise, TIMEOUTS.EMBEDDING, "Embedding"),
  
  /**
   * Wrap a FAISS search with timeout
   */
  faissSearch: <T>(promise: Promise<T>) => 
    withTimeout(promise, TIMEOUTS.FAISS_SEARCH, "FAISS search"),
  
  /**
   * Wrap a FAISS index operation with timeout
   */
  faissIndex: <T>(promise: Promise<T>) => 
    withTimeout(promise, TIMEOUTS.FAISS_INDEX, "FAISS indexing"),
  
  /**
   * Wrap a FAISS compare operation with timeout
   */
  faissCompare: <T>(promise: Promise<T>) => 
    withTimeout(promise, TIMEOUTS.FAISS_COMPARE, "FAISS comparison"),
  
  /**
   * Wrap an OpenAI API call with timeout
   */
  openai: <T>(promise: Promise<T>) => 
    withTimeout(promise, TIMEOUTS.OPENAI_REQUEST, "OpenAI API call"),
  
  /**
   * Wrap a database query with timeout
   */
  dbQuery: <T>(promise: Promise<T>) => 
    withTimeout(promise, TIMEOUTS.DB_QUERY, "Database query"),
  
  /**
   * Wrap a database transaction with timeout
   */
  dbTransaction: <T>(promise: Promise<T>) => 
    withTimeout(promise, TIMEOUTS.DB_TRANSACTION, "Database transaction"),
};

/**
 * Batch timeout - wrap multiple promises with individual timeouts
 * All promises race against their own timeouts
 * @param promises - Array of promise factories (functions that return promises)
 * @param timeoutMs - Timeout for each individual promise
 * @param operation - Description for errors
 * @returns Promise that resolves when all complete or any timeout
 */
export async function withBatchTimeout<T>(
  promises: (() => Promise<T>)[],
  timeoutMs: number,
  operation: string = "Batch operation"
): Promise<T[]> {
  return Promise.all(
    promises.map((promiseFn, idx) => 
      withTimeout(promiseFn(), timeoutMs, `${operation} [${idx}]`)
    )
  );
}

/**
 * Retry with timeout - attempt an operation multiple times with timeout
 * @param fn - Function that returns a promise
 * @param timeoutMs - Timeout per attempt
 * @param maxRetries - Maximum number of retries
 * @param operation - Description for errors
 * @returns Result of successful attempt
 * @throws Error from last failed attempt
 */
export async function retryWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  maxRetries: number = 3,
  operation: string = "Operation"
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await withTimeout(fn(), timeoutMs, `${operation} (attempt ${attempt})`);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      
      // If it's the last attempt, throw
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retry (exponential backoff)
      const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw lastError || new Error(`${operation} failed after ${maxRetries} attempts`);
}