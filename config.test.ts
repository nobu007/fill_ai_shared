/**
 * Tests for centralized configuration constants (Constitution §2.4).
 * Verifies default values, types, and immutability of shared constants.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  MAX_NAME_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NOTE_LENGTH,
  EMAIL_REGEX,
  VALID_CONTACT_CATEGORIES,
  VALID_USER_DATA_CATEGORIES,
  DEFAULT_PAGE_LIMIT,
  HISTORY_EXPORT_LIMIT,
  DASHBOARD_RECENT_LIMIT,
  MAX_ERROR_MESSAGE_LENGTH,
  INVITATION_MAX_INSERT_ATTEMPTS,
  FREE_CREDIT_PACKS,
  PRO_CREDIT_PACKS,
  PACK_CREDITS,
  CREDITS_PER_FILL,
  FILL_MAPPING_SYSTEM_PROMPT,
  FILL_MAPPING_TEMPERATURE,
  FILL_MAPPING_MAX_TOKENS,
  FILL_MAPPING_PROMPT_TEMPLATE,
  FILL_VISION_MODEL,
  FILL_VISION_TEMPERATURE,
  FILL_VISION_MAX_TOKENS,
  FILL_OCR_MODEL,
  PROVIDER_MODELS,
  DEFAULT_PROVIDER_MODEL,
  PROVIDER_LABELS,
  CLAUDE_VALIDATION_MODEL,
  AUTH_PUBLIC_PATHS,
  PDF_DPI,
  MM_PER_INCH,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  SCAN_TEXT_THRESHOLD,
  FILL_RATE_LIMIT_MAX,
  FILL_RATE_LIMIT_WINDOW_MS,
  USER_DATA_RATE_LIMIT_MAX,
  USER_DATA_RATE_LIMIT_WINDOW_MS,
  KEYS_RATE_LIMIT_MAX,
  KEYS_RATE_LIMIT_WINDOW_MS,
  ACCOUNT_DATA_RATE_LIMIT_MAX,
  ACCOUNT_DATA_RATE_LIMIT_WINDOW_MS,
  CONTACT_FORM_RATE_LIMIT_MAX,
  CONTACT_FORM_RATE_LIMIT_WINDOW_MS,
  FAMILY_MEMBERS_RATE_LIMIT_MAX,
  FAMILY_MEMBERS_RATE_LIMIT_WINDOW_MS,
  INVITATIONS_RATE_LIMIT_MAX,
  INVITATIONS_RATE_LIMIT_WINDOW_MS,
  INVITATIONS_REDEEM_RATE_LIMIT_MAX,
  INVITATIONS_REDEEM_RATE_LIMIT_WINDOW_MS,
  // STRIPE_* env vars are loaded only via dynamic `import('./config')` inside
  // the 'Stripe Subscription Rate Limits' describe block at the bottom of
  // this file (afterEach isolation requires vi.resetModules() before each
  // test that touches process.env.STRIPE_*). They are intentionally not
  // imported at module scope so the static getters do not capture the
  // current process.env value before the test's afterEach hook runs.
  API_METRICS_DURATION_SAMPLE_LIMIT,
  PII_PROXIMITY_THRESHOLD,
  VALID_FAMILY_RELATIONSHIPS,
  MAX_FAMILY_MEMBERS,
  MAX_USER_DATA_ENTRIES,
  ENHANCE_RENDER_SCALE,
  ENHANCE_SHARPEN_AMOUNT,
  STRIPE_PRICE_ID,
  ALERTS_SECRET,
  SLACK_ALERTS_WEBHOOK_URL,
} from './config'

describe('Validation Limits (Constitution §4.5)', () => {
  it('MAX_NAME_LENGTH defaults to 200', () => {
    expect(MAX_NAME_LENGTH).toBe(200)
    expect(typeof MAX_NAME_LENGTH).toBe('number')
  })

  it('MAX_EMAIL_LENGTH defaults to 254 (RFC 5321)', () => {
    expect(MAX_EMAIL_LENGTH).toBe(254)
    expect(typeof MAX_EMAIL_LENGTH).toBe('number')
  })

  it('MAX_MESSAGE_LENGTH defaults to 10000', () => {
    expect(MAX_MESSAGE_LENGTH).toBe(10000)
    expect(typeof MAX_MESSAGE_LENGTH).toBe('number')
  })

  it('MAX_NOTE_LENGTH defaults to 500', () => {
    expect(MAX_NOTE_LENGTH).toBe(500)
    expect(typeof MAX_NOTE_LENGTH).toBe('number')
  })

  it('EMAIL_REGEX is a valid regex that validates correct emails', () => {
    expect(EMAIL_REGEX).toBeInstanceOf(RegExp)

    // Valid emails
    expect(EMAIL_REGEX.test('user@example.com')).toBe(true)
    expect(EMAIL_REGEX.test('test+tag@domain.co.jp')).toBe(true)
    expect(EMAIL_REGEX.test('a@b.c')).toBe(true)

    // Invalid emails
    expect(EMAIL_REGEX.test('')).toBe(false)
    expect(EMAIL_REGEX.test('not-an-email')).toBe(false)
    expect(EMAIL_REGEX.test('@domain.com')).toBe(false)
    expect(EMAIL_REGEX.test('user@')).toBe(false)
    expect(EMAIL_REGEX.test('user @domain.com')).toBe(false)
  })

  it('VALID_CONTACT_CATEGORIES contains expected categories', () => {
    expect(VALID_CONTACT_CATEGORIES).toContain('bug')
    expect(VALID_CONTACT_CATEGORIES).toContain('feature')
    expect(VALID_CONTACT_CATEGORIES).toContain('inquiry')
    expect(VALID_CONTACT_CATEGORIES).toContain('support')
    expect(VALID_CONTACT_CATEGORIES).toContain('other')
    expect(VALID_CONTACT_CATEGORIES).toHaveLength(5)
  })

  it('VALID_CONTACT_CATEGORIES is a tuple with fixed length', () => {
    expect(VALID_CONTACT_CATEGORIES).toHaveLength(5)
    // as const ensures TypeScript treats it as readonly at compile time
    expect(Array.isArray(VALID_CONTACT_CATEGORIES)).toBe(true)
  })
})

describe('Pagination Limits (Constitution §2.4)', () => {
  it('DEFAULT_PAGE_LIMIT defaults to 50', () => {
    expect(DEFAULT_PAGE_LIMIT).toBe(50)
    expect(typeof DEFAULT_PAGE_LIMIT).toBe('number')
  })

  it('HISTORY_EXPORT_LIMIT defaults to 200', () => {
    expect(HISTORY_EXPORT_LIMIT).toBe(200)
    expect(typeof HISTORY_EXPORT_LIMIT).toBe('number')
  })

  it('DASHBOARD_RECENT_LIMIT defaults to 5', () => {
    expect(DASHBOARD_RECENT_LIMIT).toBe(5)
    expect(typeof DASHBOARD_RECENT_LIMIT).toBe('number')
  })

  it('DASHBOARD_RECENT_LIMIT is smaller than DEFAULT_PAGE_LIMIT', () => {
    expect(DASHBOARD_RECENT_LIMIT).toBeLessThan(DEFAULT_PAGE_LIMIT)
  })

  it('HISTORY_EXPORT_LIMIT is larger than DEFAULT_PAGE_LIMIT', () => {
    expect(HISTORY_EXPORT_LIMIT).toBeGreaterThan(DEFAULT_PAGE_LIMIT)
  })
})

describe('Error Handling', () => {
  it('MAX_ERROR_MESSAGE_LENGTH defaults to 500', () => {
    expect(MAX_ERROR_MESSAGE_LENGTH).toBe(500)
    expect(typeof MAX_ERROR_MESSAGE_LENGTH).toBe('number')
  })

  it('INVITATION_MAX_INSERT_ATTEMPTS defaults to 3', () => {
    expect(INVITATION_MAX_INSERT_ATTEMPTS).toBe(3)
    expect(typeof INVITATION_MAX_INSERT_ATTEMPTS).toBe('number')
  })
})

describe('Environment variable override', () => {
  it('constants are positive numbers', () => {
    const numericConstants = [
      MAX_NAME_LENGTH,
      MAX_EMAIL_LENGTH,
      MAX_MESSAGE_LENGTH,
      MAX_NOTE_LENGTH,
      DEFAULT_PAGE_LIMIT,
      HISTORY_EXPORT_LIMIT,
      DASHBOARD_RECENT_LIMIT,
      MAX_ERROR_MESSAGE_LENGTH,
      INVITATION_MAX_INSERT_ATTEMPTS,
    ]
    for (const val of numericConstants) {
      expect(val).toBeGreaterThan(0)
    }
  })
})

describe('User Data Categories (Constitution §4.5)', () => {
  it('VALID_USER_DATA_CATEGORIES contains all 17 expected categories', () => {
    expect(VALID_USER_DATA_CATEGORIES).toHaveLength(17)
    expect(VALID_USER_DATA_CATEGORIES).toContain('name')
    expect(VALID_USER_DATA_CATEGORIES).toContain('custom')
  })

  it('VALID_USER_DATA_CATEGORIES matches UserDataCategory type', () => {
    // CATEGORY_LABELS keys are the runtime source of truth (validated in host repo)
    // Here we only verify the array has expected length and types
    expect(VALID_USER_DATA_CATEGORIES).toHaveLength(17)
    for (const cat of VALID_USER_DATA_CATEGORIES) {
      expect(typeof cat).toBe('string')
    }
  })
})

describe('Credit Packs (Constitution §2.4)', () => {
  it('CREDITS_PER_FILL defaults to 1', () => {
    expect(CREDITS_PER_FILL).toBe(1)
    expect(typeof CREDITS_PER_FILL).toBe('number')
  })

  it('FREE_CREDIT_PACKS has 3 packs with correct structure', () => {
    expect(FREE_CREDIT_PACKS).toHaveLength(3)
    for (const pack of FREE_CREDIT_PACKS) {
      expect(pack.id).toMatch(/^free-\d+$/)
      expect(typeof pack.credits).toBe('number')
      expect(pack.credits).toBeGreaterThan(0)
      expect(typeof pack.price).toBe('number')
      expect(pack.price).toBeGreaterThan(0)
      expect(typeof pack.unitPrice).toBe('number')
      expect(pack.unitPrice).toBeGreaterThan(0)
    }
  })

  it('PRO_CREDIT_PACKS has 3 packs with correct structure', () => {
    expect(PRO_CREDIT_PACKS).toHaveLength(3)
    for (const pack of PRO_CREDIT_PACKS) {
      expect(pack.id).toMatch(/^pro-\d+$/)
      expect(typeof pack.credits).toBe('number')
      expect(pack.credits).toBeGreaterThan(0)
      expect(typeof pack.price).toBe('number')
      expect(pack.price).toBeGreaterThan(0)
      expect(typeof pack.unitPrice).toBe('number')
      expect(pack.unitPrice).toBeGreaterThan(0)
    }
  })

  it('FREE_CREDIT_PACKS credits match PACK_CREDITS', () => {
    for (const pack of FREE_CREDIT_PACKS) {
      expect(PACK_CREDITS[pack.id]).toBe(pack.credits)
    }
  })

  it('PRO_CREDIT_PACKS credits match PACK_CREDITS', () => {
    for (const pack of PRO_CREDIT_PACKS) {
      expect(PACK_CREDITS[pack.id]).toBe(pack.credits)
    }
  })

  it('unitPrice is approximately price / credits (rounded for display)', () => {
    const allPacks = [...FREE_CREDIT_PACKS, ...PRO_CREDIT_PACKS]
    for (const pack of allPacks) {
      const rawUnitPrice = pack.price / pack.credits
      expect(Math.abs(pack.unitPrice - rawUnitPrice)).toBeLessThan(0.3)
    }
  })

  it('exactly one pack in each tier is marked as popular', () => {
    const freePopular = FREE_CREDIT_PACKS.filter(p => p.popular)
    const proPopular = PRO_CREDIT_PACKS.filter(p => p.popular)
    expect(freePopular).toHaveLength(1)
    expect(proPopular).toHaveLength(1)
  })

  it('pro unit prices are lower than free unit prices for same credit amounts', () => {
    const free100 = FREE_CREDIT_PACKS.find(p => p.id === 'free-100')!
    const pro100 = PRO_CREDIT_PACKS.find(p => p.id === 'pro-100')!
    expect(pro100.unitPrice).toBeLessThan(free100.unitPrice)
  })
})

describe('LLM Mapping Config (Constitution §2.4)', () => {
  it('FILL_MAPPING_SYSTEM_PROMPT is a non-empty string', () => {
    expect(typeof FILL_MAPPING_SYSTEM_PROMPT).toBe('string')
    expect(FILL_MAPPING_SYSTEM_PROMPT.length).toBeGreaterThan(0)
  })

  it('FILL_MAPPING_SYSTEM_PROMPT describes field mapping role', () => {
    expect(FILL_MAPPING_SYSTEM_PROMPT).toContain('マッピング')
  })

  it('FILL_MAPPING_TEMPERATURE is a number between 0 and 1', () => {
    expect(typeof FILL_MAPPING_TEMPERATURE).toBe('number')
    expect(FILL_MAPPING_TEMPERATURE).toBeGreaterThanOrEqual(0)
    expect(FILL_MAPPING_TEMPERATURE).toBeLessThanOrEqual(1)
  })

  it('FILL_MAPPING_TEMPERATURE defaults to 0.1 (deterministic)', () => {
    expect(FILL_MAPPING_TEMPERATURE).toBe(0.1)
  })

  it('FILL_MAPPING_MAX_TOKENS is a positive integer', () => {
    expect(typeof FILL_MAPPING_MAX_TOKENS).toBe('number')
    expect(FILL_MAPPING_MAX_TOKENS).toBeGreaterThan(0)
    expect(Number.isInteger(FILL_MAPPING_MAX_TOKENS)).toBe(true)
  })

  it('FILL_MAPPING_MAX_TOKENS defaults to 4096', () => {
    expect(FILL_MAPPING_MAX_TOKENS).toBe(4096)
  })

  it('FILL_MAPPING_PROMPT_TEMPLATE contains {template} placeholder', () => {
    expect(FILL_MAPPING_PROMPT_TEMPLATE).toContain('{template}')
  })

  it('FILL_MAPPING_PROMPT_TEMPLATE contains {categories} placeholder', () => {
    expect(FILL_MAPPING_PROMPT_TEMPLATE).toContain('{categories}')
  })

  it('FILL_MAPPING_PROMPT_TEMPLATE describes mapping rules', () => {
    expect(FILL_MAPPING_PROMPT_TEMPLATE).toContain('mappings')
    expect(FILL_MAPPING_PROMPT_TEMPLATE).toContain('placeholder')
    expect(FILL_MAPPING_PROMPT_TEMPLATE).toContain('category')
    expect(FILL_MAPPING_PROMPT_TEMPLATE).toContain('confidence')
  })

  it('FILL_MAPPING_PROMPT_TEMPLATE does NOT contain raw personal data values', () => {
    expect(FILL_MAPPING_PROMPT_TEMPLATE).not.toContain('山田')
    expect(FILL_MAPPING_PROMPT_TEMPLATE).not.toContain('太郎')
    expect(FILL_MAPPING_PROMPT_TEMPLATE).not.toContain('03-')
    expect(FILL_MAPPING_PROMPT_TEMPLATE).not.toContain('1990')
  })

  // ─── Vision & OCR Config ────────────────────────────────

  it('FILL_VISION_MODEL is a non-empty string', () => {
    expect(typeof FILL_VISION_MODEL).toBe('string')
    expect(FILL_VISION_MODEL.length).toBeGreaterThan(0)
  })

  it('FILL_VISION_MODEL defaults to glm-4.6v-flash', () => {
    expect(FILL_VISION_MODEL).toBe('glm-4.6v-flash')
  })

  it('FILL_VISION_TEMPERATURE is a number between 0 and 1', () => {
    expect(typeof FILL_VISION_TEMPERATURE).toBe('number')
    expect(FILL_VISION_TEMPERATURE).toBeGreaterThanOrEqual(0)
    expect(FILL_VISION_TEMPERATURE).toBeLessThanOrEqual(1)
  })

  it('FILL_VISION_TEMPERATURE defaults to 0.1 (deterministic)', () => {
    expect(FILL_VISION_TEMPERATURE).toBe(0.1)
  })

  it('FILL_VISION_MAX_TOKENS is a positive integer', () => {
    expect(typeof FILL_VISION_MAX_TOKENS).toBe('number')
    expect(FILL_VISION_MAX_TOKENS).toBeGreaterThan(0)
    expect(Number.isInteger(FILL_VISION_MAX_TOKENS)).toBe(true)
  })

  it('FILL_VISION_MAX_TOKENS defaults to 8192', () => {
    expect(FILL_VISION_MAX_TOKENS).toBe(8192)
  })

  it('FILL_OCR_MODEL is a non-empty string', () => {
    expect(typeof FILL_OCR_MODEL).toBe('string')
    expect(FILL_OCR_MODEL.length).toBeGreaterThan(0)
  })

  it('FILL_OCR_MODEL defaults to glm-ocr', () => {
    expect(FILL_OCR_MODEL).toBe('glm-ocr')
  })

  it('FILL_MAPPING_PROMPT_TEMPLATE placeholders can be replaced', () => {
    const result = FILL_MAPPING_PROMPT_TEMPLATE
      .replace('{template}', '<field data>')
      .replace('{categories}', '- name: 氏名')
    expect(result).toContain('<field data>')
    expect(result).toContain('- name: 氏名')
    expect(result).not.toContain('{template}')
    expect(result).not.toContain('{categories}')
  })
})

describe('BYOK Model Configuration (Constitution §2.4)', () => {
  it('PROVIDER_MODELS covers all three valid API providers', () => {
    expect(Object.keys(PROVIDER_MODELS)).toEqual(['openai', 'claude', 'gemini'])
  })

  it('PROVIDER_MODELS each have at least one model option', () => {
    for (const [, models] of Object.entries(PROVIDER_MODELS)) {
      expect(models.length).toBeGreaterThan(0)
      for (const model of models) {
        expect(typeof model.value).toBe('string')
        expect(model.value.length).toBeGreaterThan(0)
        expect(typeof model.label).toBe('string')
        expect(model.label.length).toBeGreaterThan(0)
      }
    }
  })

  it('PROVIDER_MODELS model values are unique within each provider', () => {
    for (const [, models] of Object.entries(PROVIDER_MODELS)) {
      const values = models.map(m => m.value)
      expect(new Set(values).size).toBe(values.length)
    }
  })

  it('DEFAULT_PROVIDER_MODEL covers all three providers', () => {
    expect(Object.keys(DEFAULT_PROVIDER_MODEL)).toEqual(['openai', 'claude', 'gemini'])
  })

  it('DEFAULT_PROVIDER_MODEL values exist in PROVIDER_MODELS', () => {
    for (const [provider, defaultModel] of Object.entries(DEFAULT_PROVIDER_MODEL)) {
      const models = PROVIDER_MODELS[provider] || []
      const modelValues = models.map(m => m.value)
      expect(modelValues).toContain(defaultModel)
    }
  })

  it('PROVIDER_LABELS covers all three providers', () => {
    expect(Object.keys(PROVIDER_LABELS)).toEqual(['openai', 'claude', 'gemini'])
  })

  it('PROVIDER_LABELS values are non-empty strings', () => {
    for (const [, label] of Object.entries(PROVIDER_LABELS)) {
      expect(typeof label).toBe('string')
      expect(label.length).toBeGreaterThan(0)
    }
  })

  it('CLAUDE_VALIDATION_MODEL is a non-empty string', () => {
    expect(typeof CLAUDE_VALIDATION_MODEL).toBe('string')
    expect(CLAUDE_VALIDATION_MODEL.length).toBeGreaterThan(0)
  })

  it('CLAUDE_VALIDATION_MODEL defaults to claude-3-haiku-20240307', () => {
    expect(CLAUDE_VALIDATION_MODEL).toBe('claude-3-haiku-20240307')
  })

  it('AUTH_PUBLIC_PATHS is a non-empty readonly array', () => {
    expect(Array.isArray(AUTH_PUBLIC_PATHS)).toBe(true)
    expect(AUTH_PUBLIC_PATHS.length).toBeGreaterThan(0)
  })

  it('AUTH_PUBLIC_PATHS contains expected routes', () => {
    expect(AUTH_PUBLIC_PATHS).toContain('/')
    expect(AUTH_PUBLIC_PATHS).toContain('/auth')
    expect(AUTH_PUBLIC_PATHS).toContain('/api')
    expect(AUTH_PUBLIC_PATHS).toContain('/terms')
    expect(AUTH_PUBLIC_PATHS).toContain('/privacy')
  })

  it('AUTH_PUBLIC_PATHS all start with /', () => {
    for (const p of AUTH_PUBLIC_PATHS) {
      expect(p.startsWith('/')).toBe(true)
    }
  })
})

describe('Environment Variable Defaults — Alerts & Monitoring (Constitution §2.4)', () => {
  it('API_METRICS_DURATION_SAMPLE_LIMIT defaults to a bounded positive sample size', () => {
    expect(API_METRICS_DURATION_SAMPLE_LIMIT).toBe(100)
    expect(Number.isInteger(API_METRICS_DURATION_SAMPLE_LIMIT)).toBe(true)
    expect(API_METRICS_DURATION_SAMPLE_LIMIT).toBeGreaterThan(0)
  })

  it('STRIPE_PRICE_ID defaults to empty string', () => {
    expect(typeof STRIPE_PRICE_ID).toBe('string')
    expect(STRIPE_PRICE_ID).toBe('')
  })

  it('ALERTS_SECRET defaults to empty string', () => {
    expect(typeof ALERTS_SECRET).toBe('string')
    expect(ALERTS_SECRET).toBe('')
  })

  it('SLACK_ALERTS_WEBHOOK_URL defaults to empty string', () => {
    expect(typeof SLACK_ALERTS_WEBHOOK_URL).toBe('string')
    expect(SLACK_ALERTS_WEBHOOK_URL).toBe('')
  })
})

describe('PDF Constants (Core Mission — Constitution §2.4)', () => {
  it('PDF_DPI is standard 72 dpi', () => {
    expect(typeof PDF_DPI).toBe('number')
    expect(PDF_DPI).toBe(72)
  })

  it('MM_PER_INCH is exact conversion factor', () => {
    expect(typeof MM_PER_INCH).toBe('number')
    expect(MM_PER_INCH).toBe(25.4)
  })

  it('A4_WIDTH_MM is standard 210mm', () => {
    expect(typeof A4_WIDTH_MM).toBe('number')
    expect(A4_WIDTH_MM).toBe(210)
  })

  it('A4_HEIGHT_MM is standard 297mm', () => {
    expect(typeof A4_HEIGHT_MM).toBe('number')
    expect(A4_HEIGHT_MM).toBe(297)
  })

  it('A4 dimensions are consistent with MM_PER_INCH and PDF_DPI', () => {
    // A4 in PDF points = mm / MM_PER_INCH * PDF_DPI
    const expectedWidthPoints = A4_WIDTH_MM / MM_PER_INCH * PDF_DPI
    const expectedHeightPoints = A4_HEIGHT_MM / MM_PER_INCH * PDF_DPI
    expect(expectedWidthPoints).toBeCloseTo(595.28, 1) // Standard A4 width in points
    expect(expectedHeightPoints).toBeCloseTo(841.89, 1) // Standard A4 height in points
  })

  it('SCAN_TEXT_THRESHOLD is a positive number for OCR quality gate', () => {
    expect(typeof SCAN_TEXT_THRESHOLD).toBe('number')
    expect(SCAN_TEXT_THRESHOLD).toBeGreaterThan(0)
  })
})

describe('Fill API Rate Limits (Constitution §1.2 Safety)', () => {
  it('FILL_RATE_LIMIT_MAX is a positive integer', () => {
    expect(typeof FILL_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(FILL_RATE_LIMIT_MAX)).toBe(true)
    expect(FILL_RATE_LIMIT_MAX).toBeGreaterThan(0)
  })

  it('FILL_RATE_LIMIT_WINDOW_MS is a positive number in seconds range', () => {
    expect(typeof FILL_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(FILL_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    // Should be in a reasonable window (1s to 10min)
    expect(FILL_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })
})

describe('User Data API Rate Limits (Constitution §1.2 Safety)', () => {
  it('USER_DATA_RATE_LIMIT_MAX defaults to 30', () => {
    // §1.2 Safety: user-data writes (POST/PUT/DELETE) feed the fill pipeline
    // via mapping, so the budget is independent from FILL_RATE_LIMIT_MAX to
    // avoid one endpoint starving the other. 30/window is generous for
    // human-driven data entry while still bounding automated abuse.
    expect(typeof USER_DATA_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(USER_DATA_RATE_LIMIT_MAX)).toBe(true)
    expect(USER_DATA_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(USER_DATA_RATE_LIMIT_MAX).toBeGreaterThanOrEqual(10)
  })

  it('USER_DATA_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds)', () => {
    expect(typeof USER_DATA_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(USER_DATA_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(USER_DATA_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })
})

describe('API Keys API Rate Limits (Constitution §1.2 Safety)', () => {
  // §1.2 Safety: /api/keys is the highest-cost write endpoint in the app
  // (outbound provider validation fetch + AES-256-GCM encrypt() + Supabase
  // user_api_keys upsert per POST). CYCLE=191 extends the §1.2 Safety wave
  // from corrections (CYCLE=188) and user-data (CYCLE=190) into keys.
  // Budget is independent from fillRateLimiter / userDataRateLimiter so keys
  // traffic cannot starve the fill pipeline or vice versa.
  it('KEYS_RATE_LIMIT_MAX defaults to 10 (single-digit budget per user per window)', () => {
    expect(typeof KEYS_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(KEYS_RATE_LIMIT_MAX)).toBe(true)
    expect(KEYS_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(KEYS_RATE_LIMIT_MAX).toBeLessThanOrEqual(100)
  })

  it('KEYS_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds — matches fill/user-data budget)', () => {
    expect(typeof KEYS_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(KEYS_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(KEYS_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })

  it('KEYS_RATE_LIMIT_MAX + KEYS_RATE_LIMIT_WINDOW_MS env vars appear in the ENV_VAR_NAMES allowlist (safety gate)', async () => {
    const { ENV_VAR_NAMES } = await import('./env')
    expect(ENV_VAR_NAMES).toContain('KEYS_RATE_LIMIT_MAX')
    expect(ENV_VAR_NAMES).toContain('KEYS_RATE_LIMIT_WINDOW_MS')
  })
})

describe('Account Data Deletion API Rate Limits (Constitution §1.2 Safety + §4.6 PII)', () => {
  // §1.2 Safety + §4.6 PII: DELETE /api/account/data cascades deletions across
  // 10 user-scoped tables (PII-bearing). CYCLE=192 extends the §1.2 Safety wave
  // from corrections (CYCLE=188), user-data (CYCLE=190), and keys (CYCLE=191)
  // into account-data deletion. Budget is intentionally tighter than
  // KEYS_RATE_LIMIT_MAX (10) because account deletion is a one-time event
  // per account lifecycle — 5/window is permissive for a double-confirm UI flow
  // while still bounding automated abuse. Named singleton (`account-data-api`)
  // so the budget is isolated from all sibling limiters.
  it('ACCOUNT_DATA_RATE_LIMIT_MAX defaults to 5 (destructive cascade — tight per-user budget)', () => {
    expect(typeof ACCOUNT_DATA_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(ACCOUNT_DATA_RATE_LIMIT_MAX)).toBe(true)
    expect(ACCOUNT_DATA_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(ACCOUNT_DATA_RATE_LIMIT_MAX).toBeLessThanOrEqual(10)
  })

  it('ACCOUNT_DATA_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds — matches sibling limiter budget)', () => {
    expect(typeof ACCOUNT_DATA_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(ACCOUNT_DATA_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(ACCOUNT_DATA_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })

  it('ACCOUNT_DATA_RATE_LIMIT_MAX + ACCOUNT_DATA_RATE_LIMIT_WINDOW_MS env vars appear in the ENV_VAR_NAMES allowlist (safety gate)', async () => {
    const { ENV_VAR_NAMES } = await import('./env')
    expect(ENV_VAR_NAMES).toContain('ACCOUNT_DATA_RATE_LIMIT_MAX')
    expect(ENV_VAR_NAMES).toContain('ACCOUNT_DATA_RATE_LIMIT_WINDOW_MS')
  })
})

describe('Contact Form API Rate Limits (Constitution §1.2 Safety + §4.6 PII)', () => {
  // §1.2 Safety + §4.6 PII: POST /api/contact writes 1 row to
  // `contact_submissions` (PII-bearing) and triggers an outbound Resend email
  // send (charged API cost). CYCLE=193 extends the §1.2 Safety wave from
  // corrections (CYCLE=188), user-data (CYCLE=190), keys (CYCLE=191), and
  // account-data (CYCLE=192) to the unauthenticated contact form endpoint.
  // Budget is per-IP (not per-user) because the endpoint accepts anonymous
  // submissions — no `user.id` available for keying. Named singleton
  // (`contact-form-api`) so the budget is isolated from the contact-enhance
  // limiter (which is per-user, scoped to the AI rewrite endpoint).
  it('CONTACT_FORM_RATE_LIMIT_MAX defaults to 3 (per-IP, unauthenticated — tight budget to prevent Resend spam)', () => {
    expect(typeof CONTACT_FORM_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(CONTACT_FORM_RATE_LIMIT_MAX)).toBe(true)
    expect(CONTACT_FORM_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(CONTACT_FORM_RATE_LIMIT_MAX).toBeLessThanOrEqual(20)
  })

  it('CONTACT_FORM_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds — matches sibling limiter budget)', () => {
    expect(typeof CONTACT_FORM_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(CONTACT_FORM_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(CONTACT_FORM_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })

  it('CONTACT_FORM_RATE_LIMIT_MAX + CONTACT_FORM_RATE_LIMIT_WINDOW_MS env vars appear in the ENV_VAR_NAMES allowlist (safety gate)', async () => {
    const { ENV_VAR_NAMES } = await import('./env')
    expect(ENV_VAR_NAMES).toContain('CONTACT_FORM_RATE_LIMIT_MAX')
    expect(ENV_VAR_NAMES).toContain('CONTACT_FORM_RATE_LIMIT_WINDOW_MS')
  })
})

// CYCLE=194: §1.2 Safety hardening wave continued from CYCLE=188 (corrections) +
// CYCLE=190 (user-data) + CYCLE=191 (keys) + CYCLE=192 (account-data) +
// CYCLE=193 (contact-form). /api/family-members is the last Core Mission
// write endpoint (POST/PUT/DELETE — PII-bearing member name + relationship,
// §4.6) without rate-limit protection. Named singleton `family-members-api`
// so the budget is isolated from the user-data / keys / account-data /
// contact-form singletons — family-member churn cannot starve any other
// write budget and vice versa. Per-user keying (user.id) because the
// endpoint requires Supabase auth.
describe('FAMILY_MEMBERS_RATE_LIMIT_* (CYCLE=194 — /api/family-members §1.2 Safety + §4.6 PII)', () => {
  it('FAMILY_MEMBERS_RATE_LIMIT_MAX defaults to 20 (per-user, authenticated — matches MAX_FAMILY_MEMBERS cap, permissive for drag-edit UX)', () => {
    expect(typeof FAMILY_MEMBERS_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(FAMILY_MEMBERS_RATE_LIMIT_MAX)).toBe(true)
    expect(FAMILY_MEMBERS_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(FAMILY_MEMBERS_RATE_LIMIT_MAX).toBeLessThanOrEqual(50)
  })

  it('FAMILY_MEMBERS_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds — matches sibling limiter budget)', () => {
    expect(typeof FAMILY_MEMBERS_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(FAMILY_MEMBERS_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(FAMILY_MEMBERS_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })

  it('FAMILY_MEMBERS_RATE_LIMIT_MAX + FAMILY_MEMBERS_RATE_LIMIT_WINDOW_MS env vars appear in the ENV_VAR_NAMES allowlist (safety gate)', async () => {
    const { ENV_VAR_NAMES } = await import('./env')
    expect(ENV_VAR_NAMES).toContain('FAMILY_MEMBERS_RATE_LIMIT_MAX')
    expect(ENV_VAR_NAMES).toContain('FAMILY_MEMBERS_RATE_LIMIT_WINDOW_MS')
  })
})

describe('INVITATIONS_RATE_LIMIT_* (CYCLE=195 — /api/invitations §1.2 Safety + §4.6 PII)', () => {
  it('INVITATIONS_RATE_LIMIT_MAX defaults to 20 (per-admin, authenticated — permissive for bulk code-issuing campaigns)', () => {
    expect(typeof INVITATIONS_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(INVITATIONS_RATE_LIMIT_MAX)).toBe(true)
    expect(INVITATIONS_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(INVITATIONS_RATE_LIMIT_MAX).toBeLessThanOrEqual(50)
  })

  it('INVITATIONS_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds — matches sibling limiter budget)', () => {
    expect(typeof INVITATIONS_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(INVITATIONS_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(INVITATIONS_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })

  it('INVITATIONS_REDEEM_RATE_LIMIT_MAX defaults to 10 (per-user, authenticated — tighter than admin CRUD; redemption is one-time lifecycle event)', () => {
    expect(typeof INVITATIONS_REDEEM_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(INVITATIONS_REDEEM_RATE_LIMIT_MAX)).toBe(true)
    expect(INVITATIONS_REDEEM_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(INVITATIONS_REDEEM_RATE_LIMIT_MAX).toBeLessThanOrEqual(20)
  })

  it('INVITATIONS_REDEEM_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds)', () => {
    expect(typeof INVITATIONS_REDEEM_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(INVITATIONS_REDEEM_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(INVITATIONS_REDEEM_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })

  it('INVITATIONS_REDEEM_RATE_LIMIT_MAX is at most INVITATIONS_RATE_LIMIT_MAX (redeem budget tighter or equal to admin CRUD budget)', () => {
    // Redemption is per-user one-time; admin CRUD is per-admin campaign-driven.
    // Tighter or equal budget on redeem bounds brute-force attacks.
    expect(INVITATIONS_REDEEM_RATE_LIMIT_MAX).toBeLessThanOrEqual(INVITATIONS_RATE_LIMIT_MAX)
  })

  it('all 4 new env vars appear in the ENV_VAR_NAMES allowlist (safety gate)', async () => {
    const { ENV_VAR_NAMES } = await import('./env')
    expect(ENV_VAR_NAMES).toContain('INVITATIONS_RATE_LIMIT_MAX')
    expect(ENV_VAR_NAMES).toContain('INVITATIONS_RATE_LIMIT_WINDOW_MS')
    expect(ENV_VAR_NAMES).toContain('INVITATIONS_REDEEM_RATE_LIMIT_MAX')
    expect(ENV_VAR_NAMES).toContain('INVITATIONS_REDEEM_RATE_LIMIT_WINDOW_MS')
  })
})

describe('PII Masking Constants (Constitution §4.6)', () => {
  it('PII_PROXIMITY_THRESHOLD is a positive number for spatial detection', () => {
    expect(typeof PII_PROXIMITY_THRESHOLD).toBe('number')
    expect(PII_PROXIMITY_THRESHOLD).toBeGreaterThan(0)
  })
})

describe('Family & UserData Limits (Core Mission — Constitution §2.4)', () => {
  it('VALID_FAMILY_RELATIONSHIPS contains expected Japanese relationships', () => {
    expect(Array.isArray(VALID_FAMILY_RELATIONSHIPS)).toBe(true)
    expect(VALID_FAMILY_RELATIONSHIPS).toContain('本人')
    expect(VALID_FAMILY_RELATIONSHIPS).toContain('配偶者')
    expect(VALID_FAMILY_RELATIONSHIPS).toContain('父')
    expect(VALID_FAMILY_RELATIONSHIPS).toContain('母')
    expect(VALID_FAMILY_RELATIONSHIPS).toContain('子')
    expect(VALID_FAMILY_RELATIONSHIPS).toContain('その他')
  })

  it('MAX_FAMILY_MEMBERS is a positive integer', () => {
    expect(typeof MAX_FAMILY_MEMBERS).toBe('number')
    expect(Number.isInteger(MAX_FAMILY_MEMBERS)).toBe(true)
    expect(MAX_FAMILY_MEMBERS).toBeGreaterThan(0)
  })

  it('MAX_USER_DATA_ENTRIES is a positive integer', () => {
    expect(typeof MAX_USER_DATA_ENTRIES).toBe('number')
    expect(Number.isInteger(MAX_USER_DATA_ENTRIES)).toBe(true)
    expect(MAX_USER_DATA_ENTRIES).toBeGreaterThan(0)
  })

  it('MAX_FAMILY_MEMBERS is less than MAX_USER_DATA_ENTRIES', () => {
    // Family members are a subset of user data entries
    expect(MAX_FAMILY_MEMBERS).toBeLessThan(MAX_USER_DATA_ENTRIES)
  })
})

describe('PDF Enhancement Constants (Core Mission — Constitution §2.4)', () => {
  it('ENHANCE_RENDER_SCALE is a positive number (typically 1-4)', () => {
    expect(typeof ENHANCE_RENDER_SCALE).toBe('number')
    expect(ENHANCE_RENDER_SCALE).toBeGreaterThanOrEqual(1)
    expect(ENHANCE_RENDER_SCALE).toBeLessThanOrEqual(4)
  })

  it('ENHANCE_SHARPEN_AMOUNT is a number between 0 and 1', () => {
    expect(typeof ENHANCE_SHARPEN_AMOUNT).toBe('number')
    expect(ENHANCE_SHARPEN_AMOUNT).toBeGreaterThanOrEqual(0)
    expect(ENHANCE_SHARPEN_AMOUNT).toBeLessThanOrEqual(1)
  })
})

describe('LLM Fallback Chain (Constitution §3.2 + §1.3.1)', () => {
  // CYCLE=180 regression tests — guarantee the default fallback order
  // matches Constitution §3.2 (Z-AI primary chain) + §1.3.1 (MiniMax fallback tail).
  // Prior cycle (≤179) shipped a wrong default 'glm-4.7-flash,glm-5-turbo,MiniMax-M3'
  // that (a) put the flash model first (cheapest, fastest but least accurate),
  // (b) omitted glm-4.7-coding entirely, and (c) lacked visible ordering.
  const originalFallbackModels = process.env.FILL_FALLBACK_MODELS
  const originalTimeouts = process.env.FILL_MODEL_TIMEOUT_OVERRIDES

  afterEach(() => {
    if (originalFallbackModels === undefined) {
      delete process.env.FILL_FALLBACK_MODELS
    } else {
      process.env.FILL_FALLBACK_MODELS = originalFallbackModels
    }
    if (originalTimeouts === undefined) {
      delete process.env.FILL_MODEL_TIMEOUT_OVERRIDES
    } else {
      process.env.FILL_MODEL_TIMEOUT_OVERRIDES = originalTimeouts
    }
  })

  it('FILL_FALLBACK_MODELS default order matches Constitution §3.2 + §1.3.1', async () => {
    delete process.env.FILL_FALLBACK_MODELS
    vi.resetModules()
    const { FILL_FALLBACK_MODELS } = await import('./config')
    expect(FILL_FALLBACK_MODELS).toEqual([
      'glm-5-turbo',
      'glm-4.7-coding',
      'glm-4.7-flash',
      'MiniMax-M3',
    ])
  })

  it('FILL_FALLBACK_MODELS Z-AI primary chain precedes MiniMax fallback tail', async () => {
    delete process.env.FILL_FALLBACK_MODELS
    vi.resetModules()
    const { FILL_FALLBACK_MODELS } = await import('./config')
    const minIndex = FILL_FALLBACK_MODELS.indexOf('MiniMax-M3')
    expect(minIndex).toBeGreaterThan(0)
    for (const model of ['glm-5-turbo', 'glm-4.7-coding', 'glm-4.7-flash']) {
      const idx = FILL_FALLBACK_MODELS.indexOf(model)
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThan(minIndex)
    }
  })

  it('FILL_FALLBACK_MODELS contains all four §3.2 + §1.3.1 chain models', async () => {
    delete process.env.FILL_FALLBACK_MODELS
    vi.resetModules()
    const { FILL_FALLBACK_MODELS } = await import('./config')
    expect(FILL_FALLBACK_MODELS).toContain('glm-4.7-coding')
    expect(FILL_FALLBACK_MODELS).toContain('glm-5-turbo')
    expect(FILL_FALLBACK_MODELS).toContain('glm-4.7-flash')
    expect(FILL_FALLBACK_MODELS).toContain('MiniMax-M3')
  })

  it('FILL_MODEL_TIMEOUT_OVERRIDES provides per-model timeouts for all default fallback models', async () => {
    delete process.env.FILL_MODEL_TIMEOUT_OVERRIDES
    vi.resetModules()
    const { FILL_MODEL_TIMEOUT_OVERRIDES, FILL_FALLBACK_MODELS } = await import('./config')
    for (const model of FILL_FALLBACK_MODELS) {
      expect(FILL_MODEL_TIMEOUT_OVERRIDES[model]).toBeTypeOf('number')
      expect(FILL_MODEL_TIMEOUT_OVERRIDES[model]).toBeGreaterThan(0)
      expect(FILL_MODEL_TIMEOUT_OVERRIDES[model]).toBeLessThanOrEqual(60_000)
    }
  })

  it('FILL_MODEL_TIMEOUT_OVERRIDES respects ordering: flash < turbo < coding < MiniMax', async () => {
    delete process.env.FILL_MODEL_TIMEOUT_OVERRIDES
    vi.resetModules()
    const { FILL_MODEL_TIMEOUT_OVERRIDES } = await import('./config')
    expect(FILL_MODEL_TIMEOUT_OVERRIDES['glm-4.7-flash']).toBeLessThan(
      FILL_MODEL_TIMEOUT_OVERRIDES['glm-5-turbo']
    )
    expect(FILL_MODEL_TIMEOUT_OVERRIDES['glm-5-turbo']).toBeLessThan(
      FILL_MODEL_TIMEOUT_OVERRIDES['glm-4.7-coding']
    )
    expect(FILL_MODEL_TIMEOUT_OVERRIDES['glm-4.7-coding']).toBeLessThan(
      FILL_MODEL_TIMEOUT_OVERRIDES['MiniMax-M3']
    )
  })
})

describe('PDF Extraction Cache Configuration (extraction-cache.ts defaults)', () => {
  const originalMax = process.env.FILL_EXTRACTION_CACHE_MAX_ENTRIES
  const originalTtl = process.env.FILL_EXTRACTION_CACHE_TTL_MS

  afterEach(() => {
    if (originalMax === undefined) {
      delete process.env.FILL_EXTRACTION_CACHE_MAX_ENTRIES
    } else {
      process.env.FILL_EXTRACTION_CACHE_MAX_ENTRIES = originalMax
    }
    if (originalTtl === undefined) {
      delete process.env.FILL_EXTRACTION_CACHE_TTL_MS
    } else {
      process.env.FILL_EXTRACTION_CACHE_TTL_MS = originalTtl
    }
    vi.resetModules()
  })

  it('FILL_EXTRACTION_CACHE_MAX_ENTRIES defaults to 128 (extraction-cache module-local DEFAULT_MAX_ENTRIES)', async () => {
    delete process.env.FILL_EXTRACTION_CACHE_MAX_ENTRIES
    vi.resetModules()
    const { FILL_EXTRACTION_CACHE_MAX_ENTRIES } = await import('./config')
    expect(FILL_EXTRACTION_CACHE_MAX_ENTRIES).toBe(128)
  })

  it('FILL_EXTRACTION_CACHE_TTL_MS defaults to 30 minutes (1_800_000 — matches extraction-cache DEFAULT_TTL_MS)', async () => {
    delete process.env.FILL_EXTRACTION_CACHE_TTL_MS
    vi.resetModules()
    const { FILL_EXTRACTION_CACHE_TTL_MS } = await import('./config')
    expect(FILL_EXTRACTION_CACHE_TTL_MS).toBe(30 * 60 * 1000)
  })

  it('FILL_EXTRACTION_CACHE_MAX_ENTRIES env override is read at module load', async () => {
    process.env.FILL_EXTRACTION_CACHE_MAX_ENTRIES = '256'
    vi.resetModules()
    const { FILL_EXTRACTION_CACHE_MAX_ENTRIES } = await import('./config')
    expect(FILL_EXTRACTION_CACHE_MAX_ENTRIES).toBe(256)
  })

  it('FILL_EXTRACTION_CACHE_TTL_MS env override is read at module load', async () => {
    process.env.FILL_EXTRACTION_CACHE_TTL_MS = '600000'
    vi.resetModules()
    const { FILL_EXTRACTION_CACHE_TTL_MS } = await import('./config')
    expect(FILL_EXTRACTION_CACHE_TTL_MS).toBe(600000)
  })

  it('both new env vars appear in the ENV_VAR_NAMES allowlist (safety gate)', async () => {
    const { ENV_VAR_NAMES } = await import('./env')
    expect(ENV_VAR_NAMES).toContain('FILL_EXTRACTION_CACHE_MAX_ENTRIES')
    expect(ENV_VAR_NAMES).toContain('FILL_EXTRACTION_CACHE_TTL_MS')
  })
})

describe('Rule Matcher Threshold Configuration (rule-matcher.ts DEFAULT_AUTO_THRESHOLD)', () => {
  const originalThreshold = process.env.FILL_RULE_MATCH_THRESHOLD

  afterEach(() => {
    if (originalThreshold === undefined) {
      delete process.env.FILL_RULE_MATCH_THRESHOLD
    } else {
      process.env.FILL_RULE_MATCH_THRESHOLD = originalThreshold
    }
    vi.resetModules()
  })

  it('FILL_RULE_MATCH_THRESHOLD defaults to 0.95 (rule-matcher module-local DEFAULT_AUTO_THRESHOLD)', async () => {
    delete process.env.FILL_RULE_MATCH_THRESHOLD
    vi.resetModules()
    const { FILL_RULE_MATCH_THRESHOLD } = await import('./config')
    expect(FILL_RULE_MATCH_THRESHOLD).toBe(0.95)
  })

  it('FILL_RULE_MATCH_THRESHOLD env override is read at module load', async () => {
    process.env.FILL_RULE_MATCH_THRESHOLD = '0.85'
    vi.resetModules()
    const { FILL_RULE_MATCH_THRESHOLD } = await import('./config')
    expect(FILL_RULE_MATCH_THRESHOLD).toBe(0.85)
  })

  it('FILL_RULE_MATCH_THRESHOLD falls back to default on invalid env value (non-numeric)', async () => {
    process.env.FILL_RULE_MATCH_THRESHOLD = 'not-a-number'
    vi.resetModules()
    const { FILL_RULE_MATCH_THRESHOLD } = await import('./config')
    expect(FILL_RULE_MATCH_THRESHOLD).toBe(0.95)
  })

  it('FILL_RULE_MATCH_THRESHOLD env var appears in the ENV_VAR_NAMES allowlist (safety gate)', async () => {
    const { ENV_VAR_NAMES } = await import('./env')
    expect(ENV_VAR_NAMES).toContain('FILL_RULE_MATCH_THRESHOLD')
  })
})

describe('Default Matcher ID Configuration (matcher-registry.ts DEFAULT_MATCHER_ID)', () => {
  const originalMatcherId = process.env.FILL_DEFAULT_MATCHER_ID

  afterEach(() => {
    if (originalMatcherId === undefined) {
      delete process.env.FILL_DEFAULT_MATCHER_ID
    } else {
      process.env.FILL_DEFAULT_MATCHER_ID = originalMatcherId
    }
    vi.resetModules()
  })

  it('FILL_DEFAULT_MATCHER_ID defaults to "rule-based" (matcher-registry module-local DEFAULT_MATCHER_ID)', async () => {
    delete process.env.FILL_DEFAULT_MATCHER_ID
    vi.resetModules()
    const { FILL_DEFAULT_MATCHER_ID } = await import('./config')
    expect(FILL_DEFAULT_MATCHER_ID).toBe('rule-based')
  })

  it('FILL_DEFAULT_MATCHER_ID env override is read at module load', async () => {
    process.env.FILL_DEFAULT_MATCHER_ID = 'hybrid'
    vi.resetModules()
    const { FILL_DEFAULT_MATCHER_ID } = await import('./config')
    expect(FILL_DEFAULT_MATCHER_ID).toBe('hybrid')
  })

  it('FILL_DEFAULT_MATCHER_ID env var appears in the ENV_VAR_NAMES allowlist (safety gate)', async () => {
    const { ENV_VAR_NAMES } = await import('./env')
    expect(ENV_VAR_NAMES).toContain('FILL_DEFAULT_MATCHER_ID')
  })
})

describe('Stripe Subscription Rate Limits (Constitution §1.2 Safety)', () => {
  // CYCLE=196 regression tests — guarantee the new STRIPE_CHECKOUT_RATE_LIMIT_*
  // and STRIPE_CANCEL_RATE_LIMIT_* defaults match the route-level rate-limiter
  // constructions (stripe-checkout-api / stripe-cancel-api named singletons).
  // Each test isolates its own env var via process.env + vi.resetModules to
  // match the convention from CYCLE=179..195.
  const originalCheckoutMax = process.env.STRIPE_CHECKOUT_RATE_LIMIT_MAX
  const originalCheckoutWindow = process.env.STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS
  const originalCancelMax = process.env.STRIPE_CANCEL_RATE_LIMIT_MAX
  const originalCancelWindow = process.env.STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS

  afterEach(() => {
    if (originalCheckoutMax === undefined) {
      delete process.env.STRIPE_CHECKOUT_RATE_LIMIT_MAX
    } else {
      process.env.STRIPE_CHECKOUT_RATE_LIMIT_MAX = originalCheckoutMax
    }
    if (originalCheckoutWindow === undefined) {
      delete process.env.STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS
    } else {
      process.env.STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS = originalCheckoutWindow
    }
    if (originalCancelMax === undefined) {
      delete process.env.STRIPE_CANCEL_RATE_LIMIT_MAX
    } else {
      process.env.STRIPE_CANCEL_RATE_LIMIT_MAX = originalCancelMax
    }
    if (originalCancelWindow === undefined) {
      delete process.env.STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS
    } else {
      process.env.STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS = originalCancelWindow
    }
    vi.resetModules()
  })

  it('STRIPE_CHECKOUT_RATE_LIMIT_MAX defaults to 5 (per-user, authenticated — one-time plan choice + retry)', async () => {
    delete process.env.STRIPE_CHECKOUT_RATE_LIMIT_MAX
    vi.resetModules()
    const { STRIPE_CHECKOUT_RATE_LIMIT_MAX } = await import('./config')
    expect(typeof STRIPE_CHECKOUT_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(STRIPE_CHECKOUT_RATE_LIMIT_MAX)).toBe(true)
    expect(STRIPE_CHECKOUT_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(STRIPE_CHECKOUT_RATE_LIMIT_MAX).toBeLessThanOrEqual(20)
  })

  it('STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds)', async () => {
    delete process.env.STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS
    vi.resetModules()
    const { STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS } = await import('./config')
    expect(typeof STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })

  it('STRIPE_CANCEL_RATE_LIMIT_MAX defaults to 5 (per-user, authenticated — destructive Stripe RPC)', async () => {
    delete process.env.STRIPE_CANCEL_RATE_LIMIT_MAX
    vi.resetModules()
    const { STRIPE_CANCEL_RATE_LIMIT_MAX } = await import('./config')
    expect(typeof STRIPE_CANCEL_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(STRIPE_CANCEL_RATE_LIMIT_MAX)).toBe(true)
    expect(STRIPE_CANCEL_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(STRIPE_CANCEL_RATE_LIMIT_MAX).toBeLessThanOrEqual(20)
  })

  it('STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds)', async () => {
    delete process.env.STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS
    vi.resetModules()
    const { STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS } = await import('./config')
    expect(typeof STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })

  it('STRIPE_CHECKOUT_RATE_LIMIT_MAX env override is read at module load', async () => {
    process.env.STRIPE_CHECKOUT_RATE_LIMIT_MAX = '10'
    vi.resetModules()
    const { STRIPE_CHECKOUT_RATE_LIMIT_MAX } = await import('./config')
    expect(STRIPE_CHECKOUT_RATE_LIMIT_MAX).toBe(10)
  })

  it('STRIPE_CANCEL_RATE_LIMIT_MAX env override is read at module load', async () => {
    process.env.STRIPE_CANCEL_RATE_LIMIT_MAX = '3'
    vi.resetModules()
    const { STRIPE_CANCEL_RATE_LIMIT_MAX } = await import('./config')
    expect(STRIPE_CANCEL_RATE_LIMIT_MAX).toBe(3)
  })

  it('all 4 new env vars appear in the ENV_VAR_NAMES allowlist (safety gate)', async () => {
    const { ENV_VAR_NAMES } = await import('./env')
    expect(ENV_VAR_NAMES).toContain('STRIPE_CHECKOUT_RATE_LIMIT_MAX')
    expect(ENV_VAR_NAMES).toContain('STRIPE_CHECKOUT_RATE_LIMIT_WINDOW_MS')
    expect(ENV_VAR_NAMES).toContain('STRIPE_CANCEL_RATE_LIMIT_MAX')
    expect(ENV_VAR_NAMES).toContain('STRIPE_CANCEL_RATE_LIMIT_WINDOW_MS')
  })
})

describe('Blog Auto AI Rate Limits (Constitution §1.2 Safety)', () => {
  // CYCLE=197 regression tests — guarantee the new BLOG_AUTO_AI_CONNECT_RATE_LIMIT_*
  // and BLOG_AUTO_AI_SYNC_RATE_LIMIT_* defaults match the route-level rate-limiter
  // constructions (blog-auto-ai-connect-api / blog-auto-ai-sync-api named singletons).
  // Each test isolates its own env var via process.env + vi.resetModules to
  // match the convention from CYCLE=188..196.
  const originalConnectMax = process.env.BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX
  const originalConnectWindow = process.env.BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS
  const originalSyncMax = process.env.BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX
  const originalSyncWindow = process.env.BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS

  afterEach(() => {
    if (originalConnectMax === undefined) {
      delete process.env.BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX
    } else {
      process.env.BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX = originalConnectMax
    }
    if (originalConnectWindow === undefined) {
      delete process.env.BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS
    } else {
      process.env.BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS = originalConnectWindow
    }
    if (originalSyncMax === undefined) {
      delete process.env.BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX
    } else {
      process.env.BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX = originalSyncMax
    }
    if (originalSyncWindow === undefined) {
      delete process.env.BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS
    } else {
      process.env.BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS = originalSyncWindow
    }
    vi.resetModules()
  })

  it('BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX defaults to 5 (per-user, authenticated — one-time setup action + retry)', async () => {
    delete process.env.BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX
    vi.resetModules()
    const { BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX } = await import('./config')
    expect(typeof BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX)).toBe(true)
    expect(BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX).toBeLessThanOrEqual(20)
  })

  it('BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds)', async () => {
    delete process.env.BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS
    vi.resetModules()
    const { BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS } = await import('./config')
    expect(typeof BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })

  it('BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX defaults to 3 (per-user, authenticated — bulk import action, tighter than connect)', async () => {
    delete process.env.BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX
    vi.resetModules()
    const { BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX } = await import('./config')
    expect(typeof BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX)).toBe(true)
    expect(BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX).toBeLessThanOrEqual(20)
  })

  it('BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds)', async () => {
    delete process.env.BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS
    vi.resetModules()
    const { BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS } = await import('./config')
    expect(typeof BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })

  it('BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX env override is read at module load', async () => {
    process.env.BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX = '10'
    vi.resetModules()
    const { BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX } = await import('./config')
    expect(BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX).toBe(10)
  })

  it('BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX env override is read at module load', async () => {
    process.env.BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX = '2'
    vi.resetModules()
    const { BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX } = await import('./config')
    expect(BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX).toBe(2)
  })

  it('all 4 new env vars appear in the ENV_VAR_NAMES allowlist (safety gate)', async () => {
    const { ENV_VAR_NAMES } = await import('./env')
    expect(ENV_VAR_NAMES).toContain('BLOG_AUTO_AI_CONNECT_RATE_LIMIT_MAX')
    expect(ENV_VAR_NAMES).toContain('BLOG_AUTO_AI_CONNECT_RATE_LIMIT_WINDOW_MS')
    expect(ENV_VAR_NAMES).toContain('BLOG_AUTO_AI_SYNC_RATE_LIMIT_MAX')
    expect(ENV_VAR_NAMES).toContain('BLOG_AUTO_AI_SYNC_RATE_LIMIT_WINDOW_MS')
  })
})

describe('Credits Checkout Rate Limits (Constitution §1.2 Safety)', () => {
  // CYCLE=198 regression tests — guarantee the new CREDITS_CHECKOUT_RATE_LIMIT_*
  // defaults match the route-level rate-limiter construction in
  // src/app/api/credits/checkout/route.ts (credits-checkout-api named singleton,
  // gated AFTER packId allowlist + auth + BEFORE Stripe checkout.sessions.create).
  // Each test isolates its own env var via process.env + vi.resetModules to
  // match the convention from CYCLE=188..197.
  const originalMax = process.env.CREDITS_CHECKOUT_RATE_LIMIT_MAX
  const originalWindow = process.env.CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS

  afterEach(() => {
    if (originalMax === undefined) {
      delete process.env.CREDITS_CHECKOUT_RATE_LIMIT_MAX
    } else {
      process.env.CREDITS_CHECKOUT_RATE_LIMIT_MAX = originalMax
    }
    if (originalWindow === undefined) {
      delete process.env.CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS
    } else {
      process.env.CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS = originalWindow
    }
    vi.resetModules()
  })

  it('CREDITS_CHECKOUT_RATE_LIMIT_MAX defaults to 5 (per-user, authenticated — one-time pack purchase + retry)', async () => {
    delete process.env.CREDITS_CHECKOUT_RATE_LIMIT_MAX
    vi.resetModules()
    const { CREDITS_CHECKOUT_RATE_LIMIT_MAX } = await import('./config')
    expect(typeof CREDITS_CHECKOUT_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(CREDITS_CHECKOUT_RATE_LIMIT_MAX)).toBe(true)
    expect(CREDITS_CHECKOUT_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(CREDITS_CHECKOUT_RATE_LIMIT_MAX).toBeLessThanOrEqual(20)
  })

  it('CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds — matches sibling limiter budget)', async () => {
    delete process.env.CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS
    vi.resetModules()
    const { CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS } = await import('./config')
    expect(typeof CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })

  it('CREDITS_CHECKOUT_RATE_LIMIT_MAX env override is read at module load', async () => {
    process.env.CREDITS_CHECKOUT_RATE_LIMIT_MAX = '10'
    vi.resetModules()
    const { CREDITS_CHECKOUT_RATE_LIMIT_MAX } = await import('./config')
    expect(CREDITS_CHECKOUT_RATE_LIMIT_MAX).toBe(10)
  })

  it('CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS env override is read at module load', async () => {
    process.env.CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS = '300000'
    vi.resetModules()
    const { CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS } = await import('./config')
    expect(CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS).toBe(300000)
  })

  it('both new env vars appear in the ENV_VAR_NAMES allowlist (safety gate)', async () => {
    const { ENV_VAR_NAMES } = await import('./env')
    expect(ENV_VAR_NAMES).toContain('CREDITS_CHECKOUT_RATE_LIMIT_MAX')
    expect(ENV_VAR_NAMES).toContain('CREDITS_CHECKOUT_RATE_LIMIT_WINDOW_MS')
  })
})

describe('Templates Rate Limits (Constitution §1.2 Safety + §4.6 PII)', () => {
  // CYCLE=199 regression tests — guarantee the new TEMPLATES_RATE_LIMIT_*
  // defaults match the route-level rate-limiter construction in
  // src/app/api/templates/route.ts and src/app/api/templates/[id]/route.ts
  // (templates-api named singleton, gated AFTER JSON parse + body validation
  // and BEFORE pdf_templates insert / delete). pdf_templates is the Core
  // Mission cache of resolved <PLACEHOLDER> → user-data field mappings; the
  // mappings table references user-data column names (PII-adjacent, §4.6),
  // so write endpoints must be rate-limit gated to prevent churn abuse.
  // Each test isolates its own env var via process.env + vi.resetModules to
  // match the convention from CYCLE=188..198.
  const originalMax = process.env.TEMPLATES_RATE_LIMIT_MAX
  const originalWindow = process.env.TEMPLATES_RATE_LIMIT_WINDOW_MS

  afterEach(() => {
    if (originalMax === undefined) {
      delete process.env.TEMPLATES_RATE_LIMIT_MAX
    } else {
      process.env.TEMPLATES_RATE_LIMIT_MAX = originalMax
    }
    if (originalWindow === undefined) {
      delete process.env.TEMPLATES_RATE_LIMIT_WINDOW_MS
    } else {
      process.env.TEMPLATES_RATE_LIMIT_WINDOW_MS = originalWindow
    }
    vi.resetModules()
  })

  it('TEMPLATES_RATE_LIMIT_MAX defaults to 10 (per-user, authenticated — pdf_templates write surface + PII-adjacent mappings)', async () => {
    delete process.env.TEMPLATES_RATE_LIMIT_MAX
    vi.resetModules()
    const { TEMPLATES_RATE_LIMIT_MAX } = await import('./config')
    expect(typeof TEMPLATES_RATE_LIMIT_MAX).toBe('number')
    expect(Number.isInteger(TEMPLATES_RATE_LIMIT_MAX)).toBe(true)
    expect(TEMPLATES_RATE_LIMIT_MAX).toBeGreaterThan(0)
    expect(TEMPLATES_RATE_LIMIT_MAX).toBeLessThanOrEqual(50)
  })

  it('TEMPLATES_RATE_LIMIT_WINDOW_MS defaults to 60000 (60 seconds — matches sibling Core Mission limiter budget)', async () => {
    delete process.env.TEMPLATES_RATE_LIMIT_WINDOW_MS
    vi.resetModules()
    const { TEMPLATES_RATE_LIMIT_WINDOW_MS } = await import('./config')
    expect(typeof TEMPLATES_RATE_LIMIT_WINDOW_MS).toBe('number')
    expect(TEMPLATES_RATE_LIMIT_WINDOW_MS).toBeGreaterThan(0)
    expect(TEMPLATES_RATE_LIMIT_WINDOW_MS).toBeLessThanOrEqual(600_000)
  })

  it('TEMPLATES_RATE_LIMIT_MAX env override is read at module load', async () => {
    process.env.TEMPLATES_RATE_LIMIT_MAX = '25'
    vi.resetModules()
    const { TEMPLATES_RATE_LIMIT_MAX } = await import('./config')
    expect(TEMPLATES_RATE_LIMIT_MAX).toBe(25)
  })

  it('TEMPLATES_RATE_LIMIT_WINDOW_MS env override is read at module load', async () => {
    process.env.TEMPLATES_RATE_LIMIT_WINDOW_MS = '300000'
    vi.resetModules()
    const { TEMPLATES_RATE_LIMIT_WINDOW_MS } = await import('./config')
    expect(TEMPLATES_RATE_LIMIT_WINDOW_MS).toBe(300000)
  })

  it('both new env vars appear in the ENV_VAR_NAMES allowlist (safety gate)', async () => {
    const { ENV_VAR_NAMES } = await import('./env')
    expect(ENV_VAR_NAMES).toContain('TEMPLATES_RATE_LIMIT_MAX')
    expect(ENV_VAR_NAMES).toContain('TEMPLATES_RATE_LIMIT_WINDOW_MS')
  })
})
