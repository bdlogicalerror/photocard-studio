// src/components/NewsCardTile.tsx
'use client'
import { useState, useEffect } from 'react'
import { Download, Share2, Loader2, CheckCircle2, AlertCircle, Save, Copy } from 'lucide-react'

interface NewsCardTileProps {
  headline: string
  imageUrl: string | null
  source?: string
  index: number
  shouldStart: boolean
  onComplete: () => void
}

export default function NewsCardTile({ headline, imageUrl, source = 'News', index, shouldStart, onComplete }: NewsCardTileProps) {
  const [status, setStatus] = useState<'pending' | 'generating' | 'success' | 'error'>('pending')
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [filename, setFilename] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (shouldStart && status === 'pending') {
      generateCard()
    }
  }, [shouldStart, status])

  const generateCard = async () => {
    setStatus('generating')
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardData: {
            headline,
            subheadline: '',
            brandName: 'Kurigram City',
            handle: 'Kurigram City',
            website: 'Kurigram City',
            source,
            photos: [
              { id: 'p1', src: imageUrl, objectPosition: 'center', objectFit: 'cover', scale: 1 }
            ]
          },
          templateId: 'single-news'
        })
      })

      if (!response.ok) throw new Error('Generation failed')
      
      const data = await response.json()
      setFilename(data.filename)
      setGeneratedImageUrl(data.url)
      setStatus('success')
      onComplete()
    } catch (err: any) {
      console.error(err)
      setError(err.message)
      setStatus('error')
      onComplete()
    }
  }

  const handleDownload = () => {
    if (!generatedImageUrl) return
    const link = document.createElement('a')
    link.href = generatedImageUrl
    link.download = filename || `photocard-${index + 1}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSave = async () => {
    if (!filename || isSaved || isSaving) return
    setIsSaving(true)
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      })

      if (!response.ok) throw new Error('Failed to save')
      
      const data = await response.json()
      setGeneratedImageUrl(data.url)
      setIsSaved(true)
    } catch (err: any) {
      console.error(err)
      alert('Save failed: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = async () => {
    if (!generatedImageUrl) return
    const fullUrl = window.location.origin + generatedImageUrl
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'News Photocard',
          text: headline,
          url: fullUrl
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      await navigator.clipboard.writeText(fullUrl)
      alert('Link copied to clipboard!')
    }
  }

  const handleCopy = async () => {
    if (!generatedImageUrl || isCopying) return
    setIsCopying(true)
    try {
      const response = await fetch(generatedImageUrl)
      const blob = await response.blob()
      
      // Check if browser supports ClipboardItem for images
      if (typeof ClipboardItem !== 'undefined') {
        const item = new ClipboardItem({ 'image/png': blob })
        await navigator.clipboard.write([item])
        alert('Image copied to clipboard!')
      } else {
        throw new Error('ClipboardItem not supported in this browser')
      }
    } catch (err: any) {
      console.error(err)
      alert('Failed to copy image: ' + err.message)
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden transition-all hover:border-zinc-700">
      <div className="aspect-square relative bg-zinc-950 flex items-center justify-center">
        {status === 'pending' && (
          <div className="text-center p-6 space-y-2">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-700">
                {index + 1}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Waiting in queue</p>
          </div>
        )}

        {status === 'generating' && (
          <div className="text-center p-6 space-y-4">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mx-auto" />
            <div>
                <p className="text-xs font-bold text-white mb-1">Generating Photocard...</p>
                <p className="text-[10px] text-zinc-500 line-clamp-2 px-4 italic">{headline}</p>
            </div>
          </div>
        )}

        {status === 'success' && generatedImageUrl && (
          <img 
            src={generatedImageUrl} 
            alt="Generated Card" 
            className="w-full h-full object-contain bg-black"
          />
        )}

        {status === 'error' && (
          <div className="text-center p-6 space-y-2 text-red-400">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <p className="text-xs font-bold uppercase">Error</p>
            <p className="text-[10px] text-zinc-500">{error}</p>
          </div>
        )}

        {status === 'success' && generatedImageUrl && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
             {!isSaved ? (
               <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-2.5 bg-red-600 text-white rounded-full hover:scale-110 transition-transform flex items-center gap-2"
                  title="Save to Exports"
               >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
               </button>
             ) : (
               <div className="p-2.5 bg-green-600 text-white rounded-full flex items-center" title="Saved">
                  <CheckCircle2 size={18} />
               </div>
             )}
             <button 
                onClick={handleDownload}
                className="p-2.5 bg-white text-black rounded-full hover:scale-110 transition-transform flex items-center"
                title="Download"
             >
                <Download size={18} />
             </button>
             <button 
                onClick={handleShare}
                className="p-2.5 bg-zinc-800 text-white rounded-full hover:scale-110 transition-transform flex items-center"
                title="Share Link"
             >
                <Share2 size={18} />
             </button>
             <button 
                onClick={handleCopy}
                disabled={isCopying}
                className="p-2.5 bg-zinc-700 text-white rounded-full hover:scale-110 transition-transform flex items-center"
                title="Copy Image"
             >
                {isCopying ? <Loader2 size={18} className="animate-spin" /> : <Copy size={18} />}
             </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
            Story #{index + 1}
          </p>
          <h3 className="text-xs font-semibold text-zinc-100 line-clamp-2 leading-relaxed">
            {headline}
          </h3>
        </div>
        <div className="flex-shrink-0">
            {status === 'success' && <CheckCircle2 className="text-green-500" size={16} />}
            {status === 'generating' && <Loader2 className="text-red-500 animate-spin" size={16} />}
        </div>
      </div>
      
      {/* Action buttons footer for mobile visibility */}
      {status === 'success' && (
        <div className="md:hidden flex border-t border-zinc-800">
            {!isSaved && (
              <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold text-red-500 border-r border-zinc-800 active:bg-zinc-800"
              >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
              </button>
            )}
            <button 
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold text-zinc-400 border-r border-zinc-800 active:bg-zinc-800"
            >
                <Download size={14} /> Download
            </button>
            <button 
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold text-zinc-400 border-r border-zinc-800 active:bg-zinc-800"
            >
                <Share2 size={14} /> Share
            </button>
            <button 
                onClick={handleCopy}
                disabled={isCopying}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold text-zinc-400 active:bg-zinc-800"
            >
                {isCopying ? <Loader2 size={14} className="animate-spin" /> : <Copy size={14} />} Copy
            </button>
        </div>
      )}
    </div>
  )
}
