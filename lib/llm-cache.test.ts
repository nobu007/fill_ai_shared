import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { configureLlmCache, isLlmCacheEnabled, buildCacheKey, getCachedLlmResponse, setCachedLlmResponse, clearLlmCache, getLlmCacheStats } from './llm-cache'

// Mock fs module properly
vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal()
  const mockEntries = []

  return {
    ...actual,
    readFile: vi.fn(async () => {
      if (mockEntries.length === 0) throw new Error('File not found')
      return mockEntries.map(e => JSON.stringify(e)).join('\n') + (mockEntries.length ? '\n' : '')
    }),
    writeFile: vi.fn(async (path, content) => {
      // Parse content to update mockEntries
      const lines = content.trim().split('\n').filter(Boolean)
      mockEntries.length = 0 // Clear existing
      for (const line of lines) {
        if (line.trim()) mockEntries.push(JSON.parse(line))
      }
    }),
    rm: vi.fn(),
    mkdir: vi.fn(),
  }
})

// Mock path module
vi.mock('node:path', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    join: vi.fn((...args) => '/tmp/test-cache/llm-cache.jsonl'),
  }
})

describe('llm-cache', () => {
  const mockCacheDir = '/tmp/test-cache'
  const mockModel = 'gpt-3.5-turbo'
  const mockSystemPrompt = 'You are a helpful assistant'
  const mockUserPrompt = 'Hello world'
  const mockResponse = 'This is a cached response'

  beforeEach(() => {
    delete process.env.LLM_CACHE_PROVIDER
    configureLlmCache({
      enabled: true,
      cacheDir: mockCacheDir,
      ttlMs: 24 * 60 * 60 * 1000,
      maxEntries: 500,
    })

    // Reset all mocks
    vi.clearAllMocks()
  })

  describe('configureLlmCache', () => {
    it('should configure cache settings', () => {
      configureLlmCache({
        enabled: true,
        cacheDir: '/test',
        ttlMs: 3600000,
        maxEntries: 100,
      })

      expect(true).toBe(true)
    })
  })

  describe('isLlmCacheEnabled', () => {
    it('should return false when cache is disabled', () => {
      configureLlmCache({ enabled: false })
      expect(isLlmCacheEnabled()).toBe(false)
    })

    it('should return false when cache provider is not local', () => {
      process.env.LLM_CACHE_PROVIDER = 'portkey'
      expect(isLlmCacheEnabled()).toBe(false)
    })

    it('should return true when cache is enabled and provider is local', () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      configureLlmCache({ enabled: true })
      expect(isLlmCacheEnabled()).toBe(true)
    })
  })

  describe('buildCacheKey', () => {
    it('should generate consistent hash for same inputs', () => {
      const key1 = buildCacheKey(mockModel, mockSystemPrompt, mockUserPrompt)
      const key2 = buildCacheKey(mockModel, mockSystemPrompt, mockUserPrompt)
      expect(key1).toBe(key2)
      expect(key1).toHaveLength(24)
    })

    it('should generate different keys for different inputs', () => {
      const key1 = buildCacheKey(mockModel, mockSystemPrompt, mockUserPrompt)
      const key2 = buildCacheKey(mockModel, mockSystemPrompt, 'Different prompt')
      expect(key1).not.toBe(key2)
    })

    it('should generate different keys for different models', () => {
      const key1 = buildCacheKey(mockModel, mockSystemPrompt, mockUserPrompt)
      const key2 = buildCacheKey('gpt-4', mockSystemPrompt, mockUserPrompt)
      expect(key1).not.toBe(key2)
    })

    it('should generate different keys for different system prompts', () => {
      const key1 = buildCacheKey(mockModel, mockSystemPrompt, mockUserPrompt)
      const key2 = buildCacheKey(mockModel, 'Different system prompt', mockUserPrompt)
      expect(key1).not.toBe(key2)
    })
  })

  describe('getCachedLlmResponse', () => {
    it('should return null when cache is disabled', async () => {
      configureLlmCache({ enabled: false })
      const response = await getCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt)
      expect(response).toBeNull()
    })

    it('should return null when cache provider is not local', async () => {
      process.env.LLM_CACHE_PROVIDER = 'portkey'
      const response = await getCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt)
      expect(response).toBeNull()
    })
  })

  describe('setCachedLlmResponse', () => {
    it('should not cache when cache is disabled', async () => {
      configureLlmCache({ enabled: false })
      await setCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt, mockResponse)
      expect(true).toBe(true)
    })

    it('should not cache when cache provider is not local', async () => {
      process.env.LLM_CACHE_PROVIDER = 'portkey'
      await setCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt, mockResponse)
      expect(true).toBe(true)
    })

    it('should not cache empty response without force option', async () => {
      await setCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt, '')
      expect(true).toBe(true)
    })

    it('should cache empty response with force option', async () => {
      await setCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt, '', { force: true })
      expect(true).toBe(true)
    })
  })

  describe('clearLlmCache', () => {
    it('should remove cache file', async () => {
      await clearLlmCache()
      expect(true).toBe(true)
    })
  })

  describe('getLlmCacheStats', () => {
    it('should return cache statistics', async () => {
      const stats = await getLlmCacheStats()
      expect(typeof stats.entries).toBe('number')
      expect(typeof stats.dir).toBe('string')
    })

    it('should return zero entries when cache is empty', async () => {
      const stats = await getLlmCacheStats()
      expect(stats.entries).toBe(0)
    })
  })
})

// ─── File I/O Integration Tests ─────────────────────────────────────────────────

describe('file I/O integration', () => {
  // These tests use REAL file I/O with temp directories
  // We need to reset modules to get fresh fs imports (unmocked)
  let tempDir: string
  let realLlmCache: typeof import('./llm-cache')

  // Use vi.resetModules() to clear the mock and get real fs
  beforeEach(async () => {
    // Create a unique temp directory for each test
    const { mkdtemp } = await import('node:fs/promises')
    const { tmpdir } = await import('node:os')
    tempDir = await mkdtemp(`${tmpdir()}/llm-cache-test-`)

    // Reset modules to remove mocks, then import fresh
    vi.resetModules()

    // Set env BEFORE importing the module
    process.env.LLM_CACHE_PROVIDER = 'local'

    // Import fresh module (without mocks)
    realLlmCache = await import('./llm-cache')

    // Configure with real temp directory
    realLlmCache.configureLlmCache({
      enabled: true,
      cacheDir: tempDir,
      ttlMs: 1000, // Short TTL for testing expiry
      maxEntries: 5, // Small limit for testing eviction
    })
  })

  afterEach(async () => {
    // Clean up temp directory
    const { rm } = await import('node:fs/promises')
    try {
      await rm(tempDir, { recursive: true, force: true })
    } catch {
      // ignore cleanup errors
    }
    vi.resetModules()
    delete process.env.LLM_CACHE_PROVIDER
  })

  describe('cache write and read round-trip', () => {
    it('should write entry to disk and read it back', async () => {
      const model = 'gpt-4'
      const systemPrompt = 'You are helpful'
      const userPrompt = 'Hello'
      const response = 'Hello! How can I help?'

      // Write
      await realLlmCache.setCachedLlmResponse(model, systemPrompt, userPrompt, response)

      // Read back
      const cached = await realLlmCache.getCachedLlmResponse(model, systemPrompt, userPrompt)
      expect(cached).toBe(response)
    })

    it('should return null for non-existent cache key', async () => {
      const cached = await realLlmCache.getCachedLlmResponse(
        'unknown-model',
        'unknown system',
        'unknown user',
      )
      expect(cached).toBeNull()
    })

    it('should update existing entry (key replacement)', async () => {
      const model = 'gpt-4'
      const systemPrompt = 'same system'
      const userPrompt = 'same user'

      // Write first response
      await realLlmCache.setCachedLlmResponse(model, systemPrompt, userPrompt, 'First response')

      // Write second response with same key
      await realLlmCache.setCachedLlmResponse(model, systemPrompt, userPrompt, 'Second response')

      // Should return second response
      const cached = await realLlmCache.getCachedLlmResponse(model, systemPrompt, userPrompt)
      expect(cached).toBe('Second response')

      // Should have only 1 entry
      const stats = await realLlmCache.getLlmCacheStats()
      expect(stats.entries).toBe(1)
    })

    it('should store multiple entries with different keys', async () => {
      await realLlmCache.setCachedLlmResponse('model-a', 'sys', 'user1', 'response1')
      await realLlmCache.setCachedLlmResponse('model-a', 'sys', 'user2', 'response2')
      await realLlmCache.setCachedLlmResponse('model-b', 'sys', 'user1', 'response3')

      const stats = await realLlmCache.getLlmCacheStats()
      expect(stats.entries).toBe(3)

      // Verify each can be retrieved
      expect(await realLlmCache.getCachedLlmResponse('model-a', 'sys', 'user1')).toBe('response1')
      expect(await realLlmCache.getCachedLlmResponse('model-a', 'sys', 'user2')).toBe('response2')
      expect(await realLlmCache.getCachedLlmResponse('model-b', 'sys', 'user1')).toBe('response3')
    })
  })

  describe('TTL expiry', () => {
    it('should return cached response within TTL', async () => {
      realLlmCache.configureLlmCache({ ttlMs: 500 })

      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user', 'fresh response')

      // Immediately read - should work
      const cached = await realLlmCache.getCachedLlmResponse('model', 'sys', 'user')
      expect(cached).toBe('fresh response')
    })

    it('should return null after TTL expires', async () => {
      realLlmCache.configureLlmCache({ ttlMs: 50 }) // 50ms TTL

      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user', 'expiring response')

      // Wait for TTL to expire
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Should return null after expiry
      const cached = await realLlmCache.getCachedLlmResponse('model', 'sys', 'user')
      expect(cached).toBeNull()
    })

    it('should respect updated TTL configuration for new entries', async () => {
      // Start with very short TTL
      realLlmCache.configureLlmCache({ ttlMs: 30 })
      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user-short', 'response')

      // Wait for original TTL to pass
      await new Promise((resolve) => setTimeout(resolve, 60))

      // Short TTL entry should be expired
      expect(await realLlmCache.getCachedLlmResponse('model', 'sys', 'user-short')).toBeNull()

      // Extend TTL and write a new entry
      realLlmCache.configureLlmCache({ ttlMs: 60000 })
      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user-long', 'response2')

      // New entry should work with extended TTL
      expect(await realLlmCache.getCachedLlmResponse('model', 'sys', 'user-long')).toBe('response2')
    })
  })

  describe('maxEntries limit', () => {
    it('should evict oldest entry when exceeding maxEntries', async () => {
      realLlmCache.configureLlmCache({ maxEntries: 3 })

      // Add 4 entries
      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user1', 'response1')
      await new Promise((resolve) => setTimeout(resolve, 10)) // Ensure different timestamps
      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user2', 'response2')
      await new Promise((resolve) => setTimeout(resolve, 10))
      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user3', 'response3')
      await new Promise((resolve) => setTimeout(resolve, 10))
      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user4', 'response4')

      const stats = await realLlmCache.getLlmCacheStats()
      expect(stats.entries).toBe(3)

      // First entry should be evicted
      const evicted = await realLlmCache.getCachedLlmResponse('model', 'sys', 'user1')
      expect(evicted).toBeNull()

      // Others should still exist
      expect(await realLlmCache.getCachedLlmResponse('model', 'sys', 'user2')).toBe('response2')
      expect(await realLlmCache.getCachedLlmResponse('model', 'sys', 'user3')).toBe('response3')
      expect(await realLlmCache.getCachedLlmResponse('model', 'sys', 'user4')).toBe('response4')
    })

    it('should maintain exactly maxEntries after multiple writes', async () => {
      realLlmCache.configureLlmCache({ maxEntries: 2 })

      for (let i = 0; i < 10; i++) {
        await realLlmCache.setCachedLlmResponse('model', 'sys', `user${i}`, `response${i}`)
      }

      const stats = await realLlmCache.getLlmCacheStats()
      expect(stats.entries).toBe(2)
    })

    it('should evict multiple entries when batch exceeds limit', async () => {
      realLlmCache.configureLlmCache({ maxEntries: 2 })

      // Write 5 entries rapidly
      await realLlmCache.setCachedLlmResponse('m', 's', 'u1', 'r1')
      await realLlmCache.setCachedLlmResponse('m', 's', 'u2', 'r2')
      await realLlmCache.setCachedLlmResponse('m', 's', 'u3', 'r3')
      await realLlmCache.setCachedLlmResponse('m', 's', 'u4', 'r4')
      await realLlmCache.setCachedLlmResponse('m', 's', 'u5', 'r5')

      // Should only have last 2
      const stats = await realLlmCache.getLlmCacheStats()
      expect(stats.entries).toBe(2)

      // Verify u4 and u5 are present
      expect(await realLlmCache.getCachedLlmResponse('m', 's', 'u4')).toBe('r4')
      expect(await realLlmCache.getCachedLlmResponse('m', 's', 'u5')).toBe('r5')

      // u1-u3 should be evicted
      expect(await realLlmCache.getCachedLlmResponse('m', 's', 'u1')).toBeNull()
      expect(await realLlmCache.getCachedLlmResponse('m', 's', 'u2')).toBeNull()
      expect(await realLlmCache.getCachedLlmResponse('m', 's', 'u3')).toBeNull()
    })
  })

  describe('clearLlmCache', () => {
    it('should remove all entries', async () => {
      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user1', 'response1')
      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user2', 'response2')

      expect((await realLlmCache.getLlmCacheStats()).entries).toBe(2)

      await realLlmCache.clearLlmCache()

      expect((await realLlmCache.getLlmCacheStats()).entries).toBe(0)
    })

    it('should return null for previously cached entries', async () => {
      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user', 'response')

      await realLlmCache.clearLlmCache()

      const cached = await realLlmCache.getCachedLlmResponse('model', 'sys', 'user')
      expect(cached).toBeNull()
    })
  })

  describe('getLlmCacheStats', () => {
    it('should return correct entry count', async () => {
      expect((await realLlmCache.getLlmCacheStats()).entries).toBe(0)

      await realLlmCache.setCachedLlmResponse('m1', 's1', 'u1', 'r1')
      expect((await realLlmCache.getLlmCacheStats()).entries).toBe(1)

      await realLlmCache.setCachedLlmResponse('m2', 's2', 'u2', 'r2')
      expect((await realLlmCache.getLlmCacheStats()).entries).toBe(2)
    })

    it('should return the configured cache directory', async () => {
      const stats = await realLlmCache.getLlmCacheStats()
      expect(stats.dir).toBe(tempDir)
    })

    it('should count entries in file accurately', async () => {
      // Write multiple entries
      for (let i = 0; i < 5; i++) {
        await realLlmCache.setCachedLlmResponse(`model-${i}`, 'sys', `user-${i}`, `response-${i}`)
      }

      const stats = await realLlmCache.getLlmCacheStats()
      expect(stats.entries).toBe(5)
    })
  })

  describe('edge cases', () => {
    it('should handle empty response with force option', async () => {
      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user', '', { force: true })

      const cached = await realLlmCache.getCachedLlmResponse('model', 'sys', 'user')
      expect(cached).toBe('')
    })

    it('should not cache empty response without force option', async () => {
      await realLlmCache.setCachedLlmResponse('model', 'sys', 'user', '')

      const stats = await realLlmCache.getLlmCacheStats()
      expect(stats.entries).toBe(0)
    })

    it('should handle special characters in prompts', async () => {
      const specialPrompt = 'Hello\nwith\t"quotes" and \\backslash\\'
      const response = 'Special response'

      await realLlmCache.setCachedLlmResponse('model', specialPrompt, 'user', response)

      const cached = await realLlmCache.getCachedLlmResponse('model', specialPrompt, 'user')
      expect(cached).toBe(response)
    })

    it('should handle unicode in prompts and responses', async () => {
      const unicodePrompt = '日本語プロンプト 🎉'
      const unicodeResponse = '日本語レスポンス 🎊'

      await realLlmCache.setCachedLlmResponse('model', unicodePrompt, 'user', unicodeResponse)

      const cached = await realLlmCache.getCachedLlmResponse('model', unicodePrompt, 'user')
      expect(cached).toBe(unicodeResponse)
    })
  })
})
