import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { encrypt, decrypt, isEncrypted } from './crypto'

const TEST_KEY = 'a'.repeat(64) // 32 bytes hex

describe('crypto', () => {
  describe('encrypt / decrypt', () => {
    it('round-trips a simple string', () => {
      const plain = 'hello world'
      const encrypted = encrypt(plain, TEST_KEY)
      expect(encrypted).not.toBe(plain)
      expect(decrypt(encrypted, TEST_KEY)).toBe(plain)
    })

    it('round-trips a JWT token', () => {
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'
      const encrypted = encrypt(jwt, TEST_KEY)
      expect(decrypt(encrypted, TEST_KEY)).toBe(jwt)
    })

    it('round-trips an API key', () => {
      const apiKey = 'sk-proj-abc123def456ghi789jkl012mno345pqr678'
      const encrypted = encrypt(apiKey, TEST_KEY)
      expect(decrypt(encrypted, TEST_KEY)).toBe(apiKey)
    })

    it('round-trips a WordPress password', () => {
      const password = 'AbCd Ef Gh Ij Kl Mn'
      const encrypted = encrypt(password, TEST_KEY)
      expect(decrypt(encrypted, TEST_KEY)).toBe(password)
    })

    it('round-trips unicode', () => {
      const text = '日本語のテスト 🐈‍⬛ 特殊文字: <>&"\''
      const encrypted = encrypt(text, TEST_KEY)
      expect(decrypt(encrypted, TEST_KEY)).toBe(text)
    })

    it('produces different ciphertext each time (random IV)', () => {
      const plain = 'same input'
      const e1 = encrypt(plain, TEST_KEY)
      const e2 = encrypt(plain, TEST_KEY)
      expect(e1).not.toBe(e2)
      expect(decrypt(e1, TEST_KEY)).toBe(plain)
      expect(decrypt(e2, TEST_KEY)).toBe(plain)
    })

    it('throws on wrong key', () => {
      const encrypted = encrypt('secret', TEST_KEY)
      const wrongKey = 'b'.repeat(64)
      expect(() => decrypt(encrypted, wrongKey)).toThrow()
    })

    it('throws on invalid key length', () => {
      expect(() => encrypt('test', 'short')).toThrow('32 bytes')
      expect(() => decrypt('test', 'short')).toThrow('32 bytes')
    })

    it('throws on tampered ciphertext', () => {
      const encrypted = encrypt('test', TEST_KEY)
      const tampered = Buffer.from(encrypted, 'base64')
      tampered[tampered.length - 1] ^= 0xff // flip last byte
      expect(() => decrypt(tampered.toString('base64'), TEST_KEY)).toThrow()
    })

    it('throws on too-short ciphertext', () => {
      expect(() => decrypt('aGVsbG8=', TEST_KEY)).toThrow('too short')
    })
  })

  describe('isEncrypted', () => {
    it('returns true for encrypted values', () => {
      expect(isEncrypted(encrypt('test', TEST_KEY))).toBe(true)
    })

    it('returns false for plaintext', () => {
      expect(isEncrypted('hello')).toBe(false)
      expect(isEncrypted('eyJhbGciOiJI')).toBe(false)
      expect(isEncrypted('')).toBe(false)
    })

    it('returns false for invalid base64 (catch block)', () => {
      expect(isEncrypted('not-valid-base64!@#')).toBe(false)
      expect(isEncrypted('%%%')).toBe(false)
    })
  })

  describe('getEncryptionKey', () => {
    const originalEnv = process.env

    beforeEach(() => {
      // Reset environment before each test
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      // Restore environment after each test
      process.env = originalEnv
    })

    it('throws when ENCRYPTION_KEY is not set', async () => {
      delete process.env.ENCRYPTION_KEY
      vi.resetModules()
      const crypto = await import('./crypto')
      expect(() => crypto.getEncryptionKey()).toThrow('ENCRYPTION_KEY environment variable is not set')
    })

    it('returns the key when ENCRYPTION_KEY is set', async () => {
      const testKey = 'a'.repeat(64)
      process.env.ENCRYPTION_KEY = testKey
      vi.resetModules()
      const crypto = await import('./crypto')
      expect(crypto.getEncryptionKey()).toBe(testKey)
    })
  })
})
