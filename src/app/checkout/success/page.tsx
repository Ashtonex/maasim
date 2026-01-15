'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPageWrapper() {
  return (
    <Suspense>
      <SuccessPage />
    </Suspense>
  )
}

function SuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const router = useRouter()
  const supabase = createClient()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')

  useEffect(() => {
    async function verifyPayment() {
        if (!orderId) return

        // 1. Simulate a "Check" (On localhost, we assume success for testing)
        // In production, you would call Paynow's poll URL here to confirm.
        
        // 2. Update Order to 'paid'
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'paid' })
            .eq('id', orderId)

        if (updateError) {
            console.error(updateError)
            setStatus('failed')
            return
        }

        // 3. Fetch the Order to get details
        const { data: order } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

        // 4. Add to Library (If User ID exists)
        if (order?.user_id && order?.book_id) {
             const { error: libError } = await supabase
                .from('library')
                .insert({
                    user_id: order.user_id,
                    book_id: order.book_id
                })
             
             if (libError && libError.code !== '23505') { // Ignore duplicate errors
                 console.error("Library Error", libError)
             }
        }

        setStatus('success')
    }

    verifyPayment()
  }, [orderId, supabase])

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center p-6 text-center">
        {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-16 h-16 animate-spin text-maasim-yellow" />
                <h1 className="text-2xl font-black">Verifying Payment...</h1>
            </div>
        )}

        {status === 'success' && (
            <div className="bg-white p-10 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_#C6FF00]">
                <CheckCircle className="w-20 h-20 text-maasim-lime mx-auto mb-6" />
                <h1 className="text-4xl font-black mb-4">You're all set!</h1>
                <p className="text-xl font-bold text-slate-500 mb-8">The book has been added to your library.</p>
                <Link href="/library" className="bg-black text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-slate-800">
                    Go to My Library
                </Link>
            </div>
        )}

        {status === 'failed' && (
             <div className="bg-white p-10 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_#D81B60]">
                <XCircle className="w-20 h-20 text-maasim-pink mx-auto mb-6" />
                <h1 className="text-4xl font-black mb-4">Something went wrong</h1>
                <p className="text-xl font-bold text-slate-500 mb-8">We saved your order, but couldn't unlock the book automatically.</p>
                <Link href="/" className="underline font-bold">Return Home</Link>
            </div>
        )}
    </div>
  )
}