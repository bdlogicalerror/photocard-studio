// src/app/(studio)/news/abp-live/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { Newspaper, Loader2, RefreshCcw, LayoutGrid, ArrowLeft } from 'lucide-react'
import { useGalleryStore } from '@/store/useGalleryStore'
import NewsCardTile from '@/components/NewsCardTile'
import Link from 'next/link'

export default function ABPLivePage() {
  const { abpLive, updateSource } = useGalleryStore()
  const { news, currentIndex, hasFetched } = abpLive
  const [loading, setLoading] = useState(!hasFetched)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/news/abp-live')
      const data = await res.json()
      if (data.success) {
        updateSource('abpLive', { news: data.items, hasFetched: true })
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
    if (!hasFetched) {
      fetchNews()
    }
  }, [])

  const handleComplete = () => {
    const nextIdx = currentIndex + 1
    updateSource('abpLive', { currentIndex: nextIdx })
  }

  const finishedCount = currentIndex
  const progress = news.length > 0 ? (finishedCount / news.length) * 100 : 0

  if (loading && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-500">
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
        <p className="text-sm font-medium animate-pulse text-zinc-400">Fetching latest stories from ABP Live...</p>
      </div>
    )
  }

  if (error && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <div className="p-4 bg-red-900/20 rounded-full text-red-500">
           <RefreshCcw className="w-8 h-8" />
        </div>
        <div className="max-w-md">
           <h2 className="text-xl font-bold text-white mb-2">Feed Connection Failed</h2>
           <p className="text-zinc-500 text-sm mb-6">{error}</p>
           <button 
             onClick={fetchNews}
             className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-bold text-sm transition-all"
           >
             Try Again
           </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#09090b]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 p-4 md:px-8">
         <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <Link href="/" className="p-2 hover:bg-zinc-900 rounded-full transition-colors order-first">
                 <ArrowLeft size={20} className="text-zinc-400" />
               </Link>
               <div className="p-3 bg-red-600/20 rounded-2xl">
                  <Newspaper className="text-red-500 w-6 h-6" />
               </div>
               <div>
                  <h1 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
                    ABP LIVE <span className="text-[10px] bg-red-500/20 px-2 py-0.5 rounded-full font-bold text-red-400">(IN)</span>
                  </h1>
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">Automated Photocard Hub</p>
               </div>
            </div>

            <div className="flex items-center gap-6 bg-zinc-900/50 p-2 px-4 rounded-2xl border border-zinc-800">
               <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Queue Progress</span>
                     <span className="text-[10px] font-bold text-red-500">{finishedCount} / {news.length}</span>
                  </div>
                  <div className="w-32 md:w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-red-600 transition-all duration-500 ease-out"
                       style={{ width: `${progress}%` }}
                     />
                  </div>
               </div>
               <div className="h-8 w-px bg-zinc-800 mx-2" />
               <button 
                 onClick={fetchNews}
                 className="p-2 text-zinc-400 hover:text-white transition-colors"
                 title="Refresh Feed"
               >
                 <RefreshCcw size={18} />
               </button>
            </div>
         </div>
      </div>

      {/* Gallery Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {news.map((item, idx) => (
            <NewsCardTile 
              key={`${idx}-${item.articleUrl}`}
              index={idx}
              headline={item.headline}
              imageUrl={item.imageUrl}
              articleUrl={item.articleUrl}
              source="ABP Live (IN)"
              shouldStart={idx === currentIndex}
              onComplete={handleComplete}
            />
          ))}
        </div>
        
        {news.length === 0 && !loading && (
          <div className="text-center py-20 text-zinc-500">
             <div className="p-6 bg-zinc-900/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                <LayoutGrid size={40} className="opacity-20" />
             </div>
             <p className="font-bold text-sm">No stories available at the moment.</p>
          </div>
        )}
        
        <div className="h-20" />
      </div>
    </div>
  )
}
