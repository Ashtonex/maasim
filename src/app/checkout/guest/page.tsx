'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, CreditCard, Lock, Smartphone, Loader2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client' // Ensure you have this client helper

function GuestCheckoutForm() {
  const searchParams = useSearchParams()
  const bookId = searchParams.get('bookId')
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [book, setBook] = useState<any>(null)
  const [fetchingBook, setFetchingBook] = useState(true)

  // 1. FETCH BOOK DETAILS ON LOAD
  useEffect(() => {
    async function fetchBook() {
      if (!bookId) return
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single()
      
      if (data) setBook(data)
      setFetchingBook(false)
    }
    fetchBook()
  }, [bookId, supabase])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 2. CALL THE CORRECT API (/api/paynow)
      const response = await fetch('/api/paynow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          email,
          price: book.price // Pass the price from the fetched book
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Payment initiation failed. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('Checkout failed.')
    } finally {
      setLoading(false)
    }
  }

  // Loading State
  if (fetchingBook) {
    return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin h-10 w-10 text-maasim-magenta" />
            <p className="font-bold text-slate-400">Loading book details...</p>
        </div>
    )
  }

  // Error State
  if (!bookId || !book) {
      return (
        <div className="text-center p-20 flex flex-col items-center gap-4">
            <AlertTriangle className="h-12 w-12 text-maasim-pink" />
            <h2 className="text-2xl font-black">Book not found</h2>
            <Link href="/" className="underline font-bold">Return Home</Link>
        </div>
      )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_#000]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-maasim-lime p-3 border-2 border-black rounded-full mb-4">
            <Smartphone className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase leading-none">Guest Checkout</h1>
          <p className="text-slate-500 font-bold mt-2">Pay securely via Paynow</p>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">You are buying</p>
            <p className="text-lg font-black text-slate-900 leading-tight">{book.title}</p>
            <p className="text-xl font-black text-maasim-magenta mt-1">${book.price}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleCheckout} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-black uppercase mb-2">
              Email Address (For Receipt)
            </label>
            <input
              type="email"
              required
              placeholder="norman@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-4 border-slate-200 focus:border-black rounded-xl p-4 font-bold text-lg outline-none transition-colors placeholder:text-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maasim-yellow text-black text-xl py-4 rounded-xl font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" /> Preparing...
                </>
            ) : (
                `Pay $${book.price}`
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase">
          <Lock size={12} />
          Secured by Paynow Zimbabwe
        </div>
      </div>
    </div>
  )
}

export default function GuestCheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] py-20 px-6">
      <Link href="/" className="inline-flex items-center gap-2 font-bold text-slate-500 hover:text-black mb-8">
        <ArrowLeft size={20} /> Cancel
      </Link>
      
      <Suspense fallback={<div>Loading...</div>}>
        <GuestCheckoutForm />
      </Suspense>
    </div>
  )
}