import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, Star, ShieldCheck } from 'lucide-react'
import PurchaseModal from '@/components/PurchaseModal' 

// Define Props Type for Dynamic Route
type Props = {
  params: Promise<{ id: string }>
}

// 1. FORCE DYNAMIC (Critical for fixing the loop)
export const dynamic = 'force-dynamic'

export default async function BookDetailsPage(props: Props) {
  const params = await props.params
  const supabase = await createClient()

  // 2. FETCH USER (So we know if they are logged in)
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch the specific book
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', params.id)
    .single()

  // Handle 404 (Book not found)
  if (error || !book) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-sans selection:bg-maasim-lime selection:text-black pb-20">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-4 border-black px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-black text-white p-2 rounded-full group-hover:bg-maasim-magenta transition-colors">
            <ArrowLeft size={20} />
          </div>
          <span className="font-bold text-slate-900 group-hover:underline">Back to Library</span>
        </Link>
        <div className="font-black text-xl tracking-tighter">
          Maasim<span className="text-maasim-magenta">Creatives</span>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* --- LEFT COLUMN: IMAGE --- */}
          <div className="relative group">
            <div className="relative aspect-[3/4] w-full rounded-3xl border-4 border-black overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {book.cover_url ? (
                <Image
                  src={book.cover_url}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400 font-bold">
                  No Cover Image
                </div>
              )}
            </div>
            
            {/* Decorative Blobs behind image */}
            <div className="absolute -z-10 top-10 -left-10 w-full h-full bg-maasim-cyan rounded-3xl border-4 border-black opacity-30 rotate-[-3deg]" />
            <div className="absolute -z-10 bottom-10 -right-10 w-full h-full bg-maasim-pink rounded-3xl border-4 border-black opacity-30 rotate-[3deg]" />
          </div>

          {/* --- RIGHT COLUMN: DETAILS --- */}
          <div className="flex flex-col h-full pt-4">
            
            {/* Title & Price */}
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
              {book.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-black bg-maasim-yellow text-black px-4 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2">
                ${book.price}
              </span>
              <div className="flex items-center gap-1 text-maasim-yellow">
                <Star fill="currentColor" className="text-black" strokeWidth={1} />
                <Star fill="currentColor" className="text-black" strokeWidth={1} />
                <Star fill="currentColor" className="text-black" strokeWidth={1} />
                <Star fill="currentColor" className="text-black" strokeWidth={1} />
                <Star fill="currentColor" className="text-black" strokeWidth={1} />
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg text-slate-600 mb-10 leading-relaxed">
              <p>{book.description}</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Check className="text-maasim-lime" strokeWidth={4} />
                <span>Instant PDF Download</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Check className="text-maasim-lime" strokeWidth={4} />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Check className="text-maasim-lime" strokeWidth={4} />
                <span>High Quality Art</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Check className="text-maasim-lime" strokeWidth={4} />
                <span>Kid-Safe Content</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-4">
              
              {/* 3. PASS USER EMAIL TO THE COMPONENT */}
              <PurchaseModal 
                bookId={book.id} 
                price={book.price} 
                title={book.title}
                userEmail={user?.email} 
              />
              
              <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                Digital Product • Sent to Email
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}