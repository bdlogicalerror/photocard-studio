'use client'
import React from 'react'
import { useLanguage } from '@/store/LanguageContext'
import { LayoutDashboard, Image as ImageIcon, Zap, Clock } from 'lucide-react'

export default function DashboardPage() {
  const { t } = useLanguage()

  const stats = [
    { label: t.savedCards, value: '0', icon: ImageIcon, color: 'text-blue-500' },
    { label: t.activePlan, value: 'Free', icon: Zap, color: 'text-yellow-500' },
    { label: t.recentActivity, value: t.today, icon: Clock, color: 'text-purple-500' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">{t.dashboard}</h1>
        <p className="text-zinc-500">{t.heroSubtitle.split('.')[0]}.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={stat.color}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-zinc-900/30 border border-dashed border-zinc-800 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
          <ImageIcon size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">{t.noCardsFound}</h3>
        <p className="text-zinc-500 mb-6 max-w-sm">{t.step2Desc}</p>
        <button className="px-8 py-3 rounded-full bg-white text-zinc-950 font-bold hover:scale-105 transition-transform">
          {t.createFirst}
        </button>
      </div>
    </div>
  )
}
