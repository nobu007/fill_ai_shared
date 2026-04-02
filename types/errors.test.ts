/**
 * Unit tests for error types and utilities.
 */

import { describe, it, expect } from 'vitest'
import {
  errorResponse,
  ERROR_MESSAGES,
  type ApiErrorResponse,
  type ErrorCode,
} from './errors'

describe('errorResponse', () => {
  it('should create a complete error response with all fields', () => {
    const result = errorResponse('Test error', 400, 'VALIDATION_ERROR', 'Debug info')

    expect(result).toEqual({
      body: {
        error: 'Test error',
        code: 'VALIDATION_ERROR',
        debug: 'Debug info',
      },
      status: 400,
    })
  })

  it('should create error response without optional fields', () => {
    const result = errorResponse('Test error', 500)

    expect(result).toEqual({
      body: {
        error: 'Test error',
      },
      status: 500,
    })
  })

  it('should create error response with code but no debug', () => {
    const result = errorResponse('Not found', 404, 'NOT_FOUND')

    expect(result).toEqual({
      body: {
        error: 'Not found',
        code: 'NOT_FOUND',
      },
      status: 404,
    })
  })

  it('should accept string error codes', () => {
    const validCodes = [
      'UNAUTHORIZED',
      'FORBIDDEN',
      'NOT_FOUND',
      'VALIDATION_ERROR',
      'INSUFFICIENT_CREDITS',
      'INTERNAL_ERROR',
    ]

    validCodes.forEach((code) => {
      const result = errorResponse('Test', 400, code as ErrorCode)
      expect(result.body.code).toBe(code)
    })
  })

  it('should handle various HTTP status codes', () => {
    const statusCodes = [200, 400, 401, 402, 403, 404, 500, 502, 503]

    statusCodes.forEach((status) => {
      const result = errorResponse('Test', status)
      expect(result.status).toBe(status)
    })
  })

  it('should preserve error message exactly', () => {
    const messages = [
      'Simple error',
      'Error with unicode: 日本語',
      'Error with numbers: 123',
      'Error with special chars: @#$%',
      '',
    ]

    messages.forEach((message) => {
      const result = errorResponse(message, 400)
      expect(result.body.error).toBe(message)
    })
  })
})

describe('ERROR_MESSAGES', () => {
  it('should have all active error messages', () => {
    const activeKeys = ['unauthorized', 'forbidden', 'notFound', 'insufficientCredits', 'internalError']
    activeKeys.forEach((key) => {
      expect(ERROR_MESSAGES).toHaveProperty(key)
    })
  })

  it('should not include removed error messages', () => {
    // 不要なプロジェクト固有エラーメッセージが残っていないことを確認
    const removedKeys = [
      'wpApiError',
      'batchLimit', 'siteInfoNotFound',
      'promptRequired', 'invalidModelName',
    ]
    removedKeys.forEach((key) => {
      expect(Object.keys(ERROR_MESSAGES)).not.toContain(key)
    })
  })

  it('should have non-empty Japanese error messages', () => {
    Object.entries(ERROR_MESSAGES).forEach(([key, value]) => {
      if (typeof value === 'function') return // Skip function entries (e.g. textTooLong)
      if (key === 'contactHoneypotEmpty') return // Intentionally empty for honeypot field
      expect(typeof value).toBe('string')
      expect((value as string).length).toBeGreaterThan(0)
      // All active messages should be in Japanese
      expect(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(value as string)).toBe(true)
    })
  })

  it('should have at least 5 error messages', () => {
    expect(Object.keys(ERROR_MESSAGES).length).toBeGreaterThanOrEqual(5)
  })

  it('should have specific values for each core message', () => {
    expect(ERROR_MESSAGES.unauthorized).toBe('認証されていません')
    expect(ERROR_MESSAGES.forbidden).toBe('アクセス権限がありません')
    expect(ERROR_MESSAGES.notFound).toBe('リソースが見つかりません')
    expect(ERROR_MESSAGES.insufficientCredits).toBe('クレジットが不足しています')
    expect(ERROR_MESSAGES.internalError).toBe('内部エラーが発生しました')
    // Validation messages
    expect(ERROR_MESSAGES.requiredField).toBe('必須項目が入力されていません')
    expect(ERROR_MESSAGES.invalidEmail).toBe('無効なメールアドレス形式です')
    expect(ERROR_MESSAGES.invalidCategory).toBe('無効なカテゴリです')
    expect(ERROR_MESSAGES.invalidPackage).toBe('無効なパッケージです')
    expect(typeof ERROR_MESSAGES.textTooLong).toBe('function')
    expect(ERROR_MESSAGES.textTooLong('名前', 100)).toBe('名前は100文字以内で入力してください')
    expect(ERROR_MESSAGES.webhookNotConfigured).toBe('Webhook設定が見つかりません')
    expect(ERROR_MESSAGES.webhookSignatureFailed).toBe('署名の検証に失敗しました')
  })

  it('should have centralized Fill/PDF route messages (Constitution §2.4)', () => {
    expect(ERROR_MESSAGES.invalidModel).toBe('無効なモデル名です')
    expect(ERROR_MESSAGES.pdfRequired).toBe('PDFファイルが必要です')
    expect(ERROR_MESSAGES.pdfOnly).toBe('PDFファイルのみ対応しています')
    expect(ERROR_MESSAGES.emptyUserData).toBe('ユーザーデータが空です。少なくとも1つのデータを入力してください。')
    expect(ERROR_MESSAGES.invalidMappings).toBe('マッピングの形式が不正です')
    // Function messages
    expect(typeof ERROR_MESSAGES.pdfTooLarge).toBe('function')
    expect(ERROR_MESSAGES.pdfTooLarge(10)).toBe('PDFファイルは10MB以内にしてください')
    expect(typeof ERROR_MESSAGES.pdfTooManyPages).toBe('function')
    expect(ERROR_MESSAGES.pdfTooManyPages(50, 60)).toBe('PDFは50ページ以内にしてください (60ページ)')
  })

  it('should have centralized user-data route messages', () => {
    expect(ERROR_MESSAGES.labelRequired).toBe('ラベルが必要です')
    expect(ERROR_MESSAGES.valueRequired).toBe('値が必要です')
    expect(ERROR_MESSAGES.idRequired).toBe('IDが必要です')
    expect(ERROR_MESSAGES.updateFailed).toBe('更新に失敗しました')
    expect(ERROR_MESSAGES.deleteFailed).toBe('削除に失敗しました')
  })

  it('should have centralized invitation route messages', () => {
    expect(ERROR_MESSAGES.invitationsFetchFailed).toBe('招待コードの取得に失敗しました')
    expect(ERROR_MESSAGES.invitationsCreateFailed).toBe('招待コードの作成に失敗しました')
    expect(ERROR_MESSAGES.invitationsDeleteFailed).toBe('招待コードの削除に失敗しました')
    expect(ERROR_MESSAGES.emailRequired).toBe('メールアドレスが必要です')
    expect(ERROR_MESSAGES.invalidInvitationCode).toBe('無効な招待コードです')
    expect(ERROR_MESSAGES.invitationCodeUsed).toBe('この招待コードは使用済みです')
    expect(ERROR_MESSAGES.invitationEmailMismatch).toBe('この招待コードは指定されたメールアドレスのみ使用できます')
    expect(ERROR_MESSAGES.invalidMaxUses).toBe('max_usesは1〜1000の整数で指定してください')
    expect(ERROR_MESSAGES.invitationCodeRequired).toBe('招待コードが必要です')
    expect(ERROR_MESSAGES.invitationRedeemFailed).toBe('招待コードの処理に失敗しました')
  })

  it('should have centralized API keys route messages', () => {
    expect(ERROR_MESSAGES.providerAndKeyRequired).toBe('プロバイダーとAPIキーは必須です')
    expect(ERROR_MESSAGES.byokProOnly).toBe('BYOKはプロ契約のお客様のみ利用可能です')
    expect(ERROR_MESSAGES.apiKeyVerificationFailed).toBe('APIキーの検証に失敗しました。正しいキーを入力してください。')
    expect(ERROR_MESSAGES.saveFailed).toBe('保存に失敗しました')
    expect(ERROR_MESSAGES.invalidProvider).toBe('無効なプロバイダーです')
    expect(ERROR_MESSAGES.providerRequired).toBe('プロバイダーは必須です')
  })

  it('should have centralized Blog Auto AI route messages', () => {
    expect(ERROR_MESSAGES.urlAndApiKeyRequired).toBe('URLとAPIキーは必須です')
    expect(ERROR_MESSAGES.urlMustBeHttpOrHttps).toBe('URLはhttp://またはhttps://で始めてください')
    expect(ERROR_MESSAGES.invalidUrlFormat).toBe('URLの形式が正しくありません')
    expect(ERROR_MESSAGES.urlAccessDenied).toBe('指定されたURLにアクセスできません（セキュリティチェックで拒否されました）')
    expect(ERROR_MESSAGES.invalidApiKey).toBe('APIキーが正しくありません')
    expect(ERROR_MESSAGES.blogAutoAiConnectFailed).toBe('Blog Auto AI APIに接続できません。URLとAPIキーを確認してください。')
    expect(ERROR_MESSAGES.invalidApiResponse).toBe('APIレスポンスが不正です')
    expect(ERROR_MESSAGES.siteUpdateFailed).toBe('サイト情報の更新に失敗しました')
    expect(ERROR_MESSAGES.siteRegisterFailed).toBe('サイトの登録に失敗しました')
    expect(ERROR_MESSAGES.siteIdRequired).toBe('サイトIDは必須です')
    expect(ERROR_MESSAGES.blogAutoAiOnly).toBe('このエンドポイントはBlog Auto AIサイト専用です')
    expect(ERROR_MESSAGES.siteApiKeyNotSet).toBe('このサイトのAPIキーが設定されていません')
  })

  it('should have centralized WP refresh-token route messages', () => {
    expect(ERROR_MESSAGES.siteIdAndPasswordRequired).toBe('siteIdとpasswordが必要です')
    expect(ERROR_MESSAGES.siteNotJwtAuth).toBe('このサイトはJWT認証ではありません')
    expect(ERROR_MESSAGES.internalNetworkDenied).toBe('内部ネットワークへの接続は許可されていません')
    expect(ERROR_MESSAGES.wpAuthFailed).toBe('認証に失敗しました。ユーザー名とパスワードを確認してください。')
    expect(ERROR_MESSAGES.tokenRefreshSuccess).toBe('トークンを更新しました')
    expect(ERROR_MESSAGES.tokenRefreshFailed).toBe('トークンの更新に失敗しました')
  })

  it('should have centralized Prompts route messages', () => {
    expect(ERROR_MESSAGES.globalPromptModifyAdminOnly).toBe('グローバルプロンプトの変更は管理者のみ可能です')
    expect(ERROR_MESSAGES.globalPromptDeleteAdminOnly).toBe('グローバルプロンプトの削除は管理者のみ可能です')
    expect(ERROR_MESSAGES.globalPromptCreateAdminOnly).toBe('グローバルプロンプトの作成は管理者のみ可能です')
  })

  it('should have centralized Proofread stream route messages', () => {
    expect(typeof ERROR_MESSAGES.invalidAxes).toBe('function')
    expect(ERROR_MESSAGES.invalidAxes(['structure', 'readability'])).toBe('無効な校正軸が指定されました。有効な軸: structure, readability')
    expect(ERROR_MESSAGES.sessionNotFound).toBe('前回のセッションが見つかりません。新しい校正を行ってください。')
    expect(ERROR_MESSAGES.sessionAlreadyCompleted).toBe('このセッションは既に完了しています。')
  })

  it('should have centralized user_data validation messages', () => {
    expect(ERROR_MESSAGES.userDataInvalidJson).toBe('user_data の形式が不正です。有効なJSON配列を指定してください。')
    expect(ERROR_MESSAGES.userDataNotArray).toBe('user_data は配列形式で指定してください。')
    expect(ERROR_MESSAGES.userDataItemInvalid).toBe('user_data の各項目には label, category, value (文字列) が必要です。')
  })
})

describe('ApiErrorResponse type', () => {
  it('should accept valid error response structure', () => {
    const response: ApiErrorResponse = {
      error: 'Test error',
      code: 'VALIDATION_ERROR',
      debug: 'Debug info',
    }

    expect(response.error).toBe('Test error')
    expect(response.code).toBe('VALIDATION_ERROR')
    expect(response.debug).toBe('Debug info')
  })

  it('should accept minimal error response', () => {
    const response: ApiErrorResponse = {
      error: 'Test error',
    }

    expect(response.error).toBe('Test error')
    expect(response.code).toBeUndefined()
    expect(response.debug).toBeUndefined()
  })
})
