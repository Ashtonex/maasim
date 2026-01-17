'use client'

import { useState, useEffect, useRef, MouseEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Play, Ghost, Star, X, Sparkles, Frown, Zap, Heart } from 'lucide-react'

// --- TYPES ---
type Book = {
  id: string
  title: string
  cover_url: string | null
  description: string | null
  added_at: string
}

// --- SUB-COMPONENT: MAGICAL 3D CARD ---
// This handles the tilt physics and glare effect for a single book
function MagicalCard({ book, index, isNew }: { book: Book; index: number; isNew: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  // Themes cycle based on index
  const themes = [
    { border: 'border-maasim-pink', shadow: 'bg-maasim-pink', badge: 'bg-maasim-pink' },
    { border: 'border-maasim-cyan', shadow: 'bg-maasim-cyan', badge: 'bg-maasim-cyan' },
    { border: 'border-maasim-lime', shadow: 'bg-maasim-lime', badge: 'bg-maasim-lime' },
    { border: 'border-maasim-yellow', shadow: 'bg-maasim-yellow', badge: 'bg-maasim-yellow' },
  ]
  const theme = themes[index % themes.length]
  const baseRotation = index % 2 === 0 ? 1 : -1 // Subtle initial wobble

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation (max 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -10
    const rotateY = ((x - centerX) / centerX) * 10

    // Calculate Glare Position (percentage)
    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100

    setRotation({ x: rotateX, y: rotateY })
    setGlare({ x: glareX, y: glareY, opacity: 1 })
  }

  const handleMouseLeave = () => {
    // Reset to "hanging" state
    setRotation({ x: 0, y: 0 })
    setGlare(prev => ({ ...prev, opacity: 0 }))
  }

  return (
    <div className="relative group perspective-1000" style={{ perspective: '1000px' }}>
      {/* 1. THE FLOATING SHADOW (Detached for depth) */}
      <div 
        className={`absolute inset-0 rounded-3xl translate-y-4 translate-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm ${theme.shadow}`}
        style={{ 
           transform: `translate(${rotation.y * -1.5}px, ${rotation.x * -1.5 + 16}px)`, // Shadow moves opposite to light
           transition: 'transform 0.1s ease-out'
        }}
      />

      {/* 2. THE PHYSICAL CARD */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`
          relative bg-white rounded-3xl border-4 ${theme.border} p-3 
          transition-all duration-300 ease-out 
          ${baseRotation === 1 ? 'rotate-1' : '-rotate-1'} group-hover:rotate-0
        `}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.05, 1.05, 1.05)`,
          boxShadow: rotation.x !== 0 
            ? '20px 20px 60px rgba(0,0,0,0.1)' // Floating shadow
            : '8px 8px 0px 0px rgba(0,0,0,1)', // Static shadow
          transition: 'transform 0.1s ease-out, box-shadow 0.3s ease'
        }}
      >
        {/* The Glare Overlay */}
        <div 
            className="absolute inset-0 rounded-2xl z-20 pointer-events-none mix-blend-overlay"
            style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%)`,
                opacity: glare.opacity,
                transition: 'opacity 0.3s ease'
            }}
        />

        {/* New Badge */}
        {isNew && (
          <div className="absolute -top-4 -left-4 z-30 pointer-events-none">
              <div className="bg-maasim-magenta text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-black shadow-sm animate-bounce">
              NEW!
              </div>
          </div>
        )}

        {/* Cover Art */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border-2 border-black mb-4 shadow-inner">
            {book.cover_url ? (
                <>
                  <Image src={book.cover_url} alt={book.title} fill className="object-cover" />
                  {/* Spine Lighting */}
                  <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-white/40 to-transparent z-10 pointer-events-none" />
                  <div className="absolute inset-y-0 left-0 w-[2px] bg-black/10 z-10 pointer-events-none" />
                </>
            ) : (
                <div className="flex flex-col h-full items-center justify-center bg-maasim-cyan/10 text-slate-400 font-black text-center px-4 gap-2">
                    <div className="w-12 h-16 border-2 border-slate-300 rounded bg-white" />
                    <span className="text-sm">{book.title}</span>
                </div>
            )}
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center z-30">
                <Link 
                    href={`/read/${book.id}`} 
                    className="
                      scale-0 group-hover:scale-100 
                      bg-maasim-lime text-black w-16 h-16 rounded-full border-4 border-black 
                      flex items-center justify-center 
                      shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] 
                      transition-all duration-300 ease-out hover:scale-110 active:scale-90 active:shadow-none active:translate-y-1
                    "
                >
                    <Play size={32} fill="black" className="ml-1" />
                </Link>
            </div>
        </div>

        {/* Text Details */}
        <div className="px-2 pb-2 text-center pointer-events-none"> {/* Text ignores mouse so tilt works smoothly */}
            <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 line-clamp-1">{book.title}</h3>
            <div className="flex justify-center items-center gap-3 pointer-events-auto">
                <div className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-full text-slate-400 uppercase tracking-wider border border-slate-200">
                    <Heart size={10} fill="#94a3b8" /> Owned
                </div>
                <Link href={`/read/${book.id}`} className="text-sm font-black text-black underline decoration-4 decoration-maasim-yellow underline-offset-2 hover:decoration-maasim-magenta hover:text-maasim-magenta transition-all">
                    Read Now
                </Link>
            </div>
        </div>
      </div>
    </div>
  )
}

// --- MAIN COMPONENT ---
export default function LibraryContent({ books }: { books: Book[] }) {
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const filteredBooks = books.filter((book) => 
    book.title.toLowerCase().includes(search.toLowerCase())
  )

  const isNew = (dateString: string) => {
    const diff = Math.abs(new Date().getTime() - new Date(dateString).getTime())
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) <= 7
  }

  return (
    <>
      {/* HEADER */}
      <div className="container mx-auto px-6 max-w-6xl mb-12 relative z-20">
        <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
          <div className="relative">
             <div className="absolute -top-12 -left-12 opacity-20 pointer-events-none animate-spin-slow"><Star size={100} /></div>
             <div className="inline-flex items-center gap-2 bg-maasim-pink text-black px-4 py-1 rounded-full border-2 border-black mb-4 rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:rotate-0 transition-transform">
               <Star size={16} fill="black" /> 
               <span className="font-black text-xs uppercase tracking-widest">Reader Mode</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] drop-shadow-sm">
               Your <br/>
               <span className="text-maasim-cyan relative inline-block">
                 Collection
                 <svg className="absolute -bottom-3 left-0 w-full h-4 text-black opacity-100" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 25 10 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
               </span>
             </h1>
          </div>

          <div className="w-full md:w-auto relative group z-30">
             <div className="absolute -top-6 -right-4 text-maasim-yellow animate-bounce hidden md:block pointer-events-none z-20">
                <Sparkles size={40} fill="currentColor" stroke="black" strokeWidth={2} />
             </div>
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                <Search className={`h-6 w-6 transition-colors ${search ? 'text-black' : 'text-slate-400'}`} strokeWidth={3} />
             </div>
             <input 
                type="text" 
                placeholder="Find a story..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80 bg-white border-4 border-black rounded-2xl py-4 pl-12 pr-12 font-bold text-lg focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all placeholder:text-slate-300"
             />
             <button onClick={() => setSearch('')} className={`absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-red-500 transition-all ${search ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                <div className="bg-slate-100 rounded-full p-1 hover:bg-slate-200"><X size={16} strokeWidth={4} /></div>
             </button>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="container mx-auto px-6 max-w-6xl min-h-[400px]">
        {filteredBooks.length === 0 ? (
          <div className={`bg-white rounded-3xl border-4 border-black border-dashed p-12 text-center max-w-2xl mx-auto mt-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {search ? (
                <>
                    <div className="animate-wiggle inline-block mb-4"><Frown size={64} className="text-slate-300" /></div>
                    <h2 className="text-3xl font-black text-slate-400">No matching books...</h2>
                    <p className="font-bold text-slate-300">Try checking your spelling!</p>
                </>
            ) : (
                <>
                    <div className="bg-slate-100 w-24 h-24 rounded-full border-4 border-slate-300 flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <Ghost size={40} className="text-slate-400" />
                    </div>
                    <h2 className="text-3xl font-black mb-2 text-slate-900">It's a ghost town!</h2>
                    <p className="text-slate-500 font-medium mb-8 text-lg">You haven't added any books yet.</p>
                    <Link href="/#bookshelf" className="inline-block bg-maasim-yellow text-black px-8 py-4 rounded-xl font-black text-lg hover:-translate-y-1 transition-transform border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Go to Store
                    </Link>
                </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14 pb-20">
            {filteredBooks.map((book, index) => (
               <div 
                 key={book.id} 
                 className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                 style={{ transitionDelay: `${index * 100}ms` }}
               >
                 <MagicalCard book={book} index={index} isNew={isNew(book.added_at)} />
               </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}