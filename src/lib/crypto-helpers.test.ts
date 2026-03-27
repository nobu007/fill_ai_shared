/**
 * Unit tests for migration-safe crypto helpers.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { safeDecrypt, safeEncrypt } from './crypto-helpers'

// Mock dependencies
vi.mock('./crypto', () => ({
  encrypt: vi.fn(),
  decrypt: vi.fn(),
  isEncrypted: vi.fn(),
  getEncryptionKey: vi.fn(),
}))

vi.mock('./logger', () => ({
  logger: {
    error: vi.fn(),
  },
}))

describe('safeDecrypt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return empty string for null input', () => {
    const result = safeDecrypt(null)
    expect(result).toBe('')
  })

  it('should return empty string for undefined input', () => {
    const result = safeDecrypt(undefined)
    expect(result).toBe('')
  })

  it('should return empty string for empty string', () => {
    const result = safeDecrypt('')
    expect(result).toBe('')
  })

  it('should return plaintext value when not encrypted', async () => {
    const { isEncrypted } = await import('./crypto')
    vi.mocked(isEncrypted).mockReturnValue(false)

    const plaintext = 'hello world'
    const result = safeDecrypt(plaintext)

    expect(result).toBe(plaintext)
    expect(isEncrypted).toHaveBeenCalledWith(plaintext)
  })

  it('should decrypt encrypted value successfully', async () => {
    const { isEncrypted, decrypt, getEncryptionKey } = await import('./crypto')
    const encrypted = 'encrypted_base64_string'
    const decrypted = 'decrypted value'
    const testKey = 'test-key'

    vi.mocked(isEncrypted).mockReturnValue(true)
    vi.mocked(getEncryptionKey).mockReturnValue(testKey)
    vi.mocked(decrypt).mockReturnValue(decrypted)

    const result = safeDecrypt(encrypted)

    expect(result).toBe(decrypted)
    expect(isEncrypted).toHaveBeenCalledWith(encrypted)
    expect(getEncryptionKey).toHaveBeenCalled()
    expect(decrypt).toHaveBeenCalledWith(encrypted, testKey)
  })

  it('should return original value when decryption fails', async () => {
    const { isEncrypted, decrypt, getEncryptionKey } = await import('./crypto')
    const { logger } = await import('./logger')
    const encrypted = 'encrypted_base64_string'
    const testKey = 'test-key'
    const error = new Error('Decryption failed')

    vi.mocked(isEncrypted).mockReturnValue(true)
    vi.mocked(getEncryptionKey).mockReturnValue(testKey)
    vi.mocked(decrypt).mockImplementation(() => {
      throw error
    })

    const result = safeDecrypt(encrypted)

    expect(result).toBe(encrypted)
    expect(logger.error).toHaveBeenCalledWith(
      'crypto/safe-decrypt',
      'Decryption failed, returning raw value',
      error
    )
  })

  it('should handle various plaintext formats', async () => {
    const { isEncrypted } = await import('./crypto')
    vi.mocked(isEncrypted).mockReturnValue(false)

    const testCases = [
      'simple text',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', // JWT-like
      'sk-proj-abc123def456', // API key-like
      '日本語のテキスト',
      'special chars: <>&"\'',
      '',
    ]

    for (const testCase of testCases) {
      const result = safeDecrypt(testCase)
      expect(result).toBe(testCase)
    }
  })
})

describe('safeEncrypt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should encrypt value successfully when ENCRYPTION_KEY is set', async () => {
    const { encrypt, getEncryptionKey } = await import('./crypto')
    const plaintext = 'secret value'
    const encrypted = 'encrypted_base64_string'
    const testKey = 'test-key'

    vi.mocked(getEncryptionKey).mockReturnValue(testKey)
    vi.mocked(encrypt).mockReturnValue(encrypted)

    const result = safeEncrypt(plaintext)

    expect(result).toBe(encrypted)
    expect(getEncryptionKey).toHaveBeenCalled()
    expect(encrypt).toHaveBeenCalledWith(plaintext, testKey)
  })

  it('should return plaintext when encryption fails', async () => {
    const { encrypt, getEncryptionKey } = await import('./crypto')
    const plaintext = 'secret value'
    const testKey = 'test-key'

    vi.mocked(getEncryptionKey).mockReturnValue(testKey)
    vi.mocked(encrypt).mockImplementation(() => {
      throw new Error('Encryption failed')
    })

    const result = safeEncrypt(plaintext)

    expect(result).toBe(plaintext)
  })

  it('should handle empty string', async () => {
    const { encrypt, getEncryptionKey } = await import('./crypto')
    const encrypted = 'encrypted_empty'
    const testKey = 'test-key'

    vi.mocked(getEncryptionKey).mockReturnValue(testKey)
    vi.mocked(encrypt).mockReturnValue(encrypted)

    const result = safeEncrypt('')

    expect(result).toBe(encrypted)
    expect(encrypt).toHaveBeenCalledWith('', testKey)
  })

  it('should handle various string formats', async () => {
    const { encrypt, getEncryptionKey } = await import('./crypto')
    const testKey = 'test-key'

    vi.mocked(getEncryptionKey).mockReturnValue(testKey)
    vi.mocked(encrypt).mockImplementation((value: string) => `encrypted_${value}`)

    const testCases = [
      'simple text',
      'JWT-like-token-string',
      'sk-proj-api-key',
      '日本語',
      'special: <>&"\'',
      'multi\nline\ntext',
    ]

    for (const testCase of testCases) {
      const result = safeEncrypt(testCase)
      expect(result).toBe(`encrypted_${testCase}`)
    }
  })

  it('should handle unicode and special characters', async () => {
    const { encrypt, getEncryptionKey } = await import('./crypto')
    const testKey = 'test-key'
    const specialText = '🔐 encrypted with emoji 日本語'

    vi.mocked(getEncryptionKey).mockReturnValue(testKey)
    vi.mocked(encrypt).mockReturnValue('encrypted_special')

    const result = safeEncrypt(specialText)

    expect(result).toBe('encrypted_special')
    expect(encrypt).toHaveBeenCalledWith(specialText, testKey)
  })
})

describe('integration scenarios', () => {
  it('should handle encrypt-decrypt round trip', async () => {
    const { encrypt, decrypt, isEncrypted, getEncryptionKey } = await import('./crypto')
    const testKey = 'test-key'
    const plaintext = 'round trip test'
    const encrypted = 'encrypted_round_trip'

    vi.mocked(getEncryptionKey).mockReturnValue(testKey)
    vi.mocked(encrypt).mockReturnValue(encrypted)
    vi.mocked(isEncrypted).mockReturnValue(true)
    vi.mocked(decrypt).mockReturnValue(plaintext)

    const encryptedResult = safeEncrypt(plaintext)
    const decryptedResult = safeDecrypt(encryptedResult)

    expect(encryptedResult).toBe(encrypted)
    expect(decryptedResult).toBe(plaintext)
  })

  it('should handle migration scenario (mixed encrypted/plaintext)', async () => {
    const { isEncrypted, decrypt, getEncryptionKey } = await import('./crypto')
    const testKey = 'test-key'

    vi.mocked(getEncryptionKey).mockReturnValue(testKey)

    // Old plaintext value (pre-migration)
    vi.mocked(isEncrypted).mockReturnValue(false)
    const result1 = safeDecrypt('old plaintext value')
    expect(result1).toBe('old plaintext value')

    // New encrypted value (post-migration)
    vi.mocked(isEncrypted).mockReturnValue(true)
    vi.mocked(decrypt).mockReturnValue('decrypted value')
    const result2 = safeDecrypt('encrypted_value')
    expect(result2).toBe('decrypted value')
  })

  it('should gracefully handle missing encryption key during decryption', async () => {
    const { isEncrypted, getEncryptionKey } = await import('./crypto')
    const { logger } = await import('./logger')

    vi.mocked(isEncrypted).mockReturnValue(true)
    vi.mocked(getEncryptionKey).mockImplementation(() => {
      throw new Error('ENCRYPTION_KEY not set')
    })

    const encryptedValue = 'some_encrypted_value'
    const result = safeDecrypt(encryptedValue)

    expect(result).toBe(encryptedValue)
    expect(logger.error).toHaveBeenCalled()
  })

  it('should gracefully handle missing encryption key during encryption', async () => {
    const { getEncryptionKey } = await import('./crypto')

    vi.mocked(getEncryptionKey).mockImplementation(() => {
      throw new Error('ENCRYPTION_KEY not set')
    })

    const plaintext = 'secret value'
    const result = safeEncrypt(plaintext)

    expect(result).toBe(plaintext)
  })
})
