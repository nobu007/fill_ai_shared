import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { logger } from '@/shared/lib/logger'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )
}

/**
 * デバッグモード付きのcreateClient。
 * X-Debug-Tokenヘッダーが一致する場合、DEBUG_USER_IDでSupabaseにアクセスする。
 * 使い方: `const { supabase, user } = await createClientWithDebug()`
 * これに置き換えれば、各API routeの書き換えは最小限で済む。
 */
export async function createClientWithDebug() {
  // デバッグモードは開発環境のみ有効（本番では無効化）
  const isDev = process.env.NODE_ENV !== 'production'
  const debugToken = isDev ? process.env.DEBUG_AUTH_TOKEN : null
  const headersList = await headers()
  const isDebug = isDev && debugToken && headersList.get('x-debug-token') === debugToken

  if (isDebug) {
    // デバッグモード: service_roleクライアントで任意ユーザーとして操作
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      logger.warn('shared/auth/server', 'SUPABASE_SERVICE_ROLE_KEY not set, debug mode will use anon key')
    }
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: { getAll: () => [], setAll: () => {} },
      }
    )
    const user = { id: process.env.DEBUG_USER_ID || 'debug-user', email: 'debug@example.com' }
    return { supabase, user }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}

/**
 * Service role client — bypasses RLS.
 * Use only in server-side contexts where you need admin access
 * (webhooks, cron jobs, etc.).
 */
export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
    }
  )
}
