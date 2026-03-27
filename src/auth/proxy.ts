import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // デバッグモード: X-Debug-Token ヘッダーがある場合は認証をスキップ（開発環境のみ）
  const isDev = process.env.NODE_ENV !== 'production'
  const debugToken = isDev ? process.env.DEBUG_AUTH_TOKEN : null
  if (isDev && debugToken && request.headers.get('x-debug-token') === debugToken) {
    return supabaseResponse
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 未認証ユーザーはLP（/）とauth・apiは通す、それ以外はauthへ
  if (!user) {
    const publicPaths = ['/', '/auth', '/api', '/terms', '/privacy', '/commercial-law', '/contact', '/invite']
    const isPublic = publicPaths.some(p => request.nextUrl.pathname === p || request.nextUrl.pathname.startsWith(p + '/'))
    if (!isPublic) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // 認証済みユーザーがauthページにいる場合はダッシュボードへ
  if (user && request.nextUrl.pathname === '/auth') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
