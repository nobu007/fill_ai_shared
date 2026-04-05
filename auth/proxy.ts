import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { AUTH_PUBLIC_PATHS, DEBUG_AUTH_TOKEN, IS_PRODUCTION, SUPABASE_URL, SUPABASE_ANON_KEY } from '../config'
import { logger } from '../lib/logger'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const isDev = !IS_PRODUCTION
  const debugToken = DEBUG_AUTH_TOKEN
  if (isDev && debugToken && request.headers.get('x-debug-token') === debugToken) {
    logger.info('shared/auth/proxy', 'DEBUG_AUTH bypass activated', { path: request.nextUrl.pathname })
    return supabaseResponse
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const isPublic = AUTH_PUBLIC_PATHS.some(
      p => request.nextUrl.pathname === p || request.nextUrl.pathname.startsWith(p + '/')
    )
    if (!isPublic) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  if (user && request.nextUrl.pathname === '/auth') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
