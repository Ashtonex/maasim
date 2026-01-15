import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight, ShoppingBag, Star, BookOpen, PlusCircle } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton' 

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const supabase = await createClient()

  // 1. GET USER & ROLE
  const { data: { user } } = await supabase.auth.getUser()
  
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  // 2. FETCH BOOKS
  const { data: books } = await supabase
    .from('books')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // --- 3. COLOR PALETTE FOR SHADOWS (The Fun Part) ---
  const funShadows = [
    'shadow-[8px_8px_0px_0px_#00BCD4]', // Cyan
    'shadow-[8px_8px_0px_0px_#D81B60]', // Magenta
    'shadow-[8px_8px_0px_0px_#C6FF00]', // Lime
    'shadow-[8px_8px_0px_0px_#FFEA00]', // Yellow
  ]

  const funBorders = [
    'hover:border-maasim-cyan',
    'hover:border-maasim-pink',
    'hover:border-maasim-lime',
    'hover:border-maasim-yellow',
  ]

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-sans selection:bg-maasim-lime selection:text-black overflow-x-hidden">
      
      {/* --- FUN NAVBAR --- */}
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-white/90 backdrop-blur-md border-4 border-black rounded-full px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-6 md:gap-12 w-full max-w-4xl justify-between transition-transform hover:scale-[1.01]">
          
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-default">
            <div className="h-10 w-10 bg-maasim-magenta rounded-xl border-2 border-black flex items-center justify-center text-white font-black text-xl rotate-3 group-hover:rotate-12 transition-transform">
              M
            </div>
            <span className="hidden sm:block text-xl font-black tracking-tight text-slate-900 group-hover:tracking-widest transition-all">
              Maasim<span className="text-maasim-magenta">Creatives</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            
            {/* --- SMART ADMIN BUTTON --- */}
            {isAdmin ? (
               <Link href="/admin" className="hidden md:flex items-center gap-2 px-5 py-2 font-bold bg-black text-white hover:bg-slate-800 rounded-full transition border-2 border-transparent hover:scale-105 active:scale-95">
                 <PlusCircle size={18} />
                 Add Book
               </Link>
            ) : (
               !user && (
                 <Link href="/login" className="px-5 py-2 font-bold text-black hover:bg-maasim-cyan/20 rounded-full transition border-2 border-transparent hover:border-black hover:scale-105 active:scale-95">
                   Admin
                 </Link>
               )
            )}

            {/* --- LOGOUT BUTTON --- */}
            {user && (
                <div className="hidden md:block">
                    <LogoutButton />
                </div>
            )}

            <Link 
              href="/library" 
              className="bg-maasim-yellow text-black px-6 py-2 rounded-full font-black border-2 border-black shadow-[4px_4px_0px_0px_#D81B60] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#D81B60] transition-all active:scale-95 flex items-center"
            >
              My Library
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-6">
         {/* Background Elements */}
        <div className="absolute top-20 left-[-50px] w-40 h-40 bg-maasim-cyan rounded-full border-4 border-black opacity-20 blur-sm animate-pulse" />
        <div className="absolute bottom-20 right-[-20px] w-56 h-56 bg-maasim-pink rounded-full border-4 border-black opacity-20 blur-sm" />
        
        {/* Floating Icons with Bounce */}
        <Star className="absolute top-32 right-[15%] text-maasim-yellow w-12 h-12 animate-bounce hidden md:block" fill="currentColor" stroke="black" strokeWidth={3} />
        <div className="absolute top-40 left-[10%] w-8 h-8 rounded-full bg-maasim-lime border-2 border-black hidden md:block animate-bounce delay-700" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          
          {/* Fun Badge */}
          <div className="inline-flex items-center gap-2 bg-maasim-lime px-6 py-2 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_#D81B60] mb-8 -rotate-2 hover:rotate-2 hover:scale-110 transition-all cursor-default">
            <Sparkles className="w-5 h-5 text-black" />
            <span className="font-black text-black tracking-wide">THE FUN LIBRARY</span>
          </div>
          
          {/* Big Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.9] mb-8 drop-shadow-sm">
            Make Reading <br />
            <span className="text-maasim-magenta relative inline-block hover:scale-110 transition-transform cursor-pointer">
              Wobbly!
              <svg className="absolute -bottom-4 left-0 w-full h-4 text-maasim-cyan" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-800 font-bold mb-12 max-w-2xl mx-auto leading-relaxed">
            The digital library where stories pop, wiggle, and grow with you. 
            <span className="block mt-2 text-slate-600 font-semibold text-lg">Pick a book and start the adventure.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
             <a href="#bookshelf" className="group relative bg-black text-white text-xl px-10 py-5 rounded-3xl font-black shadow-[8px_8px_0px_0px_#C6FF00] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#C6FF00] hover:bg-slate-900 transition-all active:scale-95">
               Start Exploring
               <ArrowRight className="inline-block ml-3 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
             </a>
          </div>
        </div>
      </header>

      {/* --- THE BOOKSHELF --- */}
      <section id="bookshelf" className="py-24 bg-maasim-cyan/5 border-t-4 border-black border-dashed">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 inline-block bg-white px-8 py-3 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_#00BCD4] -rotate-1 hover:rotate-1 transition-transform">
              Fresh on the Shelf
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8">
            {(!books || books.length === 0) ? (
               <div className="col-span-full py-24 bg-white rounded-3xl border-4 border-black border-dashed text-center opacity-70">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-2xl font-black text-slate-500">Books are being written...</p>
               </div>
            ) : (
              books.map((book, index) => {
                // CYCLING COLORS FOR CARDS
                const shadowClass = funShadows[index % funShadows.length]
                const borderHoverClass = funBorders[index % funBorders.length]

                return (
                  <Link 
                    href={`/books/${book.id}`} 
                    key={book.id} 
                    className={`group relative flex flex-col h-full bg-white rounded-3xl border-4 border-black p-4 transition-all hover:-translate-y-2 hover:scale-105 active:scale-95 active:rotate-1 ${shadowClass} ${index % 2 === 0 ? 'rotate-1 hover:rotate-0' : '-rotate-1 hover:rotate-0'} ${borderHoverClass}`}
                  >
                    
                    {/* Image Area */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl mb-5 bg-slate-100 border-2 border-black group-hover:border-4 transition-all">
                      {book.cover_url ? (
                        <Image 
                          src={book.cover_url} 
                          alt={book.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-maasim-pink/20 text-slate-500 font-black text-lg">No Cover</div>
                      )}
                      
                      <div className="absolute -top-3 -right-3 bg-maasim-yellow text-black font-black text-lg px-4 py-2 rounded-full border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-transform">
                        ${book.price}
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 flex flex-col text-center">
                      <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
                        {book.title}
                      </h3>
                      <p className="text-slate-700 font-bold text-sm mb-6 line-clamp-2">
                        {book.description}
                      </p>
                      
                      {/* Button with matching color on hover */}
                      <button className="mt-auto w-full bg-maasim-cyan text-black py-4 rounded-xl font-black border-2 border-black hover:bg-maasim-lime transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0)] group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
                        <ShoppingBag size={20} strokeWidth={3} />
                        GRAB IT
                      </button>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-white pt-20 pb-10 mt-12 rounded-t-[3rem] mx-4 relative overflow-hidden">
         <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-32 h-32 bg-maasim-magenta rounded-full blur-3xl opacity-50" />
         
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-block p-4 bg-white rounded-3xl border-4 border-maasim-lime mb-8 -rotate-2 hover:rotate-2 transition-transform">
              <span className="text-3xl font-black text-black">Maasim<span className="text-maasim-magenta">Creatives</span></span>
          </div>
          
          <p className="text-slate-300 font-bold text-lg mb-8">Making reading weirdly wonderful.</p>
          
          <div className="flex justify-center gap-6 text-sm font-bold text-slate-400">
            <span className="hover:text-maasim-yellow cursor-pointer transition-colors hover:underline">Privacy</span>
            <span className="hover:text-maasim-yellow cursor-pointer transition-colors hover:underline">Terms</span>
            <span className="hover:text-maasim-yellow cursor-pointer transition-colors hover:underline">Parent's Guide</span>
          </div>
          
          <p className="mt-12 text-slate-500 font-bold text-xs">© 2026 Flectere. Built with 🍭 for Charlene.</p>
        </div>
      </footer>
    </div>
  )
}