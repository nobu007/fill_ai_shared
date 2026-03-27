import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { APP_VARIANT, AUTH_PUBLIC_PATHS } from '@/shared/config'
import { logger } from '@/shared/lib/logger'

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || ''
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
}

function getDebugAuthToken() {
  return process.env.DEBUG_AUTH_TOKEN || ''
}

function getAppVariant() {
  const envVariant = process.env.NEXT_PUBLIC_APP_VARIANT
  if (envVariant === 'proof' || envVariant === 'fill') {
    return envVariant
  }
  return APP_VARIANT
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
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
  const debugToken = getDebugAuthToken()
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
      if (getAppVariant() === 'proof') {
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
