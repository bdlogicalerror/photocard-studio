'use client'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/store/LanguageContext'
import { supabase } from '@/lib/supabase'
import { Search, Calendar, MoreVertical, Edit2, Download, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, isToday, isYesterday } from 'date-fns'

type Photocard = {
  id: string
  headline: string
  template_id: string
  thumbnail_url: string
  created_at: string
}

export default function GalleryPage() {
  const { t } = useLanguage()
  const [cards, setCards] = useState<Photocard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('photocards')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setCards(data)
    setLoading(false)
  }

  // Group cards by date
  const groupedCards = cards.reduce((groups: Record<string, Photocard[]>, card) => {
    const date = new Date(card.created_at)
    let label = format(date, 'MMMM do, yyyy')
    if (isToday(date)) label = t.today
    if (isYesterday(date)) label = t.yesterday
    
    if (!groups[label]) groups[label] = []
    groups[label].push(card)
    return groups
  }, {})

  const filteredGroups = Object.entries(groupedCards).map(([label, groupCards]) => {
    const filtered = groupCards.filter(c => 
      c.headline?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return { label, cards: filtered }
  }).filter(g => g.cards.length > 0)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">{t.gallery}</h1>
          <p className="text-zinc-500">{t.savedCards}</p>
        </div>

        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={t.search}
            className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl focus:outline-none focus:border-red-500 transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-square rounded-3xl bg-zinc-900 animate-pulse" />
          ))}
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-zinc-500">{t.noCardsFound}</p>
        </div>
      ) : (
        <div className="space-y-12">
          {filteredGroups.map(({ label, cards }) => (
            <section key={label} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-900" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Calendar size={14} />
                  {label}
                </span>
                <div className="h-px flex-1 bg-zinc-900" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cards.map((card) => (
                  <div key={card.id} className="group relative aspect-square rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-all">
                    {card.thumbnail_url ? (
                      <img src={card.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-800 font-bold">PREVIEW</div>
                    )}
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col p-4 justify-between backdrop-blur-sm">
                      <div className="flex justify-end">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-white">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-bold line-clamp-2 text-white text-sm mb-2">{card.headline}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-white text-black rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-zinc-200">
                            <Edit2 size={14} /> Edit
                          </button>
                          <button className="p-2 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700">
                            <Download size={14} />
                          </button>
                          <button className="p-2 bg-red-600/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
