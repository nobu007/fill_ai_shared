/**
 * Shared error response type used across all API routes.
 *
 * Every API route handler should return errors in this format.
 * Dead proof_ai/WordPress error codes were removed in Phase 3 cleanup (2026-03-26).
 */

/** Standard error response body */
export interface ApiErrorResponse {
  error: string
  code?: string
  debug?: string
}

/** Helper to create a typed error response for Next.js route handlers */
export function errorResponse(
  message: string,
  status: number,
  code?: string,
  debug?: string,
): { body: ApiErrorResponse; status: number } {
  return {
    body: { error: message, code, debug },
    status,
  }
}

/** Common error messages */
export const ERROR_MESSAGES = {
  unauthorized: '認証されていません',
  forbidden: 'アクセス権限がありません',
  notFound: 'リソースが見つかりません',
  insufficientCredits: 'クレジットが不足しています',
  internalError: '内部エラーが発生しました',
  validation: '入力内容が正しくありません',
  invalidEmail: '無効なメールアドレス形式です',
  invalidCategory: '無効なカテゴリです',
  invalidPackage: '無効なパッケージです',
  requiredField: '必須項目が入力されていません',
  textTooLong: (field: string, max: number) => `${field}は${max}文字以内で入力してください`,
  webhookNotConfigured: 'Webhook設定が見つかりません',
  webhookSignatureFailed: '署名の検証に失敗しました',

  // Fill / PDF routes (Constitution §2.4 centralization)
  invalidModel: '無効なモデル名です',
  pdfRequired: 'PDFファイルが必要です',
  pdfOnly: 'PDFファイルのみ対応しています',
  pdfTooLarge: (maxMB: number) => `PDFファイルは${maxMB}MB以内にしてください`,
  pdfTooManyPages: (maxPages: number, actual: number) => `PDFは${maxPages}ページ以内にしてください (${actual}ページ)`,
  emptyUserData: 'ユーザーデータが空です。少なくとも1つのデータを入力してください。',
  invalidMappings: 'マッピングの形式が不正です',
  promptRequired: 'プロンプトが必要です',
  invalidModelName: '無効なモデル名です',

  // User data routes
  labelRequired: 'ラベルが必要です',
  valueRequired: '値が必要です',
  idRequired: 'IDが必要です',
  updateFailed: '更新に失敗しました',
  deleteFailed: '削除に失敗しました',

  // Invitation routes
  invitationsFetchFailed: '招待コードの取得に失敗しました',
  invitationsCreateFailed: '招待コードの作成に失敗しました',
  invitationsDeleteFailed: '招待コードの削除に失敗しました',
  emailRequired: 'メールアドレスが必要です',
  invalidInvitationCode: '無効な招待コードです',
  invitationCodeUsed: 'この招待コードは使用済みです',
  invitationEmailMismatch: 'この招待コードは指定されたメールアドレスのみ使用できます',
  invalidMaxUses: 'max_usesは1〜1000の整数で指定してください',
  invitationCodeRequired: '招待コードが必要です',

  // API keys routes
  providerAndKeyRequired: 'プロバイダーとAPIキーは必須です',
  byokProOnly: 'BYOKはプロ契約のお客様のみ利用可能です',
  apiKeyVerificationFailed: 'APIキーの検証に失敗しました。正しいキーを入力してください。',
  saveFailed: '保存に失敗しました',
  invalidProvider: '無効なプロバイダーです',
} as const
