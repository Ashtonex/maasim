import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DollarSign, Users, BookOpen, ShoppingBag, PlusCircle, ShieldAlert, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 1. SECURITY CHECK
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-red-50 text-red-600 gap-4">
            <ShieldAlert size={64} />
            <h1 className="text-3xl font-black">ACCESS DENIED</h1>
            <p className="font-bold">You do not have permission to view this page.</p>
        </div>
    )
  }

  // 2. FETCH DATA (Parallel)
  const [booksResult, ordersResult, profilesResult] = await Promise.all([
    supabase.from('books').select('*'),
    supabase.from('orders').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
  ])

  const books = booksResult.data || []
  const orders = ordersResult.data || []
  const profiles = profilesResult.data || []

  // 3. CALCULATE STATS
  const totalRevenue = orders.reduce((acc, order) => acc + (order.amount || 0), 0)
  const totalUsers = profiles.length
  const totalBooks = books.length

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8">
      
      {/* --- HEADER & ACTION BUTTON --- */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-4xl font-black text-slate-900">Admin Dashboard</h1>
           <p className="text-slate-500 font-medium">Welcome back, {user.email}</p>
        </div>

        {/* THE BUTTON YOU WANTED */}
        <Link 
          href="/admin/books/add" 
          className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-maasim-magenta transition-colors shadow-lg hover:shadow-xl"
        >
          <PlusCircle size={20} />
          Add New Book
        </Link>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid gap-4 md:grid-cols-3 max-w-6xl mx-auto">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Books</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalBooks}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* --- DATA TABLES --- */}
      <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
        
        {/* RECENT ORDERS TABLE */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <ShoppingBag size={18} /> Recent Orders
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">User Email</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900">{order.user_email}</td>
                      <td className="px-6 py-4 text-green-600 font-medium">${order.amount}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Users size={18} /> Recent Users
            </h3>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900">{profile.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profile.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}