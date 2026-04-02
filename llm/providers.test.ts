import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  isPortkeyEnabled,
  getPortkeyHeaders,
  resolvePortkeyConfig,
  getModelInfo,
  getModelTier,
  getAvailableModels,
  getAiSdkModel,
  MODELS
} from './providers'

// vi.mock factories are hoisted — must use vi.hoisted() for shared refs
const { mockCreateOpenAI, mockCreateGemini } = vi.hoisted(() => ({
  mockCreateOpenAI: vi.fn(() => vi.fn(() => 'mock-model')),
  mockCreateGemini: vi.fn(() => vi.fn(() => 'mock-gemini')),
}))

// Config mock state — hoisted so vi.mock factory can reference them
const mockConfig = vi.hoisted(() => ({
  portkeyApiKey: '',
  portkeyGatewayUrl: '',
  portkeyConfigSlug: '',
  zaiApiKey: '',
  geminiApiKey: '',
  defaultAiModel: 'glm-5-turbo',
  geminiThinkingLevel: 'high' as string,
}))

vi.mock('@ai-sdk/openai-compatible', () => ({
  createOpenAICompatible: mockCreateOpenAI,
}))

vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: mockCreateGemini,
}))

vi.mock('../lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
  }
}))

vi.mock('../lib/llm-cache-stats', () => ({
  getCacheProvider: vi.fn(),
}))

// Mock config module — IIFE constants are evaluated at load time, so env vars
// set in tests have no effect. We must mock the config module itself.
// @see memory: "Config IIFE定数はロード時評価→テストenv mock不可"
vi.mock('../config', () => ({
  get ZAI_API_URL() { return 'https://api.example.com' },
  get ZAI_API_KEY() { return mockConfig.zaiApiKey },
  get DEFAULT_AI_MODEL() { return mockConfig.defaultAiModel },
  get PORTKEY_API_KEY() { return mockConfig.portkeyApiKey },
  get PORTKEY_GATEWAY_URL() { return mockConfig.portkeyGatewayUrl },
  get PORTKEY_CONFIG_SLUG() { return mockConfig.portkeyConfigSlug },
  get GEMINI_API_KEY() { return mockConfig.geminiApiKey },
  get GEMINI_THINKING_LEVEL() { return mockConfig.geminiThinkingLevel },
}))

// Import after mocking
import { getCacheProvider } from '../lib/llm-cache-stats'
import { logger } from '../lib/logger'
const mockGetCacheProvider = vi.mocked(getCacheProvider)

describe('providers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock config values
    mockConfig.portkeyApiKey = ''
    mockConfig.portkeyGatewayUrl = ''
    mockConfig.portkeyConfigSlug = ''
    mockConfig.zaiApiKey = ''
    mockConfig.geminiApiKey = ''
    mockConfig.defaultAiModel = 'glm-5-turbo'
    mockConfig.geminiThinkingLevel = 'high'
    // Reset environment variables (used by resolvePortkeyConfig which reads process.env directly)
    delete process.env.PORTKEY_API_KEY
    delete process.env.PORTKEY_GATEWAY_URL
    delete process.env.PORTKEY_VIRTUAL_KEY_ZAI
    delete process.env.PORTKEY_PROVIDER_NAME_ZAI
    delete process.env.PORTKEY_VIRTUAL_KEY_ZAI_CODING
    delete process.env.PORTKEY_PROVIDER_NAME_ZAI_CODING
    delete process.env.PORTKEY_VIRTUAL_KEY_GOOGLE
    delete process.env.PORTKEY_PROVIDER_NAME_GOOGLE
    delete process.env.LLM_CACHE_PROVIDER
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('isPortkeyEnabled', () => {
    it('should return false when no Portkey config', () => {
      expect(isPortkeyEnabled()).toBe(false)
    })

    it('should return true with config values', () => {
      mockConfig.portkeyApiKey = 'pk-test'
      mockConfig.portkeyGatewayUrl = 'https://gateway.portkey.ai'
      expect(isPortkeyEnabled()).toBe(true)
    })
  })

  describe('getModelInfo', () => {
    it('should return model info for known model', () => {
      const info = getModelInfo('glm-5-turbo')
      expect(info).toEqual({
        provider: 'zai_general',
        modelId: 'glm-5-turbo',
        tier: 'high',
        supportsThinking: true,
        portkeyProvider: 'zai_coding'
      })
    })

    it('should return undefined for unknown model', () => {
      const info = getModelInfo('unknown-model')
      expect(info).toBeUndefined()
    })
  })

  describe('getModelTier', () => {
    it('should return correct tier for known models', () => {
      expect(getModelTier('glm-5-turbo')).toBe('high')
      expect(getModelTier('glm-4.7')).toBe('mid')
      expect(getModelTier('glm-4.5-air')).toBe('low')
    })

    it('should return low tier for unknown model', () => {
      expect(getModelTier('unknown-model')).toBe('low')
    })
  })

  describe('resolvePortkeyConfig', () => {
    beforeEach(() => {
      mockConfig.portkeyApiKey = 'pk-test'
      mockConfig.portkeyGatewayUrl = 'https://gateway.portkey.ai'
    })

    it('should return undefined when Portkey not enabled', () => {
      mockConfig.portkeyApiKey = ''
      mockConfig.portkeyGatewayUrl = ''
      const config = resolvePortkeyConfig('zai')
      expect(config).toBeUndefined()
    })

    it('should return undefined when no provider hint', () => {
      const config = resolvePortkeyConfig(undefined)
      expect(config).toBeUndefined()
    })

    it('should return config with env vars', () => {
      process.env.PORTKEY_VIRTUAL_KEY_ZAI = 'virtual-key'
      process.env.PORTKEY_PROVIDER_NAME_ZAI = 'zai-provider'

      const config = resolvePortkeyConfig('zai')
      expect(config).toEqual({
        provider: 'zai-provider',
        virtualKey: 'virtual-key'
      })
    })

    it('should use provider hint as provider name when not set', () => {
      process.env.PORTKEY_VIRTUAL_KEY_ZAI = 'virtual-key'

      const config = resolvePortkeyConfig('zai')
      expect(config).toEqual({
        provider: 'zai',
        virtualKey: 'virtual-key'
      })
    })

    it('should return undefined when no virtual key', () => {
      process.env.PORTKEY_VIRTUAL_KEY_OTHER = 'virtual-key'

      const config = resolvePortkeyConfig('zai')
      expect(config).toBeUndefined()
    })
  })

  describe('getPortkeyHeaders', () => {
    it('should build basic headers', () => {
      const headers = getPortkeyHeaders('zai', 'virtual-key')
      expect(headers).toEqual({
        'x-portkey-provider': 'zai',
        'x-portkey-virtual-key': 'virtual-key',
      })
    })

    it('should include cache headers when provider is portkey', () => {
      mockGetCacheProvider.mockReturnValue('portkey')

      const headers = getPortkeyHeaders('zai', 'virtual-key', 'test-namespace')
      expect(headers).toEqual({
        'x-portkey-provider': 'zai',
        'x-portkey-virtual-key': 'virtual-key',
        'x-portkey-cache': JSON.stringify({ mode: 'simple', max_age: 86400 }),
        'x-portkey-cache-namespace': 'test-namespace'
      })
    })

    it('should not include cache headers when provider is not portkey', () => {
      mockGetCacheProvider.mockReturnValue('local')

      const headers = getPortkeyHeaders('zai', 'virtual-key', 'test-namespace')
      expect(headers).toEqual({
        'x-portkey-provider': 'zai',
        'x-portkey-virtual-key': 'virtual-key',
      })
    })
  })

  describe('getAvailableModels', () => {
    it('should return empty array when ZAI_API_KEY is not set', () => {
      mockConfig.zaiApiKey = ''
      const models = getAvailableModels()
      expect(Array.isArray(models)).toBe(true)
      expect(models.length).toBe(0)
    })

    it('should return models with correct shape when ZAI_API_KEY is set', () => {
      mockConfig.zaiApiKey = 'zai-key'
      const models = getAvailableModels()
      expect(models.length).toBeGreaterThan(0)
      // Each model should have these properties
      for (const model of models) {
        expect(model).toHaveProperty('id')
        expect(model).toHaveProperty('provider')
        expect(model).toHaveProperty('label')
        expect(model).toHaveProperty('desc')
        expect(model).toHaveProperty('tier')
        expect(model).toHaveProperty('localOnly')
      }
    })
  })

  describe('MODELS', () => {
    it('should have correct model definitions', () => {
      expect(MODELS['glm-5-turbo']).toEqual({
        provider: 'zai_general',
        modelId: 'glm-5-turbo',
        tier: 'high',
        supportsThinking: true,
        portkeyProvider: 'zai_coding'
      })

      expect(MODELS['gemini-3.1-flash-lite']).toEqual({
        provider: 'gemini',
        modelId: 'gemini-3.1-flash-lite-preview',
        tier: 'high',
        supportsThinking: true,
        thinkingLevel: 'high',
        portkeyProvider: 'google'
      })
    })
  })

  describe('getAiSdkModel', () => {
    // --- Default ZAI paths (no BYOK, no Portkey) ---

    it('should return ZAI model for known modelId without BYOK or Portkey', () => {
      const result = getAiSdkModel('glm-5-turbo')
      expect(result).toBe('mock-model')
      expect(mockCreateOpenAI).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'zai-general',
          baseURL: 'https://api.example.com',
        })
      )
    })

    it('should use ZAI provider for mid-tier model without Portkey', () => {
      const result = getAiSdkModel('glm-4.7')
      expect(result).toBe('mock-model')
      expect(mockCreateOpenAI).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'zai-general' })
      )
    })

    // --- Portkey routing ---

    it('should route ZAI model through Portkey when Portkey is enabled', () => {
      mockConfig.portkeyApiKey = 'pk-test'
      mockConfig.portkeyGatewayUrl = 'https://gateway.portkey.ai'
      process.env.PORTKEY_VIRTUAL_KEY_ZAI_CODING = 'vk-zai'
      process.env.PORTKEY_PROVIDER_NAME_ZAI_CODING = 'zai_coding'

      const result = getAiSdkModel('glm-5-turbo')
      expect(result).toBe('mock-model')
      expect(mockCreateOpenAI).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'portkey-gateway',
          baseURL: 'https://gateway.portkey.ai',
          apiKey: 'pk-test',
        })
      )
    })

    it('should route Gemini model through Portkey when Portkey is enabled', () => {
      mockConfig.portkeyApiKey = 'pk-test'
      mockConfig.portkeyGatewayUrl = 'https://gateway.portkey.ai'
      mockConfig.geminiApiKey = 'gemini-key' // Portkey takes priority over direct Gemini
      process.env.PORTKEY_VIRTUAL_KEY_GOOGLE = 'vk-google'
      process.env.PORTKEY_PROVIDER_NAME_GOOGLE = 'google'

      const result = getAiSdkModel('gemini-3.1-flash-lite')
      expect(result).toBe('mock-model')
      expect(mockCreateOpenAI).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'portkey-gateway',
          baseURL: 'https://gateway.portkey.ai',
        })
      )
    })

    // --- Gemini server-key paths ---

    it('should use Gemini server key when GEMINI_API_KEY is set', () => {
      mockConfig.geminiApiKey = 'gemini-test-key'

      const result = getAiSdkModel('gemini-3.1-flash-lite')
      expect(result).toBe('mock-gemini')
      expect(mockCreateGemini).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'gemini-test-key',
        })
      )
    })

    it('should fallback to ZAI when GEMINI_API_KEY is not set for Gemini model', () => {
      mockConfig.geminiApiKey = ''

      const result = getAiSdkModel('gemini-3.1-flash-lite')
      expect(result).toBe('mock-model')
      expect(mockCreateOpenAI).toHaveBeenCalled()
      expect(logger.warn).toHaveBeenCalledWith(
        'providers',
        expect.stringContaining('GEMINI_API_KEY not set'),
      )
    })

    // --- BYOK paths ---

    it('should use BYOK key for Gemini model with thinkingConfig', () => {
      const userKey = 'valid-gemini-key-1234567890'
      const result = getAiSdkModel('gemini-3.1-flash-lite', userKey)
      expect(result).toBe('mock-gemini')
      expect(mockCreateGemini).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: userKey,
          thinkingConfig: { thinkingLevel: 'high', includeThoughts: false },
        })
      )
    })

    it('should use BYOK key for ZAI model (default provider case)', () => {
      const userKey = 'valid-zai-key-12345678901'
      const result = getAiSdkModel('glm-4.7', userKey)
      expect(result).toBe('mock-model')
      expect(mockCreateOpenAI).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'byok-glm-4.7',
          baseURL: 'https://api.example.com',
          apiKey: userKey,
        })
      )
    })

    it('should warn and fall back to default for short BYOK key (< 20 chars)', () => {
      const shortKey = 'tooshort'
      const result = getAiSdkModel('glm-5-turbo', shortKey)
      expect(result).toBe('mock-model')
      expect(logger.warn).toHaveBeenCalledWith(
        'providers',
        expect.stringContaining('too short'),
        expect.objectContaining({ modelId: 'glm-5-turbo' })
      )
    })

    // --- Unknown model fallback ---

    it('should fallback to DEFAULT_AI_MODEL for unknown modelId', () => {
      const result = getAiSdkModel('unknown-model-xyz')
      expect(result).toBe('mock-model')
      expect(mockCreateOpenAI).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'zai-general',
        })
      )
    })

    it('should throw when modelId unknown and no default model configured', () => {
      mockConfig.defaultAiModel = ''
      expect(() => getAiSdkModel('unknown-model')).toThrow('Unknown model')
    })

    // --- Thinking level ---

    it('should pass thinkingLevel from MODELS entry for BYOK Gemini', () => {
      // Note: MODELS is a module-level constant. Its thinkingLevel is set from
      // GEMINI_THINKING_LEVEL at module load time. Changing the mock after
      // load has no effect on existing MODELS entries.
      // gemini-3.1-flash-lite has thinkingLevel: 'high' in MODELS.
      const userKey = 'valid-gemini-key-1234567890'
      const result = getAiSdkModel('gemini-3.1-flash-lite', userKey)
      expect(result).toBe('mock-gemini')
      expect(mockCreateGemini).toHaveBeenCalledWith(
        expect.objectContaining({
          thinkingConfig: { thinkingLevel: 'high', includeThoughts: false },
        })
      )
    })

    // --- BYOK default case (unknown provider falls through to ZAI) ---

    it('should handle BYOK default case for zai_general provider', () => {
      const userKey = 'valid-zai-key-12345678901'
      const result = getAiSdkModel('glm-5', userKey)
      expect(result).toBe('mock-model')
      expect(mockCreateOpenAI).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'byok-glm-5',
          apiKey: userKey,
        })
      )
    })
  })
})
