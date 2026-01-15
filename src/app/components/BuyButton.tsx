'use client'

import { useState } from 'react'
import { ShoppingBag, Loader2 } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation' // <--- 1. Import usePathname

export default function BuyButton({ bookId, price, userEmail }: { bookId: string, price: number, userEmail?: string | null }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname() // <--- 2. Get the current URL (e.g., "/books/123")

  const handleBuy = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    // 3. Force Login with "Return Ticket" logic
    if (!userEmail) {
      // This tells the login page: "After they sign in, send them back HERE"
      router.push(`/login?next=${pathname}`)
      return
    }

    setIsLoading(true)

    // 4. Call our API
    try {
      const res = await fetch('/api/paynow', {
        method: 'POST',
        body: JSON.stringify({ bookId, price, email: userEmail })
      })
      const data = await res.json()

      // 5. Redirect user to Paynow to pay
      if (data.url) {
        window.location.href = data.url
      } else {
         alert("Payment Error")
         setIsLoading(false)
      }
    } catch (error) {
      alert("Payment failed to start")
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleBuy}
      disabled={isLoading}
      className="mt-auto w-full bg-maasim-cyan text-black py-4 rounded-xl font-black border-2 border-black hover:bg-maasim-yellow transition-colors flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <ShoppingBag size={20} strokeWidth={3} />
          GRAB IT ${price}
        </>
      )}
    </button>
  )
}