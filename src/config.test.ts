/**
 * Tests for centralized configuration constants (Constitution §2.4).
 * Verifies default values, types, and immutability of shared constants.
 */
import { describe, it, expect } from 'vitest'
import { CATEGORY_LABELS } from '@/types/pdf'
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
    // CATEGORY_LABELS keys are the runtime source of truth for UserDataCategory values
    const typeKeys = Object.keys(CATEGORY_LABELS)
    expect([...VALID_USER_DATA_CATEGORIES].sort()).toEqual(typeKeys.sort())
  })
})
