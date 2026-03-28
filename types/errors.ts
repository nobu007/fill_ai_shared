/**
 * Shared error response type used across all API routes.
 *
 * Every API route handler should return errors in this format.
 * Per Constitution §4.5: all error messages are user-facing Japanese.
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
  | 'INTERNAL_ERROR'
  | 'CONFIG_ERROR'
  | 'SIGNATURE_ERROR'
  | 'WP_API_ERROR'
  | 'WP_AUTH_ERROR'
  | 'TOKEN_EXPIRED'
  | 'SESSION_SAVE_ERROR'

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

/**
 * Common error messages — centralized Japanese strings (Constitution §4.5).
 *
 * Every API route MUST use these constants instead of inline strings.
 * Adding a new message: add the key here, then update errors.test.ts.
 */
export const ERROR_MESSAGES = {
  // --- Core messages ---
  unauthorized: '認証されていません',
  forbidden: 'アクセス権限がありません',
  notFound: 'リソースが見つかりません',
  insufficientCredits: 'クレジットが不足しています',
  internalError: '内部エラーが発生しました',

  // --- Validation helpers ---
  requiredField: '必須項目が入力されていません',
  invalidEmail: '無効なメールアドレス形式です',
  invalidCategory: '無効なカテゴリです',
  invalidPackage: '無効なパッケージです',
  textTooLong: (field: string, max: number) => `${field}は${max}文字以内で入力してください`,

  // --- Webhook ---
  webhookNotConfigured: 'Webhook設定が見つかりません',
  webhookSignatureFailed: '署名の検証に失敗しました',

  // --- Fill / PDF route messages (Constitution §2.4) ---
  invalidModel: '無効なモデル名です',
  pdfRequired: 'PDFファイルが必要です',
  pdfOnly: 'PDFファイルのみ対応しています',
  emptyUserData: 'ユーザーデータが空です。少なくとも1つのデータを入力してください。',
  invalidMappings: 'マッピングの形式が不正です',
  extractionDataRequired: '抽出データが必要です',
  pdfTooLarge: (maxMB: number) => `PDFファイルは${maxMB}MB以内にしてください`,
  pdfTooManyPages: (max: number, actual: number) => `PDFは${max}ページ以内にしてください (${actual}ページ)`,
  promptTooLarge: (max: number, actual: number) => `プロンプトが長すぎます（最大${max}文字、${actual}文字）`,

  // --- user-data route messages ---
  labelRequired: 'ラベルが必要です',
  valueRequired: '値が必要です',
  idRequired: 'IDが必要です',
  updateFailed: '更新に失敗しました',
  deleteFailed: '削除に失敗しました',

  // --- Invitation route messages ---
  invitationsFetchFailed: '招待コードの取得に失敗しました',
  invitationsCreateFailed: '招待コードの作成に失敗しました',
  invitationsDeleteFailed: '招待コードの削除に失敗しました',
  emailRequired: 'メールアドレスが必要です',
  invalidInvitationCode: '無効な招待コードです',
  invitationCodeUsed: 'この招待コードは使用済みです',
  invitationEmailMismatch: 'この招待コードは指定されたメールアドレスのみ使用できます',
  invalidMaxUses: 'max_usesは1〜1000の整数で指定してください',
  invitationCodeRequired: '招待コードが必要です',

  // --- Content validation (proof_ai proofread) ---
  contentRequired: 'コンテンツが必要です',
  contentTooShort: (min: number) => `コンテンツは${min}文字以上で入力してください`,
  contentTooLong: (max: number) => `コンテンツは${max}文字以内で入力してください`,
  wpUpdateFailed: (status: number) => `WordPressの更新に失敗しました (HTTP ${status})`,
  blogAutoAiError: (status: number) => `Blog Auto AI API エラー (HTTP ${status})`,
  siteNotFound: 'サイトが見つかりません',
  wpPostSaveFailed: '記事の保存に失敗しました',
  postNotFound: '記事が見つかりません',
  wpFetchFailed: (msg?: string) => msg ? `記事の取得に失敗しました: ${msg}` : '記事の取得に失敗しました',
  sessionSaveFailed: 'セッションの保存に失敗しました',
  tokenExpired: 'トークンの有効期限が切れています',

  // --- API keys route messages ---
  providerAndKeyRequired: 'プロバイダーとAPIキーは必須です',
  byokProOnly: 'BYOKはプロ契約のお客様のみ利用可能です',
  apiKeyVerificationFailed: 'APIキーの検証に失敗しました。正しいキーを入力してください。',
  saveFailed: '保存に失敗しました',
  invalidProvider: '無効なプロバイダーです',
} as const
