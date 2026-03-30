import { describe, it, expect, vi, beforeEach } from 'vitest'
import { safeDecrypt, safeEncrypt } from './crypto-helpers'
import { encrypt, decrypt, isEncrypted, getEncryptionKey } from './crypto'
import { logger } from './logger'

vi.mock('./crypto')
vi.mock('./logger')

describe('crypto-helpers', () => {
  const mockEncrypt = encrypt as any
  const mockDecrypt = decrypt as any
  const mockIsEncrypted = isEncrypted as any
  const mockLogger = logger as any
  const mockGetEncryptionKey = getEncryptionKey as any

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

    it('should return raw text on decryption failure', () => {
      const encryptedText = 'encrypted-data'
      
      mockIsEncrypted.mockReturnValue(true)
      mockDecrypt.mockImplementation(() => {
        throw new Error('Decryption failed')
      })
      
      expect(safeDecrypt(encryptedText)).toBe(encryptedText)
      expect(mockLogger.error).toHaveBeenCalledWith(
        'crypto/safe-decrypt',
        'Decryption failed, returning raw value',
 expect.any(Error)
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

    it('should return plain text on encryption failure', () => {
      const plainText = 'plain text'
      
      mockEncrypt.mockImplementation(() => {
        throw new Error('Encryption failed')
      })
      
      expect(safeEncrypt(plainText)).toBe(plainText)
    })
  })
})
