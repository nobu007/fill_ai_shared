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
 * 復号失敗時は空文字を返す（暗号文の露出を防ぐ）
 */
export function safeDecrypt(value: string | null | undefined): string {
  if (!value) return ''
  if (!isEncrypted(value)) return value
  try {
    return decrypt(value, getEncryptionKey())
  } catch (err) {
    logger.error('crypto/safe-decrypt', 'Decryption failed, returning empty string', { error: err instanceof Error ? err.message : String(err) })
    return ''
  }
}

/**
 * 値を暗号化する（ENCRYPTION_KEY未設定時はエラーをthrow）
 * 平文保存による情報漏洩を防ぐため、暗号化失敗時は例外をスローする
 */
export function safeEncrypt(value: string): string {
  try {
    return encrypt(value, getEncryptionKey())
  } catch (err) {
    logger.error('crypto/safe-encrypt', 'Encryption failed', { error: err instanceof Error ? err.message : String(err) })
    throw new Error('Encryption failed: ' + (err instanceof Error ? err.message : String(err)), { cause: err })
  }
}
