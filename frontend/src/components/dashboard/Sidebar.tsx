'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  CreditCard, 
  Settings, 
  LogOut, 
  PlusCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react'
import { useLanguage } from '@/store/LanguageContext'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    { name: t.dashboard, href: '/dashboard', icon: LayoutDashboard },
    { name: t.gallery, href: '/dashboard/gallery', icon: ImageIcon },
    { name: t.billing, href: '/dashboard/billing', icon: CreditCard },
    { name: t.settings, href: '/dashboard/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 bg-zinc-950 border-r border-zinc-800 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-zinc-900">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-lg">N</div>
          {!isCollapsed && <span className="ml-3 font-black text-xl tracking-tight">STUDIO</span>}
        </div>

        {/* Action Button */}
        <div className="p-4">
          <Link 
            href="/studio"
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition-colors text-sm font-bold shadow-lg shadow-red-900/20",
              isCollapsed ? "px-0" : "px-4"
            )}
          >
            <PlusCircle size={20} />
            {!isCollapsed && <span>{t.createFirst}</span>}
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-zinc-900 text-white shadow-sm" 
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
                )}
              >
                <item.icon size={22} className={cn(
                  "transition-colors",
                  isActive ? "text-red-500" : "group-hover:text-red-400"
                )} />
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-zinc-900 space-y-1">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center gap-3 px-3 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900/50 transition-all"
          >
            {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
            {!isCollapsed && <span className="font-medium">Collapse</span>}
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={22} />
            {!isCollapsed && <span className="font-medium">{t.logout}</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
