import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Download, BookOpen, Star, LogOut, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function UserDashboard() {
  const supabase = await createClient()

  // 1. Security Check: Are they logged in?
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Fetch My Library (Join 'library' table with 'books' details)
  const { data: libraryItems } = await supabase
    .from('library')
    .select('*, book:books(*)') // <--- The Magic Join
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // 3. Get User Profile (Just to say "Hi")
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', user.id)
    .single()

  // Simple trick to get a name from email (norman@gmail.com -> Norman)
  const username = profile?.email?.split('@')[0] || 'Friend'

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-sans selection:bg-maasim-lime selection:text-black pb-20">
      
      {/* --- KIDS NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-maasim-cyan border-b-4 border-black px-6 py-3 flex items-center justify-between shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-3">
          <div className="bg-white border-2 border-black p-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
             <span className="font-black text-xl tracking-tighter text-black">
               MY<span className="text-maasim-magenta">ROOM</span>
             </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full border-2 border-black/10 font-bold text-black/70">
            <Star className="text-maasim-yellow fill-maasim-yellow" />
            <span>Member</span>
          </div>
          
          {/* Sign Out Button */}
          <form action="/auth/signout" method="post">
             <button className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition flex items-center gap-2 text-sm">
               <LogOut size={16} /> Log Out
             </button>
          </form>
        </div>
      </nav>

      {/* --- WELCOME HEADER --- */}
      <header className="container mx-auto px-6 pt-12 pb-8">
        <div className="bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_#C6FF00] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase">
              Hi, {username}! 👋
            </h1>
            <p className="text-slate-500 font-bold mt-2 text-lg">
              You have {libraryItems?.length || 0} books in your collection.
            </p>
          </div>
          
          <Link 
            href="/"
            className="bg-maasim-yellow text-black px-8 py-4 rounded-2xl font-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none hover:rotate-1 transition-all flex items-center gap-2"
          >
            <Search strokeWidth={3} /> Find More Books
          </Link>
        </div>
      </header>

      {/* --- THE WOODEN BOOKSHELF --- */}
      <main className="container mx-auto px-6 mt-8">
        
        {/* Shelf Background Container */}
        <div className="bg-[#EAD4AA] border-x-8 border-t-8 border-[#5D4037] rounded-t-3xl min-h-[600px] p-8 relative shadow-inner">
           
           {/* Wood Texture Pattern (CSS Trick) */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px'}}></div>

          {(!libraryItems || libraryItems.length === 0) ? (
            // STATE: EMPTY SHELF
            <div className="flex flex-col items-center justify-center py-20 text-center relative z-10">
              <div className="bg-white p-6 rounded-full border-4 border-black mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
                <BookOpen size={64} className="text-maasim-magenta" />
              </div>
              <h2 className="text-3xl font-black text-[#5D4037] mb-2">Your shelf is empty!</h2>
              <p className="text-[#8D6E63] font-bold mb-8">Time to go on an adventure.</p>
            </div>
          ) : (
            // STATE: FULL SHELF (Grid)
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16 relative z-10">
              
              {libraryItems.map((item) => {
                const book = item.book
                if (!book) return null

                return (
                  <div key={item.id} className="group flex flex-col">
                    
                    {/* Book Cover (Wobbly Hover Effect) */}
                    <div className="relative aspect-[3/4] w-full bg-white rounded-r-xl rounded-l-sm border-r-4 border-b-4 border-t-2 border-l-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:-translate-y-4 group-hover:rotate-2 origin-bottom-left cursor-pointer">
                      
                      {/* Spine Effect (Left Edge) */}
                      <div className="absolute top-0 bottom-0 left-0 w-2 bg-slate-200 border-r border-slate-300 z-20"></div>

                      {book.cover_url ? (
                        <Image 
                          src={book.cover_url} 
                          alt={book.title}
                          fill
                          className="object-cover rounded-r-lg pl-2"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center pl-2 font-black text-slate-300">NO COVER</div>
                      )}
                    </div>

                    {/* Shelf Shadow (Under the book) */}
                    <div className="h-2 w-[90%] mx-auto bg-black/20 blur-sm rounded-full mt-2 group-hover:w-[70%] group-hover:bg-black/10 transition-all"></div>

                    {/* Download Button (Appears below shelf) */}
                    <div className="mt-4 text-center">
                      <h3 className="font-black text-slate-900 leading-tight mb-2 line-clamp-1">{book.title}</h3>
                      
                      <a 
                        href={`/api/download?bookId=${book.id}`}
                        target="_blank" // Opens in new tab to start download
                        className="inline-flex items-center gap-2 bg-maasim-lime text-black px-4 py-2 rounded-xl font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-0.5 hover:shadow-none transition-all text-sm uppercase tracking-wide"
                      >
                        <Download size={16} strokeWidth={3} />
                        Download PDF
                      </a>
                    </div>

                  </div>
                )
              })}

            </div>
          )}

          {/* Literal Shelf Lines (Horizontal bars to look like shelves) */}
          <div className="absolute top-[320px] left-0 right-0 h-8 bg-[#5D4037] shadow-xl z-0 pointer-events-none"></div>
          <div className="absolute top-[640px] left-0 right-0 h-8 bg-[#5D4037] shadow-xl z-0 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#5D4037] shadow-xl z-0 pointer-events-none"></div>
        </div>
      </main>

    </div>
  )
}