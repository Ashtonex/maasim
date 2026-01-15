// src/app/login/page.tsx
'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { LogIn, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react'

// 1. WRAPPER COMPONENT (Required for using searchParams in Next.js)
export default function LoginPageWrapper() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  )
}

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') // Grab the return ticket
  const supabase = createClient()

  const handleSignUp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Success! Check your email for confirmation.')
    }
    setLoading(false)
  }

  const handleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      setMessage(error.message)
      setLoading(false)
    } else {
      // --- SMART REDIRECT LOGIC ---
      
      // 1. If we have a return ticket (from checkout), use it!
      if (nextUrl) {
        router.refresh() // Refresh to update middleware session
        router.push(nextUrl)
        return
      }

      // 2. Otherwise, check if user is Admin or Regular
      const { data: { user } } = await supabase.auth.getUser()
      
      // We check the profile role to know where to send them
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single()
      
      router.refresh() // Refresh cookies
      
      if (profile?.role === 'admin') {
        router.push('/admin') 
      } else {
        router.push('/library') // Regular users go here
      }
      
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-sans selection:bg-maasim-lime selection:text-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* --- DECORATIVE BACKGROUND ELEMENTS --- */}
      <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-maasim-cyan rounded-full border-4 border-black opacity-20 blur-xl" />
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-maasim-pink rounded-full border-4 border-black opacity-20 blur-xl" />

      {/* --- BACK BUTTON --- */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="group flex items-center gap-2 font-black text-slate-900 hover:text-maasim-magenta transition-colors">
          <div className="bg-white border-2 border-black p-2 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-x-1 transition-transform">
             <ArrowLeft size={20} strokeWidth={3} />
          </div>
          Back to Store
        </Link>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-3xl p-8 md:p-10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-maasim-yellow border-4 border-black rounded-2xl mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">
             <LogIn className="h-8 w-8 text-black" strokeWidth={3} />
          </div>
          
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 relative inline-block">
            Maasim Login
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-maasim-cyan" viewBox="0 0 100 10" preserveAspectRatio="none">
               <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="5" fill="none" />
            </svg>
          </h2>
          <p className="text-slate-500 font-medium mt-4">
            Welcome back, friend.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full bg-slate-50 border-2 border-black rounded-xl px-4 py-3 font-bold text-lg focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all placeholder:text-slate-300"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-wide">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full bg-slate-50 border-2 border-black rounded-xl px-4 py-3 font-bold text-lg focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 transition-all placeholder:text-slate-300"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error/Success Message */}
          {message && (
             <div className={`p-4 rounded-xl border-2 border-black flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${message.includes('Success') ? 'bg-maasim-lime/20' : 'bg-maasim-pink/20'}`}>
               <AlertCircle size={20} strokeWidth={3} className="shrink-0 mt-0.5" />
               <p className="font-bold text-sm leading-tight">{message}</p>
             </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-4 pt-2">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full bg-black text-white px-6 py-4 rounded-xl font-black text-lg border-2 border-black shadow-[4px_4px_0px_0px_#D81B60] hover:translate-y-1 hover:shadow-none hover:bg-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                'Checking ID...' 
              ) : (
                <>Sign In <Sparkles size={18} /></>
              )}
            </button>
            
            <div className="relative flex items-center justify-center my-2">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-black/10"></div></div>
               <span className="relative bg-white px-4 text-xs font-black text-slate-400 uppercase">Or</span>
            </div>

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-white text-black px-6 py-3 rounded-xl font-black text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none hover:bg-slate-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer Note */}
      <p className="mt-8 text-slate-400 font-bold text-sm">
        Protected by <span className="text-black">Project Velcro</span> security.
      </p>

    </div>
  )
}