/**
 * Unified LLM cache statistics tracker.
 * Works with both "local" (file-based) and "portkey" (gateway-level) cache providers.
 *
 * Usage:
 *   import { cacheStats, getCacheStats } from '@/shared/lib/llm-cache-stats'
 *   cacheStats.recordHit()
 *   cacheStats.recordMiss()
 *   getCacheStats() → { hits, misses, total, hitRate, provider }
 */

import { getLLMCacheProvider, type CacheProvider } from '../config'

export type { CacheProvider }

export interface CacheStats {
  hits: number
  misses: number
  total: number
  hitRate: number
  provider: CacheProvider
}

// ─── In-memory counters ────────────────────────────────────

let hits = 0
let misses = 0

function resetCounters() {
  hits = 0
  misses = 0
}

// ─── Public API ───────────────────────────────────────────

/** Record a cache hit (called after detecting hit from response header or local cache) */
export function recordCacheHit(): void {
  hits++
}

/** Record a cache miss (called when no cached response found) */
export function recordCacheMiss(): void {
  misses++
}

/** Reset counters (useful between requests or in tests) */
export function resetCacheStats(): void {
  resetCounters()
}

/** Get the active cache provider — delegated to centralized config (§2.4) */
export function getCacheProvider(): CacheProvider {
  return getLLMCacheProvider()
}

/** Get unified cache stats report */
export function getCacheStats(): CacheStats {
  const total = hits + misses
  return {
    hits,
    misses,
    total,
    hitRate: total > 0 ? hits / total : 0,
    provider: getCacheProvider(),
  }
}

/** Export the stats object for convenient destructured import */
export const cacheStats = {
  recordHit: recordCacheHit,
  recordMiss: recordCacheMiss,
  reset: resetCacheStats,
}
