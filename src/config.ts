/**
 * Centralized application configuration.
 *
 * All magic numbers, hardcoded URLs, and tunable parameters live here.
 * Values are read from environment variables with sensible defaults.
 */

// ─── Supabase ───────────────────────────────────────────────
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

// ─── AI Provider URLs ───────────────────────────────────────
export const ZAI_API_URL = process.env.ZAI_API_URL || 'https://api.z.ai/api/paas/v4'
export const ZAI_API_KEY = process.env.ZAI_API_KEY || ''
export const ZAI_CODING_API_URL = process.env.ZAI_CODING_API_URL || 'https://api.z.ai/api/coding/paas/v4'
export const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1'
export const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1'
export const ANTHROPIC_API_URL = process.env.ANTHROPIC_API_URL || 'https://api.anthropic.com'

// ─── Default AI Model ───────────────────────────────────────
export const DEFAULT_AI_MODEL = process.env.DEFAULT_AI_MODEL || 'glm-5-turbo'

// ─── LLM Settings ──────────────────────────────────────────
export const LLM_REQUEST_TIMEOUT_MS = Number(process.env.LLM_REQUEST_TIMEOUT_MS || 120_000)
export const LLM_MAX_RETRIES = Number(process.env.LLM_MAX_RETRIES || 4)
export const LLM_RETRY_DELAY_MS = Number(process.env.LLM_RETRY_DELAY_MS || 5000)

// ─── OpenAI Key Validation ──────────────────────────────────
export const OPENAI_MODELS_ENDPOINT = process.env.OPENAI_MODELS_ENDPOINT || 'https://api.openai.com/v1/models'
export const GEMINI_MODELS_ENDPOINT = process.env.GEMINI_MODELS_ENDPOINT || 'https://generativelanguage.googleapis.com/v1/models'

// ─── Branding ───────────────────────────────────────────────
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Fill AI'
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'PDFフォーム自動入力ツール'
export const APP_ICON = process.env.NEXT_PUBLIC_APP_ICON || '📝'

// ─── PDF / Form Fill Settings ──────────────────────────────
export const MAX_PDF_SIZE_BYTES = Number(process.env.MAX_PDF_SIZE_BYTES || 10_000_000) // 10MB
export const MAX_PDF_PAGES = Number(process.env.MAX_PDF_PAGES || 50)
export const FILL_MAPPING_TIMEOUT_MS = Number(process.env.FILL_MAPPING_TIMEOUT_MS || 30_000)
export const FILL_AUTO_APPLY_THRESHOLD = Number(process.env.FILL_AUTO_APPLY_THRESHOLD || 0.8)
export const FILL_FALLBACK_MODELS = (process.env.FILL_FALLBACK_MODELS || 'glm-5-turbo,glm-4.7-coding,glm-4.7-flash').split(',').filter(Boolean)

// ─── Stripe ──────────────────────────────────────────────
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
export const STRIPE_API_VERSION = process.env.STRIPE_API_VERSION || '2026-02-25.clover'
export const STRIPE_PRICE_FREE_10 = process.env.STRIPE_PRICE_FREE_10 || ''
export const STRIPE_PRICE_FREE_30 = process.env.STRIPE_PRICE_FREE_30 || ''
export const STRIPE_PRICE_FREE_100 = process.env.STRIPE_PRICE_FREE_100 || ''
export const STRIPE_PRICE_PRO_100 = process.env.STRIPE_PRICE_PRO_100 || ''
export const STRIPE_PRICE_PRO_300 = process.env.STRIPE_PRICE_PRO_300 || ''
export const STRIPE_PRICE_PRO_1000 = process.env.STRIPE_PRICE_PRO_1000 || ''

/**
 * Credit amounts per pack — single source of truth (Constitution §2.4).
 * Used by the webhook to grant credits. Frontend display should match these values.
 */
export const PACK_CREDITS: Record<string, number> = {
  'free-10': 10,
  'free-30': 30,
  'free-100': 100,
  'pro-100': 100,
  'pro-300': 300,
  'pro-1000': 1000,
}

// ─── PDF Enhancement Settings ───────────────────────────
export const ENHANCE_RENDER_SCALE = Number(process.env.ENHANCE_RENDER_SCALE || 2)
export const ENHANCE_SHARPEN_AMOUNT = Number(process.env.ENHANCE_SHARPEN_AMOUNT || 0.5)
export const PDF_DPI = 72 // Standard PDF points per inch
export const MM_PER_INCH = 25.4 // Millimeters per inch
export const A4_WIDTH_MM = 210 // A4 width in mm
export const A4_HEIGHT_MM = 297 // A4 height in mm
export const SCAN_TEXT_THRESHOLD = 10 // Min chars to consider PDF non-scanned

// ─── OpenRouter (Contact Enhancement) ────────────────────
export const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1'
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''
export const OPENROUTER_CHAT_COMPLETIONS_URL = `${OPENROUTER_API_URL}/chat/completions`
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001'
export const OPENROUTER_TEMPERATURE = Number(process.env.OPENROUTER_TEMPERATURE || 0.3)
export const OPENROUTER_MAX_TOKENS = Number(process.env.OPENROUTER_MAX_TOKENS || 1000)

// ─── Contact / Email ────────────────────────────────────
export const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
export const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || 'klvx01@gmail.com'

// ─── Validation Limits (Constitution §4.5) ───────────
export const MAX_NAME_LENGTH = Number(process.env.MAX_NAME_LENGTH || 200)
export const MAX_EMAIL_LENGTH = Number(process.env.MAX_EMAIL_LENGTH || 254)
export const MAX_MESSAGE_LENGTH = Number(process.env.MAX_MESSAGE_LENGTH || 10000)
export const MAX_NOTE_LENGTH = Number(process.env.MAX_NOTE_LENGTH || 500)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Valid contact form categories (Constitution §4.5 allowlist) */
export const VALID_CONTACT_CATEGORIES = ['bug', 'feature', 'inquiry', 'support', 'other'] as const

/**
 * Valid user data categories for form filling (Constitution §4.5 allowlist).
 * Must stay in sync with UserDataCategory type in types/pdf.ts.
 * Used for runtime validation of LLM responses and user input.
 */
export const VALID_USER_DATA_CATEGORIES = [
  'name', 'name_kana', 'birthday', 'age', 'gender',
  'phone', 'email', 'postal_code', 'address', 'address_kana',
  'company', 'department', 'job_title', 'id_number',
  'date', 'amount', 'custom',
] as const

// ─── Pagination Limits (Constitution §2.4) ──────────
export const DEFAULT_PAGE_LIMIT = Number(process.env.DEFAULT_PAGE_LIMIT || 50)
export const HISTORY_EXPORT_LIMIT = Number(process.env.HISTORY_EXPORT_LIMIT || 200)
export const DASHBOARD_RECENT_LIMIT = Number(process.env.DASHBOARD_RECENT_LIMIT || 5)

// ─── Error Handling ───────────────────────────────────
export const MAX_ERROR_MESSAGE_LENGTH = Number(process.env.MAX_ERROR_MESSAGE_LENGTH || 500)

// ─── Security ───────────────────────────────────────────
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''

// ─── Logging ────────────────────────────────────────────
export const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'test' ? 'error' : 'info')

// ─── App URL ─────────────────────────────────────────────
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'https://fill-ai-pink.vercel.app'
