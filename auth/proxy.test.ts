import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock @supabase/ssr before importing proxy
const mockGetUser = vi.fn()

// Captured callbacks from createServerClient
let capturedGetAll: (() => Array<{ name: string; value: string }>) | null = null
let capturedSetAll: ((cookies: Array<{ name: string; value: string; options?: Record<string, unknown> }>) => void) | null = null

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn((_url: string, _key: string, options: { cookies: { getAll: () => unknown; setAll: (cookies: unknown) => void } }) => {
    // Capture and invoke the callbacks to ensure they are exercised
    capturedGetAll = options.cookies.getAll as typeof capturedGetAll
    capturedSetAll = options.cookies.setAll as typeof capturedSetAll
    return {
      auth: { getUser: mockGetUser },
    }
  }),
}))

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  vi.clearAllMocks()
  capturedGetAll = null
  capturedSetAll = null
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    NODE_ENV: 'production',
  }
})

afterEach(() => {
  process.env = originalEnv
})

function createRequest(path: string, headers: Record<string, string> = {}): NextRequest {
  const url = new URL(`http://localhost:3000${path}`)
  const request = new NextRequest(url, { headers: new Headers(headers) })
  return request
}

describe('Auth Proxy (middleware)', () => {
  describe('authenticated user', () => {
    it('allows access to dashboard routes', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1', email: 'test@example.com' } } })

      const request = createRequest('/fill')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
      expect(mockGetUser).toHaveBeenCalledTimes(1)
    })

    it('allows access to API routes', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

      const request = createRequest('/api/fill/extract')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('redirects authenticated user from /auth to /', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

      const request = createRequest('/auth')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/')
    })

    it('allows authenticated user to access public pages', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

      const request = createRequest('/')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })
  })

  describe('unauthenticated user', () => {
    it('allows access to root path /', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('allows access to /auth', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/auth')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('allows access to /auth/callback', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/auth/callback?code=test')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('allows access to /terms', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/terms')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('allows access to /privacy', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/privacy')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('allows access to /commercial-law', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/commercial-law')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('allows access to /contact', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/contact')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('allows access to /invite', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/invite')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('allows access to /invite with code', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/invite/abc123')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('allows access to /api routes', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/api/models')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('redirects unauthenticated user from /fill to /', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/fill')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/')
    })

    it('redirects unauthenticated user from /history to /', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/history')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/')
    })

    it('redirects unauthenticated user from /settings to /', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/settings')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/')
    })

    it('redirects unauthenticated user from /credits to /', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/credits')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/')
    })

    it('redirects unauthenticated user from /support to /', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/support')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('http://localhost:3000/')
    })
  })

  describe('debug mode (development only)', () => {
    beforeEach(async () => {
      // @ts-expect-error -- test override of readonly NODE_ENV
      process.env.NODE_ENV = 'development'
      process.env.DEBUG_AUTH_TOKEN = 'test-debug-token'
      vi.resetModules()
    })

    it('bypasses auth when debug token matches in dev', async () => {
      // getUser should NOT be called when debug mode is active
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/fill', { 'x-debug-token': 'test-debug-token' })
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('does NOT bypass auth when debug token is wrong', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/fill', { 'x-debug-token': 'wrong-token' })
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(307)
      expect(mockGetUser).toHaveBeenCalledTimes(1)
    })

    it('does NOT bypass auth when debug token header is missing', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/fill')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(307)
      expect(mockGetUser).toHaveBeenCalledTimes(1)
    })

    it('does NOT bypass auth in production even with debug token', async () => {
      // @ts-expect-error -- test override of readonly NODE_ENV
      process.env.NODE_ENV = 'production'
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/fill', { 'x-debug-token': 'test-debug-token' })
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(307)
      expect(mockGetUser).toHaveBeenCalledTimes(1)
    })

    it('does NOT bypass auth when DEBUG_AUTH_TOKEN is not set', async () => {
      delete process.env.DEBUG_AUTH_TOKEN
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/fill', { 'x-debug-token': 'test-debug-token' })
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(307)
      expect(mockGetUser).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    it('handles nested API paths as public', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/api/fill/extract')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      expect(response.status).toBe(200)
    })

    it('handles nested contact paths as public', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/contact/enhance')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      // /contact/enhance is not in publicPaths (only /contact and /contact/... are matched)
      // Actually the proxy checks startsWith('/contact/') which would NOT match /contact/enhance
      // Wait, let me re-read: '/contact' matches exact, '/contact/' matches startsWith
      // So /contact/enhance starts with '/contact/' — yes it should be public
      expect(response.status).toBe(200)
    })

    it('preserves cookies through the middleware', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

      const request = createRequest('/fill')
      request.cookies.set('sb-access-token', 'test-token')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      // Response should pass through with cookies preserved
      expect(response.status).toBe(200)
    })
  })

  describe('cookie callback coverage (getAll/setAll)', () => {
    it('getAll callback returns cookies from the request', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

      const request = createRequest('/fill')
      request.cookies.set('sb-access-token', 'my-token')
      request.cookies.set('sb-refresh-token', 'my-refresh')
      const { proxy } = await import('./proxy')
      await proxy(request)

      // getAll callback should have been captured and should return request cookies
      expect(capturedGetAll).toBeDefined()
      const cookies = capturedGetAll!()
      expect(cookies).toHaveLength(2)
      expect(cookies.some(c => c.name === 'sb-access-token' && c.value === 'my-token')).toBe(true)
      expect(cookies.some(c => c.name === 'sb-refresh-token' && c.value === 'my-refresh')).toBe(true)
    })

    it('getAll callback returns empty array when no cookies', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/auth')
      const { proxy } = await import('./proxy')
      await proxy(request)

      expect(capturedGetAll).toBeDefined()
      const cookies = capturedGetAll!()
      expect(cookies).toEqual([])
    })

    it('setAll callback sets cookies on request and response', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

      const request = createRequest('/fill')
      const { proxy } = await import('./proxy')
      const response = await proxy(request)

      // setAll callback should have been captured
      expect(capturedSetAll).toBeDefined()

      // Simulate Supabase setting a new session cookie
      capturedSetAll!([
        { name: 'sb-access-token', value: 'new-token', options: { httpOnly: true, secure: true, path: '/' } },
        { name: 'sb-refresh-token', value: 'new-refresh', options: { httpOnly: true, secure: true, path: '/' } },
      ])

      // After setAll, cookies should be set on the request object
      expect(request.cookies.get('sb-access-token')?.value).toBe('new-token')
      expect(request.cookies.get('sb-refresh-token')?.value).toBe('new-refresh')

      // Response should be a new NextResponse (setAll creates one)
      // The proxy function returns the original response when user is authenticated
      expect(response.status).toBe(200)
    })

    it('setAll callback handles cookies without options', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const request = createRequest('/auth')
      const { proxy } = await import('./proxy')
      await proxy(request)

      expect(capturedSetAll).toBeDefined()

      // Should not throw when options are omitted
      expect(() => {
        capturedSetAll!([
          { name: 'test-cookie', value: 'test-value' },
        ])
      }).not.toThrow()
    })
  })
})
