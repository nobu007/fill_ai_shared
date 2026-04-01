import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

type ProvidersModule = typeof import('./providers')

let cacheProvider: 'portkey' | 'local' = 'portkey'

vi.mock('../lib/llm-cache-stats', () => ({
  getCacheProvider: vi.fn(() => cacheProvider),
}))

async function loadProviders(): Promise<ProvidersModule> {
  return import('./providers')
}

describe('providers', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.resetModules()
    cacheProvider = 'portkey'
    process.env = { ...originalEnv }
    delete process.env.PORTKEY_API_KEY
    delete process.env.PORTKEY_GATEWAY_URL
    delete process.env.PORTKEY_VIRTUAL_KEY_ZAI
    delete process.env.PORTKEY_PROVIDER_NAME_ZAI
    delete process.env.PORTKEY_CONFIG_SLUG
    delete process.env.ZAI_API_KEY
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  describe('isPortkeyEnabled', () => {
    it('returns false when portkey config is missing', async () => {
      const { isPortkeyEnabled } = await loadProviders()
      expect(isPortkeyEnabled()).toBe(false)
    })

    it('returns true when portkey config is present', async () => {
      process.env.PORTKEY_API_KEY = 'test-key'
      process.env.PORTKEY_GATEWAY_URL = 'https://gateway.example.com'

      const { isPortkeyEnabled } = await loadProviders()
      expect(isPortkeyEnabled()).toBe(true)
    })
  })

  describe('getPortkeyHeaders', () => {
    it('includes provider and virtual key headers', async () => {
      const { getPortkeyHeaders } = await loadProviders()
      const headers = getPortkeyHeaders('zai', 'test-virtual-key')

      expect(headers['x-portkey-provider']).toBe('zai')
      expect(headers['x-portkey-virtual-key']).toBe('test-virtual-key')
    })

    it('includes cache headers when cache provider is portkey', async () => {
      cacheProvider = 'portkey'

      const { getPortkeyHeaders } = await loadProviders()
      const headers = getPortkeyHeaders('zai', 'test-key', 'my-namespace')

      expect(headers).toHaveProperty('x-portkey-cache')
      expect(headers['x-portkey-cache-namespace']).toBe('my-namespace')
    })

    it('omits cache headers when cache provider is local', async () => {
      cacheProvider = 'local'

      const { getPortkeyHeaders } = await loadProviders()
      const headers = getPortkeyHeaders('zai', 'test-key', 'my-namespace')

      expect(headers).not.toHaveProperty('x-portkey-cache')
      expect(headers).not.toHaveProperty('x-portkey-cache-namespace')
    })
  })

  describe('resolvePortkeyConfig', () => {
    it('returns undefined when portkey is not enabled', async () => {
      const { resolvePortkeyConfig } = await loadProviders()
      expect(resolvePortkeyConfig('zai')).toBeUndefined()
    })

    it('returns undefined when provider hint is not provided', async () => {
      process.env.PORTKEY_API_KEY = 'test-key'
      process.env.PORTKEY_GATEWAY_URL = 'https://gateway.example.com'

      const { resolvePortkeyConfig } = await loadProviders()
      expect(resolvePortkeyConfig(undefined)).toBeUndefined()
    })

    it('returns undefined when virtual key env var is not set', async () => {
      process.env.PORTKEY_API_KEY = 'test-key'
      process.env.PORTKEY_GATEWAY_URL = 'https://gateway.example.com'

      const { resolvePortkeyConfig } = await loadProviders()
      expect(resolvePortkeyConfig('unknown-provider')).toBeUndefined()
    })

    it('returns config when virtual key env var is set', async () => {
      process.env.PORTKEY_API_KEY = 'test-key'
      process.env.PORTKEY_GATEWAY_URL = 'https://gateway.example.com'
      process.env.PORTKEY_VIRTUAL_KEY_ZAI = 'zai-virtual-key'

      const { resolvePortkeyConfig } = await loadProviders()
      expect(resolvePortkeyConfig('zai')).toEqual({
        provider: 'zai',
        virtualKey: 'zai-virtual-key',
      })
    })

    it('uses custom provider name from env var', async () => {
      process.env.PORTKEY_API_KEY = 'test-key'
      process.env.PORTKEY_GATEWAY_URL = 'https://gateway.example.com'
      process.env.PORTKEY_VIRTUAL_KEY_ZAI = 'zai-virtual-key'
      process.env.PORTKEY_PROVIDER_NAME_ZAI = 'zai_coding'

      const { resolvePortkeyConfig } = await loadProviders()
      expect(resolvePortkeyConfig('zai')?.provider).toBe('zai_coding')
    })
  })

  describe('MODELS', () => {
    it('contains expected model entries', async () => {
      const { MODELS } = await loadProviders()

      expect(MODELS['glm-5-turbo']).toBeDefined()
      expect(MODELS['glm-5']).toBeDefined()
      expect(MODELS['gemini-3.1-flash-lite']).toBeDefined()
    })

    it('all models have required properties', async () => {
      const { MODELS } = await loadProviders()

      for (const info of Object.values(MODELS)) {
        expect(info.provider).toBeTruthy()
        expect(info.modelId).toBeTruthy()
        expect(['low', 'mid', 'high']).toContain(info.tier)
        expect(typeof info.supportsThinking).toBe('boolean')
      }
    })
  })

  describe('getModelInfo', () => {
    it('returns model info for valid model ID', async () => {
      const { getModelInfo } = await loadProviders()
      const info = getModelInfo('glm-5-turbo')

      expect(info).toBeDefined()
      expect(info?.provider).toBe('zai_general')
      expect(info?.tier).toBe('high')
    })

    it('returns undefined for unknown model ID', async () => {
      const { getModelInfo } = await loadProviders()
      expect(getModelInfo('unknown-model')).toBeUndefined()
    })
  })

  describe('getModelTier', () => {
    it('returns correct tier for known models', async () => {
      const { getModelTier } = await loadProviders()

      expect(getModelTier('glm-5-turbo')).toBe('high')
      expect(getModelTier('glm-4.7')).toBe('mid')
      expect(getModelTier('glm-4.5-air')).toBe('low')
    })

    it('returns low for unknown models', async () => {
      const { getModelTier } = await loadProviders()
      expect(getModelTier('unknown-model')).toBe('low')
    })
  })

  describe('getAvailableModels', () => {
    it('returns an empty array when ZAI_API_KEY is not set', async () => {
      const { getAvailableModels } = await loadProviders()
      expect(getAvailableModels()).toEqual([])
    })

    it('returns models with the required properties when ZAI_API_KEY is set', async () => {
      process.env.ZAI_API_KEY = 'test-zai-key'

      const { getAvailableModels } = await loadProviders()
      const models = getAvailableModels()

      expect(models.length).toBeGreaterThan(0)

      for (const model of models) {
        expect(model.id).toBeTruthy()
        expect(model.provider).toBeTruthy()
        expect(model.label).toBeTruthy()
        expect(model.desc).toBeTruthy()
        expect(['low', 'mid', 'high']).toContain(model.tier)
        expect(typeof model.localOnly).toBe('boolean')
      }
    })
  })
})
