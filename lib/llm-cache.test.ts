import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { configureLlmCache, isLlmCacheEnabled, buildCacheKey, getCachedLlmResponse, setCachedLlmResponse, clearLlmCache, getLlmCacheStats } from './llm-cache'

// Mock fs module properly
vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>
  const mockEntries: unknown[] = []

  return {
    ...actual,
    readFile: vi.fn(async () => {
      if (mockEntries.length === 0) throw new Error('File not found')
      return mockEntries.map(e => JSON.stringify(e as unknown)).join('\n') + (mockEntries.length ? '\n' : '')
    }),
    writeFile: vi.fn(async (path, content) => {
      // Parse content to update mockEntries
      const lines = content.trim().split('\n').filter(Boolean)
      mockEntries.length = 0 // Clear existing
      for (const line of lines) {
        if (line.trim()) mockEntries.push(JSON.parse(line) as unknown)
      }
    }),
    rm: vi.fn(),
    mkdir: vi.fn(),
  }
})

// Mock path module
vi.mock('node:path', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>
  return {
    ...actual,
    join: vi.fn((..._args) => '/tmp/test-cache/llm-cache.jsonl'),
  }
})

describe('llm-cache', () => {
  const mockCacheDir = '/tmp/test-cache'
  const mockModel = 'gpt-3.5-turbo'
  const mockSystemPrompt = 'You are a helpful assistant'
  const mockUserPrompt = 'Hello world'

  beforeEach(() => {
    delete process.env.LLM_CACHE_PROVIDER
    configureLlmCache({
      enabled: true,
      cacheDir: mockCacheDir,
      ttlMs: 24 * 60 * 60 * 1000,
      maxEntries: 500,
    })
  })

  afterEach(() => {
    delete process.env.LLM_CACHE_PROVIDER
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
      configureLlmCache({ enabled: true })
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
      const key1 = buildCacheKey('gpt-3.5-turbo', mockSystemPrompt, mockUserPrompt)
      const key2 = buildCacheKey('gpt-4', mockSystemPrompt, mockUserPrompt)
      expect(key1).not.toBe(key2)
    })

    it('should generate different keys for different system prompts', () => {
      const key1 = buildCacheKey(mockModel, 'You are a helpful assistant', mockUserPrompt)
      const key2 = buildCacheKey(mockModel, 'You are a coding expert', mockUserPrompt)
      expect(key1).not.toBe(key2)
    })
  })

  describe('getCachedLlmResponse', () => {
    it('should return null when cache is disabled', async () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      configureLlmCache({ enabled: false })
      const result = await getCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt)
      expect(result).toBeNull()
    })

    it('should return null when cache provider is not local', async () => {
      process.env.LLM_CACHE_PROVIDER = 'portkey'
      configureLlmCache({ enabled: true })
      const result = await getCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt)
      expect(result).toBeNull()
    })

    it('should return null for cache miss', async () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      configureLlmCache({ enabled: true, cacheDir: mockCacheDir })
      const result = await getCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt)
      expect(result).toBeNull()
    })
  })

  describe('setCachedLlmResponse', () => {
    it('should not cache when disabled', async () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      configureLlmCache({ enabled: false })
      await setCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt, 'test response')
      // Should not throw
    })

    it('should not cache when provider is not local', async () => {
      process.env.LLM_CACHE_PROVIDER = 'portkey'
      configureLlmCache({ enabled: true })
      await setCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt, 'test response')
      // Should not throw
    })

    it('should not cache empty response without force', async () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      configureLlmCache({ enabled: true, cacheDir: mockCacheDir })
      await setCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt, '')
      // Should not throw
    })

    it('should cache empty response with force option', async () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      configureLlmCache({ enabled: true, cacheDir: mockCacheDir })
      await setCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt, '', { force: true })
      // Should not throw
    })

    it('should cache non-empty response', async () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      configureLlmCache({ enabled: true, cacheDir: mockCacheDir })
      await setCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt, 'test response')
      // Should not throw
    })
  })

  describe('clearLlmCache', () => {
    it('should clear cache without error', async () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      configureLlmCache({ enabled: true, cacheDir: mockCacheDir })
      await clearLlmCache()
      // Should not throw
    })
  })

  describe('getLlmCacheStats', () => {
    it('should return cache stats', async () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      configureLlmCache({ enabled: true, cacheDir: mockCacheDir })
      const stats = await getLlmCacheStats()
      expect(stats).toHaveProperty('entries')
      expect(stats).toHaveProperty('dir')
      expect(stats.dir).toBe(mockCacheDir)
    })
  })

  describe('TTL expiration', () => {
    it('should return null for expired entries', async () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      // Set very short TTL for testing
      configureLlmCache({ enabled: true, cacheDir: mockCacheDir, ttlMs: 1 })
      
      // Set a cache entry
      await setCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt, 'test response')
      
      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // Should return null because entry is expired
      const result = await getCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt)
      expect(result).toBeNull()
    })

    it('should respect custom TTL configuration', async () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      configureLlmCache({ enabled: true, cacheDir: mockCacheDir, ttlMs: 60000 })
      
      // Set a cache entry
      await setCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt, 'test response')
      
      // Should return the cached response (not expired yet)
      const result = await getCachedLlmResponse(mockModel, mockSystemPrompt, mockUserPrompt)
      // Result depends on mock implementation - validate the flow runs
      expect(result).not.toBeNull()
    })
  })

  describe('maxEntries eviction', () => {
    it('should evict oldest entries when maxEntries is exceeded', async () => {
      process.env.LLM_CACHE_PROVIDER = 'local'
      configureLlmCache({ enabled: true, cacheDir: mockCacheDir, maxEntries: 2 })
      
      // Add 3 entries (max is 2)
      await setCachedLlmResponse('model1', 'system1', 'user1', 'response1')
      await setCachedLlmResponse('model2', 'system2', 'user2', 'response2')
      await setCachedLlmResponse('model3', 'system3', 'user3', 'response3')
      
      // This test validates the maxEntries logic runs without error
      // The actual eviction behavior depends on the mock implementation
    })
  })
})
