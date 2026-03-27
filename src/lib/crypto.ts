/**
 * AES-256-GCM 暗号化/復号化ユーティリティ
 *
 * Supabaseに保存する機密データ（JWTトークン、APIキー、WordPressパスワード）を
 * 暗号化して保存するためのモジュール。
 *
 * 使い方:
 *   import { encrypt, decrypt, getEncryptionKey } from '@/shared/lib/crypto'
 *   const key = getEncryptionKey()
 *   const encrypted = encrypt(plaintext, key)
 *   const decrypted = decrypt(encrypted, key)
 *
 * 環境変数:
 *   ENCRYPTION_KEY — 32バイト（64文字のhex文字列）
 *   生成方法: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import { ENCRYPTION_KEY } from '@/shared/config'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16

/**
 * 平文を暗号化する
 * @returns base64文字列（iv + authTag + ciphertext）
 */
export function encrypt(plaintext: string, key: string): string {
  const keyBuffer = Buffer.from(key, 'hex')
  if (keyBuffer.length !== 32) {
    throw new Error(`ENCRYPTION_KEY must be 32 bytes (64 hex chars), got ${keyBuffer.length}`)
  }

  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, keyBuffer, iv)

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf-8'),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  // 形式: base64(iv || authTag || ciphertext)
  return Buffer.concat([iv, authTag, encrypted]).toString('base64')
}

/**
 * 暗号化された文字列を復号する
 * @param encrypted base64文字列（iv + authTag + ciphertext）
 */
export function decrypt(encrypted: string, key: string): string {
  const keyBuffer = Buffer.from(key, 'hex')
  if (keyBuffer.length !== 32) {
    throw new Error(`ENCRYPTION_KEY must be 32 bytes (64 hex chars), got ${keyBuffer.length}`)
  }

  const combined = Buffer.from(encrypted, 'base64')

  if (combined.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
    throw new Error('Invalid encrypted data: too short')
  }

  const iv = combined.subarray(0, IV_LENGTH)
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
  const ciphertext = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH)

  const decipher = createDecipheriv(ALGORITHM, keyBuffer, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ])

  return decrypted.toString('utf-8')
}

/**
 * 暗号化キーを取得（未設定時はエラー）
 */
export function getEncryptionKey(): string {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }
  return ENCRYPTION_KEY
}

/**
 * 値が暗号化されているか判定（base64 + 十分な長さ）
 */
export function isEncrypted(value: string): boolean {
  if (!value || value.length < 30) return false
  try {
    const buf = Buffer.from(value, 'base64')
    return buf.length >= IV_LENGTH + AUTH_TAG_LENGTH + 1
  } catch {
    return false
  }
}
