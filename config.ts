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
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
export const GEMINI_THINKING_LEVEL = (process.env.GEMINI_THINKING_LEVEL as 'minimal' | 'low' | 'medium' | 'high') || 'high'
export const ANTHROPIC_API_URL = process.env.ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/messages'

// ─── Default AI Model ───────────────────────────────────────
export const DEFAULT_AI_MODEL = process.env.DEFAULT_AI_MODEL || 'glm-5-turbo'

// ─── Content Limits ─────────────────────────────────────────
export const MAX_CONTENT_LENGTH = Number(process.env.MAX_CONTENT_LENGTH || 100000)
export const MIN_CONTENT_LENGTH = Number(process.env.MIN_CONTENT_LENGTH || 50)

// ─── Free Plan Limits (P3.1) ───────────────────────────────
export const FREE_MAX_REQUESTS_PER_MONTH = Number(process.env.FREE_MAX_REQUESTS_PER_MONTH || 10)
export const FREE_MAX_CHARACTERS_PER_REQUEST = Number(process.env.FREE_MAX_CHARACTERS_PER_REQUEST || 5000)
export const FREE_ENABLED_AXES = (process.env.FREE_ENABLED_AXES || 'structure,readability,ai_tone').split(',').filter(Boolean)



// ─── LLM / Engine Settings ──────────────────────────────────
export const LLM_REQUEST_TIMEOUT_MS = Number(process.env.LLM_REQUEST_TIMEOUT_MS || 120_000)
export const LLM_MAX_RETRIES = Number(process.env.LLM_MAX_RETRIES || 4)

/** When Portkey Config handles retry+fallback at gateway level, disable ai-sdk retries to avoid duplication */
export const PORTKEY_CONFIG_SLUG = process.env.PORTKEY_CONFIG_SLUG || ""

export const LLM_DEFAULT_MAX_TOKENS = Number(process.env.LLM_DEFAULT_MAX_TOKENS || 4096)
export const LLM_RETRY_DELAY_MS = Number(process.env.LLM_RETRY_DELAY_MS || 5000)
export const MAX_RETRY_DELAY_MS = Number(process.env.MAX_RETRY_DELAY_MS || 60_000)
export const RATE_LIMIT_BASE_DELAY_MS = Number(process.env.RATE_LIMIT_BASE_DELAY_MS || 30_000)




// ─── OpenAI/Gemini/Anthropic Key Validation ────────────────
export const OPENAI_MODELS_ENDPOINT = process.env.OPENAI_MODELS_ENDPOINT || 'https://api.openai.com/v1/models'
export const GEMINI_MODELS_ENDPOINT = process.env.GEMINI_MODELS_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models'
export const API_KEY_VALIDATION_TIMEOUT_MS = Number(process.env.API_KEY_VALIDATION_TIMEOUT_MS || 10_000)


// ─── Branding ──────────────────────────────────────────────
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Fill AI'
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'PDFフォーム自動入力ツール'
export const APP_ICON = process.env.NEXT_PUBLIC_APP_ICON || '📝'

// ─── PDF / Form Fill Settings ──────────────────────────────
export const MAX_PDF_SIZE_BYTES = Number(process.env.MAX_PDF_SIZE_BYTES || 10_000_000)
export const MAX_PDF_PAGES = Number(process.env.MAX_PDF_PAGES || 50)
export const FILL_MAPPING_TIMEOUT_MS = Number(process.env.FILL_MAPPING_TIMEOUT_MS || 30_000)
export const FILL_VISION_LLM_TIMEOUT_MS = Number(process.env.FILL_VISION_LLM_TIMEOUT_MS || 90_000)
export const FILL_AUTO_APPLY_THRESHOLD = Number(process.env.FILL_AUTO_APPLY_THRESHOLD || 0.8)
/** Maximum prompt size for LLM mapping requests (Constitution §1.2 Stability — prevent resource exhaustion) */
export const MAX_MAPPING_PROMPT_LENGTH = Number(process.env.MAX_MAPPING_PROMPT_LENGTH || 100_000)
export const FILL_FALLBACK_MODELS = (process.env.FILL_FALLBACK_MODELS || 'glm-4.7-flash,glm-5-turbo').split(',').filter(Boolean)

// ─── LLM Fallback Settings ────────────────────────────────
export const LLM_FALLBACK_STABLE_MODELS = (process.env.LLM_FALLBACK_STABLE_MODELS || 'glm-5-turbo').split(',').filter(Boolean)
export const LLM_FALLBACK_DEFAULT_MODELS = (process.env.LLM_FALLBACK_DEFAULT_MODELS || 'glm-5-turbo,glm-4.7-flash').split(',').filter(Boolean)
export const LLM_FALLBACK_CHAIN: Record<string, string[]> = (() => {
  try {
    const raw = process.env.LLM_FALLBACK_CHAIN || '{}'
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
export const WP_API_TIMEOUT_MS = Number(process.env.WP_API_TIMEOUT_MS || 15_000)
export const WP_SYNC_PER_PAGE = Number(process.env.WP_SYNC_PER_PAGE || 100)
export const WP_MAX_PER_PAGE = Number(process.env.WP_MAX_PER_PAGE || 100)
export const WP_POSTS_LIST_LIMIT = Number(process.env.WP_POSTS_LIST_LIMIT || 5000)
export const JWT_SYNC_OVERLAP_MS = Number(process.env.JWT_SYNC_OVERLAP_MS || 60_000)
export const JWT_TOKEN_MARGIN_SECONDS = Number(process.env.JWT_TOKEN_MARGIN_SECONDS || 60)
export const WP_JWT_VALIDATE_ENDPOINT = process.env.WP_JWT_VALIDATE_ENDPOINT || '/wp-json/jwt-auth/v1/token/validate'
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
export const SCORE_AUTO_FIXED_PENALTY = Number(process.env.SCORE_AUTO_FIXED_PENALTY || 2)
export const SCORE_NEEDS_REVIEW_PENALTY = Number(process.env.SCORE_NEEDS_REVIEW_PENALTY || 5)
export const SCORE_AXIS_PATCH_PENALTY = Number(process.env.SCORE_AXIS_PATCH_PENALTY || 3)
export const DIAGNOSE_OVERALL_TIMEOUT_MS = Number(process.env.DIAGNOSE_OVERALL_TIMEOUT_MS || 60_000)

// ─── OpenAI/Gemini/Anthropic Key Validation ────────────────
// (already declared above)

// ─── PDF / Form Fill Settings ──────────────────────────────
export const FILL_MAPPING_SYSTEM_PROMPT = process.env.FILL_MAPPING_SYSTEM_PROMPT
  || 'あなたはPDFフォームのフィールドマッピングを行うAIアシスタントです。JSON配列のみを出力してください。'
export const FILL_MAPPING_TEMPERATURE = Number(process.env.FILL_MAPPING_TEMPERATURE || 0.1)
export const FILL_MAPPING_MAX_TOKENS = Number(process.env.FILL_MAPPING_MAX_TOKENS || 4096)
export const FILL_MAPPING_PROMPT_TEMPLATE = process.env.FILL_MAPPING_PROMPT_TEMPLATE
  || `以下のPDFフォームのフィールド情報と、ユーザーが入力するデータカテゴリのリストを元に、各フィールドにどのカテゴリのデータを入力すべきか判定してください。

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
- reason は日本語で簡潔に（例: "氏名欄のため"）`

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
export const CREDITS_PER_FILL = Number(process.env.CREDITS_PER_FILL || 1)

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
export const OPENROUTER_TIMEOUT_MS = Number(process.env.OPENROUTER_TIMEOUT_MS || 15_000)

// ─── Blog Auto AI Sync Settings ───────────────────────────
export const BLOG_AUTO_AI_SYNC_PER_PAGE = Number(process.env.BLOG_AUTO_AI_SYNC_PER_PAGE || 100)
export const BLOG_AUTO_AI_MAX_OFFSET = Number(process.env.BLOG_AUTO_AI_MAX_OFFSET || 10_000)
export const BLOG_AUTO_AI_FETCH_CONCURRENCY = Number(process.env.BLOG_AUTO_AI_FETCH_CONCURRENCY || 5)
export const BLOG_AUTO_AI_DETAIL_TIMEOUT_MS = Number(process.env.BLOG_AUTO_AI_DETAIL_TIMEOUT_MS || 30_000)
export const BLOG_AUTO_AI_LIST_LIMIT = Number(process.env.BLOG_AUTO_AI_LIST_LIMIT || 50)

// ─── Contact Enhance Rate Limits ───────────────────────────
export const CONTACT_ENHANCE_RATE_LIMIT_MAX = Number(process.env.CONTACT_ENHANCE_RATE_LIMIT_MAX || 2)
export const CONTACT_ENHANCE_RATE_LIMIT_WINDOW_MS = Number(process.env.CONTACT_ENHANCE_RATE_LIMIT_WINDOW_MS || 300_000)
export const CONTACT_ENHANCE_CLEANUP_INTERVAL_MS = Number(process.env.CONTACT_ENHANCE_CLEANUP_INTERVAL_MS || 300_000)
export const CONTACT_ENHANCE_DAILY_CAP_MAX = Number(process.env.CONTACT_ENHANCE_DAILY_CAP_MAX || 100)

// ─── Contact / Validation ──────────────────────────────────
export const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
export const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || 'klvx01@gmail.com'
export const CONTACT_EMAIL_FROM = process.env.CONTACT_EMAIL_FROM || 'Fill AI <noreply@fillai-pi.vercel.app>'
/** Timeout for Resend email send API call (Constitution §1.2 Stability) */
export const RESEND_TIMEOUT_MS = Number(process.env.RESEND_TIMEOUT_MS || 10_000)
export const MAX_NAME_LENGTH = Number(process.env.MAX_NAME_LENGTH || 200)
export const VALID_API_PROVIDERS = ['openai', 'gemini', 'claude'] as const
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

export const VALID_FAMILY_RELATIONSHIPS = [
  '本人', '配偶者', '父', '母', '子', '兄弟姉妹', '祖父母', 'その他',
] as const

export const MAX_FAMILY_MEMBERS = 20

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

export const CLAUDE_VALIDATION_MODEL = process.env.CLAUDE_VALIDATION_MODEL || 'claude-3-haiku-20240307'


// ─── App URL ───────────────────────────────────────────────
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'https://fill-ai-pink.vercel.app'

// ─── Middleware / Auth ─────────────────────────────────────
export const AUTH_PUBLIC_PATHS = ['/', '/auth', '/api', '/terms', '/privacy', '/commercial-law', '/contact', '/invite'] as const
