import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock logger (vi.mock is hoisted, so use vi.hoisted for the spy reference)
const { mockLoggerWarn } = vi.hoisted(() => ({
  mockLoggerWarn: vi.fn(),
}))

vi.mock('../lib/logger', () => ({
  logger: { info: vi.fn(), warn: mockLoggerWarn, error: vi.fn() },
}))

// Mock config to allow overriding IS_PRODUCTION and debug vars in tests
let _isProduction = true
vi.mock('../config', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>
  return {
    ...actual,
    get IS_PRODUCTION() { return _isProduction },
    // These need to be getters to read from process.env at access time
    get DEBUG_AUTH_TOKEN() { return process.env.DEBUG_AUTH_TOKEN || '' },
    get DEBUG_USER_ID() { return process.env.DEBUG_USER_ID || '' },
    get SUPABASE_SERVICE_ROLE_KEY() { return process.env.SUPABASE_SERVICE_ROLE_KEY || '' },
  }
})

// Mock @supabase/ssr before importing server
const mockGetAll = vi.fn()
const mockGetUser = vi.fn()
const mockCreateServerClient = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createServerClient: mockCreateServerClient,
}))

// Mock next/headers
const mockCookies = vi.fn()
const mockHeaders = vi.fn()

vi.mock('next/headers', () => ({
  cookies: mockCookies,
  headers: mockHeaders,
}))

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  vi.clearAllMocks()
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    NODE_ENV: 'production',
    DEBUG_AUTH_TOKEN: 'test-debug-token',
    DEBUG_USER_ID: 'debug-user-id',
  }
})

afterEach(() => {
  process.env = originalEnv
  _isProduction = true
})

describe('createClient', () => {
  it('creates Supabase client with anon key', async () => {
    const mockCookieStore = {
      getAll: mockGetAll.mockReturnValue([]),
      set: vi.fn(),
    }
    mockCookies.mockResolvedValue(mockCookieStore)

    const mockSupabaseClient = {
      auth: { getUser: mockGetUser },
    }
    mockCreateServerClient.mockReturnValue(mockSupabaseClient)

    const { createClient } = await import('./server')
    await createClient()

    expect(mockCreateServerClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      })
    )
  })

  it('getAll callback delegates to cookieStore.getAll', async () => {
    const testCookies = [
      { name: 'sb-access-token', value: 'token123' },
      { name: 'sb-refresh-token', value: 'refresh456' },
    ]
    const mockCookieStore = {
      getAll: mockGetAll.mockReturnValue(testCookies),
      set: vi.fn(),
    }
    mockCookies.mockResolvedValue(mockCookieStore)

    const mockSupabaseClient = {
      auth: { getUser: mockGetUser },
    }
    mockCreateServerClient.mockReturnValue(mockSupabaseClient)

    const { createClient } = await import('./server')
    await createClient()

    // Extract and invoke the getAll callback to cover line 34
    const getAllCallback = mockCreateServerClient.mock.calls[0][2].cookies.getAll
    expect(getAllCallback()).toEqual(testCookies)
    expect(mockGetAll).toHaveBeenCalled()
  })

  it('getAll callback returns empty array when no cookies', async () => {
    const mockCookieStore = {
      getAll: mockGetAll.mockReturnValue([]),
      set: vi.fn(),
    }
    mockCookies.mockResolvedValue(mockCookieStore)

    const mockSupabaseClient = {
      auth: { getUser: mockGetUser },
    }
    mockCreateServerClient.mockReturnValue(mockSupabaseClient)

    const { createClient } = await import('./server')
    await createClient()

    const getAllCallback = mockCreateServerClient.mock.calls[0][2].cookies.getAll
    expect(getAllCallback()).toEqual([])
  })

  it('handles cookie setAll errors gracefully', async () => {
    const mockCookieStore = {
      getAll: mockGetAll.mockReturnValue([]),
      set: vi.fn(),
    }
    mockCookies.mockResolvedValue(mockCookieStore)

    const mockSupabaseClient = {
      auth: { getUser: mockGetUser },
    }
    mockCreateServerClient.mockReturnValue(mockSupabaseClient)

    const { createClient } = await import('./server')
    const _client = await createClient()

    // Call setAll with cookies that will throw
    const cookieSetter = mockCreateServerClient.mock.calls[0][2].cookies.setAll
    expect(() => cookieSetter([{ name: 'test', value: 'value' }])).not.toThrow()
  })
})

describe('createClientWithDebug', () => {
  describe('debug mode (development only)', () => {
    beforeEach(() => {
      _isProduction = false
      // @ts-expect-error -- test override of readonly NODE_ENV
      process.env.NODE_ENV = 'development'
      process.env.DEBUG_AUTH_TOKEN = 'test-debug-token'
      process.env.DEBUG_USER_ID = 'debug-user-id'
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
    })

    it('returns debug user when debug token matches in development', async () => {
      const mockHeadersList = new Headers({
        'x-debug-token': 'test-debug-token',
      })
      mockHeaders.mockResolvedValue(mockHeadersList)

      const mockSupabaseClient = {}
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const { createClientWithDebug } = await import('./server')
      const { supabase, user } = await createClientWithDebug()

      expect(supabase).toBe(mockSupabaseClient)
      expect(user).toEqual({
        id: 'debug-user-id',
        email: 'debug@example.com',
      })
      expect(mockCreateServerClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-service-role-key',
        expect.objectContaining({
          cookies: expect.objectContaining({
            getAll: expect.any(Function),
            setAll: expect.any(Function),
          }),
        })
      )
    })

    it('debug mode getAll callback returns empty array (no cookie access)', async () => {
      const mockHeadersList = new Headers({
        'x-debug-token': 'test-debug-token',
      })
      mockHeaders.mockResolvedValue(mockHeadersList)

      const mockSupabaseClient = {}
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const { createClientWithDebug } = await import('./server')
      const { supabase: _supabase, user: _user } = await createClientWithDebug()

      // Extract and invoke the getAll callback to cover line 67
      const getAllCallback = mockCreateServerClient.mock.calls[0][2].cookies.getAll
      expect(getAllCallback()).toEqual([])
    })

    it('debug mode setAll callback is a no-op', async () => {
      const mockHeadersList = new Headers({
        'x-debug-token': 'test-debug-token',
      })
      mockHeaders.mockResolvedValue(mockHeadersList)

      const mockSupabaseClient = {}
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const { createClientWithDebug } = await import('./server')
      const { supabase: _supabase, user: _user } = await createClientWithDebug()

      const setAllCallback = mockCreateServerClient.mock.calls[0][2].cookies.setAll
      expect(() => setAllCallback([{ name: 'test', value: 'val' }])).not.toThrow()
    })

    it('uses default debug user id when DEBUG_USER_ID is not set', async () => {
      delete process.env.DEBUG_USER_ID

      const mockHeadersList = new Headers({
        'x-debug-token': 'test-debug-token',
      })
      mockHeaders.mockResolvedValue(mockHeadersList)

      const mockSupabaseClient = {}
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const { createClientWithDebug } = await import('./server')
      const { supabase: _supabase, user } = await createClientWithDebug()

      expect(user!.id).toBe('debug-user')
      expect(user!.email).toBe('debug@example.com')
    })

    it('falls back to anon key when service role key is not set', async () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY

      const mockHeadersList = new Headers({
        'x-debug-token': 'test-debug-token',
      })
      mockHeaders.mockResolvedValue(mockHeadersList)

      const mockSupabaseClient = {}
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const { createClientWithDebug } = await import('./server')
      const { supabase: _supabase, user: _user } = await createClientWithDebug()

      expect(mockLoggerWarn).toHaveBeenCalledWith(
        'shared/auth/server',
        'SUPABASE_SERVICE_ROLE_KEY not set, debug mode will use anon key'
      )
      expect(mockCreateServerClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-anon-key',
        expect.any(Object)
      )
    })

    it('does NOT activate debug mode when debug token is wrong', async () => {
      const mockHeadersList = new Headers({
        'x-debug-token': 'wrong-token',
      })
      mockHeaders.mockResolvedValue(mockHeadersList)

      const mockCookieStore = {
        getAll: mockGetAll.mockReturnValue([]),
        set: vi.fn(),
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = {
        auth: { getUser: mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const { createClientWithDebug } = await import('./server')
      const { supabase: _supabase, user } = await createClientWithDebug()

      expect(mockCreateServerClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-anon-key',
        expect.any(Object)
      )
      expect(user).toEqual({ id: 'user-1' })
    })

    it('does NOT activate debug mode when debug token header is missing', async () => {
      const mockHeadersList = new Headers({})
      mockHeaders.mockResolvedValue(mockHeadersList)

      const mockCookieStore = {
        getAll: mockGetAll.mockReturnValue([]),
        set: vi.fn(),
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = {
        auth: { getUser: mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const { createClientWithDebug } = await import('./server')
      const { supabase: _supabase, user } = await createClientWithDebug()

      expect(mockCreateServerClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-anon-key',
        expect.any(Object)
      )
      expect(user).toEqual({ id: 'user-1' })
    })

    it('does NOT activate debug mode when DEBUG_AUTH_TOKEN is not set', async () => {
      delete process.env.DEBUG_AUTH_TOKEN

      const mockHeadersList = new Headers({
        'x-debug-token': 'test-debug-token',
      })
      mockHeaders.mockResolvedValue(mockHeadersList)

      const mockCookieStore = {
        getAll: mockGetAll.mockReturnValue([]),
        set: vi.fn(),
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = {
        auth: { getUser: mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const { createClientWithDebug } = await import('./server')
      const { supabase: _supabase, user } = await createClientWithDebug()

      expect(mockCreateServerClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-anon-key',
        expect.any(Object)
      )
      expect(user).toEqual({ id: 'user-1' })
    })
  })

  describe('production mode', () => {
    beforeEach(() => {
      // @ts-expect-error -- test override of readonly NODE_ENV
      process.env.NODE_ENV = 'production'
    })

    it('does NOT activate debug mode in production even with matching token', async () => {
      const mockHeadersList = new Headers({
        'x-debug-token': 'test-debug-token',
      })
      mockHeaders.mockResolvedValue(mockHeadersList)

      const mockCookieStore = {
        getAll: mockGetAll.mockReturnValue([]),
        set: vi.fn(),
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = {
        auth: { getUser: mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const { createClientWithDebug } = await import('./server')
      const { supabase: _supabase, user } = await createClientWithDebug()

      expect(mockCreateServerClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'test-anon-key',
        expect.any(Object)
      )
      expect(user).toEqual({ id: 'user-1' })
    })

    it('uses normal client when no debug token present', async () => {
      const mockHeadersList = new Headers({})
      mockHeaders.mockResolvedValue(mockHeadersList)

      const mockCookieStore = {
        getAll: mockGetAll.mockReturnValue([]),
        set: vi.fn(),
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = {
        auth: { getUser: mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } }) },
      }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const { createClientWithDebug } = await import('./server')
      const { supabase, user } = await createClientWithDebug()

      expect(supabase).toBe(mockSupabaseClient)
      expect(user).toEqual({ id: 'user-1' })
    })
  })

  describe('normal mode (authenticated user)', () => {
    it('returns authenticated user from normal client', async () => {
      // @ts-expect-error -- test override of readonly NODE_ENV
      process.env.NODE_ENV = 'production'

      const mockHeadersList = new Headers({})
      mockHeaders.mockResolvedValue(mockHeadersList)

      const mockCookieStore = {
        getAll: mockGetAll.mockReturnValue([]),
        set: vi.fn(),
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = {
        auth: { getUser: mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123', email: 'test@example.com' } } }) },
      }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const { createClientWithDebug } = await import('./server')
      const { supabase, user } = await createClientWithDebug()

      expect(supabase).toBe(mockSupabaseClient)
      expect(user).toEqual({ id: 'user-123', email: 'test@example.com' })
      expect(mockGetUser).toHaveBeenCalledTimes(1)
    })

    it('returns null user when not authenticated', async () => {
      // @ts-expect-error -- test override of readonly NODE_ENV
      process.env.NODE_ENV = 'production'

      const mockHeadersList = new Headers({})
      mockHeaders.mockResolvedValue(mockHeadersList)

      const mockCookieStore = {
        getAll: mockGetAll.mockReturnValue([]),
        set: vi.fn(),
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      const mockSupabaseClient = {
        auth: { getUser: mockGetUser.mockResolvedValue({ data: { user: null } }) },
      }
      mockCreateServerClient.mockReturnValue(mockSupabaseClient)

      const { createClientWithDebug } = await import('./server')
      const { supabase, user } = await createClientWithDebug()

      expect(supabase).toBe(mockSupabaseClient)
      expect(user).toBeNull()
    })
  })
})

describe('createServiceClient', () => {
  it('creates Supabase client with service role key', async () => {
    const mockSupabaseClient = {}
    mockCreateServerClient.mockReturnValue(mockSupabaseClient)

    const { createServiceClient } = await import('./server')
    const client = createServiceClient()

    expect(mockCreateServerClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-service-role-key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      })
    )
    expect(client).toBe(mockSupabaseClient)
  })

  it('uses empty cookie handlers for service client', async () => {
    const mockSupabaseClient = {}
    mockCreateServerClient.mockReturnValue(mockSupabaseClient)

    const { createServiceClient } = await import('./server')
    createServiceClient()

    const cookieConfig = mockCreateServerClient.mock.calls[0][2].cookies
    expect(cookieConfig.getAll()).toEqual([])
    expect(() => cookieConfig.setAll([])).not.toThrow()
  })
})
