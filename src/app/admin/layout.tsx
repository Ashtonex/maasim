// src/app/admin/layout.tsx
import { createClient } from '@/utils/supabase/server' // <--- usage of our new helper
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, LayoutDashboard, LogOut } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient() // <--- Await the client creation

  // 1. Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Check if user is actually an ADMIN
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // 3. Render the Admin Sidebar & Content
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col">
        <div className="mb-8 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-yellow-400" />
          <h1 className="text-xl font-bold tracking-tight">Charlene Dash</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-2 px-4 py-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
        </nav>

        <form action="/auth/signout" method="post">
           <button className="flex items-center gap-2 text-slate-400 hover:text-white mt-auto">
            <LogOut size={20} />
            Sign Out
          </button>
        </form>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
            {children}
        </div>
      </main>
    </div>
  )
}