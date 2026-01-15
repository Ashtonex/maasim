import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// 1. CHANGED "GET" TO "POST"
export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Check if a user session exists
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()
  }

  // Clear cache so the layout updates (removes the user avatar immediately)
  revalidatePath('/', 'layout')
  
  // Redirect to login page after sign out
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })
}