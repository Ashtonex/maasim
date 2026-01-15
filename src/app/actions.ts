'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAvatar(avatar: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Upsert: Update if exists, Insert if it's a new user profile
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, avatar_icon: avatar })

  if (error) {
    console.error('Error updating avatar:', error)
    return
  }

  // Refresh the library page so the new avatar shows up immediately
  revalidatePath('/library')
}