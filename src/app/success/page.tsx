import Link from 'next/link'
import { Check, ArrowRight, Home, Mail } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center p-6 font-sans selection:bg-maasim-lime selection:text-black relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* --- THE RECEIPT CARD --- */}
      <div className="relative z-10 w-full max-w-lg animate-in zoom-in-95 duration-500">
        
        {/* Bouncing Success Sticker */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-maasim-lime text-black h-24 w-24 rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce z-20">
          <Check size={48} strokeWidth={4} />
        </div>

        <div className="bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[12px_12px_0px_0px_#D81B60]">
          
          {/* Header */}
          <div className="bg-black text-white p-8 pt-16 text-center">
            <h1 className="text-4xl font-black uppercase tracking-wide mb-2">
              Order Confirmed!
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Thank you for supporting Maasim Creatives
            </p>
          </div>

          {/* Ticket Body */}
          <div className="p-8 text-center space-y-6">
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">
                Payment Successful
              </h2>
              <p className="text-slate-600 max-w-xs mx-auto leading-relaxed">
                Your payment is being processed. You will receive an email shortly with your book download link.
              </p>
            </div>

            {/* Receipt Info Box */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-4 text-left space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500 uppercase">Status</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold uppercase text-xs">Paid</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500 uppercase">Delivery</span>
                <div className="flex items-center gap-1 font-bold text-slate-900">
                   <Mail size={14} /> Email
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Link 
                href="/"
                className="w-full bg-maasim-yellow text-black py-4 rounded-xl font-black border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                Back to Library <ArrowRight size={20} strokeWidth={3} />
              </Link>
              
              <Link 
                href="/"
                className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold border-2 border-transparent hover:border-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <Home size={18} /> Return Home
              </Link>
            </div>

          </div>

          {/* Jagged Bottom Edge (CSS Trick) */}
          <div className="h-4 bg-black w-full" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)'}}></div>
        </div>

      </div>

      {/* Confetti Decor */}
      <div className="absolute top-20 left-10 text-maasim-pink rotate-12 opacity-50 hidden md:block text-6xl">✨</div>
      <div className="absolute bottom-20 right-10 text-maasim-cyan -rotate-12 opacity-50 hidden md:block text-6xl">🎉</div>

    </div>
  )
}