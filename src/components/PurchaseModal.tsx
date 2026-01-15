'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingBag, User, MessageCircle, X, Loader2 } from 'lucide-react' // Changed Ghost to MessageCircle

type Props = {
  bookId: string
  price: number
  title: string
  userEmail?: string | null
}

export default function PurchaseModal({ bookId, price, title, userEmail }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // --- CONFIGURATION ---
  const ADMIN_PHONE = "+263774091119" // <--- REPLACE WITH YOUR WHATSAPP NUMBER (No + sign)
  
  // Helper to build the WhatsApp Link
  const getWhatsappLink = (email?: string | null) => {
    let message = `Hello! I want to buy the book: *${title}* ($${price}).`
    
    if (email) {
      message += `\n\nMy Email is: ${email}`
      message += `\n(Please add this book to my Maasim Library)`
    } else {
      message += `\n\nI am checking out as a Guest.`
    }
    
    // Encode for URL
    return `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`
  }

  const handleSmartBuy = () => {
    // A. IF GUEST: Open the Choice Modal (Login or WhatsApp)
    if (!userEmail) {
      setIsOpen(true)
      return
    }

    // B. IF LOGGED IN: Go straight to WhatsApp
    const url = getWhatsappLink(userEmail)
    window.open(url, '_blank')
  }

  return (
    <>
      {/* --- MAIN BUTTON --- */}
      <button 
        onClick={handleSmartBuy}
        className="w-full bg-green-500 text-white text-xl py-5 rounded-2xl font-black border-2 border-black shadow-[6px_6px_0px_0px_#000] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] hover:bg-green-600 transition-all flex items-center justify-center gap-3"
      >
        <MessageCircle strokeWidth={3} />
        {userEmail ? 'Buy via WhatsApp' : 'Buy Now'}
      </button>

      {/* --- MODAL OVERLAY (For Guests) --- */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white border-4 border-black rounded-3xl p-8 max-w-lg w-full shadow-[12px_12px_0px_0px_#D81B60] animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-maasim-pink border-2 border-black rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <div className="inline-block bg-maasim-yellow border-2 border-black px-4 py-1 font-bold text-sm rounded-full mb-4 -rotate-2">
                ALMOST THERE!
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                How to checkout?
              </h2>
              <p className="text-slate-500 font-medium mt-2">
                Buying <span className="text-black font-bold">"{title}"</span>
              </p>
            </div>

            <div className="grid gap-4">
              
              {/* Option A: Guest (WhatsApp) */}
              <a 
                href={getWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl border-4 border-slate-200 hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <div className="h-12 w-12 bg-white border-2 border-black rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                  <MessageCircle strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <span className="block text-xl font-black text-slate-900">Order on WhatsApp</span>
                  <span className="text-sm font-bold text-slate-500">Chat with Admin to pay via EcoCash/InnBucks.</span>
                </div>
              </a>

              {/* Option B: Login (Save to Library) */}
              <Link 
                href={`/login?next=${pathname}`}
                className="group flex items-center gap-4 p-4 rounded-2xl border-4 border-slate-200 hover:border-black hover:bg-maasim-lime/20 transition-all"
              >
                <div className="h-12 w-12 bg-black border-2 border-black rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <User strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <span className="block text-xl font-black text-slate-900">Log In First</span>
                  <span className="text-sm font-bold text-slate-500">Create account so you can download anytime.</span>
                </div>
              </Link>

            </div>
          </div>
        </div>
      )}
    </>
  )
}