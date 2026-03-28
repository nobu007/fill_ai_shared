import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { logger } from '../lib/logger'

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || ''
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
}

function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || ''
}

function getDebugAuthToken() {
  return process.env.DEBUG_AUTH_TOKEN || ''
}

function getDebugUserId() {
  return process.env.DEBUG_USER_ID || ''
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Called from Server Components; ignore.
          }
        },
      },
    }
  )
}

export async function createClientWithDebug() {
  const isDev = process.env.NODE_ENV !== 'production'
  const headersList = await headers()
  const debugToken = getDebugAuthToken()
  const debugUserId = getDebugUserId()
  const serviceRoleKey = getSupabaseServiceRoleKey()
  const anonKey = getSupabaseAnonKey()
  const isDebug = isDev && !!debugToken && headersList.get('x-debug-token') === debugToken

  if (isDebug) {
    if (!serviceRoleKey) {
      logger.warn('shared/auth/server', 'SUPABASE_SERVICE_ROLE_KEY not set, debug mode will use anon key')
    }

    const supabase = createServerClient(
      getSupabaseUrl(),
      serviceRoleKey || anonKey,
      {
        cookies: {
          getAll: () => [],
          setAll: () => {},
        },
      }
    )

    return {
      supabase,
      user: {
        id: debugUserId || 'debug-user',
        email: 'debug@example.com',
      },
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}

export function createServiceClient() {
  return createServerClient(
    getSupabaseUrl(),
    getSupabaseServiceRoleKey(),
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  )
}
