'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, X, Type, CheckCircle } from 'lucide-react'
import confetti from 'canvas-confetti' // Optional: run 'npm install canvas-confetti @types/canvas-confetti'

// --- MOCK CONTENT GENERATOR ---
// (In the future, you will fetch 'pages' from your Supabase database)
const generatePages = (title: string) => [
  { type: 'cover', text: title },
  { type: 'text', text: "Once upon a time, in a land made entirely of wobbly jelly..." },
  { type: 'text', text: "The sun was a giant lemon drop, and the clouds were made of cotton candy that rained sprinkles." },
  { type: 'text', text: "One day, a little spoon named Steve decided he wanted to see the world beyond the dessert bowl." },
  { type: 'end', text: "The End." }
]

export default function Reader({ book }: { book: any }) {
  const [pages] = useState(generatePages(book.title))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fontSize, setFontSize] = useState(24) // Base font size

  const progress = ((currentIndex + 1) / pages.length) * 100
  const isLastPage = currentIndex === pages.length - 1

  // Handle Page Turns
  const nextPage = () => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  // Confetti effect on finish
  useEffect(() => {
    if (pages[currentIndex].type === 'end') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D81B60', '#C6FF00', '#00BCD4']
      })
    }
  }, [currentIndex, pages])

  return (
    <div className="fixed inset-0 bg-[#FFFDF5] z-50 flex flex-col">
      
      {/* --- TOP BAR --- */}
      <div className="h-20 border-b-4 border-black flex items-center justify-between px-6 bg-white">
        
        {/* Progress Bar (Visual) */}
        <div className="absolute top-0 left-0 h-2 bg-maasim-lime transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />

        {/* Back / Exit */}
        <Link href="/library" className="p-2 hover:bg-slate-100 rounded-xl border-2 border-transparent hover:border-black transition-all">
          <X size={32} strokeWidth={3} />
        </Link>

        {/* Title */}
        <h1 className="font-black text-xl truncate max-w-xs md:max-w-md hidden sm:block">
          {book.title}
        </h1>

        {/* Font Controls */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1 border-2 border-black">
          <button 
            onClick={() => setFontSize(Math.max(18, fontSize - 2))}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:border-2 hover:border-black font-bold"
          >
            A-
          </button>
          <button 
            onClick={() => setFontSize(Math.min(48, fontSize + 2))}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:border-2 hover:border-black font-black text-lg"
          >
            A+
          </button>
        </div>
      </div>

      {/* --- READING AREA --- */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 relative">
        
        {/* The Page Sheet */}
        <div className="bg-white w-full max-w-3xl min-h-[60vh] md:aspect-[3/4] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] rounded-3xl p-8 md:p-16 flex flex-col justify-center items-center text-center relative transition-all duration-300">
          
          {/* Decorative Holes like binder paper */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-8 opacity-20 pointer-events-none">
             <div className="w-4 h-4 rounded-full bg-black"></div>
             <div className="w-4 h-4 rounded-full bg-black"></div>
             <div className="w-4 h-4 rounded-full bg-black"></div>
          </div>

          {pages[currentIndex].type === 'cover' && (
             <div className="animate-in fade-in zoom-in duration-500">
                <div className="text-maasim-magenta font-black text-xl mb-4 uppercase tracking-widest">Starting Story</div>
                <h2 className="text-5xl md:text-7xl font-black leading-tight mb-8">{pages[currentIndex].text}</h2>
                <div className="w-32 h-2 bg-maasim-yellow mx-auto rounded-full"></div>
             </div>
          )}

          {pages[currentIndex].type === 'text' && (
             <p 
               className="font-medium text-slate-800 leading-relaxed animate-in slide-in-from-right-4 fade-in duration-300"
               style={{ fontSize: `${fontSize}px` }}
             >
               {pages[currentIndex].text}
             </p>
          )}

          {pages[currentIndex].type === 'end' && (
             <div className="animate-in zoom-in spin-in-3 duration-500">
                <CheckCircle className="w-24 h-24 text-maasim-lime mx-auto mb-6" strokeWidth={3} />
                <h2 className="text-4xl font-black mb-4">You did it!</h2>
                <p className="text-xl text-slate-500 mb-8">Adventure complete.</p>
                <Link href="/library" className="bg-black text-white px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform inline-block">
                  Back to Library
                </Link>
             </div>
          )}
        </div>

      </div>

      {/* --- BOTTOM NAV CONTROLS --- */}
      <div className="h-24 bg-[#FFFDF5] border-t-4 border-black flex items-center justify-center gap-8 px-6">
        
        <button 
          onClick={prevPage}
          disabled={currentIndex === 0}
          className="bg-white w-16 h-16 rounded-full border-4 border-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-maasim-yellow hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0"
        >
          <ArrowLeft size={32} strokeWidth={3} />
        </button>

        <span className="font-black text-xl font-mono">
           {currentIndex + 1} / {pages.length}
        </span>

        <button 
          onClick={nextPage}
          disabled={isLastPage}
          className="bg-maasim-cyan w-16 h-16 rounded-full border-4 border-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-maasim-lime hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0"
        >
          <ArrowRight size={32} strokeWidth={3} />
        </button>

      </div>
    </div>
  )
}