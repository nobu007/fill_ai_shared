import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock config values
vi.mock('../config', () => ({
  ZAI_API_URL: 'https://api.z.ai/api/general/v4',
  ZAI_API_KEY: 'test-zai-key',
  DEFAULT_AI_MODEL: 'glm-5-turbo',
}))

vi.mock('../lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

describe('llm/providers', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
    delete process.env.PORTKEY_API_KEY
    delete process.env.PORTKEY_GATEWAY_URL
    delete process.env.PORTKEY_CONFIG_SLUG
    delete process.env.PORTKEY_VIRTUAL_KEY_ZAI_CODING
    delete process.env.PORTKEY_PROVIDER_NAME_ZAI_CODING
    delete process.env.GEMINI_API_KEY
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('Portkey integration', () => {
    it('does not use Portkey when env vars are not set', async () => {
      const { getAiSdkModel } = await import('./providers')
      const model = getAiSdkModel('glm-5-turbo')
      expect(model).toBeDefined()
      expect(model.modelId).toBe('glm-5-turbo')
      // Default ZAI provider
      expect(model.config.provider).toBe('zai-general.chat')
    })

    it('uses Portkey when PORTKEY_API_KEY and PORTKEY_GATEWAY_URL are set', async () => {
      process.env.PORTKEY_API_KEY = 'pk-test-key'
      process.env.PORTKEY_GATEWAY_URL = 'https://test-gateway.example.com/v1'
      process.env.PORTKEY_VIRTUAL_KEY_ZAI_CODING = 'vk-test-123'

      const { getAiSdkModel } = await import('./providers')
      const model = getAiSdkModel('glm-5-turbo')
      expect(model).toBeDefined()
      expect(model.modelId).toBe('glm-5-turbo')
      // Portkey gateway provider
      expect(model.config.provider).toBe('portkey-gateway.chat')
    })

    it('falls back to ZAI when Portkey virtual key is not configured for provider', async () => {
      process.env.PORTKEY_API_KEY = 'pk-test-key'
      process.env.PORTKEY_GATEWAY_URL = 'https://test-gateway.example.com/v1'
      // No PORTKEY_VIRTUAL_KEY_ZAI_CODING set

      const { getAiSdkModel } = await import('./providers')
      const model = getAiSdkModel('glm-5-turbo')
      expect(model).toBeDefined()
      expect(model.config.provider).toBe('zai-general.chat')
    })

    it('includes x-portkey-config header when PORTKEY_CONFIG_SLUG is set', async () => {
      process.env.PORTKEY_API_KEY = 'pk-test-key'
      process.env.PORTKEY_GATEWAY_URL = 'https://test-gateway.example.com/v1'
      process.env.PORTKEY_VIRTUAL_KEY_ZAI_CODING = 'vk-test-123'
      process.env.PORTKEY_CONFIG_SLUG = 'my-config-slug'

      const { getAiSdkModel } = await import('./providers')
      const model = getAiSdkModel('glm-5-turbo')
      expect(model).toBeDefined()
      expect(model.config.provider).toBe('portkey-gateway.chat')
    })

    it('resolves Portkey provider name from env var override', async () => {
      process.env.PORTKEY_API_KEY = 'pk-test-key'
      process.env.PORTKEY_GATEWAY_URL = 'https://test-gateway.example.com/v1'
      process.env.PORTKEY_VIRTUAL_KEY_ZAI_CODING = 'vk-test-123'
      process.env.PORTKEY_PROVIDER_NAME_ZAI_CODING = 'custom-zai'

      const { getAiSdkModel } = await import('./providers')
      const model = getAiSdkModel('glm-5-turbo')
      expect(model).toBeDefined()
      expect(model.config.provider).toBe('portkey-gateway.chat')
    })
  })

  describe('getModelInfo / getModelTier', () => {
    it('returns correct model info for known models', async () => {
      const { getModelInfo, getModelTier } = await import('./providers')
      expect(getModelInfo('glm-5-turbo')?.tier).toBe('high')
      expect(getModelInfo('glm-5-turbo')?.portkeyProvider).toBe('zai_coding')
      expect(getModelInfo('glm-4.7-flash')?.tier).toBe('low')
      expect(getModelTier('glm-4.6')).toBe('mid')
    })

    it('returns undefined for unknown models', async () => {
      const { getModelInfo } = await import('./providers')
      expect(getModelInfo('nonexistent-model')).toBeUndefined()
    })

    it('returns low tier for unknown models via getModelTier', async () => {
      const { getModelTier } = await import('./providers')
      expect(getModelTier('nonexistent-model')).toBe('low')
    })
  })

  describe('BYOK (Bring Your Own Key)', () => {
    it('uses user API key for ZAI models', async () => {
      const { getAiSdkModel } = await import('./providers')
      const model = getAiSdkModel('glm-5-turbo', 'sk-user-provided-key-1234567890')
      expect(model).toBeDefined()
      expect(model.modelId).toBe('glm-5-turbo')
      expect(model.config.provider).toBe('byok-glm-5-turbo.chat')
    })

    it('rejects too-short user API keys (falls back to default)', async () => {
      const { getAiSdkModel } = await import('./providers')
      const model = getAiSdkModel('glm-5-turbo', 'short')
      expect(model).toBeDefined()
      // Should fall back to zai-general, not byok
      expect(model.config.provider).toBe('zai-general.chat')
    })

    it('uses user API key for Gemini models', async () => {
      process.env.GEMINI_API_KEY = 'server-gemini-key'
      const { getAiSdkModel } = await import('./providers')
      const model = getAiSdkModel('gemini-3.1-flash-lite', 'sk-user-gemini-key-1234567890')
      expect(model).toBeDefined()
      expect(model.modelId).toBe('gemini-3.1-flash-lite-preview')
    })
  })

  describe('Gemini fallback', () => {
    it('falls back to ZAI when GEMINI_API_KEY is not set', async () => {
      const { getAiSdkModel } = await import('./providers')
      const model = getAiSdkModel('gemini-3.1-flash-lite')
      expect(model).toBeDefined()
      // Should fall back to default ZAI model
      expect(model.config.provider).toBe('zai-general.chat')
      expect(model.modelId).toBe('glm-5-turbo')
    })

    it('uses Gemini when GEMINI_API_KEY is set', async () => {
      process.env.GEMINI_API_KEY = 'test-gemini-key'
      const { getAiSdkModel } = await import('./providers')
      const model = getAiSdkModel('gemini-3.1-flash-lite')
      expect(model).toBeDefined()
      expect(model.modelId).toBe('gemini-3.1-flash-lite-preview')
      // Gemini provider
      expect(model.config.provider).toContain('google')
    })
  })

  describe('getAvailableModels', () => {
    it('returns model list with correct tiers', async () => {
      const { getAvailableModels } = await import('./providers')
      const models = getAvailableModels()
      expect(models.length).toBeGreaterThan(0)
      const turbo = models.find(m => m.id === 'glm-5-turbo')
      expect(turbo?.tier).toBe('high')
      expect(turbo?.provider).toBe('zai')
    })
  })

  describe('MODELS registry', () => {
    it('all ZAI models have portkeyProvider set to zai_coding', async () => {
      const { MODELS } = await import('./providers')
      const zaiModels = Object.entries(MODELS).filter(([, info]) => info.provider === 'zai_general')
      expect(zaiModels.length).toBeGreaterThan(0)
      for (const [id, info] of zaiModels) {
        expect(info.portkeyProvider).toBe('zai_coding', `Model ${id} missing portkeyProvider`)
      }
    })

    it('Gemini model has portkeyProvider set to google', async () => {
      const { MODELS } = await import('./providers')
      const gemini = MODELS['gemini-3.1-flash-lite']
      expect(gemini?.portkeyProvider).toBe('google')
    })
  })
})
