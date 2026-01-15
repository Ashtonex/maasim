import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Search, ArrowLeft, Star, Play, Ghost } from 'lucide-react'
import AvatarPicker from '@/app/components/AvatarPicker' // Import the picker

export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
  const supabase = await createClient()

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // 2. Fetch User's Library (The Join)
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

  // 3. Fetch User Profile (For the Avatar)
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_icon')
    .eq('id', user.id)
    .single()

  // Flatten the data for easier mapping
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
            
            {/* The Interactive Avatar Picker */}
            <AvatarPicker currentAvatar={profile?.avatar_icon} />
          </div>
        </div>
      </nav>

      {/* --- HEADER --- */}
      <div className="container mx-auto px-6 max-w-6xl mb-12">
        <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-maasim-pink text-black px-4 py-1 rounded-full border-2 border-black mb-4 rotate-2">
               <Star size={16} fill="black" /> 
               <span className="font-black text-xs uppercase tracking-widest">Reader Mode</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9]">
              Your <br/>
              <span className="text-maasim-cyan relative inline-block">
                Collection
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-black opacity-20" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="5" fill="none" />
                </svg>
              </span>
            </h1>
          </div>

          <div className="w-full md:w-auto relative">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-400" strokeWidth={3} />
             </div>
             <input 
                type="text" 
                placeholder="Search your stash..." 
                className="w-full md:w-80 bg-white border-4 border-black rounded-2xl py-4 pl-12 pr-4 font-bold text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all placeholder:text-slate-300"
             />
          </div>
        </div>
      </div>

      {/* --- BOOK GRID --- */}
      <div className="container mx-auto px-6 max-w-6xl">
        
        {myBooks.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-3xl border-4 border-black border-dashed p-12 text-center max-w-2xl mx-auto mt-12 opacity-80">
            <div className="bg-slate-100 w-24 h-24 rounded-full border-4 border-slate-300 flex items-center justify-center mx-auto mb-6">
                <Ghost size={40} className="text-slate-400" />
            </div>
            <h2 className="text-3xl font-black mb-2 text-slate-900">It's a ghost town!</h2>
            <p className="text-slate-500 font-medium mb-8 text-lg">You haven't added any books yet.</p>
            <Link href="/#bookshelf" className="inline-block bg-maasim-yellow text-black px-8 py-4 rounded-xl font-black text-lg hover:-translate-y-1 transition-transform border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
               Go to Store
            </Link>
          </div>
        ) : (
          /* FILLED GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {myBooks.map((book: any, index: number) => (
              <div 
                key={book.id} 
                /* Added 'animate-wiggle' here for the hover effect */
                className="group relative bg-white rounded-3xl border-4 border-black p-3 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-wiggle transition-all duration-300"
              >
                {/* Cover Container */}
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border-2 border-black mb-4">
                    {book.cover_url ? (
                        <Image 
                            src={book.cover_url} 
                            alt={book.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-maasim-cyan/20 text-slate-400 font-black text-center px-4">
                          {book.title}
                        </div>
                    )}
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                        <Link href={`/read/${book.id}`} className="scale-0 group-hover:scale-100 bg-maasim-lime text-black w-16 h-16 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:scale-110 active:scale-95">
                            <Play size={32} fill="black" className="ml-1" />
                        </Link>
                    </div>
                </div>

                {/* Details */}
                <div className="px-2 pb-2">
                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-1 line-clamp-1">{book.title}</h3>
                    <div className="flex justify-between items-center mt-3">
                        <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-wider">
                           Purchased
                        </span>
                        <Link 
                            href={`/read/${book.id}`} 
                            className="text-sm font-black underline decoration-2 decoration-maasim-magenta underline-offset-4 hover:bg-maasim-magenta hover:text-white hover:no-underline px-2 rounded transition-all"
                        >
                            Open Book
                        </Link>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}