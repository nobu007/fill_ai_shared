import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../config', () => ({
  LOG_LEVEL: 'debug',
  SCORE_AUTO_FIXED_PENALTY: 2,
  SCORE_NEEDS_REVIEW_PENALTY: 5,
  SCORE_AXIS_PATCH_PENALTY: 3,
}))

import { logger } from './logger'
import { LOG_LEVEL } from '../config'

describe('logger', () => {
  it('config mock works', () => {
    expect(LOG_LEVEL).toBe('debug')
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'debug').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should log debug messages', () => {
    logger.debug('test', 'debug message', { data: 'test' })
    expect(console.debug).toHaveBeenCalledWith(expect.stringContaining('[test] debug message'))
    expect(console.debug).toHaveBeenCalledWith(expect.stringContaining('"data":"test"'))
  })

  it('should log info messages', () => {
    logger.info('test', 'info message', 'string data')
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[test] info message string data'))
  })

  it('should log warn messages with Error object', () => {
    logger.warn('test', 'warn message', new Error('test error'))
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[test] warn message'))
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('test error'))
  })

  it('should log error messages', () => {
    logger.error('test', 'error message', { error: 'test' })
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('[test] error message'))
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('"error":"test"'))
  })

  it('should include ISO timestamp in output', () => {
    logger.info('mod', 'msg')
    const call = vi.mocked(console.log).mock.calls[0][0]
    expect(call).toMatch(/^\[\d{4}-\d{2}-\d{2}T/)
  })

  it('should format message without data', () => {
    logger.info('mod', 'simple message')
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[mod] simple message'))
  })

  it('should stringify object data', () => {
    logger.info('mod', 'msg', { key: 'value' })
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"key":"value"'))
  })
})
