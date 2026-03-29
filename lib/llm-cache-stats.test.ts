import { describe, it, expect, beforeEach } from 'vitest'
import { recordCacheHit, recordCacheMiss, resetCacheStats, getCacheStats, getCacheProvider } from './llm-cache-stats'

beforeEach(() => {
  resetCacheStats()
  delete process.env.LLM_CACHE_PROVIDER
})

describe('llm-cache-stats', () => {
  describe('getCacheProvider', () => {
    it('defaults to portkey', () => {
      expect(getCacheProvider()).toBe('portkey')
    })

    it('reads LLM_CACHE_PROVIDER=local', () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      expect(getCacheProvider()).toBe('local')
    })

    it('reads LLM_CACHE_PROVIDER=portkey', () => {
      process.env.LLM_CACHE_PROVIDER = 'portkey'
      expect(getCacheProvider()).toBe('portkey')
    })

    it('falls back to portkey for invalid values', () => {
      process.env.LLM_CACHE_PROVIDER = 'redis'
      expect(getCacheProvider()).toBe('portkey')
    })
  })

  describe('getCacheStats', () => {
    it('returns zeros initially', () => {
      const stats = getCacheStats()
      expect(stats.hits).toBe(0)
      expect(stats.misses).toBe(0)
      expect(stats.total).toBe(0)
      expect(stats.hitRate).toBe(0)
    })

    it('tracks hits and misses', () => {
      recordCacheHit()
      recordCacheHit()
      recordCacheMiss()
      const stats = getCacheStats()
      expect(stats.hits).toBe(2)
      expect(stats.misses).toBe(1)
      expect(stats.total).toBe(3)
      expect(stats.hitRate).toBeCloseTo(2 / 3)
    })

    it('resets counters', () => {
      recordCacheHit()
      recordCacheMiss()
      resetCacheStats()
      const stats = getCacheStats()
      expect(stats.hits).toBe(0)
      expect(stats.misses).toBe(0)
    })

    it('hitRate is 0 when no calls', () => {
      expect(getCacheStats().hitRate).toBe(0)
    })

    it('hitRate is 1 when all hits', () => {
      recordCacheHit()
      recordCacheHit()
      expect(getCacheStats().hitRate).toBe(1)
    })
  })
})
