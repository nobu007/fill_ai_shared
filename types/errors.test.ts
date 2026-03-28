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

  it('should include fill_ai specific error messages (no proof_ai remnants)', () => {
    // Phase 3 構造分離完了: proof_ai由来看削除済み
    const removedKeys = [
      'contentRequired', 'contentTooLong', 'contentTooShort',
      'tokenExpired', 'wpAuthFailed', 'wpApiError', 'wpFetchFailed',
      'sessionSaveFailed', 'wpUpdateFailed', 'wpPostSaveFailed',
      'siteNotFound', 'postNotFound', 'batchLimit', 'siteInfoNotFound',
      'promptRequired', 'invalidModelName',
    ]
    removedKeys.forEach((key) => {
      expect(Object.keys(ERROR_MESSAGES)).not.toContain(key)
    })
  })

  it('should have non-empty Japanese error messages', () => {
    Object.entries(ERROR_MESSAGES).forEach(([, value]) => {
      if (typeof value === 'function') return // Skip function entries (e.g. textTooLong)
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
  })

  it('should have centralized API keys route messages', () => {
    expect(ERROR_MESSAGES.providerAndKeyRequired).toBe('プロバイダーとAPIキーは必須です')
    expect(ERROR_MESSAGES.byokProOnly).toBe('BYOKはプロ契約のお客様のみ利用可能です')
    expect(ERROR_MESSAGES.apiKeyVerificationFailed).toBe('APIキーの検証に失敗しました。正しいキーを入力してください。')
    expect(ERROR_MESSAGES.saveFailed).toBe('保存に失敗しました')
    expect(ERROR_MESSAGES.invalidProvider).toBe('無効なプロバイダーです')
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
