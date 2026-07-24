/**
 * Centralized application configuration.
 *
 * All magic numbers, hardcoded URLs, and tunable parameters live here.
 * Values are read from environment variables with sensible defaults.
 */

// ─── Type-safe env accessors ─────────────────────────────────
import { getEnv, getEnvWithDefault, getEnvNumber, getEnvBool } from './env'


// ─── Supabase ───────────────────────────────────────────────
export const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL')
export const SUPABASE_ANON_KEY = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
export const SUPABASE_SERVICE_ROLE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY')

// ─── AI Provider URLs ───────────────────────────────────────
export const ZAI_API_URL = getEnvWithDefault('ZAI_API_URL', 'https://api.z.ai/api/paas/v4')
export const ZAI_API_KEY = getEnv('ZAI_API_KEY')
export const ZAI_CODING_API_URL = getEnvWithDefault('ZAI_CODING_API_URL', 'https://api.z.ai/api/coding/paas/v4')
export const OPENAI_API_URL = getEnvWithDefault('OPENAI_API_URL', 'https://api.openai.com/v1')
export const GEMINI_API_URL = getEnvWithDefault('GEMINI_API_URL', 'https://generativelanguage.googleapis.com/v1')
export const GEMINI_API_KEY = getEnv('GEMINI_API_KEY')
export const GEMINI_THINKING_LEVEL = (getEnv('GEMINI_THINKING_LEVEL') as 'minimal' | 'low' | 'medium' | 'high') || 'high'
export const ANTHROPIC_API_URL = getEnvWithDefault('ANTHROPIC_API_URL', 'https://api.anthropic.com/v1/messages')

// ─── MiniMax LLM（fallback tail — Amendment #3）──────────────
export const MINIMAX_API_KEY = getEnv('MINIMAX_API_KEY')
export const MINIMAX_BASE_URL = getEnvWithDefault('MINIMAX_BASE_URL', 'https://api.minimax.io/v1')

// ─── Default AI Model ───────────────────────────────────────
export const DEFAULT_AI_MODEL = getEnvWithDefault('DEFAULT_AI_MODEL', 'glm-5-turbo')

// ─── Quality Evaluation Settings ───────────────────────────
/** LLM model used for quality evaluation benchmarks (§2.4 centralized config) */
export const EVAL_MODEL = getEnvWithDefault('EVAL_MODEL', 'glm-5-turbo')
/** LLM model override for benchmark runner CLI */
export const BENCHMARK_MODEL = getEnvWithDefault('BENCHMARK_MODEL', DEFAULT_AI_MODEL)

// ─── Content Limits ─────────────────────────────────────────
export const MAX_CONTENT_LENGTH = getEnvNumber('MAX_CONTENT_LENGTH', 100000)
export const MIN_CONTENT_LENGTH = getEnvNumber('MIN_CONTENT_LENGTH', 50)

// ─── Free Plan Limits (P3.1) ───────────────────────────────
export const FREE_MAX_REQUESTS_PER_MONTH = getEnvNumber('FREE_MAX_REQUESTS_PER_MONTH', 10)
export const FREE_MAX_CHARACTERS_PER_REQUEST = getEnvNumber('FREE_MAX_CHARACTERS_PER_REQUEST', 5000)
export const FREE_ENABLED_AXES = (getEnv('FREE_ENABLED_AXES') || 'structure,readability,ai_tone').split(',').filter(Boolean)



// ─── LLM / Engine Settings ──────────────────────────────────
export const LLM_REQUEST_TIMEOUT_MS = getEnvNumber('LLM_REQUEST_TIMEOUT_MS', 120000)
export const LLM_MAX_RETRIES = getEnvNumber('LLM_MAX_RETRIES', 4)

/** When Portkey Config handles retry+fallback at gateway level, disable ai-sdk retries to avoid duplication */
export const PORTKEY_CONFIG_SLUG = getEnvWithDefault('PORTKEY_CONFIG_SLUG', "")
export const PORTKEY_API_KEY = getEnv('PORTKEY_API_KEY')
export const PORTKEY_GATEWAY_URL = getEnvWithDefault('PORTKEY_GATEWAY_URL', 'https://api.portkey.ai/v1')

export const LLM_DEFAULT_MAX_TOKENS = getEnvNumber('LLM_DEFAULT_MAX_TOKENS', 4096)
export const LLM_RETRY_DELAY_MS = getEnvNumber('LLM_RETRY_DELAY_MS', 5000)
export const MAX_RETRY_DELAY_MS = getEnvNumber('MAX_RETRY_DELAY_MS', 60000)
export const RATE_LIMIT_BASE_DELAY_MS = getEnvNumber('RATE_LIMIT_BASE_DELAY_MS', 30000)

/** LLM Throttle: per-model rate limit — max LLM calls per sliding window */
export const LLM_THROTTLE_RATE_LIMIT_MAX = getEnvNumber('LLM_THROTTLE_RATE_LIMIT_MAX', 30)
/** LLM Throttle: per-model sliding window duration (ms) */
export const LLM_THROTTLE_RATE_LIMIT_WINDOW_MS = getEnvNumber('LLM_THROTTLE_RATE_LIMIT_WINDOW_MS', 60000)
/** LLM Throttle: consecutive failures before circuit breaker trips */
export const LLM_THROTTLE_CIRCUIT_BREAKER_THRESHOLD = getEnvNumber('LLM_THROTTLE_CIRCUIT_BREAKER_THRESHOLD', 3)
/** LLM Throttle: circuit breaker cooldown after tripping (ms) */
export const LLM_THROTTLE_CIRCUIT_BREAKER_COOLDOWN_MS = getEnvNumber('LLM_THROTTLE_CIRCUIT_BREAKER_COOLDOWN_MS', 30000)
/** LLM Throttle: max concurrent LLM calls across all models */
export const LLM_THROTTLE_MAX_CONCURRENCY = getEnvNumber('LLM_THROTTLE_MAX_CONCURRENCY', 5)
/** LLM Throttle: max adaptive delay cap (ms) */
export const LLM_THROTTLE_ADAPTIVE_DELAY_MAX_MS = getEnvNumber('LLM_THROTTLE_ADAPTIVE_DELAY_MAX_MS', 30000)

// ─── OpenAI/Gemini/Anthropic Key Validation ────────────────
export const OPENAI_MODELS_ENDPOINT = getEnvWithDefault('OPENAI_MODELS_ENDPOINT', 'https://api.openai.com/v1/models')
export const GEMINI_MODELS_ENDPOINT = getEnvWithDefault('GEMINI_MODELS_ENDPOINT', 'https://generativelanguage.googleapis.com/v1beta/models')
export const API_KEY_VALIDATION_TIMEOUT_MS = getEnvNumber('API_KEY_VALIDATION_TIMEOUT_MS', 10000)


// ─── Branding ──────────────────────────────────────────────
export const APP_NAME = getEnvWithDefault('NEXT_PUBLIC_APP_NAME', 'Fill AI')
export const APP_DESCRIPTION = getEnvWithDefault('NEXT_PUBLIC_APP_DESCRIPTION', 'PDFフォーム自動入力ツール')
export const APP_ICON = getEnvWithDefault('NEXT_PUBLIC_APP_ICON', '📝')

// ─── PDF / Form Fill Settings ──────────────────────────────
export const MAX_PDF_SIZE_BYTES = getEnvNumber('MAX_PDF_SIZE_BYTES', 10000000)
export const MAX_PDF_PAGES = getEnvNumber('MAX_PDF_PAGES', 50)
export const FILL_MAPPING_TIMEOUT_MS = getEnvNumber('FILL_MAPPING_TIMEOUT_MS', 30000)
export const FILL_VISION_LLM_TIMEOUT_MS = getEnvNumber('FILL_VISION_LLM_TIMEOUT_MS', 90000)
/** VLM model for vision-based PDF field extraction */
export const FILL_VISION_MODEL = getEnvWithDefault('FILL_VISION_MODEL', 'glm-4.6v-flash')
/** Temperature for VLM field detection (low = deterministic) */
export const FILL_VISION_TEMPERATURE = getEnvNumber('FILL_VISION_TEMPERATURE', 0.1)
/** Max tokens for VLM field detection response */
export const FILL_VISION_MAX_TOKENS = getEnvNumber('FILL_VISION_MAX_TOKENS', 8192)
/** OCR model for layout_parsing API */
export const FILL_OCR_MODEL = getEnvWithDefault('FILL_OCR_MODEL', 'glm-ocr')
export const FILL_AUTO_APPLY_THRESHOLD = getEnvNumber('FILL_AUTO_APPLY_THRESHOLD', 0.8)
/** Maximum prompt size for LLM mapping requests (Constitution §1.2 Stability — prevent resource exhaustion) */
export const MAX_MAPPING_PROMPT_LENGTH = getEnvNumber('MAX_MAPPING_PROMPT_LENGTH', 100000)
export const FILL_FALLBACK_MODELS = (getEnv('FILL_FALLBACK_MODELS') || 'glm-4.7-flash,glm-5-turbo,MiniMax-M3').split(',').filter(Boolean)
/** VLM compression threshold in KB — PDFs below this size skip JPEG compression */
export const FILL_VLM_COMPRESS_THRESHOLD_KB = getEnvNumber('FILL_VLM_COMPRESS_THRESHOLD_KB', 200)
/** JPEG quality for VLM compression (0.0–1.0) */
export const FILL_VLM_COMPRESS_QUALITY = getEnvNumber('FILL_VLM_COMPRESS_QUALITY', 0.8)
/** Max pixel dimension for VLM compression */
export const FILL_VLM_COMPRESS_MAX_DIMENSION = getEnvNumber('FILL_VLM_COMPRESS_MAX_DIMENSION', 1600)
/** Page count threshold to trigger parallel page extraction (10+ pages) */
export const FILL_PARALLEL_PAGE_THRESHOLD = getEnvNumber('FILL_PARALLEL_PAGE_THRESHOLD', 10)
/** Max concurrent pages for parallel extraction */
export const FILL_PARALLEL_CONCURRENCY = getEnvNumber('FILL_PARALLEL_CONCURRENCY', 4)

// Phase Engine settings are defined in src/lib/engine/engine-config.ts
// to avoid circular dependencies with fill_ai_shared.

// ─── LLM Fallback Settings ────────────────────────────────
export const LLM_FALLBACK_STABLE_MODELS = (getEnv('LLM_FALLBACK_STABLE_MODELS') || 'glm-5-turbo').split(',').filter(Boolean)
export const LLM_FALLBACK_DEFAULT_MODELS = (getEnv('LLM_FALLBACK_DEFAULT_MODELS') || 'glm-5-turbo,glm-4.7-flash').split(',').filter(Boolean)
export const LLM_FALLBACK_CHAIN: Record<string, string[]> = (() => {
  try {
    const raw = getEnv('LLM_FALLBACK_CHAIN')
    return JSON.parse(raw)
  } catch {
    return {}
  }
})()

// ─── Cost-Optimized BYOK Fallback Chain (便宜順) ─────────────
// BYOKユーザー向けのコスト最適化フォールバックチェーン
// 安定モデルでもここに明示的に定義されたチェーンを使用
export const COST_OPTIMIZED_FALLBACK_CHAIN: Record<string, string[]> = {
  // 安定モデル：glm-5-turbo のフォールバックチェーン（便宜順）
  'glm-5-turbo': [
    'glm-4.7-flash',      // 最安価 (low-tier)
    'glm-4.7-coding',     // 中価値 (mid-tier)
    'glm-4.7',           // 高品質 (mid-tier)
    'glm-4.6',           // 代替 (mid-tier)
    'gemini-3.1-flash-lite', // 高価値 (high-tier) - 最後の手段
  ],
  // glm-5 系列のフォールバックチェーン
  'glm-5': [
    'glm-4.7-flash',      // 最安価
    'glm-4.7-coding',     // 中価値
    'glm-4.7',           // 高品質
    'glm-4.6',           // 代替
    'glm-5-turbo',       // 同系列の安定モデル
  ],
  // glm-4.7 系列のフォールバックチェーン
  'glm-4.7': [
    'glm-4.7-flash',     // 安価な代替
    'glm-4.7-coding',    // コーディング向け
    'glm-4.6',           // 安定した代替
    'glm-4.5-air',       // 最も安価
  ],
  // 軽量モデルのフォールバックチェーン
  'glm-4.7-flash': [
    'glm-4.5-air',       // 最も安価
    'glm-4.7-coding',    // より高価だが信頼性の高い代替
  ],
  // ジェミニモデルのフォールバックチェーン
  'gemini-3.1-flash-lite': [
    'glm-5-turbo',       // 安定した代替（ZAI API経由）
    'glm-4.7-flash',     // 安価な代替
  ],
  // デフォルトのBYOKフォールバックチェーン（コスト順）
  'default-byok': [
    'glm-4.7-flash',     // 最安価
    'glm-4.7-coding',    // 中価値
    'glm-4.7',          // 高品質
    'glm-4.6',          // 代替
    'glm-5-turbo',      // 安定モデル
    'glm-4.5-air',      // 最も安価
  ]
}

// ─── WordPress API Settings ───────────────────────────────
export const WP_API_TIMEOUT_MS = getEnvNumber('WP_API_TIMEOUT_MS', 15000)
export const WP_SYNC_PER_PAGE = getEnvNumber('WP_SYNC_PER_PAGE', 100)
export const WP_MAX_PER_PAGE = getEnvNumber('WP_MAX_PER_PAGE', 100)
export const WP_POSTS_LIST_LIMIT = getEnvNumber('WP_POSTS_LIST_LIMIT', 5000)
export const JWT_SYNC_OVERLAP_MS = getEnvNumber('JWT_SYNC_OVERLAP_MS', 60000)
export const JWT_TOKEN_MARGIN_SECONDS = getEnvNumber('JWT_TOKEN_MARGIN_SECONDS', 60)
export const WP_JWT_VALIDATE_ENDPOINT = getEnvWithDefault('WP_JWT_VALIDATE_ENDPOINT', '/wp-json/jwt-auth/v1/token/validate')
export const WP_JWT_ENDPOINT = '/wp-json/jwt-auth/v1/token'
export const WP_POSTS_ENDPOINT = '/wp-json/wp/v2/posts'
export const WP_USERS_ME_ENDPOINT = '/wp-json/wp/v2/users/me'
export const WP_SITES_ENDPOINT = '/wp-json/wp/v2/sites'
export const WP_DEFAULT_PER_PAGE = 10
export const WP_DEFAULT_ORDERBY = 'date'
export const WP_DEFAULT_ORDER = 'desc'
export const WP_DEFAULT_FIELDS = 'id,title,content,status,date,modified,link,categories'
export const WP_DEFAULT_STATUS = 'publish,draft'

// ─── Score Calculation Settings ──────────────────────────
export const SCORE_AUTO_FIXED_PENALTY = getEnvNumber('SCORE_AUTO_FIXED_PENALTY', 2)
export const SCORE_NEEDS_REVIEW_PENALTY = getEnvNumber('SCORE_NEEDS_REVIEW_PENALTY', 5)
export const SCORE_AXIS_PATCH_PENALTY = getEnvNumber('SCORE_AXIS_PATCH_PENALTY', 3)
export const DIAGNOSE_OVERALL_TIMEOUT_MS = getEnvNumber('DIAGNOSE_OVERALL_TIMEOUT_MS', 60000)

// ─── OpenAI/Gemini/Anthropic Key Validation ────────────────
// (already declared above)

// ─── PDF / Form Fill Settings ──────────────────────────────
export const FILL_MAPPING_SYSTEM_PROMPT = getEnvWithDefault('FILL_MAPPING_SYSTEM_PROMPT', 'あなたはPDFフォームのフィールドマッピングを行うAIアシスタントです。JSON配列のみを出力してください。')

export const FILL_MAPPING_TEMPERATURE = getEnvNumber('FILL_MAPPING_TEMPERATURE', 0.1)
export const FILL_MAPPING_MAX_TOKENS = getEnvNumber('FILL_MAPPING_MAX_TOKENS', 4096)
export const FILL_MAPPING_PROMPT_TEMPLATE = getEnvWithDefault('FILL_MAPPING_PROMPT_TEMPLATE', `以下のPDFフォームのフィールド情報と、ユーザーが入力するデータカテゴリのリストを元に、各フィールドにどのカテゴリのデータを入力すべきか判定してください。

## PDF フィールド構造
{template}

## 利用可能なデータカテゴリ
{categories}

## 出力形式
以下のJSONで返してください（他の説明やコメントは一切不要）:
{
  "mappings": [
    {
      "placeholder": "<PLACEHOLDER>",
      "category": "カテゴリID",
      "confidence": 0.9,
      "reason": "判定理由"
    }
  ]
}

## ルール
- 各フィールドに対して最も適切なカテゴリを1つ選んでください
- マッピング不能なフィールドは含めないでください
- confidence は 0.0〜1.0 で、判定の確信度を表してください
- reason は日本語で簡潔に（例: "氏名欄のため"）`)

// ─── Stripe ────────────────────────────────────────────────
export const STRIPE_SECRET_KEY = getEnv('STRIPE_SECRET_KEY')
export const STRIPE_WEBHOOK_SECRET = getEnv('STRIPE_WEBHOOK_SECRET')
/** Default Stripe Price ID for subscription checkout (fallback when no priceId in request) */
export const STRIPE_PRICE_ID = getEnv('STRIPE_PRICE_ID')
export const STRIPE_API_VERSION = getEnvWithDefault('STRIPE_API_VERSION', '2026-03-25.dahlia')
/** Timeout for Stripe API key validation connectivity check (ms) */
export const STRIPE_API_TIMEOUT_MS = getEnvNumber('STRIPE_API_TIMEOUT_MS', 5000)
/** Timeout for Stripe Price ID bulk validation (ms) — higher than API check since it makes multiple requests */
export const STRIPE_PRICE_VALIDATION_TIMEOUT_MS = getEnvNumber('STRIPE_PRICE_VALIDATION_TIMEOUT_MS', 10000)
export const STRIPE_PRICE_FREE_10 = getEnv('STRIPE_PRICE_FREE_10')
export const STRIPE_PRICE_FREE_30 = getEnv('STRIPE_PRICE_FREE_30')
export const STRIPE_PRICE_FREE_100 = getEnv('STRIPE_PRICE_FREE_100')
export const STRIPE_PRICE_PRO_100 = getEnv('STRIPE_PRICE_PRO_100')
export const STRIPE_PRICE_PRO_300 = getEnv('STRIPE_PRICE_PRO_300')
export const STRIPE_PRICE_PRO_1000 = getEnv('STRIPE_PRICE_PRO_1000')
export const CREDITS_PER_FILL = getEnvNumber('CREDITS_PER_FILL', 1)

export const PACK_CREDITS: Record<string, number> = {
  'free-10': 10,
  'free-30': 30,
  'free-100': 100,
  'pro-100': 100,
  'pro-300': 300,
  'pro-1000': 1000,
}

export interface CreditPackDisplay {
  id: string
  credits: number
  price: number
  unitPrice: number
  popular?: boolean
}

export const FREE_CREDIT_PACKS: CreditPackDisplay[] = [
  { id: 'free-10', credits: 10, price: 980, unitPrice: 98 },
  { id: 'free-30', credits: 30, price: 1980, unitPrice: 66, popular: true },
  { id: 'free-100', credits: 100, price: 4980, unitPrice: 50 },
]

export const PRO_CREDIT_PACKS: CreditPackDisplay[] = [
  { id: 'pro-100', credits: 100, price: 1480, unitPrice: 14.8 },
  { id: 'pro-300', credits: 300, price: 2980, unitPrice: 9.9, popular: true },
  { id: 'pro-1000', credits: 1000, price: 4980, unitPrice: 5.0 },
]

// ─── PDF / PII Masking Settings ───────────────────────────
/** Proximity threshold in PDF points (~2cm) for PII label-to-value spatial detection */
export const PII_PROXIMITY_THRESHOLD = getEnvNumber('PII_PROXIMITY_THRESHOLD', 60)

// ─── PDF Enhancement Settings ──────────────────────────────
export const ENHANCE_RENDER_SCALE = getEnvNumber('ENHANCE_RENDER_SCALE', 2)
export const ENHANCE_SHARPEN_AMOUNT = getEnvNumber('ENHANCE_SHARPEN_AMOUNT', 0.5)
export const PDF_DPI = 72
export const MM_PER_INCH = 25.4
export const A4_WIDTH_MM = 210
export const A4_HEIGHT_MM = 297
export const SCAN_TEXT_THRESHOLD = 10

// ─── OpenRouter ────────────────────────────────────────────
export const OPENROUTER_API_URL = getEnvWithDefault('OPENROUTER_API_URL', 'https://openrouter.ai/api/v1')
export const OPENROUTER_API_KEY = getEnv('OPENROUTER_API_KEY')
export const OPENROUTER_CHAT_COMPLETIONS_URL = `${OPENROUTER_API_URL}/chat/completions`
export const OPENROUTER_MODEL = getEnvWithDefault('OPENROUTER_MODEL', 'google/gemini-2.0-flash-001')
export const OPENROUTER_TEMPERATURE = getEnvNumber('OPENROUTER_TEMPERATURE', 0.3)
export const OPENROUTER_MAX_TOKENS = getEnvNumber('OPENROUTER_MAX_TOKENS', 1000)
export const OPENROUTER_TIMEOUT_MS = getEnvNumber('OPENROUTER_TIMEOUT_MS', 15000)

// ─── Blog Auto AI Sync Settings ───────────────────────────
export const BLOG_AUTO_AI_SYNC_PER_PAGE = getEnvNumber('BLOG_AUTO_AI_SYNC_PER_PAGE', 100)
export const BLOG_AUTO_AI_MAX_OFFSET = getEnvNumber('BLOG_AUTO_AI_MAX_OFFSET', 10000)
export const BLOG_AUTO_AI_FETCH_CONCURRENCY = getEnvNumber('BLOG_AUTO_AI_FETCH_CONCURRENCY', 5)
export const BLOG_AUTO_AI_DETAIL_TIMEOUT_MS = getEnvNumber('BLOG_AUTO_AI_DETAIL_TIMEOUT_MS', 30000)
export const BLOG_AUTO_AI_CONNECT_TIMEOUT_MS = getEnvNumber('BLOG_AUTO_AI_CONNECT_TIMEOUT_MS', 15000)
export const BLOG_AUTO_AI_LIST_TIMEOUT_MS = getEnvNumber('BLOG_AUTO_AI_LIST_TIMEOUT_MS', 30000)
export const BLOG_AUTO_AI_LIST_LIMIT = getEnvNumber('BLOG_AUTO_AI_LIST_LIMIT', 50)

// ─── API Monitoring ────────────────────────────────────────
/** Maximum recent duration samples retained per endpoint for P95/P99 metrics. */
export const API_METRICS_DURATION_SAMPLE_LIMIT = getEnvNumber('API_METRICS_DURATION_SAMPLE_LIMIT', 100)

// ─── Fill API Rate Limits ──────────────────────────────────
/**
 * Maximum fill API requests per user within the rate limit window.
 * Override per tenant via FILL_RATE_LIMIT_MAX env var.
 * Exceeding this limit returns HTTP 429 and increments the rateLimited counter
 * in /api/fill/metrics.
 *
 * @example
 *   # Default: 10 requests per 60-second window per user
 *   FILL_RATE_LIMIT_MAX=20   # increase to 20 req/window
 *   FILL_RATE_LIMIT_MAX=5    # decrease to 5 req/window (strict)
 */
export const FILL_RATE_LIMIT_MAX = getEnvNumber('FILL_RATE_LIMIT_MAX', 10)
/** Rate limit window in milliseconds.
 * Sliding window: a request is allowed if (current_time - window_start) < this value
 * and the request count within the window is below FILL_RATE_LIMIT_MAX.
 * Override via FILL_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   FILL_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   FILL_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const FILL_RATE_LIMIT_WINDOW_MS = getEnvNumber('FILL_RATE_LIMIT_WINDOW_MS', 60000)

// ─── Contact Enhance Rate Limits ───────────────────────────
/**
 * Maximum contact enhance API requests per user within the rate limit window.
 * Override via CONTACT_ENHANCE_RATE_LIMIT_MAX env var.
 * Exceeding this limit returns HTTP 429 and increments the rateLimited counter
 * in the contact-enhance metrics.
 *
 * @example
 *   # Default: 2 requests per 300-second (5-minute) window per user
 *   CONTACT_ENHANCE_RATE_LIMIT_MAX=5   # increase to 5 req/window
 */
export const CONTACT_ENHANCE_RATE_LIMIT_MAX = getEnvNumber('CONTACT_ENHANCE_RATE_LIMIT_MAX', 2)
/**
 * Contact enhance rate limit window in milliseconds.
 * Sliding window: a request is allowed if (current_time - window_start) < this value
 * and the request count within the window is below CONTACT_ENHANCE_RATE_LIMIT_MAX.
 * Override via CONTACT_ENHANCE_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   CONTACT_ENHANCE_RATE_LIMIT_WINDOW_MS=300000    # default: 5-minute window
 *   CONTACT_ENHANCE_RATE_LIMIT_WINDOW_MS=600000    # 10-minute window (more relaxed)
 */
export const CONTACT_ENHANCE_RATE_LIMIT_WINDOW_MS = getEnvNumber('CONTACT_ENHANCE_RATE_LIMIT_WINDOW_MS', 300000)
/**
 * Interval in milliseconds between automatic cleanup of expired contact enhance entries.
 * Override via CONTACT_ENHANCE_CLEANUP_INTERVAL_MS env var.
 *
 * @example
 *   CONTACT_ENHANCE_CLEANUP_INTERVAL_MS=300000    # default: 5-minute cleanup cycle
 */
export const CONTACT_ENHANCE_CLEANUP_INTERVAL_MS = getEnvNumber('CONTACT_ENHANCE_CLEANUP_INTERVAL_MS', 300000)
/**
 * Maximum number of contact enhance requests per user per day (daily hard cap).
 * Override via CONTACT_ENHANCE_DAILY_CAP_MAX env var.
 * This is a separate daily-level cap on top of the per-window rate limit.
 *
 * @example
 *   CONTACT_ENHANCE_DAILY_CAP_MAX=100   # default: 100 requests per user per day
 *   CONTACT_ENHANCE_DAILY_CAP_MAX=50    # stricter daily cap
 */
export const CONTACT_ENHANCE_DAILY_CAP_MAX = getEnvNumber('CONTACT_ENHANCE_DAILY_CAP_MAX', 100)
/** Maximum message length for contact enhance API (Constitution §2.4) */
export const CONTACT_ENHANCE_MESSAGE_MAX_LENGTH = getEnvNumber('CONTACT_ENHANCE_MESSAGE_MAX_LENGTH', 5000)
/** Maximum category length for contact enhance API (Constitution §2.4) */
export const CONTACT_ENHANCE_CATEGORY_MAX_LENGTH = getEnvNumber('CONTACT_ENHANCE_CATEGORY_MAX_LENGTH', 50)
/** Minimum User-Agent string length to reject bots with obviously fake UA (Constitution §2.4) */
export const MIN_USER_AGENT_LENGTH = getEnvNumber('MIN_USER_AGENT_LENGTH', 10)

// ─── Contact / Validation ──────────────────────────────────
export const RESEND_API_KEY = getEnv('RESEND_API_KEY')
export const CONTACT_EMAIL_TO = getEnvWithDefault('CONTACT_EMAIL_TO', 'klvx01@gmail.com')
export const CONTACT_EMAIL_FROM = getEnvWithDefault('CONTACT_EMAIL_FROM', 'Fill AI <noreply@fillai-pi.vercel.app>')
/** Timeout for Resend email send API call (Constitution §1.2 Stability) */
export const RESEND_TIMEOUT_MS = getEnvNumber('RESEND_TIMEOUT_MS', 10000)
export const MAX_NAME_LENGTH = getEnvNumber('MAX_NAME_LENGTH', 200)
export const VALID_API_PROVIDERS = ['openai', 'gemini', 'claude'] as const
export const MAX_EMAIL_LENGTH = getEnvNumber('MAX_EMAIL_LENGTH', 254)
export const MAX_MESSAGE_LENGTH = getEnvNumber('MAX_MESSAGE_LENGTH', 10000)
export const MAX_NOTE_LENGTH = getEnvNumber('MAX_NOTE_LENGTH', 500)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const VALID_CONTACT_CATEGORIES = ['bug', 'feature', 'inquiry', 'support', 'other'] as const
export const VALID_USER_DATA_CATEGORIES = [
  'name', 'name_kana', 'birthday', 'age', 'gender',
  'phone', 'email', 'postal_code', 'address', 'address_kana',
  'company', 'department', 'job_title', 'id_number',
  'date', 'amount', 'custom',
] as const

export const VALID_FAMILY_RELATIONSHIPS = [
  '本人', '配偶者', '父', '母', '子', '兄弟姉妹', '祖父母', 'その他',
] as const

export const MAX_FAMILY_MEMBERS = 20
export const MAX_USER_DATA_ENTRIES = 100

// ─── Pagination / Error Handling ───────────────────────────
export const DEFAULT_PAGE_LIMIT = getEnvNumber('DEFAULT_PAGE_LIMIT', 50)
export const HISTORY_EXPORT_LIMIT = getEnvNumber('HISTORY_EXPORT_LIMIT', 200)
export const DASHBOARD_RECENT_LIMIT = getEnvNumber('DASHBOARD_RECENT_LIMIT', 5)
export const MAX_ERROR_MESSAGE_LENGTH = getEnvNumber('MAX_ERROR_MESSAGE_LENGTH', 500)
export const INVITATION_MAX_INSERT_ATTEMPTS = getEnvNumber('INVITATION_MAX_INSERT_ATTEMPTS', 3)
export const INVITATION_MAX_USES = getEnvNumber('INVITATION_MAX_USES', 100)
export const INVITATION_CODE_MAX_LENGTH = getEnvNumber('INVITATION_CODE_MAX_LENGTH', 20)

// ─── Security / Debug / Admin ──────────────────────────────
export const ENCRYPTION_KEY = getEnv('ENCRYPTION_KEY')
export const DEBUG_AUTH_TOKEN = getEnv('DEBUG_AUTH_TOKEN')
export const DEBUG_USER_ID = getEnv('DEBUG_USER_ID')
// --- Alerts / Monitoring ---
/** Secret token for authenticating alerts webhook calls */
export const ALERTS_SECRET = getEnv('ALERTS_SECRET')
/** Slack webhook URL for sending alert notifications */
export const SLACK_ALERTS_WEBHOOK_URL = getEnv('SLACK_ALERTS_WEBHOOK_URL')

export const ADMIN_USER_IDS: string[] = (() => {
    const raw = getEnv('ADMIN_USER_IDS')
  if (!raw) return []
  return raw.split(',').map(id => id.trim()).filter(Boolean)
})()

const isServerRuntime = typeof window === 'undefined'
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build'

if (!ENCRYPTION_KEY && isServerRuntime) {
  // Allow secret injection at runtime during build, but block booting a real production server
  if (process.env.NODE_ENV === 'production' && !isBuildTime) {
    throw new Error('ENCRYPTION_KEY is required in production runtime')
  }
  if (!isBuildTime) {
    console.warn('[WARNING] ENCRYPTION_KEY is not set. Sensitive data may be stored as plaintext.')
  }
}

// ─── Environment / Logging ─────────────────────────────────
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'test' ? 'error' : 'info')

export type CacheProvider = 'portkey' | 'local'
/** Get the active LLM cache provider — lazy eval for test env mock compatibility (§2.4) */
export function getLLMCacheProvider(): CacheProvider {
  const env = process.env.LLM_CACHE_PROVIDER || 'portkey'
  return env === 'local' ? 'local' : 'portkey'
}

// ─── BYOK Model Configuration ──────────────────────────────
export interface ProviderModelOption {
  value: string
  label: string
}

export const PROVIDER_MODELS: Record<string, ProviderModelOption[]> = {
  openai: [
    { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
    { value: 'gpt-4.1', label: 'GPT-4.1' },
    { value: 'gpt-4.1-nano', label: 'GPT-4.1 Nano' },
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'o3-mini', label: 'o3 Mini' },
    { value: 'o4-mini', label: 'o4 Mini' },
  ],
  claude: [
    { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
    { value: 'claude-haiku-4-20250414', label: 'Claude Haiku 4' },
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
  ],
  gemini: [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  ],
}

export const DEFAULT_PROVIDER_MODEL: Record<string, string> = {
  openai: 'gpt-4.1-mini',
  claude: 'claude-sonnet-4-20250514',
  gemini: 'gemini-2.5-flash',
}

export const PROVIDER_LABELS: Record<string, string> = {
  openai: 'OpenAI',
  claude: 'Anthropic Claude',
  gemini: 'Google Gemini',
}

export const CLAUDE_VALIDATION_MODEL = getEnvWithDefault('CLAUDE_VALIDATION_MODEL', 'claude-3-haiku-20240307')


// ─── App URL ───────────────────────────────────────────────
export const APP_URL = getEnv('NEXT_PUBLIC_APP_URL') || getEnv('NEXT_PUBLIC_VERCEL_URL') || 'https://fill-ai-pink.vercel.app'

// ─── Storage Retention / Deletion Policy (M1-3) ──────────
/** TTL in days: PDF files older than this are eligible for deletion */
export const STORAGE_RETENTION_DAYS = getEnvNumber('STORAGE_RETENTION_DAYS', 30)
/** TTL in days: fill_sessions older than this are eligible for cleanup */
export const SESSION_RETENTION_DAYS = getEnvNumber('SESSION_RETENTION_DAYS', 90)
/** Maximum number of files to delete in a single cleanup run (safety limit) */
export const STORAGE_CLEANUP_BATCH_SIZE = getEnvNumber('STORAGE_CLEANUP_BATCH_SIZE', 100)
/** Storage bucket name for PDF files */
export const STORAGE_BUCKET_NAME = getEnvWithDefault('STORAGE_BUCKET_NAME', 'pdfs')
/** Whether the storage cleanup cron is enabled */
export const STORAGE_CLEANUP_ENABLED = getEnvBool('STORAGE_CLEANUP_ENABLED', true)

// ─── Proofread Model Usage ────────────────────────────────
export const PROOFREAD_MODEL_USAGE_ENABLED = getEnvBool('PROOFREAD_MODEL_USAGE_ENABLED', true)
export const PROOFREAD_MODEL_USAGE_VERBOSE = getEnvBool('PROOFREAD_MODEL_USAGE_VERBOSE', false)

// ─── Middleware / Auth ─────────────────────────────────────
export const AUTH_PUBLIC_PATHS = ['/', '/auth', '/api', '/terms', '/privacy', '/commercial-law', '/contact', '/invite'] as const
