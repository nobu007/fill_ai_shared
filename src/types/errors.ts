/**
 * Shared error response type used across all API routes.
 */

export interface ApiErrorResponse {
  error: string
  code?: string
  debug?: string
}

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

export const ERROR_MESSAGES = {
  unauthorized: '認証されていません',
  forbidden: 'アクセス権限がありません',
  notFound: 'リソースが見つかりません',
  internalError: '内部エラーが発生しました',
  insufficientCredits: 'クレジットが不足しています',

  // Proofread / WordPress
  contentRequired: 'Content is required',
  contentTooLong: (max: number) => `本文は${max.toLocaleString()}文字以内にしてください`,
  contentTooShort: (min: number) => `本文は${min}文字以上で入力してください`,
  tokenExpired: 'トークンの有効期限が切れました。接続情報を再設定してください。',
  wpAuthFailed: 'WordPress認証に失敗しました。認証情報を確認してください。',
  wpApiError: (status: number) => `WordPress API エラー (${status})`,
  wpFetchFailed: (msg: string) => `記事の取得に失敗しました: ${msg}`,
  sessionSaveFailed: 'セッションの保存に失敗しました',
  wpUpdateFailed: (status: number) => `WordPressの更新に失敗しました (${status})`,
  wpPostSaveFailed: '記事の保存に失敗しました',
  siteNotFound: 'サイトが見つかりません',
  postNotFound: '記事が見つかりません',
  batchLimit: (max: number) => `一度に${max}件までです`,
  siteInfoNotFound: 'サイト情報が見つかりません',

  // Generic validation / forms
  validation: '入力内容が正しくありません',
  invalidEmail: '無効なメールアドレス形式です',
  invalidCategory: '無効なカテゴリです',
  invalidPackage: '無効なパッケージです',
  requiredField: '必須項目が入力されていません',
  textTooLong: (field: string, max: number) => `${field}は${max}文字以内で入力してください`,
  webhookNotConfigured: 'Webhook設定が見つかりません',
  webhookSignatureFailed: '署名の検証に失敗しました',

  // Fill / PDF
  invalidModel: '無効なモデル名です',
  pdfRequired: 'PDFファイルが必要です',
  pdfOnly: 'PDFファイルのみ対応しています',
  pdfTooLarge: (maxMB: number) => `PDFファイルは${maxMB}MB以内にしてください`,
  pdfTooManyPages: (maxPages: number, actual: number) => `PDFは${maxPages}ページ以内にしてください (${actual}ページ)`,
  emptyUserData: 'ユーザーデータが空です。少なくとも1つのデータを入力してください。',
  invalidMappings: 'マッピングの形式が不正です',
  promptRequired: 'プロンプトが必要です',
  invalidModelName: '無効なモデル名です',

  // User data / invitations / keys
  labelRequired: 'ラベルが必要です',
  valueRequired: '値が必要です',
  idRequired: 'IDが必要です',
  updateFailed: '更新に失敗しました',
  deleteFailed: '削除に失敗しました',
  invitationsFetchFailed: '招待コードの取得に失敗しました',
  invitationsCreateFailed: '招待コードの作成に失敗しました',
  invitationsDeleteFailed: '招待コードの削除に失敗しました',
  emailRequired: 'メールアドレスが必要です',
  invalidInvitationCode: '無効な招待コードです',
  invitationCodeUsed: 'この招待コードは使用済みです',
  invitationEmailMismatch: 'この招待コードは指定されたメールアドレスのみ使用できます',
  invalidMaxUses: 'max_usesは1〜1000の整数で指定してください',
  invitationCodeRequired: '招待コードが必要です',
  providerAndKeyRequired: 'プロバイダーとAPIキーは必須です',
  byokProOnly: 'BYOKはプロ契約のお客様のみ利用可能です',
  apiKeyVerificationFailed: 'APIキーの検証に失敗しました。正しいキーを入力してください。',
  saveFailed: '保存に失敗しました',
  invalidProvider: '無効なプロバイダーです',
} as const
