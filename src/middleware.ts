// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    // 1. HARDCODED URL
    'https://bqllrdpglkpxaohwmzgf.supabase.co', 
    // 2. YOUR ANON KEY
    'sb_publishable_v5Xr_AM8zod0iDoyfNuRHA_VcTtnHyV', 
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This call refreshes the session cookie so you stay logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // SECURITY CHECK
  // Only kick the user if they try to access Admin pages without being logged in
  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

// --- THE CRITICAL FIX IS BELOW ---
export const config = {
  // Update this matcher to run on ALL pages so the session never dies
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}