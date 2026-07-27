import { describe, it, expect, vi, beforeEach } from 'vitest'
import { safeDecrypt, safeEncrypt } from './crypto-helpers'
import { encrypt, decrypt, isEncrypted, getEncryptionKey } from './crypto'
import { logger } from './logger'

vi.mock('./crypto')
vi.mock('./logger')

describe('crypto-helpers', () => {
  const mockEncrypt = vi.mocked(encrypt)
  const mockDecrypt = vi.mocked(decrypt)
  const mockIsEncrypted = vi.mocked(isEncrypted)
  const mockLogger = vi.mocked(logger)
  const mockGetEncryptionKey = vi.mocked(getEncryptionKey)

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetEncryptionKey.mockReturnValue('test-key')
  })

  describe('safeDecrypt', () => {
    it('should return empty string for null/undefined input', () => {
      expect(safeDecrypt(null)).toBe('')
      expect(safeDecrypt(undefined)).toBe('')
    })

    it('should return plain text if not encrypted', () => {
      mockIsEncrypted.mockReturnValue(false)
      expect(safeDecrypt('plain text')).toBe('plain text')
    })

    it('should decrypt encrypted text successfully', () => {
      const encryptedText = 'encrypted-data'
      const decryptedText = 'plain text'
      
      mockIsEncrypted.mockReturnValue(true)
      mockDecrypt.mockReturnValue(decryptedText)
      
      expect(safeDecrypt(encryptedText)).toBe(decryptedText)
      expect(mockDecrypt).toHaveBeenCalledWith(encryptedText, 'test-key')
    })

    it('should return empty string on decryption failure', () => {
      const encryptedText = 'encrypted-data'
      
      mockIsEncrypted.mockReturnValue(true)
      mockDecrypt.mockImplementation(() => {
        throw new Error('Decryption failed')
      })
      
      expect(safeDecrypt(encryptedText)).toBe('')
      expect(mockLogger.error).toHaveBeenCalledWith(
        'crypto/safe-decrypt',
        'Decryption failed, returning empty string',
        expect.any(Object)
      )
    })
  })

  describe('safeEncrypt', () => {
    it('should encrypt successfully when key is available', () => {
      const plainText = 'plain text'
      const encryptedText = 'encrypted-data'
      
      mockEncrypt.mockReturnValue(encryptedText)
      
      expect(safeEncrypt(plainText)).toBe(encryptedText)
      expect(mockEncrypt).toHaveBeenCalledWith(plainText, 'test-key')
    })

    it('should throw on encryption failure', () => {
      const plainText = 'plain text'

      mockEncrypt.mockImplementation(() => {
        throw new Error('Encryption failed')
      })

      // §4.6 CYCLE=80: the rethrown Error message is now fixed ('Encryption failed')
      // — previously concatenated the raw err.message which could echo plaintext.
      expect(() => safeEncrypt(plainText)).toThrow('Encryption failed')
      expect(mockLogger.error).toHaveBeenCalledWith(
        'crypto/safe-encrypt',
        'Encryption failed',
        expect.any(Object)
      )
    })

    it('§4.6: rethrown Error carries original err via cause chain but message is fixed', () => {
      const originalError = new Error('ENCRYPTION_KEY invalid: secret-key-abcdef')
      mockEncrypt.mockImplementation(() => {
        throw originalError
      })

      let caught: unknown
      try {
        safeEncrypt('plain')
      } catch (e) {
        caught = e
      }
      expect(caught).toBeInstanceOf(Error)
      const err = caught as Error
      // Message must NOT include the raw err.message substring.
      expect(err.message).toBe('Encryption failed')
      expect(err.message).not.toContain('ENCRYPTION_KEY')
      expect(err.message).not.toContain('secret-key-abcdef')
      // But the original error is still preserved on the cause chain for
      // operator-side debugging — outside the logger boundary.
      expect((err as Error & { cause?: unknown }).cause).toBe(originalError)
    })
  })

  // ─── §4.6 redaction — synthetic PII marker must NEVER appear in serialized logger calls
  // Crypto failures can carry plaintext BYOK API keys, ENCRYPTION_KEY fragments,
  // or decrypted auth payload; we must never let those reach the logger.
  const PII_MARKER = 'X-PII-MARKER-CRYPTO-9d4e'
  describe('§4.6 redaction — crypto-helpers logger.error does not leak caught error text', () => {
    it('§4.6: safeDecrypt logger.error does NOT include caught err.message (PII marker absent)', () => {
      const sensitiveMessage = `decrypt blew up: ${PII_MARKER} / key=sk-${PII_MARKER}-suffix`
      mockIsEncrypted.mockReturnValue(true)
      mockDecrypt.mockImplementation(() => {
        throw new Error(sensitiveMessage)
      })

      expect(safeDecrypt('cipher-text')).toBe('')
      const calls = mockLogger.error.mock.calls
      expect(calls.length).toBeGreaterThan(0)
      // JSON.stringify objects to avoid String() returning '[object Object]'.
      const serialized = calls
        .flatMap((c) => c.map((a: unknown) => (typeof a === 'string' ? a : JSON.stringify(a))))
        .join('|')
      expect(serialized).not.toContain(PII_MARKER)
      expect(serialized).not.toContain('sk-')
      expect(serialized).toContain('decryption request failed')
    })

    it('§4.6: safeEncrypt logger.error does NOT include caught err.message (PII marker absent)', () => {
      const sensitiveMessage = `encrypt blew up: ${PII_MARKER} / plaintext-key=${PII_MARKER}-leak`
      mockEncrypt.mockImplementation(() => {
        throw new Error(sensitiveMessage)
      })

      expect(() => safeEncrypt('plain')).toThrow('Encryption failed')
      const calls = mockLogger.error.mock.calls
      expect(calls.length).toBeGreaterThan(0)
      const serialized = calls
        .flatMap((c) => c.map((a: unknown) => (typeof a === 'string' ? a : JSON.stringify(a))))
        .join('|')
      expect(serialized).not.toContain(PII_MARKER)
      expect(serialized).not.toContain('plaintext-key=')
      expect(serialized).toContain('encryption request failed')
    })
  })
})
