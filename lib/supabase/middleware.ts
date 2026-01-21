import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Check if route should skip auth entirely
function shouldSkipAuth(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/) !== null
  )
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip auth logic entirely for static assets and API routes
  if (shouldSkipAuth(pathname)) {
    return NextResponse.next()
  }

  // Validate environment variables - fail open if missing
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Middleware] Missing Supabase environment variables - failing open')
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(
            cookiesToSet: {
              name: string
              value: string
              options?: {
                path?: string
                domain?: string
                maxAge?: number
                expires?: Date
                httpOnly?: boolean
                secure?: boolean
                sameSite?: 'strict' | 'lax' | 'none'
              }
            }[]
          ) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                request.cookies.set({
                  name,
                  value,
                  ...(options ?? {})
                })
              })
              supabaseResponse = NextResponse.next({
                request,
              })
              cookiesToSet.forEach(({ name, value, options }) => {
                supabaseResponse.cookies.set({
                  name,
                  value,
                  ...(options ?? {})
                })
              })
            } catch (error) {
              // Cookie setting can fail in Edge runtime - log but don't crash
              console.error('[Middleware] Cookie setting error:', error)
            }
          },
        },
      }
    )

    // Attempt to refresh the auth token
    let user = null
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('[Middleware] Auth error:', error.message)
      }
      user = data?.user ?? null
    } catch (error) {
      console.error('[Middleware] Failed to get user:', error)
      // Continue without user - fail open
    }

    // Protected routes - redirect to login if not authenticated
    if (!user && pathname.startsWith('/dashboard')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if (user && (pathname === '/login' || pathname === '/signup')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    // Catch-all for any unexpected errors - log and fail open
    console.error('[Middleware] Unexpected error:', error)
    return NextResponse.next()
  }
}
