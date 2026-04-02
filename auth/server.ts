import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { DEBUG_AUTH_TOKEN, DEBUG_USER_ID, IS_PRODUCTION, SUPABASE_SERVICE_ROLE_KEY } from '../config'
import { logger } from '../lib/logger'

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || ''
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
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
  const isDev = !IS_PRODUCTION
  const headersList = await headers()
  const debugToken = DEBUG_AUTH_TOKEN
  const debugUserId = DEBUG_USER_ID
  const serviceRoleKey = SUPABASE_SERVICE_ROLE_KEY
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
      isDebug: true,
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user, isDebug: false }
}

export function createServiceClient() {
  return createServerClient(
    getSupabaseUrl(),
    SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  )
}
