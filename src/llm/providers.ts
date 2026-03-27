import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { ZAI_API_URL, ZAI_API_KEY } from '@/shared/config'

export type ModelTier = 'low' | 'mid' | 'high'

function getZaiProvider() {
  return createOpenAICompatible({
    name: 'zai-general',
    baseURL: ZAI_API_URL,
    apiKey: ZAI_API_KEY,
  })
}

export interface ModelInfo {
  provider: string
  modelId: string
  tier: ModelTier
  supportsThinking: boolean
}

export const MODELS: Record<string, ModelInfo> = {
  // Z-AI General & Coding API（共通）
  'glm-5-turbo': { provider: 'zai_general', modelId: 'glm-5-turbo', tier: 'high', supportsThinking: true },
  'glm-5':       { provider: 'zai_general', modelId: 'glm-5',       tier: 'high', supportsThinking: true },
  'glm-4.7':     { provider: 'zai_general', modelId: 'glm-4.7',     tier: 'mid',  supportsThinking: true },
  'glm-4.6':     { provider: 'zai_general', modelId: 'glm-4.6',     tier: 'mid',  supportsThinking: true },
  'glm-4.5-air': { provider: 'zai_general', modelId: 'glm-4.5-air', tier: 'low',  supportsThinking: true },
}

export function getModelInfo(modelId: string): ModelInfo | undefined {
  return MODELS[modelId]
}

export function getModelTier(modelId: string): ModelTier {
  return MODELS[modelId]?.tier || 'low'
}

/**
 * ai-sdk modelインスタンスを取得
 * BYOKのユーザーAPIキーがあればそちらを使用
 */
export function getAiSdkModel(modelId: string, userApiKey?: string) {
  const info = MODELS[modelId]
  if (!info) throw new Error(`Unknown model: ${modelId}`)

  if (userApiKey) {
    const provider = createOpenAICompatible({
      name: `byok-${modelId}`,
      baseURL: ZAI_API_URL,
      apiKey: userApiKey,
    })
    return provider(info.modelId)
  }

  return getZaiProvider()(info.modelId)
}

/** GUI用モデル一覧 */
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
      { id: 'glm-5',       provider: 'zai', label: 'GLM-5',       desc: '高品質（Z-AI）', tier: 'high', localOnly: false },
      { id: 'glm-4.7',     provider: 'zai', label: 'GLM-4.7',     desc: 'バランス（Z-AI）', tier: 'mid', localOnly: false },
      { id: 'glm-4.6',     provider: 'zai', label: 'GLM-4.6',     desc: '標準（Z-AI）', tier: 'mid', localOnly: false },
      { id: 'glm-4.5-air', provider: 'zai', label: 'GLM-4.5 Air', desc: '軽量・高速（Z-AI）', tier: 'low', localOnly: false },
    )
  }
  return models
}
