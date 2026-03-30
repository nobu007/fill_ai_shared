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
  | 'MONTHLY_LIMIT_EXCEEDED'
  | 'CONTENT_LENGTH_EXCEEDED'
  | 'AXIS_NOT_AVAILABLE'

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

  // --- family-members route messages ---
  nameRequired: '名前が必要です',
  invalidRelationship: '無効な続柄です',
  memberNotFound: 'メンバーが見つかりません',
  memberLimitReached: (max: number) => `メンバー数は${max}人以内にしてください`,

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

  // --- Content validation ---
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

  // --- Usage limit messages (P3.1) ---
  monthlyLimitExceeded: (max: number) => `今月の利用回数が上限（${max}回）に達しています。来月までお待ちいただくか、プランをアップグレードしてください。`,
  contentLengthExceeded: (max: number, actual: number) => `フリープランの文字数制限は${max.toLocaleString()}文字です。${actual.toLocaleString()}文字のテキストはプランをアップグレードしてご利用ください。`,
  axisNotAvailable: (axes: string[], allowed: string[]) => `フリープランでは${allowed.join('、')}のみ利用可能です。「${axes.join('、')}」はプランをアップグレードしてご利用ください。`,

  // --- API keys route messages ---
  providerAndKeyRequired: 'プロバイダーとAPIキーは必須です',
  byokProOnly: 'BYOKはプロ契約のお客様のみ利用可能です',
  apiKeyVerificationFailed: 'APIキーの検証に失敗しました。正しいキーを入力してください。',
  saveFailed: '保存に失敗しました',
  invalidProvider: '無効なプロバイダーです',

  // --- Fill service messages (§2.4) ---
  fillSessionCreateFailed: 'セッション作成に失敗しました',
  creditConsumeFailed: 'クレジット消費に失敗しました',
  invalidMatcherId: '無効なマッチャーIDです',

  // --- Settings route messages ---
  settingsFetchFailed: '設定の取得に失敗しました',

  // --- Config route messages ---
  configLoadFailed: '設定の読み込みに失敗しました',

  // --- Contact route messages ---
  allFieldsRequired: 'すべての項目は必須です',
  contactSaveFailed: 'お問い合わせの保存に失敗しました',

  // --- Prompts route messages ---
  promptsFetchFailed: 'プロンプトの取得に失敗しました',
  promptSaveFailed: 'プロンプトの保存に失敗しました',
  promptUpdateFailed: 'プロンプトの更新に失敗しました',
  promptDeleteFailed: 'プロンプトの削除に失敗しました',
  axisIdAndPromptRequired: 'axis_idとsystem_promptは必須です',
  systemPromptRequired: 'system_promptは必須です',

  // --- WP route messages ---
  wpPostsDeleteFailed: '関連記事の削除に失敗しました',
  wpSettingsDeleteFailed: 'サイト設定の削除に失敗しました',
  wpSiteDeleteFailed: 'サイトの削除に失敗しました',
  siteAccessDenied: 'サイトが見つからないか、アクセス権限がありません',
  invalidPageParameter: '無効なページパラメータです',

  // --- Proofread route messages ---
  invalidRequest: '無効なリクエストです',

  // --- Blog Auto AI route messages ---
  urlAndApiKeyRequired: 'URLとAPIキーは必須です',
  urlMustBeHttpOrHttps: 'URLはhttp://またはhttps://で始めてください',
  invalidUrlFormat: 'URLの形式が正しくありません',
  urlAccessDenied: '指定されたURLにアクセスできません（セキュリティチェックで拒否されました）',
  invalidApiKey: 'APIキーが正しくありません',
  blogAutoAiConnectFailed: 'Blog Auto AI APIに接続できません。URLとAPIキーを確認してください。',
  invalidApiResponse: 'APIレスポンスが不正です',
  siteUpdateFailed: 'サイト情報の更新に失敗しました',
  siteRegisterFailed: 'サイトの登録に失敗しました',
  siteIdRequired: 'サイトIDは必須です',
  blogAutoAiOnly: 'このエンドポイントはBlog Auto AIサイト専用です',
  siteApiKeyNotSet: 'このサイトのAPIキーが設定されていません',

  // --- Keys route messages ---
  providerRequired: 'プロバイダーは必須です',

  // --- WP refresh-token route messages ---
  siteIdAndPasswordRequired: 'siteIdとpasswordが必要です',
  siteNotJwtAuth: 'このサイトはJWT認証ではありません',
  internalNetworkDenied: '内部ネットワークへの接続は許可されていません',
  wpAuthFailed: '認証に失敗しました。ユーザー名とパスワードを確認してください。',
  tokenRefreshSuccess: 'トークンを更新しました',
  tokenRefreshFailed: 'トークンの更新に失敗しました',

  // --- Prompts route messages ---
  globalPromptModifyAdminOnly: 'グローバルプロンプトの変更は管理者のみ可能です',
  globalPromptDeleteAdminOnly: 'グローバルプロンプトの削除は管理者のみ可能です',
  globalPromptCreateAdminOnly: 'グローバルプロンプトの作成は管理者のみ可能です',
} as const
