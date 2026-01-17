import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, Cloud, Heart, Sparkles } from 'lucide-react'
import BookReader from '@/components/BookReader'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ReadPage({ params }: Props) {
  const supabase = await createClient()
  const { id } = await params

  // 1. AUTH & PERMISSIONS
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/read/${id}`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  const isAdmin = profile?.role === 'admin'

  // Access Check
  if (!isAdmin) {
    const { data: ownership } = await supabase
      .from('library')
      .select('id')
      .eq('user_id', user.id)
      .eq('book_id', id)
      .single()

    if (!ownership) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF5] text-center px-4 overflow-hidden relative">
             {/* Background blobs */}
            <div className="absolute top-10 left-10 text-maasim-pink animate-bounce"><Star size={40} fill="currentColor" /></div>
            <div className="absolute bottom-20 right-20 text-maasim-cyan animate-pulse"><Cloud size={60} fill="currentColor" /></div>
            
            <h1 className="text-4xl font-black mb-4 text-slate-900 relative z-10">Oopsie!</h1>
            <p className="text-slate-600 font-bold mb-8 text-lg relative z-10">You don't have this book in your backpack yet.</p>
            <Link href={`/books/${id}`} className="relative z-10 bg-maasim-magenta text-white px-8 py-4 rounded-3xl font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              Go Get It!
            </Link>
        </div>
      )
    }
  }

  // 2. FETCH BOOK
  const { data: book } = await supabase.from('books').select('*').eq('id', id).single()

  if (!book || !book.file_url) return <div>Book content missing!</div>

  return (
    // --- MAIN WRAPPER ---
    <div className="h-screen w-screen flex flex-col bg-[#FFFDF5] relative overflow-hidden selection:bg-maasim-lime">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      </div>
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-maasim-cyan rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-maasim-pink rounded-full blur-3xl opacity-20 pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="relative z-20 px-6 py-3 flex items-center justify-between shrink-0 h-16 md:h-20">
        
        {/* Back Button */}
        <Link 
          href="/library" 
          className="group flex items-center gap-3 bg-white px-4 py-2 md:px-5 md:py-3 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_#C6FF00] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#C6FF00] transition-all"
        >
           <div className="bg-black text-white p-1 rounded-full group-hover:rotate-[-10deg] transition-transform">
             <ArrowLeft size={18} strokeWidth={3} />
           </div>
           <span className="font-black text-slate-900 hidden sm:inline text-sm md:text-base">Library</span>
        </Link>

        {/* Title Badge */}
        <div className="hidden md:flex items-center gap-2 bg-maasim-yellow px-6 py-2 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          <Sparkles size={18} className="text-black" />
          <span className="font-black text-black truncate max-w-[300px]">{book.title}</span>
        </div>

        {/* Admin Badge */}
        {isAdmin && (
           <span className="text-[10px] md:text-xs font-black bg-maasim-magenta text-white px-3 py-1 md:px-4 md:py-2 rounded-xl border-2 border-black rotate-2 shadow-sm">
             ADMIN
           </span>
        )}
      </div>

      {/* --- READER AREA (The "Tablet") --- */}
      <div className="flex-1 flex justify-center items-center p-2 md:p-6 relative z-10 overflow-hidden">
        
        {/* Floating Stickers */}
        <Star className="absolute top-[15%] left-[5%] text-maasim-yellow w-10 h-10 animate-bounce hidden lg:block drop-shadow-md" fill="currentColor" stroke="black" strokeWidth={2} />
        <Heart className="absolute bottom-[15%] right-[5%] text-maasim-pink w-8 h-8 animate-pulse hidden lg:block drop-shadow-md" fill="currentColor" stroke="black" strokeWidth={2} />

        {/* BOOK CONTAINER - WIDER NOW (max-w-7xl) */}
        <div className="w-full max-w-7xl h-full flex flex-col items-center justify-center">
             {/* We removed the 'bg-white rounded-3xl border-[6px]' wrapper here 
                because the BookReader component now has its own tablet frame.
                This prevents the "Double Frame" look and gives the book more space.
             */}
             <BookReader url={book.file_url} title={book.title} />
        </div>
      </div>

    </div>
  )
}