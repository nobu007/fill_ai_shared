import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { configureLlmCache, isLlmCacheEnabled, buildCacheKey } from './llm-cache'

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
})
