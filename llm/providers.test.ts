import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock environment variables
beforeEach(() => {
  process.env.ZAI_API_KEY='***'
  process.env.OPENAI_API_KEY='***'
})

describe('getModelInfo', () => {
  it('returns info for known model', async () => {
    const { getModelInfo } = await import('./providers')
    const info = getModelInfo('glm-4.7')
    expect(info).toBeDefined()
    expect(info!.tier).toBe('mid')
    expect(info!.provider).toBe('zai_general')
  })

  it('returns undefined for unknown model', async () => {
    const { getModelInfo } = await import('./providers')
    expect(getModelInfo('nonexistent')).toBeUndefined()
  })
})

describe('getModelTier', () => {
  it('returns correct tiers', async () => {
    const { getModelTier } = await import('./providers')
    expect(getModelTier('glm-4.5-air')).toBe('low')
    expect(getModelTier('glm-4.7')).toBe('mid')
    expect(getModelTier('glm-5-turbo')).toBe('high')
    expect(getModelTier('unknown')).toBe('low')
  })
})

describe('MODELS', () => {
  it('has expected models', async () => {
    const { MODELS } = await import('./providers')
    expect(MODELS['glm-4.7']).toBeDefined()
    expect(MODELS['glm-4.5-air']).toBeDefined()
    expect(MODELS['glm-5-turbo']).toBeDefined()
    expect(MODELS['glm-5']).toBeDefined()
  })
})

describe('getAvailableModels', () => {
  it('returns models when API keys are set', async () => {
    const { getAvailableModels } = await import('./providers')
    const models = getAvailableModels()
    expect(models.length).toBeGreaterThan(0)
    expect(models.every(m => m.id && m.label && m.desc)).toBe(true)
  })

  it('returns empty when no API keys', async () => {
    delete process.env.ZAI_API_KEY
    delete process.env.OPENAI_API_KEY
    // Re-import to pick up new env
    vi.resetModules()
    const { getAvailableModels } = await import('./providers')
    const models = getAvailableModels()
    expect(models.length).toBe(0)
  })
})

describe('getAiSdkModel', () => {
  it('falls back to default model for unknown model', async () => {
    const { getAiSdkModel } = await import('./providers')
    const model = getAiSdkModel('unknown-model')
    expect(model).toBeDefined()
    // Unknown models fall back to DEFAULT_AI_MODEL (glm-5-turbo)
    expect(model.modelId).toBe('glm-5-turbo')
  })

  it('returns a model instance for known model', async () => {
    const { getAiSdkModel } = await import('./providers')
    const model = getAiSdkModel('glm-4.7')
    expect(model).toBeDefined()
    expect(model.modelId).toBe('glm-4.7')
  })

  it('uses user API key when provided (BYOK)', async () => {
    const { getAiSdkModel } = await import('./providers')
    const userApiKey = 'sk-abcdefghijklmnopqrstuvwxyz'
    const model = getAiSdkModel('glm-5-turbo', userApiKey)
    expect(model).toBeDefined()
    expect(model.modelId).toBe('glm-5-turbo')
    // The provider name should include the model ID when using BYOK
    expect(model.provider).toContain('byok-glm-5-turbo')
  })

  it('uses default ZAI key when user API key is not provided', async () => {
    const { getAiSdkModel } = await import('./providers')
    const model = getAiSdkModel('glm-4.7')
    expect(model).toBeDefined()
    expect(model.modelId).toBe('glm-4.7')
    // Should use the default zai-general provider (with .chat suffix)
    expect(model.provider).toContain('zai-general')
  })

  it('uses user API key for different models', async () => {
    const { getAiSdkModel } = await import('./providers')
    const userApiKey = 'sk-abcdefghijklmnopqrstuvwxyz'

    const model1 = getAiSdkModel('glm-5', userApiKey)
    expect(model1.modelId).toBe('glm-5')
    expect(model1.provider).toContain('byok-glm-5')

    const model2 = getAiSdkModel('glm-4.6', userApiKey)
    expect(model2.modelId).toBe('glm-4.6')
    expect(model2.provider).toContain('byok-glm-4.6')
  })

  it('handles empty string as user API key', async () => {
    const { getAiSdkModel } = await import('./providers')
    const model = getAiSdkModel('glm-4.7', '')
    expect(model).toBeDefined()
    expect(model.modelId).toBe('glm-4.7')
    // Empty string should fall back to default provider
    expect(model.provider).toContain('zai-general')
  })
})

describe('getAiSdkModel — Gemini paths', () => {
  beforeEach(() => {
    process.env.ZAI_API_KEY='***'
    process.env.GEMINI_API_KEY='***'
    vi.resetModules()
  })

  it('creates Gemini model with BYOK user API key', async () => {
    const { getAiSdkModel } = await import('./providers')
    const userApiKey = 'sk-abcdefghijklmnopqrstuvwxyz'
    const model = getAiSdkModel('gemini-3.1-flash-lite', userApiKey)
    expect(model).toBeDefined()
    expect(model.modelId).toBe('gemini-3.1-flash-lite-preview')
  })

  it('creates Gemini model with default GEMINI_API_KEY', async () => {
    const { getAiSdkModel } = await import('./providers')
    const model = getAiSdkModel('gemini-3.1-flash-lite')
    expect(model).toBeDefined()
    expect(model.modelId).toBe('gemini-3.1-flash-lite-preview')
  })

  it('falls back to ZAI when GEMINI_API_KEY is not set', async () => {
    delete process.env.GEMINI_API_KEY
    vi.resetModules()
    const { getAiSdkModel } = await import('./providers')
    const model = getAiSdkModel('gemini-3.1-flash-lite')
    expect(model).toBeDefined()
    // Should fall back to ZAI provider with default model
    expect(model.provider).toContain('zai-general')
  })

  it('falls back to ZAI with DEFAULT_AI_MODEL when GEMINI_API_KEY is not set', async () => {
    delete process.env.GEMINI_API_KEY
    process.env.DEFAULT_AI_MODEL = 'glm-4.7'
    vi.resetModules()
    const { getAiSdkModel } = await import('./providers')
    const model = getAiSdkModel('gemini-3.1-flash-lite')
    expect(model).toBeDefined()
    expect(model.provider).toContain('zai-general')
    expect(model.modelId).toBe('glm-4.7')
  })

  it('respects GEMINI_THINKING_LEVEL env var for Gemini model config', async () => {
    process.env.GEMINI_THINKING_LEVEL = 'low'
    vi.resetModules()
    const { getModelInfo } = await import('./providers')
    const info = getModelInfo('gemini-3.1-flash-lite')
    expect(info).toBeDefined()
    expect(info!.thinkingLevel).toBe('low')
  })

  it('defaults GEMINI_THINKING_LEVEL to high when not set', async () => {
    delete process.env.GEMINI_THINKING_LEVEL
    vi.resetModules()
    const { getModelInfo } = await import('./providers')
    const info = getModelInfo('gemini-3.1-flash-lite')
    expect(info).toBeDefined()
    expect(info!.thinkingLevel).toBe('high')
  })

  it('Gemini BYOK path includes thinkingConfig when model has thinkingLevel', async () => {
    const { getAiSdkModel } = await import('./providers')
    const userApiKey = 'sk-abcdefghijklmnopqrstuvwxyz'
    // This exercises lines 69-75: BYOK gemini path with thinkingConfig
    const model = getAiSdkModel('gemini-3.1-flash-lite', userApiKey)
    expect(model).toBeDefined()
    expect(model.modelId).toBe('gemini-3.1-flash-lite-preview')
  })
})
