/**
 * Centralized application configuration.
 *
 * All magic numbers, hardcoded URLs, and tunable parameters live here.
 * Values are read from environment variables with sensible defaults.
 */

// ─── Supabase ───────────────────────────────────────────────
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// ─── AI Provider URLs ───────────────────────────────────────
export const ZAI_API_URL = process.env.ZAI_API_URL || 'https://api.z.ai/api/paas/v4'
export const ZAI_API_KEY = process.env.ZAI_API_KEY || ''
export const ZAI_CODING_API_URL = process.env.ZAI_CODING_API_URL || 'https://api.z.ai/api/coding/paas/v4'
export const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1'
export const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1'
export const ANTHROPIC_API_URL = process.env.ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/messages'

// ─── Default AI Model ───────────────────────────────────────
export const DEFAULT_AI_MODEL = process.env.DEFAULT_AI_MODEL || 'glm-5-turbo'

// ─── Content Limits ─────────────────────────────────────────
export const MAX_CONTENT_LENGTH = Number(process.env.MAX_CONTENT_LENGTH || 100000)
export const MIN_CONTENT_LENGTH = Number(process.env.MIN_CONTENT_LENGTH || 50)

// ─── LLM Fallback Chain ────────────────────────────────────
export const LLM_FALLBACK_STABLE_MODELS: string[] = (() => {
  try {
    return JSON.parse(process.env.LLM_FALLBACK_STABLE_MODELS || '["glm-5-turbo","glm-4.7"]')
  } catch {
    return ['glm-5-turbo', 'glm-4.7']
  }
})()

export const LLM_FALLBACK_CHAIN: Record<string, string[]> = (() => {
  const raw = process.env.LLM_FALLBACK_CHAIN || ''
  if (!raw) {
    return {
      'glm-5-turbo': ['glm-4.7', 'gemini-3.1-flash-lite'],
      'glm-4.7': ['glm-5-turbo', 'gemini-3.1-flash-lite'],
    }
  }

  const result: Record<string, string[]> = {}
  for (const entry of raw.split(';')) {
    const [primary, chain] = entry.split(':')
    if (primary && chain) {
      result[primary.trim()] = chain.split(',').map(s => s.trim())
    }
  }
  return result
})()

export const LLM_FALLBACK_DEFAULT_MODELS: string[] = (() => {
  try {
    return JSON.parse(process.env.LLM_FALLBACK_DEFAULT_MODELS || '["glm-5-turbo","glm-4.7","gemini-3.1-flash-lite"]')
  } catch {
    return ['glm-5-turbo', 'glm-4.7', 'gemini-3.1-flash-lite']
  }
})()

// ─── LLM / Engine Settings ──────────────────────────────────
export const LLM_REQUEST_TIMEOUT_MS = Number(process.env.LLM_REQUEST_TIMEOUT_MS || 120_000)
export const LLM_MAX_RETRIES = Number(process.env.LLM_MAX_RETRIES || 4)
export const LLM_DEFAULT_MAX_TOKENS = Number(process.env.LLM_DEFAULT_MAX_TOKENS || 4096)
export const LLM_RETRY_DELAY_MS = Number(process.env.LLM_RETRY_DELAY_MS || 5000)
export const CHUNK_BATCH_SIZE = Number(process.env.CHUNK_BATCH_SIZE || 3)
export const CHUNK_PROCESS_DELAY_MS = Number(process.env.CHUNK_PROCESS_DELAY_MS || 2000)
export const PHASE_START_DELAY_MS = Number(process.env.PHASE_START_DELAY_MS || 2000)
export const MAX_INPUT_CHARS = Number(process.env.MAX_INPUT_CHARS || 15000)
export const SUMMARY_MAX_TOKENS = Number(process.env.SUMMARY_MAX_TOKENS || 1024)
export const MAX_RETRY_DELAY_MS = Number(process.env.MAX_RETRY_DELAY_MS || 60_000)
export const RATE_LIMIT_BASE_DELAY_MS = Number(process.env.RATE_LIMIT_BASE_DELAY_MS || 30_000)
export const INTER_AXIS_DELAY_MS = Number(process.env.INTER_AXIS_DELAY_MS || 3_000)

// ─── Score Calculation ──────────────────────────────────────
export const SCORE_AUTO_FIXED_PENALTY = Number(process.env.SCORE_AUTO_FIXED_PENALTY || 3)
export const SCORE_NEEDS_REVIEW_PENALTY = Number(process.env.SCORE_NEEDS_REVIEW_PENALTY || 5)
export const SCORE_AXIS_PATCH_PENALTY = Number(process.env.SCORE_AXIS_PATCH_PENALTY || 5)

// ─── Batch Proofread ────────────────────────────────────────
export const BATCH_MAX_POSTS = Number(process.env.BATCH_MAX_POSTS || 20)

// ─── WordPress API ──────────────────────────────────────────
export const WP_API_TIMEOUT_MS = Number(process.env.WP_API_TIMEOUT_MS || 30_000)
export const DIAGNOSE_OVERALL_TIMEOUT_MS = Number(process.env.DIAGNOSE_OVERALL_TIMEOUT_MS || 60_000)
export const WP_JWT_ENDPOINT = process.env.WP_JWT_ENDPOINT || '/wp-json/jwt-auth/v2/token'
export const WP_JWT_VALIDATE_ENDPOINT = process.env.WP_JWT_VALIDATE_ENDPOINT || '/wp-json/jwt-auth/v2/token/validate'
export const WP_POSTS_ENDPOINT = process.env.WP_POSTS_ENDPOINT || '/wp-json/wp/v2/posts'
export const WP_USERS_ME_ENDPOINT = process.env.WP_USERS_ME_ENDPOINT || '/wp-json/wp/v2/users/me'
export const WP_SITES_ENDPOINT = process.env.WP_SITES_ENDPOINT || '/wp-json/wp/v2/sites'
export const WP_DEFAULT_PER_PAGE = Number(process.env.WP_DEFAULT_PER_PAGE || 10)
export const WP_DEFAULT_ORDERBY = process.env.WP_DEFAULT_ORDERBY || 'date'
export const WP_DEFAULT_ORDER = process.env.WP_DEFAULT_ORDER || 'desc'
export const WP_DEFAULT_FIELDS = process.env.WP_DEFAULT_FIELDS || 'id,title,content,status,date,link,categories'
export const WP_DEFAULT_STATUS = process.env.WP_DEFAULT_STATUS || 'publish'
export const WP_SYNC_PER_PAGE = Number(process.env.WP_SYNC_PER_PAGE || 10)
export const WP_MAX_PER_PAGE = Number(process.env.WP_MAX_PER_PAGE || 100)
export const WP_PLUGINS_PER_PAGE = Number(process.env.WP_PLUGINS_PER_PAGE || 100)
export const WP_POSTS_LIST_LIMIT = Number(process.env.WP_POSTS_LIST_LIMIT || 20)

// ─── JWT Settings ───────────────────────────────────────────
export const JWT_TOKEN_MARGIN_SECONDS = Number(process.env.JWT_TOKEN_MARGIN_SECONDS || 60)
export const JWT_SYNC_OVERLAP_MS = Number(process.env.JWT_SYNC_OVERLAP_MS || 60_000)

// ─── OpenAI/Gemini/Anthropic Key Validation ────────────────
export const OPENAI_MODELS_ENDPOINT = process.env.OPENAI_MODELS_ENDPOINT || 'https://api.openai.com/v1/models'
export const GEMINI_MODELS_ENDPOINT = process.env.GEMINI_MODELS_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models'

// ─── Engine Confidence Thresholds ───────────────────────────
export const DEFAULT_CONFIDENCE_THRESHOLD = Number(process.env.DEFAULT_CONFIDENCE_THRESHOLD || 0.7)
export const AUTO_APPLY_THRESHOLD = Number(process.env.AUTO_APPLY_THRESHOLD || 0.7)

// ─── Branding / App Variant ────────────────────────────────
const envAppName = process.env.NEXT_PUBLIC_APP_NAME || ''
export const APP_VARIANT =
  process.env.NEXT_PUBLIC_APP_VARIANT === 'proof' || process.env.NEXT_PUBLIC_APP_VARIANT === 'fill'
    ? process.env.NEXT_PUBLIC_APP_VARIANT
    : envAppName.toLowerCase().includes('proof')
      ? 'proof'
      : 'fill'

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || (APP_VARIANT === 'proof' ? 'Proof AI' : 'Fill AI')
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || (APP_VARIANT === 'proof' ? 'ブログ記事の校正ツール' : 'PDFフォーム自動入力ツール')
export const APP_ICON = process.env.NEXT_PUBLIC_APP_ICON || (APP_VARIANT === 'proof' ? '✓' : '📝')

// ─── PDF / Form Fill Settings ──────────────────────────────
export const MAX_PDF_SIZE_BYTES = Number(process.env.MAX_PDF_SIZE_BYTES || 10_000_000)
export const MAX_PDF_PAGES = Number(process.env.MAX_PDF_PAGES || 50)
export const FILL_MAPPING_TIMEOUT_MS = Number(process.env.FILL_MAPPING_TIMEOUT_MS || 30_000)
export const FILL_AUTO_APPLY_THRESHOLD = Number(process.env.FILL_AUTO_APPLY_THRESHOLD || 0.8)
export const FILL_FALLBACK_MODELS = (process.env.FILL_FALLBACK_MODELS || 'glm-5-turbo,glm-4.7-coding,glm-4.7-flash').split(',').filter(Boolean)

// ─── Stripe ────────────────────────────────────────────────
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
export const STRIPE_API_VERSION = process.env.STRIPE_API_VERSION || '2026-02-25.clover'
export const STRIPE_PRICE_FREE_10 = process.env.STRIPE_PRICE_FREE_10 || ''
export const STRIPE_PRICE_FREE_30 = process.env.STRIPE_PRICE_FREE_30 || ''
export const STRIPE_PRICE_FREE_100 = process.env.STRIPE_PRICE_FREE_100 || ''
export const STRIPE_PRICE_PRO_100 = process.env.STRIPE_PRICE_PRO_100 || ''
export const STRIPE_PRICE_PRO_300 = process.env.STRIPE_PRICE_PRO_300 || ''
export const STRIPE_PRICE_PRO_1000 = process.env.STRIPE_PRICE_PRO_1000 || ''

export const PACK_CREDITS: Record<string, number> = {
  'free-10': 10,
  'free-30': 30,
  'free-100': 100,
  'pro-100': 100,
  'pro-300': 300,
  'pro-1000': 1000,
}

// ─── PDF Enhancement Settings ──────────────────────────────
export const ENHANCE_RENDER_SCALE = Number(process.env.ENHANCE_RENDER_SCALE || 2)
export const ENHANCE_SHARPEN_AMOUNT = Number(process.env.ENHANCE_SHARPEN_AMOUNT || 0.5)
export const PDF_DPI = 72
export const MM_PER_INCH = 25.4
export const A4_WIDTH_MM = 210
export const A4_HEIGHT_MM = 297
export const SCAN_TEXT_THRESHOLD = 10

// ─── OpenRouter ────────────────────────────────────────────
export const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1'
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''
export const OPENROUTER_CHAT_COMPLETIONS_URL = `${OPENROUTER_API_URL}/chat/completions`
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001'
export const OPENROUTER_TEMPERATURE = Number(process.env.OPENROUTER_TEMPERATURE || 0.3)
export const OPENROUTER_MAX_TOKENS = Number(process.env.OPENROUTER_MAX_TOKENS || 1000)

// ─── Contact / Validation ──────────────────────────────────
export const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
export const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || 'klvx01@gmail.com'
export const MAX_NAME_LENGTH = Number(process.env.MAX_NAME_LENGTH || 200)
export const MAX_EMAIL_LENGTH = Number(process.env.MAX_EMAIL_LENGTH || 254)
export const MAX_MESSAGE_LENGTH = Number(process.env.MAX_MESSAGE_LENGTH || 10000)
export const MAX_NOTE_LENGTH = Number(process.env.MAX_NOTE_LENGTH || 500)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const VALID_CONTACT_CATEGORIES = ['bug', 'feature', 'inquiry', 'support', 'other'] as const
export const VALID_USER_DATA_CATEGORIES = [
  'name', 'name_kana', 'birthday', 'age', 'gender',
  'phone', 'email', 'postal_code', 'address', 'address_kana',
  'company', 'department', 'job_title', 'id_number',
  'date', 'amount', 'custom',
] as const

// ─── Pagination / Error Handling ───────────────────────────
export const DEFAULT_PAGE_LIMIT = Number(process.env.DEFAULT_PAGE_LIMIT || 50)
export const HISTORY_EXPORT_LIMIT = Number(process.env.HISTORY_EXPORT_LIMIT || 200)
export const DASHBOARD_RECENT_LIMIT = Number(process.env.DASHBOARD_RECENT_LIMIT || 5)
export const MAX_ERROR_MESSAGE_LENGTH = Number(process.env.MAX_ERROR_MESSAGE_LENGTH || 500)

// ─── Security / Debug / Admin ──────────────────────────────
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''
export const DEBUG_AUTH_TOKEN = process.env.DEBUG_AUTH_TOKEN || ''
export const DEBUG_USER_ID = process.env.DEBUG_USER_ID || ''
export const ADMIN_USER_IDS: string[] = (() => {
  const raw = process.env.ADMIN_USER_IDS || ''
  if (!raw) return []
  return raw.split(',').map(id => id.trim()).filter(Boolean)
})()

if (!ENCRYPTION_KEY && typeof window === 'undefined') {
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build'
  if (!isBuildTime) {
    console.warn('[WARNING] ENCRYPTION_KEY is not set. Sensitive data may be stored as plaintext.')
  }
}

// ─── Environment / Logging ─────────────────────────────────
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'test' ? 'error' : 'info')

// ─── Blog Auto AI Sync ─────────────────────────────────────
export const BLOG_AUTO_AI_SYNC_PER_PAGE = Number(process.env.BLOG_AUTO_AI_SYNC_PER_PAGE || 50)
export const BLOG_AUTO_AI_MAX_OFFSET = Number(process.env.BLOG_AUTO_AI_MAX_OFFSET || 5000)
export const BLOG_AUTO_AI_FETCH_CONCURRENCY = Number(process.env.BLOG_AUTO_AI_FETCH_CONCURRENCY || 5)
export const BLOG_AUTO_AI_DETAIL_TIMEOUT_MS = Number(process.env.BLOG_AUTO_AI_DETAIL_TIMEOUT_MS || 15000)
export const BLOG_AUTO_AI_LIST_LIMIT = Number(process.env.BLOG_AUTO_AI_LIST_LIMIT || 100)

// ─── App URL ───────────────────────────────────────────────
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'https://fill-ai-pink.vercel.app'
