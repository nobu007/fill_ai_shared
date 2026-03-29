import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mkdtemp, rm, writeFile, readFile, mkdir, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  configureLlmCache,
  isLlmCacheEnabled,
  buildCacheKey,
  getCachedLlmResponse,
  setCachedLlmResponse,
  clearLlmCache,
  getLlmCacheStats,
} from './llm-cache'

let cacheDir: string

beforeEach(async () => {
  cacheDir = await mkdtemp(join(tmpdir(), 'llm-cache-test-'))
  configureLlmCache({ enabled: true, cacheDir, ttlMs: 24 * 60 * 60 * 1000, maxEntries: 500 })
})

afterEach(async () => {
  await rm(cacheDir, { recursive: true, force: true })
})

describe('llm-cache', () => {
  describe('configureLlmCache', () => {
    it('should disable and re-enable cache', () => {
      configureLlmCache({ enabled: false })
      expect(isLlmCacheEnabled()).toBe(false)
      configureLlmCache({ enabled: true })
      expect(isLlmCacheEnabled()).toBe(true)
    })
  })

  describe('buildCacheKey', () => {
    it('should generate consistent key for same inputs', () => {
      const key1 = buildCacheKey('m', 's', 'u')
      const key2 = buildCacheKey('m', 's', 'u')
      expect(key1).toBe(key2)
      expect(key1).toHaveLength(24)
    })

    it('should generate different keys for different inputs', () => {
      const k1 = buildCacheKey('a', 'b', 'c')
      const k2 = buildCacheKey('x', 'b', 'c')
      expect(k1).not.toBe(k2)
    })
  })

  describe('getCachedLlmResponse', () => {
    it('returns null when disabled', async () => {
      configureLlmCache({ enabled: false })
      expect(await getCachedLlmResponse('m', 's', 'u')).toBeNull()
    })

    it('returns null on cache miss', async () => {
      expect(await getCachedLlmResponse('m', 's', 'u')).toBeNull()
    })

    it('returns cached response', async () => {
      await setCachedLlmResponse('m', 's', 'u', 'hello')
      expect(await getCachedLlmResponse('m', 's', 'u')).toBe('hello')
    })

    it('returns empty string for cached empty response', async () => {
      await setCachedLlmResponse('m', 's', 'u', '', { force: true })
      expect(await getCachedLlmResponse('m', 's', 'u')).toBe('')
    })

    it('returns null for expired entry', async () => {
      configureLlmCache({ ttlMs: 1 })
      await setCachedLlmResponse('m', 's', 'u', 'hello')
      await new Promise(r => setTimeout(r, 10))
      expect(await getCachedLlmResponse('m', 's', 'u')).toBeNull()
    })
  })

  describe('setCachedLlmResponse', () => {
    it('does nothing when disabled', async () => {
      configureLlmCache({ enabled: false })
      await setCachedLlmResponse('m', 's', 'u', 'hello')
      // Re-enable and check nothing was cached
      configureLlmCache({ enabled: true, cacheDir })
      expect(await getCachedLlmResponse('m', 's', 'u')).toBeNull()
    })

    it('skips empty responses by default', async () => {
      await setCachedLlmResponse('m', 's', 'u', '')
      expect(await getCachedLlmResponse('m', 's', 'u')).toBeNull()
    })

    it('caches empty responses with force=true', async () => {
      await setCachedLlmResponse('m', 's', 'u', '', { force: true })
      expect(await getCachedLlmResponse('m', 's', 'u')).toBe('')
    })

    it('caches valid responses and retrieves them', async () => {
      await setCachedLlmResponse('m1', 's1', 'u1', 'resp1')
      await setCachedLlmResponse('m2', 's2', 'u2', 'resp2')
      expect(await getCachedLlmResponse('m1', 's1', 'u1')).toBe('resp1')
      expect(await getCachedLlmResponse('m2', 's2', 'u2')).toBe('resp2')
    })
  })

  describe('clearLlmCache', () => {
    it('clears all entries', async () => {
      await setCachedLlmResponse('m', 's', 'u', 'hello')
      expect(await getCachedLlmResponse('m', 's', 'u')).toBe('hello')
      await clearLlmCache()
      expect(await getCachedLlmResponse('m', 's', 'u')).toBeNull()
    })
  })

  describe('getLlmCacheStats', () => {
    it('returns zero entries for empty cache', async () => {
      const stats = await getLlmCacheStats()
      expect(stats.entries).toBe(0)
      expect(stats.dir).toBe(cacheDir)
    })

    it('counts entries correctly', async () => {
      await setCachedLlmResponse('m1', 's', 'u', 'r1')
      await setCachedLlmResponse('m2', 's', 'u', 'r2')
      const stats = await getLlmCacheStats()
      expect(stats.entries).toBe(2)
    })
  })

  describe('cache file format', () => {
    it('writes valid JSONL entries', async () => {
      await setCachedLlmResponse('model', 'sys', 'user', 'response')
      const content = await readFile(join(cacheDir, 'llm-cache.jsonl'), 'utf-8')
      const lines = content.trim().split('\n')
      expect(lines).toHaveLength(1)
      const entry = JSON.parse(lines[0])
      expect(entry).toHaveProperty('key')
      expect(entry).toHaveProperty('response', 'response')
      expect(entry).toHaveProperty('ts')
      expect(entry).toHaveProperty('model', 'model')
      expect(entry.empty).toBe(false)
    })

    it('overwrites with latest entry for same key', async () => {
      await setCachedLlmResponse('m', 's', 'u', 'first')
      await setCachedLlmResponse('m', 's', 'u', 'second')
      expect(await getCachedLlmResponse('m', 's', 'u')).toBe('second')
    })
  })
})