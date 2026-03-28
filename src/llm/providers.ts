import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { ZAI_API_URL, ZAI_API_KEY, DEFAULT_AI_MODEL } from '@/shared/config'
import { logger } from '@/shared/lib/logger'

export type ModelTier = 'low' | 'mid' | 'high'

/** Whether Portkey AI Gateway is enabled via env vars */
const PORTKEY_ENABLED = !!process.env.PORTKEY_API_KEY && !!process.env.PORTKEY_GATEWAY_URL
const PORTKEY_API_KEY = process.env.PORTKEY_API_KEY || ''
const PORTKEY_GATEWAY_URL = process.env.PORTKEY_GATEWAY_URL || 'https://api.portkey.ai/v1'
const PORTKEY_CONFIG_SLUG = process.env.PORTKEY_CONFIG_SLUG || ''

function getZaiProvider(portkeyConfig?: { provider: string; virtualKey: string }) {
  if (PORTKEY_ENABLED && portkeyConfig) {
    logger.info('providers', 'Using Portkey AI Gateway', { baseURL: PORTKEY_GATEWAY_URL, ...portkeyConfig })
    return createOpenAICompatible({
      name: 'portkey-gateway',
      baseURL: PORTKEY_GATEWAY_URL,
      apiKey: PORTKEY_API_KEY,
      headers: getPortkeyHeaders(portkeyConfig.provider, portkeyConfig.virtualKey),
    })
  }
  return createOpenAICompatible({
    name: 'zai-general',
    baseURL: process.env.ZAI_API_URL || ZAI_API_URL,
    apiKey: process.env.ZAI_API_KEY || ZAI_API_KEY,
  })
}

/**
 * Build Portkey request headers.
 * Uses x-portkey-provider and x-portkey-virtual-key to route correctly.
 */
function getPortkeyHeaders(provider: string, virtualKey: string): Record<string, string> {
  const headers: Record<string, string> = {
    'x-portkey-provider': provider,
    'x-portkey-virtual-key': virtualKey,
  }
  // Attach Portkey config for automatic retry + fallback (handled at gateway level)
  if (PORTKEY_CONFIG_SLUG) {
    headers['x-portkey-config'] = PORTKEY_CONFIG_SLUG
  }
  return headers
}

/**
 * Resolve Portkey config for a provider.
 * Reads PORTKEY_VIRTUAL_KEY_<PROVIDER> and PORTKEY_PROVIDER_NAME_<PROVIDER> env vars.
 */
function resolvePortkeyConfig(providerHint?: string): { provider: string; virtualKey: string } | undefined {
  if (!PORTKEY_ENABLED || !providerHint) return undefined
  const envBase = providerHint.toUpperCase().replace(/-/g, '_')
  const virtualKey = process.env[`PORTKEY_VIRTUAL_KEY_${envBase}`]
  const providerName = process.env[`PORTKEY_PROVIDER_NAME_${envBase}`]
  if (!virtualKey) return undefined
  return { provider: providerName || providerHint, virtualKey }
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
  /** Portkey provider slug for routing (e.g. "zai_coding", "google") */
  portkeyProvider?: string
}

export const MODELS: Record<string, ModelInfo> = {
  // Z-AI General & Coding API（共通）
  'glm-5-turbo': { provider: 'zai_general', modelId: 'glm-5-turbo', tier: 'high', supportsThinking: true, portkeyProvider: 'zai_coding' },
  'glm-5':       { provider: 'zai_general', modelId: 'glm-5',       tier: 'high', supportsThinking: true, portkeyProvider: 'zai_coding' },
  'glm-4.7':     { provider: 'zai_general', modelId: 'glm-4.7',     tier: 'mid',  supportsThinking: true, portkeyProvider: 'zai_coding' },
  'glm-4.6':     { provider: 'zai_general', modelId: 'glm-4.6',     tier: 'mid',  supportsThinking: true, portkeyProvider: 'zai_coding' },
  'glm-4.5-air': { provider: 'zai_general', modelId: 'glm-4.5-air', tier: 'low',  supportsThinking: true, portkeyProvider: 'zai_coding' },
  'glm-4.7-coding': { provider: 'zai_general', modelId: 'glm-4.7-coding', tier: 'mid', supportsThinking: true, portkeyProvider: 'zai_coding' },
  'glm-4.7-flash': { provider: 'zai_general', modelId: 'glm-4.7-flash', tier: 'low', supportsThinking: true, portkeyProvider: 'zai_coding' },
  // Google Gemini（fallback用）
  'gemini-3.1-flash-lite': { provider: 'gemini', modelId: 'gemini-3.1-flash-lite-preview', tier: 'high', supportsThinking: true, thinkingLevel: (process.env.GEMINI_THINKING_LEVEL as 'minimal' | 'low' | 'medium' | 'high') || 'high', portkeyProvider: 'google' },
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
 *
 * BYOK keys are validated at save time (POST /api/keys). This function trusts
 * the stored key without re-validation, which is acceptable since keys are
 * validated on insert and marked is_valid=false if revoked.
 */
export function getAiSdkModel(modelId: string, userApiKey?: string) {
  let info = MODELS[modelId]
  if (!info) {
    // Fall back to default model for unknown modelIds
    const fallback = MODELS[DEFAULT_AI_MODEL]
    if (!fallback) throw new Error(`Unknown model: ${modelId} and no default model configured`)
    info = fallback
  }

  // BYOK: ユーザーAPIキーがある場合、モデルのプロバイダーに応じてルーティング
  if (userApiKey) {
    if (userApiKey.length < 20) {
      logger.warn('providers', `Invalid userApiKey: too short (${userApiKey.length} chars), falling back to default provider`, { modelId })
    } else {
      switch (info.provider) {
        case 'gemini': {
          const opts: Record<string, unknown> = {}
          if (info.thinkingLevel) {
            opts.thinkingConfig = { thinkingLevel: info.thinkingLevel, includeThoughts: false }
          }
          const provider = createGoogleGenerativeAI({ apiKey: userApiKey, ...opts })
          return provider(info.modelId)
        }
        case 'zai_general':
        default: {
          const provider = createOpenAICompatible({
            name: `byok-${modelId}`,
            baseURL: ZAI_API_URL,
            apiKey: userApiKey,
          })
          return provider(info.modelId)
        }
      }
    }
  }

  // Geminiプロバイダーの場合（サーバーキー使用）
  if (info.provider === 'gemini') {
    const portkeyConfig = resolvePortkeyConfig(info.portkeyProvider)
    if (portkeyConfig) {
      return getZaiProvider(portkeyConfig)(info.modelId)
    }
    const geminiProvider = getGeminiProvider(info.thinkingLevel)
    if (!geminiProvider) {
      logger.warn('providers', `Gemini model ${modelId} requested but GEMINI_API_KEY not set, falling back to ZAI`)
      const fallbackConfig = resolvePortkeyConfig(MODELS[DEFAULT_AI_MODEL]!.portkeyProvider)
      return getZaiProvider(fallbackConfig)(MODELS[DEFAULT_AI_MODEL]!.modelId)
    }
    return geminiProvider(info.modelId)
  }

  return getZaiProvider(resolvePortkeyConfig(info.portkeyProvider))(info.modelId)
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
