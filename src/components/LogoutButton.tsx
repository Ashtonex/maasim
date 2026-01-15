'use client'

import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  return (
    <form action="/auth/signout" method="post">
      <button 
        type="submit"
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-600 rounded-lg font-bold transition-colors"
      >
        <LogOut size={18} strokeWidth={2.5} />
        <span>Log Out</span>
      </button>
    </form>
  )
}