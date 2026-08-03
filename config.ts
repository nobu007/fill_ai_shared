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
/**
 * Fill API fallback model chain (Constitution §3.2 + §1.3.1).
 *
 * Default order — read top-to-bottom — tries each provider in sequence
 * until one succeeds:
 *   1. glm-5-turbo      (Z-AI primary, fast general model)
 *   2. glm-4.7-coding   (Z-AI secondary, slower but more accurate)
 *   3. glm-4.7-flash    (Z-AI tertiary, ultra-low latency)
 *   4. MiniMax-M3        (Amendment #3 fallback tail — Anthropic Messages API)
 *
 * Override via `FILL_FALLBACK_MODELS` env var (comma-separated). The fallback
 * sequence is identical whether the override is set or the default applies.
 */
export const FILL_FALLBACK_MODELS = (getEnv('FILL_FALLBACK_MODELS') || 'glm-5-turbo,glm-4.7-coding,glm-4.7-flash,MiniMax-M3').split(',').filter(Boolean)

/**
 * Per-model LLM timeout overrides (ms) — Constitution §1.2 Stability.
 *
 * Faster models should respond in < 5-10s for short prompts. Using shorter
 * timeouts prevents slow-model tail from dominating P99 latency. Per-model
 * overrides are used when present; otherwise the global `FILL_MAPPING_TIMEOUT_MS`
 * (default 30s) is the fallback.
 *
 * Single source of truth — consumed by `src/lib/pdf/llm.ts` `resolveModelTimeout()`.
 * Override per-model via `FILL_MODEL_TIMEOUT_OVERRIDES` env var as a JSON object
 * (e.g. `{"MiniMax-M3": 25000}`).
 */
export const FILL_MODEL_TIMEOUT_OVERRIDES: Readonly<Record<string, number>> = (() => {
  const raw = getEnv('FILL_MODEL_TIMEOUT_OVERRIDES')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, number>
      }
    } catch {
      // Fall through to defaults on parse error
    }
  }
  return {
    'glm-4.7-flash': 5_000,    // Ultra-low-latency: < 5s
    'glm-5-turbo': 10_000,     // Fast general model: < 10s
    'glm-4.7-coding': 15_000,  // Coding model: < 15s (slower but more accurate)
    'MiniMax-M3': 20_000,      // Fallback tail: Anthropic Messages API, < 20s
  }
})()
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

/**
 * Print-iframe cleanup delay (ms) for the DownloadOptions print action.
 *
 * Single source of truth replacing the module-local `setTimeout(..., 2000)`
 * hardcoded in `src/app/(dashboard)/fill/components/DownloadOptions.tsx`.
 *
 * The download component opens a hidden `<iframe>` whose `contentWindow.print()`
 * is invoked once the iframe's `onload` fires. The cleanup `setTimeout` defers
 * `iframe.remove()` so the browser's print dialog has time to take ownership of
 * the document before the iframe is detached (otherwise some browsers cancel
 * the print job the moment the iframe disappears from the DOM).
 *
 * 2000 ms is generous on most platforms but could legitimately need to grow in
 * environments with slow printers, large PDF documents, or contested CPU. The
 * constant is exposed for env-var tuning rather than left inline per
 * Constitution §2.4 ("All hardcoded values, magic numbers, and environment
 * variable references must be aggregated to src/config.ts").
 *
 * Override per environment via `FILL_PRINT_IFRAME_CLEANUP_MS` env var.
 *   FILL_PRINT_IFRAME_CLEANUP_MS=3000   # slow printer queue
 *   FILL_PRINT_IFRAME_CLEANUP_MS=500    # known-fast browser/OS combo
 *
 * Defaults to 2000 ms — matches the pre-centralization hard-coded constant so
 * behaviour is unchanged on upgrade.
 */
export const FILL_PRINT_IFRAME_CLEANUP_MS = getEnvNumber(
  'FILL_PRINT_IFRAME_CLEANUP_MS',
  2000,
)

/**
 * PDF extraction cache: max entries (LRU cap).
 *
 * Single source of truth consumed by `src/lib/pdf/extraction-cache.ts`.
 * Defaults to 128 entries (matches prior module-local `DEFAULT_MAX_ENTRIES`).
 * The cache evicts the oldest entry once full; reduce for memory-constrained
 * serverless environments, increase for warm-cache reuse across cold starts.
 */
export const FILL_EXTRACTION_CACHE_MAX_ENTRIES = getEnvNumber(
  'FILL_EXTRACTION_CACHE_MAX_ENTRIES',
  128,
)
/**
 * PDF extraction cache: per-entry TTL (ms).
 *
 * Single source of truth consumed by `src/lib/pdf/extraction-cache.ts`.
 * Defaults to 30 minutes (1_800_000 ms — matches prior `DEFAULT_TTL_MS`).
 * Entries older than this are considered expired and purged on access.
 */
export const FILL_EXTRACTION_CACHE_TTL_MS = getEnvNumber(
  'FILL_EXTRACTION_CACHE_TTL_MS',
  30 * 60 * 1000,
)
/**
 * Confidence threshold separating "high confidence" from "low confidence" mappings.
 *
 * Single source of truth consumed by both `src/lib/pdf/accuracy-tracker.ts`
 * (correction-derived accuracy buckets) and `src/lib/infra/api-metrics.ts`
 * (trackConfidence — production confidence counters). Defaults to 0.7.
 * Stored as a fraction (0.0–1.0) so it can be compared directly with `mapping.confidence`.
 */
export const FILL_HIGH_CONFIDENCE_THRESHOLD = getEnvNumber('FILL_HIGH_CONFIDENCE_THRESHOLD', 0.7)

/**
 * Confidence threshold for rule-based field auto-resolution in
 * `src/lib/pdf/rule-matcher.ts` (RuleMatcher.matchAll).
 *
 * Single source of truth replacing the module-local `DEFAULT_AUTO_THRESHOLD = 0.95`.
 * Fields whose regex-derived confidence >= this threshold are auto-resolved
 * (no LLM fallback); fields below it are deferred for the LLM mapping pass.
 *
 * Override per environment via `FILL_RULE_MATCH_THRESHOLD` env var.
 *   FILL_RULE_MATCH_THRESHOLD=0.85   # more aggressive auto-resolve (fewer LLM calls)
 *   FILL_RULE_MATCH_THRESHOLD=0.99   # more conservative (more LLM fallback)
 *
 * Stored as a fraction (0.0–1.0) so it can be compared directly with `result.confidence`.
 * Defaults to 0.95 — matches the pre-centralization hard-coded constant so behavior
 * is unchanged on upgrade.
 */
export const FILL_RULE_MATCH_THRESHOLD = getEnvNumber('FILL_RULE_MATCH_THRESHOLD', 0.95)

/**
 * Default matcher strategy ID used by `matcherRegistry.getDefault()`
 * in `src/lib/pdf/matcher-registry.ts` when no explicit strategy is requested.
 *
 * Single source of truth replacing the module-local `DEFAULT_MATCHER_ID = 'rule-based'`.
 * Rule-based matching is the Core Mission default because it is deterministic and
 * zero-cost (no LLM invocation); LLM-based and hybrid strategies remain available
 * via `MatcherRegistry.setDefault()` and the per-request matcherId parameter
 * (see `src/lib/pdf/fill-service.ts`).
 *
 * Override per environment via `FILL_DEFAULT_MATCHER_ID` env var.
 *   FILL_DEFAULT_MATCHER_ID=rule-based   # default (regex-only, no LLM)
 *   FILL_DEFAULT_MATCHER_ID=llm-based    # direct LLM (use sparingly — cost)
 *   FILL_DEFAULT_MATCHER_ID=hybrid       # rule → LLM fallback (not yet built)
 *
 * The supplied value must be a non-empty string. Numeric or whitespace-only
 * values fall back to the documented default via `getEnvWithDefault` + the
 * `||` short-circuit at the call site.
 */
export const FILL_DEFAULT_MATCHER_ID = getEnvWithDefault('FILL_DEFAULT_MATCHER_ID', 'rule-based')

/**
 * UI toast / saved-indicator auto-dismiss timeout (ms) for the dashboard.
 *
 * Single source of truth replacing the module-local `setTimeout(..., 3000)`
 * hardcoded in:
 *   - src/app/(dashboard)/sites/hooks/use-sites.ts (showToast)
 *   - src/app/(dashboard)/sites/[id]/info/page.tsx (copyScript)
 *   - src/app/(dashboard)/settings/components/ProfileSection.tsx
 *       (handleSaveProfile "saved" indicator)
 *   - src/app/(dashboard)/settings/components/InviteSection.tsx
 *       (handleCopyUrl "copied" chip)
 *
 * Toast / saved-indicator messages in the dashboard auto-dismiss after this
 * delay so users get feedback without needing to manually close the chip.
 * 3000 ms is generous enough for a quick read; reduce for snappier UX or
 * extend if accessibility reading-time studies show users need longer.
 *
 * Override per environment via `UI_TOAST_TIMEOUT_MS` env var.
 *   UI_TOAST_TIMEOUT_MS=5000   # longer read time (a11y-tuned)
 *   UI_TOAST_TIMEOUT_MS=1500   # snappier default
 *
 * Defaults to 3000 ms — matches the pre-centralization hard-coded constant so
 * behaviour is unchanged on upgrade.
 */
export const UI_TOAST_TIMEOUT_MS = getEnvNumber('UI_TOAST_TIMEOUT_MS', 3000)

/**
 * UI sync-result-message auto-dismiss timeout (ms) for the WordPress sites
 * dashboard.
 *
 * Single source of truth replacing the module-local `setTimeout(..., 8000)`
 * hardcoded in `src/app/(dashboard)/sites/hooks/use-sites.ts` (handleSync
 * finally block — the "✅ N件の新規・更新記事を同期しました" status line).
 *
 * Sync-result messages stay up longer than toast chips because they often
 * contain numeric summaries the user wants to read (e.g. "全120件") before
 * the next sync. 8000 ms is generous on most platforms but could legitimately
 * need to grow in environments with slow connections or contested CPU.
 *
 * Override per environment via `UI_SYNC_MESSAGE_TIMEOUT_MS` env var.
 *   UI_SYNC_MESSAGE_TIMEOUT_MS=15000   # slow-reading users / a11y
 *   UI_SYNC_MESSAGE_TIMEOUT_MS=4000    # fast-paced power users
 *
 * Defaults to 8000 ms — matches the pre-centralization hard-coded constant
 * so behaviour is unchanged on upgrade.
 */
export const UI_SYNC_MESSAGE_TIMEOUT_MS = getEnvNumber('UI_SYNC_MESSAGE_TIMEOUT_MS', 8000)

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

/**
 * Alert thresholds for /api/alerts/check (Constitution §2.4 — operational
 * settings must be env-overridable). Previously hardcoded at module scope in
 * src/lib/infra/alerts.ts as DEFAULT_THRESHOLDS; now centralised so production
 * can tune SLA / cost sensitivity without a redeploy.
 *
 * - FILL_ALERT_ERROR_RATE_THRESHOLD: fraction (0..1) of 4xx+5xx / total_requests
 *   above which an endpoint emits error_rate alert. Default 0.05 (5%).
 * - FILL_ALERT_RESPONSE_TIME_THRESHOLD_MS: P99 latency in ms above which an
 *   endpoint emits slow_response alert. Default 2000 (2s) — matches PURPOSE
 *   Phase 5 T-011 SLA direction (Fill API P99 < 1.5s in production; alerts at
 *   2s give ~33% grace margin).
 * - FILL_ALERT_TOKEN_THRESHOLD: total tokens (input+output) per-model per
 *   uptime period above which a model emits cost_anomaly alert.
 *   Default 100000 (100k tokens).
 */
export const FILL_ALERT_ERROR_RATE_THRESHOLD = getEnvNumber('FILL_ALERT_ERROR_RATE_THRESHOLD', 0.05)
export const FILL_ALERT_RESPONSE_TIME_THRESHOLD_MS = getEnvNumber('FILL_ALERT_RESPONSE_TIME_THRESHOLD_MS', 2000)
export const FILL_ALERT_TOKEN_THRESHOLD = getEnvNumber('FILL_ALERT_TOKEN_THRESHOLD', 100000)

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

// ─── User Data Rate Limits ─────────────────────────────────
/**
 * Maximum user-data write API requests (POST/PUT/DELETE /api/user-data) per
 * user within the rate limit window. Separate from FILL_RATE_LIMIT_MAX so the
 * user-data budget (which feeds the fill pipeline) cannot be exhausted by
 * unrelated fill traffic — and vice versa.
 *
 * Override via USER_DATA_RATE_LIMIT_MAX env var.
 *
 * @example
 *   # Default: 30 requests per 60-second window per user
 *   USER_DATA_RATE_LIMIT_MAX=60   # increase to 60 req/window
 *   USER_DATA_RATE_LIMIT_MAX=10   # decrease to 10 req/window (strict)
 */
export const USER_DATA_RATE_LIMIT_MAX = getEnvNumber('USER_DATA_RATE_LIMIT_MAX', 30)
/**
 * User-data rate limit window in milliseconds.
 * Sliding window: a request is allowed if (current_time - window_start) < this value
 * and the request count within the window is below USER_DATA_RATE_LIMIT_MAX.
 * Override via USER_DATA_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   USER_DATA_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   USER_DATA_RATE_LIMIT_WINDOW_MS=600000   # 10-minute window (more relaxed; matches the fill budget)
 */
export const USER_DATA_RATE_LIMIT_WINDOW_MS = getEnvNumber('USER_DATA_RATE_LIMIT_WINDOW_MS', 60000)

// ─── API Keys Rate Limits ───────────────────────────────────
/**
 * Maximum /api/keys write requests (POST/DELETE) per user within the rate limit
 * window. /api/keys is the BYOK endpoint: every POST triggers an outbound call
 * to OpenAI / Gemini / Claude (provider validation), an AES-256-GCM encrypt(),
 * and a Supabase user_api_keys upsert — the highest-cost write endpoint in the
 * app. Without a gate, an attacker can burn CPU, leak via provider cost, and
 * flood user_api_keys rows with a tight script.
 *
 * Named singleton (`keys-api`) so the keys budget is isolated from
 * fillRateLimiter and userDataRateLimiter — keys traffic cannot starve the
 * fill pipeline or vice versa.
 *
 * Override via KEYS_RATE_LIMIT_MAX env var.
 *
 * @example
 *   # Default: 10 requests per 60-second window per user
 *   KEYS_RATE_LIMIT_MAX=20   # increase to 20 req/window
 *   KEYS_RATE_LIMIT_MAX=5    # decrease to 5 req/window (strict)
 */
export const KEYS_RATE_LIMIT_MAX = getEnvNumber('KEYS_RATE_LIMIT_MAX', 10)
/**
 * API-keys rate limit window in milliseconds.
 * Sliding window: a request is allowed if (current_time - window_start) < this value
 * and the request count within the window is below KEYS_RATE_LIMIT_MAX.
 * Override via KEYS_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   KEYS_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   KEYS_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const KEYS_RATE_LIMIT_WINDOW_MS = getEnvNumber('KEYS_RATE_LIMIT_WINDOW_MS', 60000)

// ─── Account Data Deletion Rate Limits ──────────────────────
/**
 * Maximum account-data delete requests (DELETE /api/account/data) per user
 * within the rate limit window. This endpoint cascades deletions across
 * 10 user-scoped tables (fill_sessions, user_api_keys, credit_transactions,
 * proofreading_*, contact_submissions, user_data, wp_*, site_settings, wp_sites)
 * — Constitution §4.6 PII and §1.2 Safety both require that destructive
 * cascades be tightly bounded. Without a gate, a tight script can re-trigger
 * the cascade (each delete is its own Supabase RPC + RLS auth check) and
 * churn log volume + Supabase DB load unboundedly.
 *
 * The budget is intentionally tighter than /api/keys (10/window) because
 * account deletion is a one-time event per account lifecycle: a legitimate
 * user clicks it once after exporting their data; an automated abuser
 * hammers it. The 5/window cap is permissive enough for any sane UI flow
 * (retry on transient failure, double-confirm) while still bounding
 * abuse. Named singleton (`account-data-api`) so the budget is isolated
 * from fillRateLimiter / userDataRateLimiter / keysRateLimiter — account
 * deletion traffic cannot starve the fill pipeline and vice versa.
 *
 * Override via ACCOUNT_DATA_RATE_LIMIT_MAX env var.
 *
 * @example
 *   # Default: 5 requests per 60-second window per user
 *   ACCOUNT_DATA_RATE_LIMIT_MAX=10  # increase to 10 req/window (more relaxed)
 *   ACCOUNT_DATA_RATE_LIMIT_MAX=1   # decrease to 1 req/window (paranoid)
 */
export const ACCOUNT_DATA_RATE_LIMIT_MAX = getEnvNumber('ACCOUNT_DATA_RATE_LIMIT_MAX', 5)
/**
 * Account-data deletion rate limit window in milliseconds.
 * Sliding window: a request is allowed if (current_time - window_start) < this value
 * and the request count within the window is below ACCOUNT_DATA_RATE_LIMIT_MAX.
 * Override via ACCOUNT_DATA_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   ACCOUNT_DATA_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   ACCOUNT_DATA_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const ACCOUNT_DATA_RATE_LIMIT_WINDOW_MS = getEnvNumber(
  'ACCOUNT_DATA_RATE_LIMIT_WINDOW_MS',
  60000,
)

// ─── Contact Form Rate Limits ──────────────────────────────
/**
 * Maximum contact form submissions per IP within the rate limit window.
 * §1.2 Safety: contact form writes 1 row to `contact_submissions` (PII-bearing,
 * §4.6) and triggers an outbound Resend email send (charged API cost). Tight
 * budget prevents form spam from churning the contact_submissions table and
 * burning Resend quota. Budget is per-IP (not per-user) because the endpoint
 * accepts unauthenticated submissions.
 *
 * Override via CONTACT_FORM_RATE_LIMIT_MAX env var.
 *
 * @example
 *   CONTACT_FORM_RATE_LIMIT_MAX=3   # default: 3 submissions per IP per window
 *   CONTACT_FORM_RATE_LIMIT_MAX=10  # more relaxed (e.g. for public launch)
 */
export const CONTACT_FORM_RATE_LIMIT_MAX = getEnvNumber('CONTACT_FORM_RATE_LIMIT_MAX', 3)
/**
 * Contact form rate limit window in milliseconds.
 * Sliding window: a submission is allowed if (current_time - window_start) < this value
 * and the submission count within the window is below CONTACT_FORM_RATE_LIMIT_MAX.
 * Override via CONTACT_FORM_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   CONTACT_FORM_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   CONTACT_FORM_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const CONTACT_FORM_RATE_LIMIT_WINDOW_MS = getEnvNumber(
  'CONTACT_FORM_RATE_LIMIT_WINDOW_MS',
  60000,
)

// ─── Family Members Rate Limits ────────────────────────────
/**
 * Maximum family-member mutations per user within the rate limit window.
 * §1.2 Safety: family-member rows are PII-bearing (member name + relationship,
 * §4.6) and the endpoint exposes POST/PUT/DELETE — the only Core Mission
 * mutation endpoint left without rate-limit protection after the CYCLE=188–193
 * hardening wave. The endpoint accepts authenticated mutations; keying the
 * budget by `user.id` matches the user-data (CYCLE=190) + keys (CYCLE=191) +
 * account-data (CYCLE=192) wave.
 *
 * Budget is intentionally more permissive than account-data (5/window) because
 * legitimate UI flows drag-edit names, re-order sort_order, and delete/insert
 * during onboarding — 20/window accommodates that without enabling abuse.
 * Hard cap of MAX_FAMILY_MEMBERS (currently 20) rows already bounds the per-user
 * row count, so this limiter only blocks the *abuse vector* (rapid insert/delete
 * churn that bypasses the row cap by deleting then re-inserting).
 *
 * Override via FAMILY_MEMBERS_RATE_LIMIT_MAX env var.
 *
 * @example
 *   # Default: 20 mutations per 60-second window per user
 *   FAMILY_MEMBERS_RATE_LIMIT_MAX=40  # more relaxed (e.g. for power users)
 *   FAMILY_MEMBERS_RATE_LIMIT_MAX=10  # stricter
 */
export const FAMILY_MEMBERS_RATE_LIMIT_MAX = getEnvNumber(
  'FAMILY_MEMBERS_RATE_LIMIT_MAX',
  20,
)
/**
 * Family-members rate limit window in milliseconds.
 * Sliding window: a mutation is allowed if (current_time - window_start) < this value
 * and the mutation count within the window is below FAMILY_MEMBERS_RATE_LIMIT_MAX.
 * Override via FAMILY_MEMBERS_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   FAMILY_MEMBERS_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   FAMILY_MEMBERS_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const FAMILY_MEMBERS_RATE_LIMIT_WINDOW_MS = getEnvNumber(
  'FAMILY_MEMBERS_RATE_LIMIT_WINDOW_MS',
  60000,
)

// ─── Invitations Rate Limits ────────────────────────────────
/**
 * Maximum invitation CRUD (POST/DELETE /api/invitations) requests per admin
 * within the rate limit window. Sliding window: a request is allowed if
 * (current_time - window_start) < INVITATIONS_RATE_LIMIT_WINDOW_MS and the
 * request count within the window is below INVITATIONS_RATE_LIMIT_MAX.
 * Override via INVITATIONS_RATE_LIMIT_MAX env var.
 *
 * §1.2 Safety: per-admin budget for the admin-facing invitation-management
 * surface (`/api/invitations` POST + DELETE mutate `beta_invitations` rows;
 * the `email` column is PII, §4.6). Both POST and DELETE require the caller
 * to pass the admin gate (ADMIN_USER_IDS env or profiles.membership='pro')
 * — keying the budget by `user.id` means a compromised admin token still
 * cannot burst unbounded code-issuing / invalidation churn. Budget is
 * intentionally more permissive than redeem (20/window vs 10/window) because
 * admin code-issuing flows batch-create codes for invitation campaigns.
 *
 * @example
 *   # Default: 20 mutations per 60-second window per admin
 *   INVITATIONS_RATE_LIMIT_MAX=40   # more relaxed (e.g. for bulk campaigns)
 *   INVITATIONS_RATE_LIMIT_MAX=10   # stricter
 */
export const INVITATIONS_RATE_LIMIT_MAX = getEnvNumber(
  'INVITATIONS_RATE_LIMIT_MAX',
  20,
)
/**
 * Invitations CRUD rate limit window in milliseconds.
 * Override via INVITATIONS_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   INVITATIONS_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   INVITATIONS_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const INVITATIONS_RATE_LIMIT_WINDOW_MS = getEnvNumber(
  'INVITATIONS_RATE_LIMIT_WINDOW_MS',
  60000,
)
/**
 * Maximum invitation redemption (POST /api/invitations/redeem) requests per
 * authenticated user within the rate limit window. Sliding window: a request
 * is allowed if (current_time - window_start) < INVITATIONS_REDEEM_RATE_LIMIT_WINDOW_MS
 * and the request count within the window is below INVITATIONS_REDEEM_RATE_LIMIT_MAX.
 * Override via INVITATIONS_REDEEM_RATE_LIMIT_MAX env var.
 *
 * §1.2 Safety + §4.6 PII: per-user budget for the redemption surface that
 * upgrades the caller's profiles.membership to 'beta'. Redemption is a
 * one-time lifecycle event — 10/window is permissive for double-confirm UI
 * flows and retry-on-transient-failure while still bounding automated
 * abuse (brute-forcing the redeem_invitation RPC). Named singleton
 * (`invitations-redeem-api`) so redemption traffic is isolated from the
 * admin CRUD budget (`invitations-api`) and from all sibling write budgets
 * (`family-members-api` / `user-data-api` / `keys-api` /
 * `account-data-api` / `contact-form-api`).
 *
 * @example
 *   # Default: 10 redemption attempts per 60-second window per user
 *   INVITATIONS_REDEEM_RATE_LIMIT_MAX=20  # more relaxed
 *   INVITATIONS_REDEEM_RATE_LIMIT_MAX=3   # stricter (anti-brute-force)
 */
export const INVITATIONS_REDEEM_RATE_LIMIT_MAX = getEnvNumber(
  'INVITATIONS_REDEEM_RATE_LIMIT_MAX',
  10,
)
/**
 * Invitations redemption rate limit window in milliseconds.
 * Override via INVITATIONS_REDEEM_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   INVITATIONS_REDEEM_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   INVITATIONS_REDEEM_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const INVITATIONS_REDEEM_RATE_LIMIT_WINDOW_MS = getEnvNumber(
  'INVITATIONS_REDEEM_RATE_LIMIT_WINDOW_MS',
  60000,
)

// ─── Subscription / Stripe Checkout Rate Limits ────────────
/**
 * Maximum subscription checkout session creations (POST /api/subscription/create-checkout)
 * per user within the rate limit window. §1.2 Safety: every accepted request triggers
 * a real Stripe Checkout Session API call (charged against the Stripe API quota + creates
 * a hosted checkout URL), a Supabase `profiles` read for the customer email, and returns
 * a `sessionId` the caller can use to redirect to Stripe. Without a gate, an attacker
 * can rapidly create Stripe Sessions to drain API quota, spam the user's email inbox
 * with Stripe checkout emails, and force Stripe API rate-limit noise into the system.
 * Tight budget prevents Stripe API quota exhaustion (the platform-wide abuse vector).
 *
 * Named singleton (`stripe-checkout-api`) so the checkout budget is isolated from all
 * sibling write budgets (fillRateLimiter / userDataRateLimiter / keysRateLimiter /
 * accountDataRateLimiter / contactFormRateLimiter / familyMembersRateLimiter /
 * invitationsRateLimiter / invitationsRedeemRateLimiter) — a flood of checkout
 * attempts cannot starve any other write budget (and vice versa).
 *
 * Budget is intentionally tight (5/window) because legitimate users click "Subscribe"
 * once per plan choice; UI flows retry on transient Stripe failure (max 1 retry by
 * convention), so 5/window is permissive for double-confirm + retry while still
 * bounding abuse. The account-data (5/window) and family-members (20/window) limits
 * are the closest siblings — checkout is tighter because it has an external paid
 * API cost (vs. internal DB rows).
 *
 * Override via STRIPE_CHECKOUT_RATE_LIMIT_MAX env var.
 *
 * @example
 *   # Default: 5 checkout creations per 60-second window per user
 *   STRIPE_CHECKOUT_RATE_LIMIT_MAX=10  # more relaxed
 *   STRIPE_CHECKOUT_RATE_LIMIT_MAX=3   # stricter
 */
export const STRIPE_CHECKOUT_RATE_LIMIT_MAX = getEnvNumber(
  'STRIPE_CHECKOUT_RATE_LIMIT_MAX',
  5,
)
/**
 * Stripe checkout rate limit window in milliseconds.
 * Sliding window: a request is allowed if (current_time - window_start) < this value
 * and the request count within the window is below STRIPE_CHECKOUT_RATE_LIMIT_MAX.
 * Override via STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS = getEnvNumber(
  'STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS',
  60000,
)

// ─── Subscription Cancel Rate Limits ───────────────────────
/**
 * Maximum subscription cancel requests (POST /api/subscription/cancel) per user within
 * the rate limit window. §1.2 Safety: every accepted request fires a real Stripe
 * `subscriptions.cancel(...)` RPC (charged against the Stripe API quota, irreversibly
 * cancels the user's paid subscription) and a Supabase `subscriptions` row read.
 * Without a gate, an attacker (or a buggy retry loop) can repeatedly cancel/restore
 * churn against the Stripe subscriptions table bounded only by RLS + per-RPC latency,
 * drowning out legitimate cancel requests and contaminating Stripe's subscription
 * state. Tight budget prevents destructive churn from a single compromised token.
 *
 * Named singleton (`stripe-cancel-api`) so the cancel budget is isolated from the
 * checkout budget (`stripe-checkout-api`) and all sibling write budgets — a flood of
 * cancel attempts cannot starve the checkout budget or vice versa (an attacker who
 * has captured a token cannot simultaneously drain checkout quota AND burn the
 * subscription via cancel churn).
 *
 * Budget is intentionally the same tightness as checkout (5/window) because both
 * touch the Stripe subscriptions API. Cancellation is a one-time lifecycle event
 * (a legitimate user clicks "Cancel subscription" once); the budget is permissive
 * for double-confirm UI flows and retry-on-transient-failure while still bounding
 * abuse.
 *
 * Override via STRIPE_CANCEL_RATE_LIMIT_MAX env var.
 *
 * @example
 *   # Default: 5 cancellations per 60-second window per user
 *   STRIPE_CANCEL_RATE_LIMIT_MAX=10  # more relaxed
 *   STRIPE_CANCEL_RATE_LIMIT_MAX=3   # stricter
 */
export const STRIPE_CANCEL_RATE_LIMIT_MAX = getEnvNumber(
  'STRIPE_CANCEL_RATE_LIMIT_MAX',
  5,
)
/**
 * Stripe cancel rate limit window in milliseconds.
 * Override via STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS = getEnvNumber(
  'STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS',
  60000,
)

// ─── Blog Auto AI Connect Rate Limits ───────────────────────
/**
 * Maximum Blog Auto AI connect requests (POST /api/blog-auto-ai/connect) per user
 * within the rate limit window. §1.2 Safety: every accepted request fires a real
 * external fetch to the user-supplied `${baseUrl}/api/proof-ai.php?action=list&limit=1`
 * endpoint (charged against the upstream Blog Auto AI backend's quota + the
 * connect URL is user-controlled → SSRF / external API abuse vector) and
 * subsequently writes/updates a wp_sites row with safeEncrypt(apiKey)
 * (PII-bearing per §4.6). Without this gate, an attacker can:
 *   1. Repeatedly probe external URLs to drain upstream Blog Auto AI quota
 *   2. Spam the wp_sites table with one-off entries
 *   3. Force external API rate-limit noise into the system
 *
 * Named singleton (`blog-auto-ai-connect-api`) so the connect budget is isolated
 * from the sync budget (`blog-auto-ai-sync-api`) and all sibling write budgets
 * (fillRateLimiter / userDataRateLimiter / keysRateLimiter /
 * accountDataRateLimiter / contactFormRateLimiter / familyMembersRateLimiter /
 * invitationsRateLimiter / invitationsRedeemRateLimiter /
 * stripeCheckoutRateLimiter / stripeCancelRateLimiter) — a flood of connect
 * attempts cannot starve any other write budget (and vice versa).
 *
 * Budget is intentionally tight (5/window) because connecting to a Blog Auto AI
 * site is a one-time setup action; legitimate users click "Connect" once per
 * site, and reconnect-after-edit is the standard retry path. The 5/window
 * ceiling is permissive for double-confirm + retry while still bounding abuse.
 *
 * Override via BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX env var.
 *
 * @example
 *   # Default: 5 connect attempts per 60-second window per user
 *   BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX=10  # more relaxed
 *   BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX=3   # stricter
 */
export const BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX = getEnvNumber(
  'BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX',
  5,
)
/**
 * Blog Auto AI connect rate limit window in milliseconds.
 * Sliding window: a request is allowed if (current_time - window_start) < this value
 * and the request count within the window is below BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX.
 * Override via BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS = getEnvNumber(
  'BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS',
  60000,
)

// ─── Blog Auto AI Sync Rate Limits ──────────────────────────
/**
 * Maximum Blog Auto AI sync requests (POST /api/blog-auto-ai/sync) per user within
 * the rate limit window. §1.2 Safety: every accepted request fires multiple
 * external fetches against the user's Blog Auto AI site — a LIST request for
 * each pagination step (up to BLOG_AUTO_AI_LIST_LIMIT articles) plus a DETAIL
 * request per article (BLOG_AUTO_AI_LIST_LIMIT articles total). Without this
 * gate, a single script can repeatedly trigger bulk sync to:
 *   1. DoS the upstream Blog Auto AI backend (LIST + DETAIL fan-out)
 *   2. Repeatedly safeDecrypt the user's API key (GCM nonce reuse risk vector)
 *   3. Saturate the sources supabase table with churn inserts/updates
 *
 * Named singleton (`blog-auto-ai-sync-api`) so the sync budget is isolated from
 * the connect budget (`blog-auto-ai-connect-api`) and all sibling write budgets.
 *
 * Budget is intentionally tighter than connect (3/window vs 5/window) because
 * sync is a bulk import action: a legitimate user initiates sync once, then
 * waits for completion; 3/window is permissive for retry-on-failure (max 1-2
 * retries by convention) while still bounding abuse. The connector/sync pair
 * pattern matches account-data (5/window) and family-members (20/window)
 * separation, scaled down for the higher external API cost.
 *
 * Override via BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX env var.
 *
 * @example
 *   # Default: 3 sync attempts per 60-second window per user
 *   BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX=10  # more relaxed
 *   BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX=2   # stricter
 */
export const BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX = getEnvNumber(
  'BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX',
  3,
)
/**
 * Blog Auto AI sync rate limit window in milliseconds.
 * Override via BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS = getEnvNumber(
  'BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS',
  60000,
)

// ─── Credits Checkout Rate Limits ──────────────────────────
/**
 * Maximum credits checkout requests (POST /api/credits/checkout) per user within
 * the rate limit window. §1.2 Safety: every accepted request fires a real
 * `stripe.checkout.sessions.create({ mode: 'payment', ... })` API call (charged
 * against the Stripe API quota, creates a hosted Stripe checkout URL) for the
 * user-selected credit pack (free-10, free-30, free-100, pro-100, pro-300,
 * pro-1000). Without this gate, an attacker can rapidly drain Stripe API
 * quota, force Stripe API rate-limit noise into the system, and spam the
 * customer with Stripe checkout emails.
 *
 * This is the second financial endpoint protected — the first was the
 * subscription `/api/subscription/create-checkout` (CYCLE=196, budget
 * `stripe-checkout-api`). Credits checkout is intentionally given a NAMED
 * SEPARATE singleton (`credits-checkout-api`) so credits-pack purchases
 * cannot starve the subscription checkout budget (or vice versa) — a user
 * who is buying a one-off credits pack should not be locked out of starting
 * a new subscription, and a user who is upgrading a subscription should not
 * be locked out of topping up their credits.
 *
 * Budget matches the subscription checkout budget (5/window) because both
 * surface equivalent external paid API cost (one Stripe checkout.sessions.create
 * per accepted request). A legitimate user clicks "Buy credits" once per pack
 * choice; UI flows retry on transient Stripe failure (max 1 retry by
 * convention), so 5/window is permissive for double-confirm + retry while
 * still bounding abuse. The packId allowlist (6 fixed values) already bounds
 * the input space, so this rate limiter is the only abuse-velocity control.
 *
 * Override via CREDITS_CHECKOUT_RATE_LIMIT_MAX env var.
 *
 * @example
 *   # Default: 5 credits-checkout creations per 60-second window per user
 *   CREDITS_CHECKOUT_RATE_LIMIT_MAX=10  # more relaxed
 *   CREDITS_CHECKOUT_RATE_LIMIT_MAX=3   # stricter
 */
export const CREDITS_CHECKOUT_RATE_LIMIT_MAX = getEnvNumber(
  'CREDITS_CHECKOUT_RATE_LIMIT_MAX',
  5,
)
/**
 * Credits checkout rate limit window in milliseconds.
 * Sliding window: a request is allowed if (current_time - window_start) < this value
 * and the request count within the window is below CREDITS_CHECKOUT_RATE_LIMIT_MAX.
 * Override via CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS = getEnvNumber(
  'CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS',
  60000,
)

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

// ─── Templates Rate Limits ──────────────────────────────────
/**
 * Maximum template API write requests per user within the rate limit window.
 * Override via TEMPLATES_RATE_LIMIT_MAX env var.
 *
 * Templates cache the resolved `<PLACEHOLDER> → user-data field` mapping for a
 * specific PDF (fingerprint-scoped). Both POST and DELETE are write endpoints
 * and POST inserts into `pdf_templates` (PII-adjacent, §4.6: the mappings
 * table references user data column names like 'name' / 'address'). Per-user
 * budget so a single compromised token cannot starve other users.
 *
 * @example
 *   # Default: 10 template mutations per 60-second window per user
 *   TEMPLATES_RATE_LIMIT_MAX=20  # more relaxed
 *   TEMPLATES_RATE_LIMIT_MAX=3   # stricter
 */
export const TEMPLATES_RATE_LIMIT_MAX = getEnvNumber('TEMPLATES_RATE_LIMIT_MAX', 10)
/**
 * Templates rate limit window in milliseconds.
 * Sliding window: a request is allowed if (current_time - window_start) < this value
 * and the request count within the window is below TEMPLATES_RATE_LIMIT_MAX.
 * Override via TEMPLATES_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   TEMPLATES_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   TEMPLATES_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const TEMPLATES_RATE_LIMIT_WINDOW_MS = getEnvNumber('TEMPLATES_RATE_LIMIT_WINDOW_MS', 60000)

// ─── Prompts Rate Limits ────────────────────────────────────
/**
 * Maximum prompts API write requests per user within the rate limit window.
 * Override via PROMPTS_RATE_LIMIT_MAX env var.
 *
 * Prompts govern the `<axis_id> → system_prompt` text the LLM uses during the
 * Core Mission fill pipeline (review axes like 'structure' / 'readability' /
 * 'ai_tone', plus per-site custom prompts). Both POST (creates/updates via
 * PUT) and PUT/DELETE are write endpoints and mutate the `prompts` table —
 * system_prompt text is LLM-context-shaped and can contain user-confidential
 * tuning instructions, which is why it sits under §4.6. Per-user budget so
 * a compromised token cannot rapidly churn prompt rows bounded only by RLS
 * + per-RPC latency.
 *
 * @example
 *   # Default: 10 prompt mutations per 60-second window per user
 *   PROMPTS_RATE_LIMIT_MAX=20  # more relaxed
 *   PROMPTS_RATE_LIMIT_MAX=3   # stricter
 */
export const PROMPTS_RATE_LIMIT_MAX = getEnvNumber('PROMPTS_RATE_LIMIT_MAX', 10)
/**
 * Prompts rate limit window in milliseconds.
 * Sliding window: a request is allowed if (current_time - window_start) < this value
 * and the request count within the window is below PROMPTS_RATE_LIMIT_MAX.
 * Override via PROMPTS_RATE_LIMIT_WINDOW_MS env var.
 *
 * @example
 *   PROMPTS_RATE_LIMIT_WINDOW_MS=60000    # default: 60-second window
 *   PROMPTS_RATE_LIMIT_WINDOW_MS=300000   # 5-minute window (more relaxed)
 */
export const PROMPTS_RATE_LIMIT_WINDOW_MS = getEnvNumber('PROMPTS_RATE_LIMIT_WINDOW_MS', 60000)
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
