'use client'

import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import confetti from 'canvas-confetti'
import { ChevronLeft, ChevronRight, Star, Loader2 } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Force HTTPS and use the specific .mjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function BookReader({ url, title }: { url: string; title: string }) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 1. NEW: DYNAMIC HEIGHT STATE
  const [pageHeight, setPageHeight] = useState(600)

  // 2. NEW: CALCULATE HEIGHT ON MOUNT & RESIZE
  useEffect(() => {
    function updateHeight() {
      // Calculate available height: Window height - (Header + Padding + Margins)
      // Roughly 75% of the screen height works best for "Fit Page"
      const optimalHeight = window.innerHeight * 0.75
      setPageHeight(optimalHeight)
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
  }

  function onDocumentLoadError(err: Error) {
    console.error("PDF Load Error:", err)
    setLoading(false)
    setError("Failed to load book. Please try refreshing.")
  }

  const changePage = (offset: number) => {
    setPageNumber(prev => {
      const newPage = prev + offset
      if (newPage === numPages && numPages > 1) triggerConfetti()
      return newPage
    })
  }

  const triggerConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#D81B60', '#C6FF00', '#00BCD4'] })
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#D81B60', '#C6FF00', '#00BCD4'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }

  const progress = numPages > 0 ? (pageNumber / numPages) * 100 : 0

  return (
    <div className="flex flex-col items-center w-full h-full justify-center">
      
      {/* Progress Bar */}
      <div className="w-full max-w-2xl bg-slate-200 h-3 rounded-full mb-4 border-2 border-black overflow-hidden relative shadow-sm shrink-0">
         <div 
           className="h-full bg-maasim-lime transition-all duration-500 ease-out flex items-center justify-end pr-1"
           style={{ width: `${progress}%` }}
         >
           <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
         </div>
      </div>

      {/* Reader Surface */}
      <div className="relative bg-white p-2 rounded-xl border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-center items-center overflow-hidden">
        
        {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-maasim-magenta bg-white z-20">
                <Loader2 size={40} className="animate-spin" />
                <span className="text-xl font-black">Loading Magic...</span>
            </div>
        )}

        {error && <div className="text-red-500 font-bold p-10">{error}</div>}

        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className="flex justify-center"
        >
          <Page 
             pageNumber={pageNumber} 
             renderTextLayer={false} 
             renderAnnotationLayer={false}
             className="!bg-transparent"
             // 3. APPLY DYNAMIC HEIGHT (Removes the cut-off issue!)
             height={pageHeight}
          />
        </Document>

        {/* Navigation Buttons (Outside the page, inside the border) */}
        {!loading && !error && (
            <>
                <button
                    disabled={pageNumber <= 1}
                    onClick={() => changePage(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full border-4 border-black shadow-[2px_2px_0px_0px_#000] hover:scale-110 active:scale-95 disabled:opacity-0 transition-all z-10"
                >
                    <ChevronLeft size={24} strokeWidth={3} />
                </button>

                <button
                    disabled={pageNumber >= numPages}
                    onClick={() => changePage(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-maasim-yellow p-3 rounded-full border-4 border-black shadow-[2px_2px_0px_0px_#000] hover:scale-110 active:scale-95 disabled:opacity-0 transition-all z-10"
                >
                    <ChevronRight size={24} strokeWidth={3} />
                </button>
            </>
        )}
      </div>

      {/* Page Counter */}
      {!loading && !error && (
        <div className="mt-4 flex items-center gap-3 bg-white px-4 py-1 rounded-full border-2 border-black shadow-sm font-black text-sm shrink-0">
            <span>Page {pageNumber} of {numPages}</span>
            {pageNumber === numPages && <Star className="text-maasim-yellow fill-maasim-yellow animate-spin-slow w-4 h-4" />}
        </div>
      )}

    </div>
  )
}