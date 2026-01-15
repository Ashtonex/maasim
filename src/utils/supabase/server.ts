import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // I have pasted your REAL credentials here to bypass the .env file issues
  const url = 'https://bqllrdpglkpxaohwmzgf.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Keep using env for key, or hardcode it too if needed

  return createServerClient(
    url,
    key,
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
            // Ignored
          }
        },
      },
    }
  )
}