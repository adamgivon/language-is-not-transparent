// lib/utils/rateLimit.ts
// Simple in-memory token bucket rate limiter
// For production, replace with Redis-backed solution

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

// In-memory store (module-level)
const buckets = new Map<string, TokenBucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp when bucket resets
}

export interface RateLimitConfig {
  rate: number;    // tokens per minute
  burst: number;   // max tokens (burst size)
}

// Default configs
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  rate: 6,    // 6 requests per minute
  burst: 6,   // burst of 6
};

/**
 * Check and consume a token for rate limiting
 * @param key - Unique identifier (e.g., "session:abc123")
 * @param config - Rate limit configuration
 * @returns RateLimitResult with allowed status and remaining tokens
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
): RateLimitResult {
  const now = Date.now();
  const { rate, burst } = config;
  
  // Get or create bucket
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = {
      tokens: burst,
      lastRefill: now,
    };
    buckets.set(key, bucket);
  }
  
  // Calculate refill
  const elapsedMs = now - bucket.lastRefill;
  const elapsedMinutes = elapsedMs / 60000;
  const refillTokens = Math.floor(elapsedMinutes * rate);
  
  // Refill bucket (capped at burst)
  if (refillTokens > 0) {
    bucket.tokens = Math.min(burst, bucket.tokens + refillTokens);
    bucket.lastRefill = now;
  }
  
  // Calculate when bucket will reset to full
  const tokensUntilFull = burst - bucket.tokens;
  const msUntilFull = (tokensUntilFull / rate) * 60000;
  const resetAt = now + msUntilFull;
  
  // Check if request allowed
  if (bucket.tokens <= 0) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: Math.ceil(resetAt / 1000), // Unix timestamp in seconds
    };
  }
  
  // Consume token
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  
  return {
    allowed: true,
    remaining: bucket.tokens,
    resetAt: Math.ceil(resetAt / 1000),
  };
}

/**
 * Clear all rate limit buckets (useful for testing)
 */
export function clearRateLimits(): void {
  buckets.clear();
}

/**
 * Clear rate limit for specific key
 */
export function clearRateLimit(key: string): void {
  buckets.delete(key);
}

/**
 * Get current bucket state (for monitoring/debugging)
 */
export function getRateLimitState(key: string): TokenBucket | null {
  return buckets.get(key) ?? null;
}

// Periodic cleanup of old buckets (run every 10 minutes)
// Removes buckets that haven't been accessed in over 1 hour
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const BUCKET_MAX_AGE_MS = 60 * 60 * 1000;   // 1 hour

let cleanupTimer: NodeJS.Timeout | null = null;

function startCleanup() {
  if (cleanupTimer) return; // Already running
  
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    let removed = 0;
    
    for (const [key, bucket] of buckets.entries()) {
      if (now - bucket.lastRefill > BUCKET_MAX_AGE_MS) {
        buckets.delete(key);
        removed++;
      }
    }
    
    if (removed > 0) {
      console.log(`Rate limiter: cleaned up ${removed} stale buckets`);
    }
  }, CLEANUP_INTERVAL_MS);
}

function stopCleanup() {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }
}

// Auto-start cleanup in non-test environments
if (process.env.NODE_ENV !== 'test') {
  startCleanup();
}

// Export cleanup controls for testing
export const cleanup = {
  start: startCleanup,
  stop: stopCleanup,
};