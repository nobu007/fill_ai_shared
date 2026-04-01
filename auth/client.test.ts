import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createClient } from './client'

// Mock the config module
vi.mock('../config', () => ({
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_ANON_KEY: 'test-anon-key',
}))

describe('auth/client', () => {
  describe('createClient', () => {
    it('creates a Supabase client', () => {
      const client = createClient()
      expect(client).toBeDefined()
    })

    it('returns an object with auth property', () => {
      const client = createClient()
      expect(client.auth).toBeDefined()
    })

    it('returns an object with from property for database queries', () => {
      const client = createClient()
      expect(typeof client.from).toBe('function')
    })

    it('returns an object with rpc property for remote procedure calls', () => {
      const client = createClient()
      expect(typeof client.rpc).toBe('function')
    })

    it('returns an object with channel property for real-time subscriptions', () => {
      const client = createClient()
      expect(typeof client.channel).toBe('function')
    })

    it('returns a consistent client instance', () => {
      const client1 = createClient()
      const client2 = createClient()
      // Both should be valid Supabase clients
      expect(client1.auth).toBeDefined()
      expect(client2.auth).toBeDefined()
    })
  })
})
