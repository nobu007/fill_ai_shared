/**
 * 移行安全な復号化ヘルパー
 *
 * 暗号化されていれば復号化し、平文ならそのまま返す。
 * これにより ENCRYPTION_KEY 設定前後のデータを共存させられる。
 */

import { encrypt, decrypt, isEncrypted, getEncryptionKey } from './crypto'
import { logger } from './logger'

/**
 * 値を復号化する（暗号化されていなければそのまま返す）
 */
export function safeDecrypt(value: string | null | undefined): string {
  if (!value) return ''
  if (!isEncrypted(value)) return value
  try {
    return decrypt(value, getEncryptionKey())
  } catch (err) {
    logger.error('crypto/safe-decrypt', 'Decryption failed, returning raw value', err)
    return value
  }
}

/**
 * 値を暗号化する（ENCRYPTION_KEY未設定時は平文のまま）
 */
export function safeEncrypt(value: string): string {
  try {
    return encrypt(value, getEncryptionKey())
  } catch {
    return value
  }
}
