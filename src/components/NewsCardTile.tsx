'use client'
import { useState, useEffect } from 'react'
import { Download, Share2, Loader2, CheckCircle2, AlertCircle, Save, Copy, Pencil, RefreshCw, Link as LinkIcon, ExternalLink } from 'lucide-react'
import clsx from 'clsx'
import { useStore } from '@/store/useStore'
import { useGalleryStore, GalleryCardState } from '@/store/useGalleryStore'
import { useRouter } from 'next/navigation'
import { BUILT_IN_TEMPLATES } from '@/lib/types'

interface NewsCardTileProps {
  headline: string
  imageUrl: string | null
  articleUrl?: string
  category?: string
  source?: string
  index: number
  shouldStart: boolean
  onComplete: () => void
}

export default function NewsCardTile({ headline, imageUrl, articleUrl, category, source = 'News', index, shouldStart, onComplete }: NewsCardTileProps) {
  const { cardStates, updateCardState } = useGalleryStore()
  const uniqueKey = `${source}-${index}`
  const state: GalleryCardState = cardStates[uniqueKey] || {
    status: 'pending',
    generatedImageUrl: null,
    filename: null,
    isSaved: false,
    isSaving: false,
    isCopying: false,
    error: null
  }
  const { status, templateId: savedTemplateId, generatedImageUrl, filename, isSaved, isSaving, isCopying, error } = state

  const [copyFeedback, setCopyFeedback] = useState<'headline' | 'link' | null>(null)

  const handleCopyText = async (text: string, type: 'headline' | 'link') => {
    try {
      if (!text) return
      await navigator.clipboard.writeText(text)
      setCopyFeedback(type)
      setTimeout(() => setCopyFeedback(null), 2000)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  const setStatus = (v: any) => updateCardState(uniqueKey, { status: v })
  const setSelectedTemplateId = (v: any) => updateCardState(uniqueKey, { templateId: v })
  const setGeneratedImageUrl = (v: any) => updateCardState(uniqueKey, { generatedImageUrl: v })
  const setFilename = (v: any) => updateCardState(uniqueKey, { filename: v })
  const setIsSaved = (v: any) => updateCardState(uniqueKey, { isSaved: v })
  const setIsSaving = (v: any) => updateCardState(uniqueKey, { isSaving: v })
  const setIsCopying = (v: any) => updateCardState(uniqueKey, { isCopying: v })
  const setError = (v: any) => updateCardState(uniqueKey, { error: v })

  const updateCardData = useStore(s => s.updateCardData)
  const setActiveTemplate = useStore(s => s.setActiveTemplate)
  const router = useRouter()

  useEffect(() => {
    if (shouldStart && status === 'pending') {
      generateCard()
    }
  }, [shouldStart, status])

  const getDynamicTemplate = (text: string): string => {
    const len = text.length
    const cleanText = text.trim()
    const cat = category?.toLowerCase() || ''

    // 0. CATEGORY-BASED OVERRIDES (Highest Priority)
    if (cat.includes('খেলা') || cat.includes('ফুটবল') || cat.includes('ক্রিকেট') || cat.includes('sports')) {
      if (text.includes('বনাম') || text.includes('vs')) return 'versus-debate'
      return 'single-news'
    }
    if (cat.includes('বিনোদন') || cat.includes('entertainment') || cat.includes('গান') || cat.includes('সিনেমা')) {
      return 'news-reel'
    }
    if (cat.includes('মতামত') || cat.includes('সম্পাদকীয়') || cat.includes('opinion') || cat.includes('editorial')) {
      return 'editorial-gold'
    }
    if (cat.includes('অপরাধ') || cat.includes('ক্রাইম') || cat.includes('crime') || cat.includes('durghotona')) {
      return 'breaking-ribbon'
    }
    if (cat.includes('প্রযুক্তি') || cat.includes('tech') || cat.includes('বিজ্ঞান') || cat.includes('science')) {
      return 'side-story'
    }
    if (cat.includes('বাণিজ্য') || cat.includes('অর্থনীতি') || cat.includes('business') || cat.includes('economy')) {
      return 'stat-fact'
    }
    if (cat.includes('স্বাস্থ্য') || cat.includes('health') || cat.includes('lifestyle')) {
      return 'modern-duo'
    }

    // 1. HIGH-IMPACT / BREAKING / CRISIS (Urgent news)
    const impactKeywords = [
      'ব্রেকিং', 'নিহত', 'হামলা', 'গ্রেপ্তার', 'মামলা', 'আগুন', 'আটক', 'মৃত্যু',
      'বিস্ফোরণ', 'অভিযান', 'উদ্ধার', 'ভূমিকম্প', 'নিখোঁজ', 'ধর্ষণ', 'খুন',
      'অবরোধ', 'হরতাল', 'সংঘর্ষ', 'গুলি', 'দুর্ঘটনা', 'অগ্নিকাণ্ড', 'নিখোঁজ',
      'আহত', 'রক্তাক্ত', 'তদন্ত', 'সতর্কবার্তা', 'জরুরি', 'কারাদণ্ড', 'ফাঁসি',
      'মারা গেছেন', 'নিখোঁজ', 'ধ্বস', 'ভয়াবহ'
    ]
    if (impactKeywords.some(k => text.includes(k))) {
      return 'breaking-ribbon' 
    }

    // 2. POLITICS / GOVERNANCE
    const politicsKeywords = [
      'প্রধানমন্ত্রী', 'হাসিনা', 'খালেদা', 'তারেক', 'আওয়ামী লীগ', 'বিএনপি', 'নির্বাচন',
      'সংসদ', 'মন্ত্রী', 'বৈঠক', 'রাজনৈতিক', 'দল', 'আন্দোলন', 'সরকার', 'রাষ্ট্রপতি',
      'ইউনূস', 'উপদেষ্টা'
    ]
    if (politicsKeywords.some(k => text.includes(k))) {
      return 'single-news' // Standard blue look for serious news
    }

    // 3. VERSUS / RIVALRY
    const vsKeywords = ['বনাম', 'লড়াই', 'মুখোমুখি', 'দ্বন্দ্ব', 'ভার্সেস', 'vs', 'দ্বৈরথ', 'পাল্টাপাল্টি']
    if (vsKeywords.some(k => text.includes(k))) {
      return 'versus-debate'
    }

    // 4. ENTERTAINMENT / CELEBRITY
    const entertainmentKeywords = [
      'বিনোদন', 'সিনেমা', 'বলিউড', 'হলিউড', 'শাকিব', 'পরিমণি', 'তারকা',
      'উৎসব', 'ঈদ', 'গান', 'ভাইরাল', 'ভিডিও', 'নাটক', 'অভিনেতা', 'অভিনেত্রী',
      'জয়া আহসান', 'ট্রল', 'টিজার', 'ট্রেইলার', 'মুক্তি', 'কনসার্ট', 'জন্মদিন'
    ]
    if (entertainmentKeywords.some(k => text.includes(k))) {
      return 'news-reel'
    }

    // 5. DATA / ECONOMY
    const statKeywords = [
      'শতাংশ', 'কোটি', 'লাখ', 'হাজার', 'গুণ', 'দাম বেড়েছে', 'দাম কমেছে', 'সূচক',
      'শেয়ারবাজার', 'বাজেট', 'রিজার্ভ', 'ডলার', 'রাজস্ব', 'ট্যাক্স', 'শুল্ক',
      'দ্রব্যমূল্য', 'বাজারদর', 'রেকর্ড', 'সর্বোচ্চ', 'সর্বনিম্ন'
    ]
    if (statKeywords.some(k => text.includes(k))) {
      return 'stat-fact'
    }

    // 6. QUOTES / INTERVIEWS
    const quoteKeywords = [
      'বললেন', 'জানালেন', 'মন্তব্য', 'দাবি', 'আহ্বান', 'বলছেন', 'সাক্ষাৎকার',
      'প্রশ্ন', 'উত্তর', 'অভিযোগ', 'আশ্বাস', 'ঘোষণা', 'অঙ্গীকার'
    ]
    const hasQuotes = text.includes('‘') || text.includes('’') || text.includes('"') || text.includes('“') || text.includes('”')
    if (hasQuotes || quoteKeywords.some(k => text.includes(k))) {
      return 'quote-spotlight'
    }

    // 7. QUESTIONS / POLLS
    if (text.includes('?') || text.startsWith('কেমন') || text.startsWith('কেন') || text.startsWith('কীভাবে') || text.startsWith('কারা')) {
      return 'poll-voting'
    }

    // 8. WORLD NEWS
    const worldKeywords = ['বিশ্ব', 'আন্তর্জাতিক', 'যুক্তরাষ্ট্র', 'চীন', 'ভারত', 'পাকিস্তান', 'গাজা', 'ইসরায়েল', 'রাশিয়া', 'ইউক্রেন', 'বাইডেন', 'ট্রাম্প', 'মোদি']
    if (worldKeywords.some(k => text.includes(k))) {
      return 'portrait-editorial' // Distinctive layout for global stories
    }

    // 9. LIFESTYLE / TECH / ENVIRONMENT
    const natureKeywords = [
      'জলবায়ু', 'আবহাওয়া', 'পরিবেশ', 'প্রযুক্তি', 'স্মার্টফোন', 'আইফোন',
      'রোবট', 'চাঁদ', 'মহাকাশ', 'বিদ্যুৎ', 'গ্যাস', 'বৃষ্টি', 'ঝড়', 
      'বন্যা', 'রোদ', 'শীত', 'গরম', 'প্রাকৃতিক', 'বৃক্ষরোপণ', 'খাবার', 'ভ্রমণ'
    ]
    if (natureKeywords.some(k => text.includes(k))) {
      return 'side-story'
    }

    // 10. EDITORIAL / ANALYSIS
    if (len > 80 || text.includes('বিশ্লেষণ') || text.includes('নেপথ্য') || text.includes('ইতিহাস')) {
      return 'editorial-gold'
    }

    // 11. MINIMAL / SHORT NEWS
    if (len < 35) {
      return 'minimal-white'
    }

    // DEFAULT VARIETY (Rotate based on index if no specific match)
    const fallbacks: string[] = ['single-news', 'minimal-split', 'single-bottom']
    return fallbacks[index % fallbacks.length]
  }

  const generateCard = async (forceTemplateId?: string) => {
    setStatus('generating')
    try {
      // Proxy the image through our server to avoid CORS issues with external news sites
      const proxiedImage = imageUrl
        ? `${window.location.origin}/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
        : null

      const templateId = forceTemplateId || savedTemplateId || getDynamicTemplate(headline)

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
            watermarkText: 'Kurigram City',
            source,
            photos: [
              { id: 'p1', src: proxiedImage, objectPosition: 'center', objectFit: 'cover', scale: 1 }
            ]
          },
          templateId,
          styleOverrides: {
            showWatermark: true,
            watermarkOpacity: 0.15
          }
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

  const handleEditInStudio = () => {
    const proxiedImage = imageUrl
      ? `${window.location.origin}/api/proxy-image?url=${encodeURIComponent(imageUrl)}&t=${Date.now()}`
      : null

    const templateId = getDynamicTemplate(headline)
    setActiveTemplate(templateId)

    updateCardData({
      headline,
      subheadline: '',
      brandName: 'Kurigram City',
      handle: 'Kurigram City',
      website: 'Kurigram City',
      source,
      photos: [
        { id: 'p1', src: proxiedImage, objectPosition: 'center', objectFit: 'cover', scale: 1 },
        { id: 'p2', src: null, objectPosition: 'center', objectFit: 'cover', scale: 1 },
        { id: 'p3', src: null, objectPosition: 'center', objectFit: 'cover', scale: 1 }
      ]
    })

    // Force a full reload to clear any stale React state/refs from previous cards
    window.location.href = '/'
  }

  return (
    <div className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden transition-all hover:border-zinc-700">
      <div className="aspect-square relative bg-zinc-950 flex items-center justify-center">
        {status === 'success' && (
          <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
            <select
              className="bg-black/70 text-white text-[10px] rounded px-2 py-1.5 border border-zinc-700 outline-none backdrop-blur-sm cursor-pointer hover:bg-black uppercase font-bold tracking-wider"
              value={savedTemplateId || getDynamicTemplate(headline)}
              onChange={(e) => {
                const newId = e.target.value
                setSelectedTemplateId(newId)
                generateCard(newId)
              }}
            >
              <optgroup label="Select Layout">
                {BUILT_IN_TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        )}

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
          <div className="text-center p-6 space-y-3 text-red-400">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <div>
              <p className="text-xs font-bold uppercase">Error</p>
              <p className="text-[10px] text-zinc-500 line-clamp-2">{error}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); generateCard(); }}
              className="px-4 py-1.5 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 rounded-full text-xs font-bold text-red-400 transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={12} /> Retry
            </button>
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
            <button
              onClick={(e) => { e.stopPropagation(); generateCard(); }}
              className="p-2.5 bg-zinc-800 text-white rounded-full hover:scale-110 transition-transform flex items-center"
              title="Regenerate"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleEditInStudio}
              className="p-2.5 bg-blue-600 text-white rounded-full hover:scale-110 transition-transform flex items-center"
              title="Edit in Studio"
            >
              <Pencil size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800 flex flex-col gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              Story #{index + 1} • {source}
            </p>
            {articleUrl && (
              <button
                onClick={(e) => { e.stopPropagation(); handleCopyText(articleUrl, 'link'); }}
                className={clsx(
                  "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded transition-all",
                  copyFeedback === 'link' ? "bg-green-500/20 text-green-400" : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 active:scale-95"
                )}
              >
                {copyFeedback === 'link' ? <CheckCircle2 size={10} /> : <ExternalLink size={10} />}
                {copyFeedback === 'link' ? 'LINK COPIED' : 'COPY NEWS LINK'}
              </button>
            )}
          </div>

          <div className="group/title relative">
            <h3 className="text-xs font-semibold text-zinc-100 line-clamp-2 leading-relaxed pr-8">
              {headline}
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); handleCopyText(headline, 'headline'); }}
              className={clsx(
                "absolute right-0 top-0 p-1.5 rounded-md transition-all opacity-0 group-hover/title:opacity-100 active:scale-90",
                copyFeedback === 'headline' ? "text-green-500" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
              )}
              title="Copy Full Headline"
            >
              {copyFeedback === 'headline' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status === 'success' && <CheckCircle2 className="text-green-500" size={14} />}
            {status === 'generating' && <Loader2 className="text-red-500 animate-spin" size={14} />}
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
              {status === 'success' ? 'Ready' : status === 'generating' ? 'Generating...' : 'Pending'}
            </span>
          </div>
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
            onClick={(e) => { e.stopPropagation(); generateCard(); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold text-zinc-400 border-r border-zinc-800 active:bg-zinc-800"
          >
            <RefreshCw size={14} /> Retry
          </button>
          <button
            onClick={handleEditInStudio}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-bold text-blue-400 active:bg-zinc-800"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>
      )}
    </div>
  )
}
