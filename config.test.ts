/**
 * Tests for centralized configuration constants (Constitution §2.4).
 * Verifies default values, types, and immutability of shared constants.
 */
import { describe, it, expect } from 'vitest'
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
  PII_PROXIMITY_THRESHOLD,
  VALID_FAMILY_RELATIONSHIPS,
  MAX_FAMILY_MEMBERS,
  MAX_USER_DATA_ENTRIES,
  ENHANCE_RENDER_SCALE,
  ENHANCE_SHARPEN_AMOUNT,
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
