import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AvatarPicker from '@/app/components/AvatarPicker'
import LibraryContent from './LibraryContent' // <--- Import the Client Component

export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
  const supabase = await createClient()

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  // 2. Fetch User's Library
  const { data: libraryItems } = await supabase
    .from('library')
    .select(`
      created_at,
      book:books (
        id,
        title,
        description,
        cover_url,
        is_published
      )
    `)
    .eq('user_id', user.id)
    .not('book', 'is', null) 

  // 3. Fetch User Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_icon')
    .eq('id', user.id)
    .single()

  // Flatten the data
  const myBooks = libraryItems?.map((item: any) => ({
    ...item.book, 
    added_at: item.created_at
  })) || []

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-sans selection:bg-maasim-magenta selection:text-white pb-20">
      
      {/* --- MINI NAVBAR --- */}
      <nav className="sticky top-4 z-40 px-4 mb-12">
        <div className="bg-white/90 backdrop-blur-md border-4 border-black rounded-full px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between max-w-6xl mx-auto">
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-black text-white p-2 rounded-full group-hover:-translate-x-1 transition-transform">
                <ArrowLeft size={20} strokeWidth={3} />
            </div>
            <span className="font-black text-lg hidden sm:block">Back to Store</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700 hidden sm:block text-right leading-tight">
              My<br/>Stash
            </span>
            <AvatarPicker currentAvatar={profile?.avatar_icon} />
          </div>
        </div>
      </nav>

      {/* --- CONTENT (Header + Grid) --- */}
      {/* This component handles the search state and filtering */}
      <LibraryContent books={myBooks} />
      
    </div>
  )
}