/**
 * Shared error response type used across all API routes.
 *
 * Every API route handler should return errors in this format.
 */

/** Standard error response body */
export interface ApiErrorResponse {
  error: string
  code?: string
  debug?: string
}

/** Error codes for known failure modes */
export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INSUFFICIENT_CREDITS'
  | 'TOKEN_EXPIRED'
  | 'WP_AUTH_ERROR'
  | 'WP_API_ERROR'
  | 'SESSION_SAVE_ERROR'
  | 'INTERNAL_ERROR'
  | 'RATE_LIMITED'

/** Helper to create a typed error response for Next.js route handlers */
export function errorResponse(
  message: string,
  status: number,
  code?: ErrorCode,
  debug?: string,
): { body: ApiErrorResponse; status: number } {
  return {
    body: { error: message, code, debug },
    status,
  }
}

/** Common error messages */
export const ERROR_MESSAGES = {
  unauthorized: 'Unauthorized',
  forbidden: 'アクセス権限がありません',
  notFound: 'リソースが見つかりません',
  contentRequired: 'Content is required',
  contentTooLong: (max: number) => `本文は${max.toLocaleString()}文字以内にしてください`,
  contentTooShort: (min: number) => `本文は${min}文字以上で入力してください`,
  insufficientCredits: 'クレジットが不足しています',
  tokenExpired: 'トークンの有効期限が切れました。接続情報を再設定してください。',
  wpAuthFailed: 'WordPress認証に失敗しました。認証情報を確認してください。',
  wpApiError: (status: number) => `WordPress API エラー (${status})`,
  wpFetchFailed: (msg: string) => `記事の取得に失敗しました: ${msg}`,
  sessionSaveFailed: 'セッションの保存に失敗しました',
  wpUpdateFailed: (status: number) => `WordPressの更新に失敗しました (${status})`,
  wpPostSaveFailed: '記事の保存に失敗しました',
  internalError: 'Internal server error',
  siteNotFound: 'サイトが見つかりません',
  postNotFound: '記事が見つかりません',
  batchLimit: (max: number) => `一度に${max}件までです`,
  siteInfoNotFound: 'サイト情報が見つかりません',
} as const
