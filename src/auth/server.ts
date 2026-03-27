import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import {
  DEBUG_AUTH_TOKEN,
  DEBUG_USER_ID,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
} from '@/shared/config'
import { logger } from '@/shared/lib/logger'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!,
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
  const isDebug = isDev && !!DEBUG_AUTH_TOKEN && headersList.get('x-debug-token') === DEBUG_AUTH_TOKEN

  if (isDebug) {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      logger.warn('shared/auth/server', 'SUPABASE_SERVICE_ROLE_KEY not set, debug mode will use anon key')
    }

    const supabase = createServerClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY!,
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
        id: DEBUG_USER_ID || 'debug-user',
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
    SUPABASE_URL!,
    SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  )
}
