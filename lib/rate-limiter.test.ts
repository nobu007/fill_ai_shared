import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  createRateLimiter,
  resetRateLimiterState,
  _internals,
} from './rate-limiter'

// ─── Helpers ─────────────────────────────────────────────

beforeEach(() => {
  resetRateLimiterState()
  vi.useFakeTimers()
})

afterEach(() => {
  resetRateLimiterState()
  vi.useRealTimers()
})

function advanceTime(ms: number) {
  vi.advanceTimersByTime(ms)
}

// ─── Basic Rate Limiting ─────────────────────────────────

describe('createRateLimiter', () => {
  it('allows requests within the limit', () => {
    const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 })

    for (let i = 0; i < 5; i++) {
      expect(limiter.check('user-1')).toBe(false)
    }
  })

  it('blocks requests exceeding the limit', () => {
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60_000 })

    // Allow 3
    expect(limiter.check('user-1')).toBe(false)
    expect(limiter.check('user-1')).toBe(false)
    expect(limiter.check('user-1')).toBe(false)
    // Block the 4th
    expect(limiter.check('user-1')).toBe(true)
  })

  it('allows different keys independently', () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60_000 })

    // User A uses 2 requests
    expect(limiter.check('user-a')).toBe(false)
    expect(limiter.check('user-a')).toBe(false)
    expect(limiter.check('user-a')).toBe(true) // blocked

    // User B still has quota
    expect(limiter.check('user-b')).toBe(false)
    expect(limiter.check('user-b')).toBe(false)
  })
})

// ─── Sliding Window Reset ────────────────────────────────

describe('sliding window', () => {
  it('resets after window expires', () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 5_000 })

    // Use up quota
    expect(limiter.check('user-1')).toBe(false)
    expect(limiter.check('user-1')).toBe(false)
    expect(limiter.check('user-1')).toBe(true)

    // Advance past window
    advanceTime(5_001)

    // Should allow again
    expect(limiter.check('user-1')).toBe(false)
  })

  it('maintains separate windows per key', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 5_000 })

    expect(limiter.check('user-a')).toBe(false)
    advanceTime(2_500)
    // user-a still in window
    expect(limiter.check('user-a')).toBe(true)

    // user-b has its own window
    expect(limiter.check('user-b')).toBe(false)

    advanceTime(2_501)
    // user-a window expired, user-b still in window
    expect(limiter.check('user-a')).toBe(false)
    expect(limiter.check('user-b')).toBe(true)
  })
})

// ─── Remaining Requests ──────────────────────────────────

describe('getRemainingRequests', () => {
  it('returns maxRequests for new key', () => {
    const limiter = createRateLimiter({ maxRequests: 10, windowMs: 60_000 })

    expect(limiter.getRemainingRequests('user-1')).toBe(10)
  })

  it('decrements with each request', () => {
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60_000 })

    limiter.check('user-1')
    expect(limiter.getRemainingRequests('user-1')).toBe(2)

    limiter.check('user-1')
    expect(limiter.getRemainingRequests('user-1')).toBe(1)

    limiter.check('user-1')
    expect(limiter.getRemainingRequests('user-1')).toBe(0)
  })

  it('returns 0 when blocked', () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60_000 })

    limiter.check('user-1')
    limiter.check('user-1')
    limiter.check('user-1') // blocked
    expect(limiter.getRemainingRequests('user-1')).toBe(0)
  })

  it('resets after window expires', () => {
    const limiter = createRateLimiter({ maxRequests: 5, windowMs: 5_000 })

    limiter.check('user-1')
    limiter.check('user-1')
    expect(limiter.getRemainingRequests('user-1')).toBe(3)

    advanceTime(5_001)
    expect(limiter.getRemainingRequests('user-1')).toBe(5)
  })
})

// ─── Retry-After ──────────────────────────────────────────

describe('getRetryAfterSeconds', () => {
  it('returns the ceiling of the active window duration in seconds', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 5_000 })

    limiter.check('user-1')
    expect(limiter.getRetryAfterSeconds('user-1')).toBe(5)

    advanceTime(1_001)
    expect(limiter.getRetryAfterSeconds('user-1')).toBe(4)
  })

  it('returns zero when no active window exists', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 5_000 })

    expect(limiter.getRetryAfterSeconds('new-user')).toBe(0)

    limiter.check('expired-user')
    advanceTime(5_001)
    expect(limiter.getRetryAfterSeconds('expired-user')).toBe(0)
  })
})

// ─── Stats ────────────────────────────────────────────────

describe('getStats', () => {
  it('returns correct initial stats', () => {
    const limiter = createRateLimiter({ maxRequests: 10, windowMs: 60_000 })

    const stats = limiter.getStats()
    expect(stats.maxRequests).toBe(10)
    expect(stats.windowMs).toBe(60_000)
    expect(stats.totalEntries).toBe(0)
    expect(stats.totalBlocked).toBe(0)
  })

  it('tracks total entries', () => {
    const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 })

    limiter.check('user-a')
    limiter.check('user-b')
    limiter.check('user-c')

    expect(limiter.getStats().totalEntries).toBe(3)
  })

  it('tracks blocked count', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 })

    limiter.check('user-1')
    limiter.check('user-1') // blocked
    limiter.check('user-1') // blocked
    limiter.check('user-1') // blocked

    expect(limiter.getStats().totalBlocked).toBe(3)
  })
})

// ─── Singleton Isolation (named limiters) ────────────────

describe('named singleton isolation', () => {
  it('shares state for same name', () => {
    const limiter1 = createRateLimiter({ name: 'shared', maxRequests: 2, windowMs: 60_000 })
    const limiter2 = createRateLimiter({ name: 'shared', maxRequests: 2, windowMs: 60_000 })

    // limiter1 uses quota
    limiter1.check('user-1')
    limiter1.check('user-1')

    // limiter2 sees the same quota exhausted
    expect(limiter2.check('user-1')).toBe(true)
  })

  it('isolates state for different names', () => {
    const limiterA = createRateLimiter({ name: 'limiter-a', maxRequests: 1, windowMs: 60_000 })
    const limiterB = createRateLimiter({ name: 'limiter-b', maxRequests: 1, windowMs: 60_000 })

    // limiterA uses quota
    limiterA.check('user-1')
    expect(limiterA.check('user-1')).toBe(true)

    // limiterB has independent quota
    expect(limiterB.check('user-1')).toBe(false)
  })

  it('uses default name when none provided', () => {
    const limiter1 = createRateLimiter({ maxRequests: 1, windowMs: 60_000 })
    const limiter2 = createRateLimiter({ maxRequests: 1, windowMs: 60_000 })

    limiter1.check('user-1')
    expect(limiter2.check('user-1')).toBe(true) // same default store
  })
})

// ─── Cleanup ─────────────────────────────────────────────

describe('cleanup', () => {
  it('removes expired entries on interval', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 5_000, cleanupIntervalMs: 5_000 })

    limiter.check('user-a')
    limiter.check('user-b')
    limiter.check('user-c')

    expect(limiter.getStats().totalEntries).toBe(3)

    // Advance past window + cleanup interval
    advanceTime(5_001)

    // Cleanup should have removed expired entries
    expect(limiter.getStats().totalEntries).toBe(0)
  })

  it('uses windowMs as default cleanup interval', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 10_000 })

    limiter.check('user-a')
    expect(limiter.getStats().totalEntries).toBe(1)

    // Before cleanup interval
    advanceTime(9_999)
    expect(limiter.getStats().totalEntries).toBe(1)

    // After cleanup interval (= windowMs)
    advanceTime(1)
    expect(limiter.getStats().totalEntries).toBe(0)
  })

  it('lazy cleanup on check removes expired entries', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 5_000 })

    limiter.check('user-a')
    limiter.check('user-b')
    expect(limiter.getStats().totalEntries).toBe(2)

    // Advance past window (but before interval-based cleanup)
    advanceTime(5_001)

    // Trigger a check which should lazy-clean
    limiter.check('user-c')
    expect(limiter.getStats().totalEntries).toBe(1) // only user-c
  })
})

// ─── resetRateLimiterState ───────────────────────────────

describe('resetRateLimiterState', () => {
  it('clears all rate limiter state', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 })

    limiter.check('user-1')
    limiter.check('user-1') // blocked
    expect(limiter.getStats().totalEntries).toBe(1)
    expect(limiter.getStats().totalBlocked).toBe(1)

    resetRateLimiterState()

    // New limiter after reset should have clean state
    const limiter2 = createRateLimiter({ maxRequests: 1, windowMs: 60_000 })
    expect(limiter2.getStats().totalEntries).toBe(0)
    expect(limiter2.getStats().totalBlocked).toBe(0)
    expect(limiter2.check('user-1')).toBe(false) // not blocked
  })
})

// ─── Edge Cases ──────────────────────────────────────────

describe('edge cases', () => {
  it('handles maxRequests of 1 (strictest limit)', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 })

    expect(limiter.check('user-1')).toBe(false)
    expect(limiter.check('user-1')).toBe(true)
  })

  it('handles maxRequests of 0 (blocks after first request)', () => {
    // Note: the first request always creates a new window with count=1,
    // so it's allowed. Subsequent requests within the window are blocked.
    const limiter = createRateLimiter({ maxRequests: 0, windowMs: 60_000 })

    expect(limiter.check('user-1')).toBe(false) // first request creates window
    expect(limiter.check('user-1')).toBe(true)  // blocked: count(1) >= maxRequests(0)
  })

  it('handles very short window', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 100 })

    expect(limiter.check('user-1')).toBe(false)
    expect(limiter.check('user-1')).toBe(true)

    advanceTime(101)
    expect(limiter.check('user-1')).toBe(false)
  })

  it('handles many keys without memory issues', () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 })

    for (let i = 0; i < 1000; i++) {
      expect(limiter.check(`user-${i}`)).toBe(false)
    }

    expect(limiter.getStats().totalEntries).toBe(1000)
  })
})
