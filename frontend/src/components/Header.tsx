// src/components/Header.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Layers, Newspaper } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const pathname = usePathname()
  const { isOwner, loading } = useAuth()

  if (loading) {
    return (
      <div className="absolute top-0 left-0 right-0 h-12 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 z-20 gap-3">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-5 h-5 bg-zinc-800 rounded-md" />
          <div className="w-24 h-4 bg-zinc-800 rounded-md hidden sm:block" />
        </div>
      </div>
    )
  }

  const navItems = [
    { name: 'Studio', href: '/studio', icon: Layers },
    ...(isOwner ? [
      { name: 'Prothom Alo', href: '/studio/news/prothom-alo', icon: Newspaper },
      { name: 'BD24Live', href: '/studio/news/bd24live', icon: Newspaper },
      { name: 'ABP Live (IN)', href: '/studio/news/abp-live', icon: Newspaper },
      { name: 'Daily Rangpur', href: '/studio/news/drb', icon: Newspaper },
    ] : [])
  ]

  return (
    <div className="absolute top-0 left-0 right-0 h-12 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 z-20 gap-3">
      <div className="flex items-center gap-2 flex-shrink-0">
        <Layers size={18} className="text-red-500" />
        <span className="text-sm font-bold tracking-tight text-white hidden sm:inline">News Cards Studio</span>
      </div>
      
      <div className="w-px h-5 bg-zinc-800 flex-shrink-0 hidden md:block" />

      {/* Horizontally scrollable nav — no scrollbar visible */}
      <nav
        className="flex items-center gap-1 overflow-x-auto flex-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex-shrink-0 ${
                isActive 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-red-500' : ''} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
