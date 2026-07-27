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
  } catch {
    // §4.6: caught error may carry decrypted plaintext fragments, key
    // material, or auth payload. Log metadata-only; do not echo err.message.
    logger.error('crypto/safe-decrypt', 'Decryption failed, returning empty string', { error: 'decryption request failed' })
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
    // §4.6: caught error may carry plaintext BYOK keys, ENCRYPTION_KEY
    // fragments, or buffer contents. Log metadata-only; do not echo
    // err.message. The `err` binding is preserved for the rethrow's cause
    // chain so callers can still inspect the original failure.
    logger.error('crypto/safe-encrypt', 'Encryption failed', { error: 'encryption request failed' })
    throw new Error('Encryption failed', { cause: err })
  }
}
