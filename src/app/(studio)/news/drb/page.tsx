// src/app/(studio)/news/drb/page.tsx
'use client'
import { useState, useEffect } from 'react'
import NewsCardTile from '@/components/NewsCardTile'
import { Newspaper, RefreshCcw, Loader2 } from 'lucide-react'
import { useGalleryStore } from '@/store/useGalleryStore'

export default function DrbGallery() {
  const { drb, updateSource } = useGalleryStore()
  const { news, currentIndex, hasFetched } = drb

  const [loading, setLoading] = useState(!hasFetched)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = async () => {
    if (hasFetched && news.length > 0) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    updateSource('drb', { currentIndex: 0 })
    try {
      const response = await fetch('/api/news/drb')
      const data = await response.json()
      if (data.success) {
        updateSource('drb', { news: data.items, hasFetched: true })
      } else {
        throw new Error(data.error || 'Failed to fetch news')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleComplete = () => {
    updateSource('drb', { currentIndex: useGalleryStore.getState().drb.currentIndex + 1 })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-500">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        <p className="text-sm font-medium animate-pulse">Fetching latest stories from Daily Rangpur...</p>
        <p className="text-xs text-zinc-600">Visiting each article to collect images — this takes a moment</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <div className="p-4 bg-orange-900/20 rounded-full text-orange-500">
           <RefreshCcw className="w-8 h-8" />
        </div>
        <div>
            <h2 className="text-lg font-bold text-white mb-2">Failed to load news</h2>
            <p className="text-zinc-500 max-w-xs mx-auto text-sm">{error}</p>
        </div>
        <button 
          onClick={fetchNews}
          className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-sm font-bold transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  const finishedCount = Math.min(currentIndex, news.length)
  const progress = news.length > 0 ? (finishedCount / news.length) * 100 : 0

  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col overflow-hidden">
      {/* Gallery Header */}
      <div className="flex-shrink-0 px-6 py-4 bg-zinc-950/50 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-600 rounded-lg">
            <Newspaper className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold text-white">Daily Rangpur</h1>
            <p className="text-[10px] md:text-xs text-zinc-500">drb.news — Generating photocards for the latest stories</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400">PROGRESS</span>
              <span className="text-[10px] font-bold text-orange-500">{finishedCount} / {news.length}</span>
           </div>
           <div className="w-32 md:w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
           </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, idx) => (
            <NewsCardTile 
              key={idx}
              index={idx}
              headline={item.headline}
              imageUrl={item.imageUrl}
              category={item.category}
              articleUrl={item.articleUrl}
              source="Daily Rangpur"
              shouldStart={idx === currentIndex}
              onComplete={handleComplete}
            />
          ))}
        </div>
        
        {news.length === 0 && !loading && (
          <div className="text-center py-20 text-zinc-500">
            No news items found.
          </div>
        )}
        
        <div className="h-20" />
      </div>
    </div>
  )
}
