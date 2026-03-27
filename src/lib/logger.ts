/**
 * Structured logger for server-side code.
 *
 * Replaces raw console.log/error/warn with a thin wrapper that:
 * - Prefixes messages with a module tag for grep-ability
 * - No-ops in test environments (unless LOG_LEVEL is set)
 * - Keeps `console.error` for actual errors (visible in serverless logs)
 *
 * Usage:
 *   import { logger } from '@/lib/logger'
 *   logger.info('wp', 'JWT token expired, refreshing...')
 *   logger.error('engine', 'LLM call failed', err)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

import { LOG_LEVEL as CONFIG_LOG_LEVEL } from '../config'

const LOG_LEVEL: LogLevel = CONFIG_LOG_LEVEL as LogLevel

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[LOG_LEVEL]
}

function formatMessage(module: string, message: string, data?: unknown): string {
  const ts = new Date().toISOString()
  const prefix = `[${ts}][${module}]`
  if (data !== undefined) {
    return `${prefix} ${message}` + (data instanceof Error ? ` — ${data.message}` : ` ${typeof data === 'string' ? data : JSON.stringify(data)}`)
  }
  return `${prefix} ${message}`
}

export const logger = {
  debug(module: string, message: string, data?: unknown) {
    if (shouldLog('debug')) {
      console.debug(formatMessage(module, message, data))
    }
  },

  info(module: string, message: string, data?: unknown) {
    if (shouldLog('info')) {
      console.log(formatMessage(module, message, data))
    }
  },

  warn(module: string, message: string, data?: unknown) {
    if (shouldLog('warn')) {
      console.warn(formatMessage(module, message, data))
    }
  },

  error(module: string, message: string, data?: unknown) {
    if (shouldLog('error')) {
      console.error(formatMessage(module, message, data))
    }
  },
}
