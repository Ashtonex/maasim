'use client'

import { useState } from 'react'
import { updateAvatar } from '@/app/actions'
import { Edit2 } from 'lucide-react'

const AVATARS = ['🦁', '🚀', '🐱', '🦖', '🦄', '🤖', '👾', '🌵']

export default function AvatarPicker({ currentAvatar }: { currentAvatar: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [avatar, setAvatar] = useState(currentAvatar || '🦁')
  const [isSaving, setIsSaving] = useState(false)

  const handleSelect = async (newAvatar: string) => {
    setIsSaving(true)
    setAvatar(newAvatar) // Optimistic update (feels instant)
    await updateAvatar(newAvatar) // Server update
    setIsOpen(false)
    setIsSaving(false)
  }

  return (
    <div className="relative">
      {/* The Avatar Badge */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative h-14 w-14 bg-maasim-yellow rounded-2xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all active:scale-95"
      >
        <span className="text-3xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform">
          {avatar}
        </span>
        
        {/* Little Edit Icon */}
        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border-2 border-black">
          <Edit2 size={10} strokeWidth={3} />
        </div>
      </button>

      {/* The Dropdown Menu */}
      {isOpen && (
        <>
          {/* Invisible backdrop to close on click outside */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute top-16 right-0 z-50 bg-white p-3 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-64 grid grid-cols-4 gap-2 animate-in fade-in zoom-in-95 duration-200">
            {AVATARS.map((icon) => (
              <button
                key={icon}
                onClick={() => handleSelect(icon)}
                disabled={isSaving}
                className={`text-2xl p-2 rounded-xl hover:bg-slate-100 border-2 border-transparent hover:border-black transition-all ${avatar === icon ? 'bg-maasim-lime/30 border-maasim-lime' : ''}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}