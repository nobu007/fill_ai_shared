import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { DEFAULT_AI_MODEL, ZAI_API_KEY, ZAI_API_URL } from '@/shared/config'
import { logger } from '@/shared/lib/logger'

export type ModelTier = 'low' | 'mid' | 'high'

function getZaiProvider() {
  return createOpenAICompatible({
    name: 'zai-general',
    baseURL: process.env.ZAI_API_URL || ZAI_API_URL,
    apiKey: process.env.ZAI_API_KEY || ZAI_API_KEY,
  })
}

function getGeminiProvider(thinkingLevel?: string) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    logger.warn('providers', 'GEMINI_API_KEY not set, Gemini fallback unavailable')
    return null
  }

  const options: Record<string, unknown> = {}
  if (thinkingLevel) {
    options.thinkingConfig = { thinkingLevel, includeThoughts: false }
  }

  return createGoogleGenerativeAI({ apiKey, ...options })
}

export interface ModelInfo {
  provider: string
  modelId: string
  tier: ModelTier
  supportsThinking: boolean
  thinkingLevel?: 'minimal' | 'low' | 'medium' | 'high'
}

export const MODELS: Record<string, ModelInfo> = {
  'glm-5-turbo': { provider: 'zai_general', modelId: 'glm-5-turbo', tier: 'high', supportsThinking: true },
  'glm-5': { provider: 'zai_general', modelId: 'glm-5', tier: 'high', supportsThinking: true },
  'glm-4.7': { provider: 'zai_general', modelId: 'glm-4.7', tier: 'mid', supportsThinking: true },
  'glm-4.6': { provider: 'zai_general', modelId: 'glm-4.6', tier: 'mid', supportsThinking: true },
  'glm-4.5-air': { provider: 'zai_general', modelId: 'glm-4.5-air', tier: 'low', supportsThinking: true },
  'glm-4.7-coding': { provider: 'zai_general', modelId: 'glm-4.7-coding', tier: 'mid', supportsThinking: true },
  'glm-4.7-flash': { provider: 'zai_general', modelId: 'glm-4.7-flash', tier: 'low', supportsThinking: true },
  'gemini-3.1-flash-lite': {
    provider: 'gemini',
    modelId: 'gemini-3.1-flash-lite-preview',
    tier: 'high',
    supportsThinking: true,
    thinkingLevel: (process.env.GEMINI_THINKING_LEVEL as 'minimal' | 'low' | 'medium' | 'high') || 'high',
  },
}

export function getModelInfo(modelId: string): ModelInfo | undefined {
  return MODELS[modelId]
}

export function getModelTier(modelId: string): ModelTier {
  return MODELS[modelId]?.tier || 'low'
}

export function getAiSdkModel(modelId: string, userApiKey?: string) {
  const info = MODELS[modelId]
  if (!info) throw new Error(`Unknown model: ${modelId}`)

  if (userApiKey) {
    if (info.provider === 'gemini') {
      const options: Record<string, unknown> = {}
      if (info.thinkingLevel) {
        options.thinkingConfig = { thinkingLevel: info.thinkingLevel, includeThoughts: false }
      }
      const provider = createGoogleGenerativeAI({ apiKey: userApiKey, ...options })
      return provider(info.modelId)
    }

    const provider = createOpenAICompatible({
      name: `byok-${modelId}`,
      baseURL: ZAI_API_URL,
      apiKey: userApiKey,
    })
    return provider(info.modelId)
  }

  if (info.provider === 'gemini') {
    const geminiProvider = getGeminiProvider(info.thinkingLevel)
    if (!geminiProvider) {
      logger.warn('providers', `Gemini model ${modelId} requested but GEMINI_API_KEY not set, falling back to ZAI`)
      return getZaiProvider()(MODELS[DEFAULT_AI_MODEL]?.modelId || 'glm-5-turbo')
    }
    return geminiProvider(info.modelId)
  }

  return getZaiProvider()(info.modelId)
}

export function getAvailableModels(): Array<{
  id: string
  provider: string
  label: string
  desc: string
  tier: ModelTier
  localOnly: boolean
}> {
  const hasZaiKey = !!ZAI_API_KEY
  const models: Array<{
    id: string
    provider: string
    label: string
    desc: string
    tier: ModelTier
    localOnly: boolean
  }> = []

  if (hasZaiKey) {
    models.push(
      { id: 'glm-5-turbo', provider: 'zai', label: 'GLM-5 Turbo', desc: '高品質・高速（Z-AI）', tier: 'high', localOnly: false },
      { id: 'glm-5', provider: 'zai', label: 'GLM-5', desc: '高品質（Z-AI）', tier: 'high', localOnly: false },
      { id: 'glm-4.7', provider: 'zai', label: 'GLM-4.7', desc: 'バランス（Z-AI）', tier: 'mid', localOnly: false },
      { id: 'glm-4.6', provider: 'zai', label: 'GLM-4.6', desc: '標準（Z-AI）', tier: 'mid', localOnly: false },
      { id: 'glm-4.5-air', provider: 'zai', label: 'GLM-4.5 Air', desc: '軽量・高速（Z-AI）', tier: 'low', localOnly: false },
    )
  }

  return models
}
