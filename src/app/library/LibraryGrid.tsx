'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Play, Ghost, Sparkles, Frown } from 'lucide-react'

type Book = {
  id: string
  title: string
  cover_url: string | null
  description: string | null
}

export default function LibraryGrid({ books }: { books: Book[] }) {
  const [search, setSearch] = useState('')

  // 1. Filter books instantly based on search text
  const filteredBooks = books.filter((book) => 
    book.title.toLowerCase().includes(search.toLowerCase())
  )

  // 2. Fun Color Palette for borders/shadows
  const colors = [
    { border: 'hover:border-maasim-pink', shadow: 'shadow-[8px_8px_0px_0px_#D81B60]', bg: 'bg-maasim-pink' },
    { border: 'hover:border-maasim-cyan', shadow: 'shadow-[8px_8px_0px_0px_#00BCD4]', bg: 'bg-maasim-cyan' },
    { border: 'hover:border-maasim-lime', shadow: 'shadow-[8px_8px_0px_0px_#C6FF00]', bg: 'bg-maasim-lime' },
    { border: 'hover:border-maasim-yellow', shadow: 'shadow-[8px_8px_0px_0px_#FFEA00]', bg: 'bg-maasim-yellow' },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* --- SEARCH BAR --- */}
      <div className="relative max-w-xl mx-auto mb-16 z-20">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-slate-400" strokeWidth={3} />
        </div>
        <input 
          type="text" 
          placeholder="Search your stash..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-6 py-4 text-xl font-bold rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-y-[2px] transition-all placeholder:text-slate-300"
        />
        <div className="absolute -top-6 -right-6 text-maasim-yellow animate-bounce hidden md:block">
           <Sparkles size={40} fill="currentColor" stroke="black" strokeWidth={2} />
        </div>
      </div>

      {/* --- GRID --- */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white rounded-3xl border-4 border-black border-dashed p-12 text-center max-w-2xl mx-auto opacity-80">
           {search ? (
             <>
               <Frown size={64} className="mx-auto mb-4 text-slate-400" />
               <h2 className="text-3xl font-black text-slate-400">No matching books...</h2>
             </>
           ) : (
             <>
               <div className="bg-slate-100 w-24 h-24 rounded-full border-4 border-slate-300 flex items-center justify-center mx-auto mb-6">
                   <Ghost size={40} className="text-slate-400" />
               </div>
               <h2 className="text-3xl font-black mb-2 text-slate-900">It's a ghost town!</h2>
               <p className="text-slate-500 font-bold mb-8">You haven't added any books yet.</p>
               <Link href="/#bookshelf" className="inline-block bg-maasim-yellow text-black px-8 py-4 rounded-xl font-black hover:-translate-y-1 transition-transform border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                 Go to Store
               </Link>
             </>
           )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pb-20 px-4">
          {filteredBooks.map((book, index) => {
            const theme = colors[index % colors.length]
            const rotation = index % 2 === 0 ? 'rotate-1' : '-rotate-1'

            return (
              <div 
                key={book.id} 
                className={`group relative bg-white p-3 rounded-3xl border-4 border-black transition-all duration-300 hover:scale-[1.02] hover:rotate-0 hover:z-10 ${theme.shadow} ${rotation} ${theme.border}`}
              >
                {/* Cover */}
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 border-2 border-black mb-4">
                   {book.cover_url ? (
                      <Image 
                        src={book.cover_url} 
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                   ) : (
                      <div className="flex h-full items-center justify-center text-slate-300 font-black px-4 text-center">{book.title}</div>
                   )}
                   
                   {/* Play Button Overlay */}
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                      <Link href={`/read/${book.id}`} className="scale-0 group-hover:scale-100 bg-maasim-lime text-black w-16 h-16 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:scale-110 active:scale-95">
                         <Play size={32} fill="black" className="ml-1" />
                      </Link>
                   </div>
                </div>

                {/* Details */}
                <div className="px-2 pb-2 text-center">
                  <h3 className="text-xl font-black text-slate-900 leading-tight mb-3 line-clamp-1">{book.title}</h3>
                  <div className="flex justify-center items-center gap-2">
                     <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-full text-slate-500 uppercase tracking-wider border border-slate-200">
                       Owned
                     </span>
                     <Link href={`/read/${book.id}`} className="text-sm font-black underline decoration-2 decoration-maasim-magenta underline-offset-4 hover:bg-maasim-magenta hover:text-white hover:no-underline px-2 rounded transition-all">
                       Open Book
                     </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}