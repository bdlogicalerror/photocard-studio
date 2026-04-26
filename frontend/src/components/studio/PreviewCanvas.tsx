// src/components/studio/PreviewCanvas.tsx
'use client'
import { useRef, useState } from 'react'
import { useStore, useActiveTemplate } from '@/store/useStore'
import CardPreview from './CardPreview'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Save, ChevronDown, Undo, Redo, Trash2, Settings, Download, Share2 } from 'lucide-react'
import { photocardApi } from '@/api/photocard'
import { useGeneratePhotocard } from '@/hooks/usePhotocard'
import AuthModal from '@/components/auth/AuthModal'

export default function PreviewCanvas() {
  const { cardData, updateCardData, updatePhotoById, updateBlurRegion, removeBlurRegion, updateCustomLayer, removeCustomLayer } = useStore()
  const template = useActiveTemplate()
  const [zoom, setZoom] = useState(100)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [canvasSize, setCanvasSize] = useState<'square' | 'portrait' | 'landscape'>('square')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [hasReachedLimit, setHasReachedLimit] = useState(false)
  const [downloadQuality, setDownloadQuality] = useState<'standard' | 'hd' | 'fhd'>('standard')
  
  const generateMutation = useGeneratePhotocard()

  const sizes = {
    square: { label: 'Square (1:1)', width: 1080, height: 1080, aspect: '1/1' },
    portrait: { label: 'Portrait (9:16)', width: 1080, height: 1920, aspect: '9/16' },
    landscape: { label: 'Landscape (1.91:1)', width: 1200, height: 630, aspect: '1.91/1' }
  } as const

  const pollJobStatus = async (jobId: string, toastId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const status = await photocardApi.checkStatus(jobId)
          if (status.status === 'complete' || status.status === 'success') {
            clearInterval(interval)
            if (!status.result) {
              reject(new Error('Generation failed: No result returned'))
            } else {
              resolve(status.result)
            }
          } else if (status.status === 'failed' || status.progress === -1) {
            clearInterval(interval)
            reject(new Error(status.message || 'Generation failed'))
          } else {
            toast.loading(`Processing: ${status.message} (${status.progress}%)`, { id: toastId })
          }
        } catch (err) {
          // ignore
        }
      }, 1000)
      setTimeout(() => { clearInterval(interval); reject(new Error('Timed out')) }, 30000)
    })
  }

  const handleSaveToGallery = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setIsAuthModalOpen(true)
      return
    }

    setIsSaving(true)
    const toastId = toast.loading('Queueing generation...')

    try {
      const formData = new FormData()
      formData.append('template_id', template?.id || '')
      formData.append('headline', cardData.headline)
      formData.append('subheadline', cardData.subheadline || '')
      formData.append('brand_name', cardData.brandName || '')
      formData.append('variant', canvasSize)
      formData.append('photos_json', JSON.stringify(cardData.photos.map(p => ({ 
        id: p.id, src: p.src || '', objectPosition: p.objectPosition, objectFit: p.objectFit, scale: p.scale 
      }))))

      const response = await generateMutation.mutateAsync(formData)
      await pollJobStatus(response.id, toastId)
      toast.success('Saved to gallery!', { id: toastId })
    } catch (err: any) {
      console.error('Save failed:', err)
      if (err.response?.status === 429) {
        toast.dismiss(toastId)
        setHasReachedLimit(true)
        setIsAuthModalOpen(true)
      } else {
        toast.error(err.message || 'Failed to save', { id: toastId })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleAction = async (type: 'download' | 'share') => {
    // Quality enforcement for guests/free users
    const { data: { session } } = await supabase.auth.getSession()
    const isPro = session?.user?.user_metadata?.plan === 'pro'
    
    if (downloadQuality !== 'standard' && !isPro) {
      toast.error('Upgrade to a Pro plan to unlock HD and FHD downloads!')
      return
    }

    const toastId = toast.loading('Queueing generation...')
    
    try {
      const formData = new FormData()
      formData.append('template_id', template?.id || '')
      formData.append('headline', cardData.headline)
      formData.append('subheadline', cardData.subheadline || '')
      formData.append('brand_name', cardData.brandName || '')
      formData.append('variant', canvasSize)
      formData.append('quality', downloadQuality)
      formData.append('photos_json', JSON.stringify(cardData.photos.map(p => ({ 
        id: p.id, src: p.src || '', objectPosition: p.objectPosition, objectFit: p.objectFit, scale: p.scale 
      }))))

      const response = await generateMutation.mutateAsync(formData)
      const result = await pollJobStatus(response.id, toastId)
      if (!result || !result.image_url) {
        throw new Error('Generation failed: Image URL not found')
      }
      
      toast.success('Generated successfully!', { id: toastId })
      
      const imgResponse = await fetch(result.image_url)
      const blobResponse = await imgResponse.blob()
      const file = new File([blobResponse], result.filename, { type: 'image/png' })

      if (type === 'download') {
        const url = window.URL.createObjectURL(blobResponse)
        const link = document.createElement('a')
        link.href = url
        link.download = result.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'News Photocard', text: cardData.headline })
        } else {
          toast.error('Sharing not supported on this device')
        }
      }
    } catch (err: any) {
      console.error('Action failed:', err)
      if (err.response?.status === 429) {
        toast.dismiss(toastId)
        setHasReachedLimit(true)
        setIsAuthModalOpen(true)
      } else {
        toast.error(err.message || `Failed to ${type}`, { id: toastId })
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-[#14141A] min-w-0 overflow-hidden">
      {/* Top Action Bar (Sticky and compact on mobile) */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 py-2.5 border-b border-zinc-800/50 bg-[#1E1E24]/90 backdrop-blur-md">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800/50 p-1 rounded transition-colors">
          <span className="text-white font-bold text-[10px] md:text-sm tracking-tighter uppercase italic">Photocard Studio</span>
        </div>

        <div className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/30">
            <Settings size={12} className="text-zinc-400" />
            <select 
              value={canvasSize}
              onChange={(e) => setCanvasSize(e.target.value as any)}
              className="bg-transparent text-[11px] font-bold text-white outline-none cursor-pointer"
            >
              {Object.entries(sizes).map(([key, val]) => (
                <option key={key} value={key} className="bg-[#1E1E24]">{val.label}</option>
              ))}
            </select>
          </div>
          <div className="hidden md:flex items-center gap-2 text-zinc-400 border-l border-zinc-800 pl-4">
            <button className="p-1.5 hover:text-white hover:bg-zinc-700/50 rounded transition-colors"><Undo size={16} /></button>
            <button className="p-1.5 hover:text-white hover:bg-zinc-700/50 rounded transition-colors"><Redo size={16} /></button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={downloadQuality}
            onChange={(e) => setDownloadQuality(e.target.value as any)}
            className="bg-zinc-800 text-white text-xs font-bold px-2 py-1.5 rounded-lg border border-zinc-700/50 outline-none"
          >
            <option value="standard">Standard (1080p)</option>
            <option value="hd">HD (1620p)</option>
            <option value="fhd">FHD (2160p)</option>
          </select>
          <button 
            onClick={handleSaveToGallery}
            disabled={isSaving}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 border border-zinc-700/50"
          >
            <Save size={14} className={cn(isSaving && "animate-pulse")} />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button 
            onClick={() => handleAction('download')}
            disabled={generateMutation.isPending}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg active:scale-95"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download</span>
          </button>
          <button 
            onClick={() => handleAction('share')}
            disabled={generateMutation.isPending}
            className="flex md:hidden items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white p-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative"
        style={{ backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        <div className="min-h-full w-full p-4 md:p-12 flex items-center justify-center">
          <div
            style={{
              width: zoom === 100 ? '100%' : `${zoom}%`,
              maxWidth: 'min(100%, 78vh)', 
              aspectRatio: (sizes as any)[canvasSize].aspect,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              margin: 'auto' 
            }}
            className="relative z-0 shadow-2xl"
          >
            {template ? (
              <CardPreview 
                key={`${cardData.headline}-${cardData.photos[0]?.src || 'no-photo'}`}
                ref={cardRef}
                template={template} 
                cardData={cardData} 
                aspectRatio={(sizes as any)[canvasSize].aspect}
                forExport={generateMutation.isPending}
                isGuest={true}
                onPhotoChange={(id, patch) => updatePhotoById(id, patch)}
                onBlurChange={(id, patch) => updateBlurRegion(id, patch)}
                onBlurRemove={(id) => removeBlurRegion(id)}
                onCustomLayerChange={(id, patch) => updateCustomLayer(id, patch)}
                onCustomLayerRemove={(id) => removeCustomLayer(id)}
                onWatermarkChange={(patch) => updateCardData(patch)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900/20 rounded-2xl border-2 border-dashed border-zinc-800 animate-pulse">
                <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest italic">Loading Design...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-2.5 border-t border-zinc-800/50 flex items-center justify-between bg-[#1E1E24]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded">
            {template?.layout || 'loading...'}
          </span>
          <span className="text-[11px] text-zinc-500">
            {template?.photoCount || 0} Photo{(template?.photoCount || 0) > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(40, z - 10))} className="text-zinc-500 hover:text-white">-</button>
          <span className="text-[10px] text-zinc-500 w-8 text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="text-zinc-500 hover:text-white">+</button>
        </div>
      </div>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false)
          setHasReachedLimit(false)
        }} 
        defaultTab={hasReachedLimit ? "signup" : "login"}
        limitReached={hasReachedLimit}
      />
    </div>
  )
}
