/**
 * Shared in-memory rate limiter.
 *
 * Provides per-key sliding-window rate limiting with configurable limits.
 * Supports named singletons for independent rate limiters across routes.
 *
 * Per SYSTEM_CONSTITUTION.md §1.2 Safety: rate limiting prevents API abuse.
 */

// ─── Types ───────────────────────────────────────────────

export interface RateLimiterConfig {
  /** Optional name for singleton isolation. Named limiters share no state. */
  name?: string
  /** Maximum requests allowed within the window. */
  maxRequests: number
  /** Sliding window duration in milliseconds. */
  windowMs: number
  /** Interval for proactive cleanup of expired entries (default: windowMs). */
  cleanupIntervalMs?: number
}

export interface RateLimiterStats {
  maxRequests: number
  windowMs: number
  totalEntries: number
  totalBlocked: number
}

export interface RateLimiter {
  /** Check if a key is rate-limited. Returns true if BLOCKED, false if ALLOWED. */
  check(key: string): boolean
  /** Get remaining requests for a key within the current window. */
  getRemainingRequests(key: string): number
  /** Get aggregate statistics. */
  getStats(): RateLimiterStats
}

interface RateLimitEntry {
  count: number
  windowStart: number
}

// ─── Internal state ──────────────────────────────────────

/** Per-limiter-name state store. Each named limiter gets its own Map. */
const stores = new Map<string, Map<string, RateLimitEntry>>()

/** Per-limiter-name blocked counter. */
const blockedCounters = new Map<string, number>()

/** Active cleanup timers. */
const cleanupTimers = new Map<string, ReturnType<typeof setInterval>>()

/** Get or create the store for a named limiter. */
function getStore(name: string): Map<string, RateLimitEntry> {
  let store = stores.get(name)
  if (!store) {
    store = new Map()
    stores.set(name, store)
  }
  return store
}

/** Get or create the blocked counter for a named limiter. */
function getBlockedCounter(name: string): { get: () => number; increment: () => void; reset: () => void } {
  let counter = blockedCounters.get(name)
  if (counter === undefined) {
    counter = 0
    blockedCounters.set(name, counter)
  }
  return {
    get: () => blockedCounters.get(name) ?? 0,
    increment: () => {
      const current = blockedCounters.get(name) ?? 0
      blockedCounters.set(name, current + 1)
    },
    reset: () => blockedCounters.set(name, 0),
  }
}

// ─── Cleanup ─────────────────────────────────────────────

function cleanupExpired(store: Map<string, RateLimitEntry>, windowMs: number, now: number): void {
  for (const [key, entry] of store) {
    if (now - entry.windowStart >= windowMs) {
      store.delete(key)
    }
  }
}

function startCleanup(name: string, config: RateLimiterConfig): void {
  // Clear any existing timer for this name
  const existing = cleanupTimers.get(name)
  if (existing) clearInterval(existing)

  const intervalMs = config.cleanupIntervalMs ?? config.windowMs
  const timer = setInterval(() => {
    const store = stores.get(name)
    if (store) {
      cleanupExpired(store, config.windowMs, Date.now())
    }
  }, intervalMs)

  // Allow the process to exit even if timers are active
  if (timer.unref) timer.unref()
  cleanupTimers.set(name, timer)
}

// ─── Public API ──────────────────────────────────────────

/**
 * Create a rate limiter instance.
 *
 * If `name` is provided, limiters with the same name share state (singleton).
 * Different names create independent rate limiters.
 */
export function createRateLimiter(config: RateLimiterConfig): RateLimiter {
  const name = config.name ?? '__default__'
  const store = getStore(name)
  const blocked = getBlockedCounter(name)

  // Start periodic cleanup
  startCleanup(name, config)

  return {
    check(key: string): boolean {
      const now = Date.now()

      // Lazy cleanup on every check
      cleanupExpired(store, config.windowMs, now)

      const entry = store.get(key)
      if (!entry || now - entry.windowStart >= config.windowMs) {
        // New window
        store.set(key, { count: 1, windowStart: now })
        return false
      }

      if (entry.count < config.maxRequests) {
        entry.count++
        return false
      }

      // Rate limited
      blocked.increment()
      return true
    },

    getRemainingRequests(key: string): number {
      const now = Date.now()
      const entry = store.get(key)

      if (!entry || now - entry.windowStart >= config.windowMs) {
        return config.maxRequests
      }

      return Math.max(0, config.maxRequests - entry.count)
    },

    getStats(): RateLimiterStats {
      return {
        maxRequests: config.maxRequests,
        windowMs: config.windowMs,
        totalEntries: store.size,
        totalBlocked: blocked.get(),
      }
    },
  }
}

// ─── Test helpers ────────────────────────────────────────

/**
 * Reset all rate limiter state. Only for testing.
 */
export function resetRateLimiterState(): void {
  for (const timer of cleanupTimers.values()) {
    clearInterval(timer)
  }
  stores.clear()
  blockedCounters.clear()
  cleanupTimers.clear()
}

/**
 * Exposed internals for testing.
 */
export const _internals = {
  stores,
  blockedCounters,
  cleanupTimers,
}
