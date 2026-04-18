// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const originalEnv = process.env

describe('config runtime validation', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('throws when production runtime starts without ENCRYPTION_KEY', async () => {
    process.env = { ...process.env, NODE_ENV: 'production' }
    delete process.env.ENCRYPTION_KEY
    delete process.env.NEXT_PHASE

    await expect(import('./config')).rejects.toThrow('ENCRYPTION_KEY is required in production runtime')
  })

  it('allows production build without ENCRYPTION_KEY', async () => {
    process.env = { ...process.env, NODE_ENV: 'production', NEXT_PHASE: 'phase-production-build' }
    delete process.env.ENCRYPTION_KEY

    await expect(import('./config')).resolves.toBeDefined()
  })

  it('allows production runtime when ENCRYPTION_KEY is set', async () => {
    process.env = { ...process.env, NODE_ENV: 'production', ENCRYPTION_KEY: 'a'.repeat(64) }
    delete process.env.NEXT_PHASE

    await expect(import('./config')).resolves.toBeDefined()
  })
})
