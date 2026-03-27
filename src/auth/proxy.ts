import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { APP_VARIANT, DEBUG_AUTH_TOKEN, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from '@/shared/config'
import { logger } from '@/shared/lib/logger'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!,
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

  const isDev = process.env.NODE_ENV !== 'production'
  if (isDev && DEBUG_AUTH_TOKEN && request.headers.get('x-debug-token') === DEBUG_AUTH_TOKEN && !!SUPABASE_SERVICE_ROLE_KEY) {
    logger.info('shared/auth/proxy', 'DEBUG_AUTH bypass activated', { path: request.nextUrl.pathname })
    return supabaseResponse
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const publicPaths = ['/', '/auth', '/api', '/terms', '/privacy', '/commercial-law', '/contact', '/invite']
    const isPublic = publicPaths.some(p => request.nextUrl.pathname === p || request.nextUrl.pathname.startsWith(p + '/'))
    if (!isPublic) {
      const url = request.nextUrl.clone()
      if (APP_VARIANT === 'proof') {
        url.pathname = '/auth'
        url.searchParams.set('redirect', request.nextUrl.pathname)
      } else {
        url.pathname = '/'
      }
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
