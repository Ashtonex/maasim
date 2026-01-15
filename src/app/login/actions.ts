'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // 1. Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // This ensures the user is redirected back to your site after email confirmation
      // If you have email confirmations disabled in Supabase, this logs them in immediately
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error('Signup Error:', error)
    return redirect('/login?message=Could not validate sign up. Password must be 6+ chars.')
  }

  // 2. Create the Profile Entry manually (since we aren't using SQL Triggers)
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      email: email, // Optional: if you added an email column to profiles
      role: 'user', // Default role
      avatar_icon: '🦁'
    })
  }

  revalidatePath('/', 'layout')
  
  // 3. Handle Email Confirmation vs Immediate Login
  if (data.session) {
    // If "Confirm Email" is OFF in Supabase, they are logged in now.
    redirect('/')
  } else {
    // If "Confirm Email" is ON, tell them to check their inbox.
    redirect('/login?message=Check email to continue sign in process')
  }
}