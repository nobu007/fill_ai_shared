/**
 * Type-safe environment variable accessors.
 *
 * Env var names are exposed as a union of literal string types so that
 * `getEnv<'NEXT_PUBLIC_SUPABASE_URL'>()` gives compile-time typo detection
 * (e.g. `getEnv<'NEXT_PUBLIC_SUPABASE_URL'>` vs `getEnv<'NEXT_PUBLIC_SUPBASE_URL'>`).
 *
 * Usage:
 *   import { getEnv, requireEnv, type EnvVarName } from '@/shared/env'
 *   const url = getEnv('NEXT_PUBLIC_SUPABASE_URL')
 *   const key = requireEnv('ENCRYPTION_KEY')  // throws if empty in production
 */

/** All known env var names in the application — used for typed accessors. */
export const ENV_VAR_NAMES = [
  // Supabase
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  // Encryption
  'ENCRYPTION_KEY',
  // AI Providers
  'ZAI_API_KEY',
  'ZAI_API_URL',
  'ZAI_CODING_API_URL',
  'OPENAI_API_KEY',
  'OPENAI_API_URL',
  'GEMINI_API_KEY',
  'GEMINI_API_URL',
  'ANTHROPIC_API_URL',
  'MINIMAX_API_KEY',
  'MINIMAX_BASE_URL',
  'PORTKEY_API_KEY',
  'PORTKEY_CONFIG_SLUG',
  'PORTKEY_GATEWAY_URL',
  // AI Model defaults
  'DEFAULT_AI_MODEL',
  'EVAL_MODEL',
  'BENCHMARK_MODEL',
  'CLAUDE_VALIDATION_MODEL',
  // Limits
  'MAX_CONTENT_LENGTH',
  'MIN_CONTENT_LENGTH',
  'FREE_MAX_REQUESTS_PER_MONTH',
  'FREE_MAX_CHARACTERS_PER_REQUEST',
  'FREE_ENABLED_AXES',
  'LLM_REQUEST_TIMEOUT_MS',
  'LLM_MAX_RETRIES',
  'LLM_DEFAULT_MAX_TOKENS',
  'LLM_RETRY_DELAY_MS',
  'MAX_RETRY_DELAY_MS',
  'RATE_LIMIT_BASE_DELAY_MS',
  'LLM_THROTTLE_RATE_LIMIT_MAX',
  'LLM_THROTTLE_RATE_LIMIT_WINDOW_MS',
  'LLM_THROTTLE_CIRCUIT_BREAKER_THRESHOLD',
  'LLM_THROTTLE_CIRCUIT_BREAKER_COOLDOWN_MS',
  'LLM_THROTTLE_MAX_CONCURRENCY',
  'LLM_THROTTLE_ADAPTIVE_DELAY_MAX_MS',
  'API_KEY_VALIDATION_TIMEOUT_MS',
  // Branding
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_APP_DESCRIPTION',
  'NEXT_PUBLIC_APP_ICON',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_VERCEL_URL',
  // PDF / Fill
  'MAX_PDF_SIZE_BYTES',
  'MAX_PDF_PAGES',
  'FILL_MAPPING_TIMEOUT_MS',
  'FILL_VISION_LLM_TIMEOUT_MS',
  'FILL_VISION_MODEL',
  'FILL_VISION_TEMPERATURE',
  'FILL_VISION_MAX_TOKENS',
  'FILL_OCR_MODEL',
  'FILL_AUTO_APPLY_THRESHOLD',
  'MAX_MAPPING_PROMPT_LENGTH',
  'FILL_FALLBACK_MODELS',
  'FILL_VLM_COMPRESS_THRESHOLD_KB',
  'FILL_VLM_COMPRESS_QUALITY',
  'FILL_VLM_COMPRESS_MAX_DIMENSION',
  'FILL_PARALLEL_PAGE_THRESHOLD',
  'FILL_PARALLEL_CONCURRENCY',
  // BYOK fallback
  'LLM_FALLBACK_STABLE_MODELS',
  'LLM_FALLBACK_DEFAULT_MODELS',
  'LLM_FALLBACK_CHAIN',
  // Stripe
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_ID',
  'STRIPE_API_VERSION',
  'STRIPE_API_TIMEOUT_MS',
  'STRIPE_PRICE_VALIDATION_TIMEOUT_MS',
  'STRIPE_PRICE_FREE_10',
  'STRIPE_PRICE_FREE_30',
  'STRIPE_PRICE_FREE_100',
  'STRIPE_PRICE_PRO_100',
  'STRIPE_PRICE_PRO_300',
  'STRIPE_PRICE_PRO_1000',
  'CREDITS_PER_FILL',
  // LLM Cache
  'LLM_CACHE_PROVIDER',
  // OpenRouter
  'OPENROUTER_API_URL',
  'OPENROUTER_API_KEY',
  'OPENROUTER_MODEL',
  'OPENROUTER_TEMPERATURE',
  'OPENROUTER_MAX_TOKENS',
  'OPENROUTER_TIMEOUT_MS',
  // Blog
  'BLOG_AUTO_AI_SYNC_PER_PAGE',
  'BLOG_AUTO_AI_MAX_OFFSET',
  'BLOG_AUTO_AI_FETCH_CONCURRENCY',
  'BLOG_AUTO_AI_DETAIL_TIMEOUT_MS',
  'BLOG_AUTO_AI_CONNECT_TIMEOUT_MS',
  'BLOG_AUTO_AI_LIST_TIMEOUT_MS',
  'BLOG_AUTO_AI_LIST_LIMIT',
  // Contact / Email
  'RESEND_API_KEY',
  'CONTACT_EMAIL_TO',
  'CONTACT_EMAIL_FROM',
  'RESEND_TIMEOUT_MS',
  // Validation limits
  'MAX_NAME_LENGTH',
  'MAX_EMAIL_LENGTH',
  'MAX_MESSAGE_LENGTH',
  'MAX_NOTE_LENGTH',
  'DEFAULT_PAGE_LIMIT',
  'HISTORY_EXPORT_LIMIT',
  'DASHBOARD_RECENT_LIMIT',
  'MAX_ERROR_MESSAGE_LENGTH',
  'INVITATION_MAX_INSERT_ATTEMPTS',
  'INVITATION_MAX_USES',
  'INVITATION_CODE_MAX_LENGTH',
  'VALID_API_PROVIDERS',
  'MAX_FAMILY_MEMBERS',
  'MAX_USER_DATA_ENTRIES',
  // Security / Debug
  'DEBUG_AUTH_TOKEN',
  'DEBUG_USER_ID',
  'ALERTS_SECRET',
  'SLACK_ALERTS_WEBHOOK_URL',
  'ADMIN_USER_IDS',
  // Storage
  'STORAGE_RETENTION_DAYS',
  'SESSION_RETENTION_DAYS',
  'STORAGE_CLEANUP_BATCH_SIZE',
  'STORAGE_BUCKET_NAME',
  'STORAGE_CLEANUP_ENABLED',
  // Logging
  'LOG_LEVEL',
  // Proofread
  'PROOFREAD_MODEL_USAGE_ENABLED',
  'PROOFREAD_MODEL_USAGE_VERBOSE',
  // API monitoring
  'API_METRICS_DURATION_SAMPLE_LIMIT',
  // Rate limits
  'FILL_RATE_LIMIT_MAX',
  'FILL_RATE_LIMIT_WINDOW_MS',
  // Contact rate limits
  'CONTACT_ENHANCE_RATE_LIMIT_MAX',
  'CONTACT_ENHANCE_RATE_LIMIT_WINDOW_MS',
  'CONTACT_ENHANCE_CLEANUP_INTERVAL_MS',
  'CONTACT_ENHANCE_DAILY_CAP_MAX',
  'CONTACT_ENHANCE_MESSAGE_MAX_LENGTH',
  'CONTACT_ENHANCE_CATEGORY_MAX_LENGTH',
  'MIN_USER_AGENT_LENGTH',
  // WordPress
  'WP_API_TIMEOUT_MS',
  'WP_SYNC_PER_PAGE',
  'WP_MAX_PER_PAGE',
  'WP_POSTS_LIST_LIMIT',
  'JWT_SYNC_OVERLAP_MS',
  'JWT_TOKEN_MARGIN_SECONDS',
  'WP_JWT_VALIDATE_ENDPOINT',
] as const

export type EnvVarName = (typeof ENV_VAR_NAMES)[number]

/**
 * Type-safe env var getter.
 * Returns the value as a string, or empty string if not set.
 *
 * @example
 *   const url = getEnv('NEXT_PUBLIC_SUPABASE_URL')
 */
export function getEnv<K extends EnvVarName>(key: K): string {
  return process.env[key] ?? ''
}

/**
 * Type-safe env var getter that requires a non-empty value.
 * Returns the value as a string.
 * Throws in production if the value is empty.
 *
 * @example
 *   const key = requireEnv('ENCRYPTION_KEY')
 */
export function requireEnv<K extends EnvVarName>(key: K): string {
  const value = process.env[key] ?? ''
  if (!value) {
    // Only throw at runtime in production to allow dev/test flexibility
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`${key} is required but not set`)
    }
  }
  return value
}

/**
 * Type-safe env var getter with a default value.
 *
 * @example
 *   const level = getEnvWithDefault('LOG_LEVEL', 'info')
 */
export function getEnvWithDefault<K extends EnvVarName>(key: K, defaultValue: string): string {
  return process.env[key] ?? defaultValue
}

/**
 * Type-safe env var getter for numeric values.
 * Returns the value as a number, or defaultValue if not set or not a valid number.
 *
 * @example
 *   const timeout = getEnvNumber('LLM_REQUEST_TIMEOUT_MS', 120000)
 */
export function getEnvNumber<K extends EnvVarName>(key: K, defaultValue: number): number {
  const raw = process.env[key]
  if (raw === undefined || raw === '') return defaultValue
  const parsed = Number(raw)
  return Number.isNaN(parsed) ? defaultValue : parsed
}

/**
 * Type-safe env var getter for boolean values.
 * Returns true if the value is 'true', false otherwise.
 *
 * @example
 *   const enabled = getEnvBool('PROOFREAD_MODEL_USAGE_ENABLED', false)
 */
export function getEnvBool<K extends EnvVarName>(key: K, defaultValue: boolean): boolean {
  const raw = process.env[key]
  if (raw === undefined || raw === '') return defaultValue
  return raw === 'true'
}
