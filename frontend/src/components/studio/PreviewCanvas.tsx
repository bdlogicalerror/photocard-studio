// src/components/studio/PreviewCanvas.tsx
'use client'
import { useRef, useState } from 'react'
import { useStore, useActiveTemplate } from '@/store/useStore'
import CardPreview from './CardPreview'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import { ChevronDown, Undo, Redo, Trash2, Settings, Download, Share2 } from 'lucide-react'
import { useGeneratePhotocard } from '@/hooks/usePhotocard'

export default function PreviewCanvas() {
  const { cardData, updateCardData, updatePhotoById, updateBlurRegion, removeBlurRegion, updateCustomLayer, removeCustomLayer } = useStore()
  const template = useActiveTemplate()
  const [zoom, setZoom] = useState(100)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const generateMutation = useGeneratePhotocard()

  const handleAction = async (type: 'download' | 'share') => {
    const cardElement = cardRef.current
    if (!cardElement) return

    const toastId = toast.loading('Preparing high-quality render...')
    
    try {
      // Capture the visual bytecode from frontend (perfect fonts)
      const canvas = await html2canvas(cardElement, {
        scale: 2, // 2x resolution
        useCORS: true,
        backgroundColor: '#1E1E24',
        logging: false
      })
      const base64Image = canvas.toDataURL('image/png')

      const payload = {
        template_id: template.id,
        headline: cardData.headline,
        subheadline: cardData.subheadline,
        brand_name: cardData.brandName,
        photos: cardData.photos.map(p => ({ 
          id: p.id, 
          src: p.src || '', 
          objectPosition: p.objectPosition, 
          objectFit: p.objectFit, 
          scale: p.scale 
        })),
        style_overrides: {},
        base64_image: base64Image
      }

      const response = await generateMutation.mutateAsync(payload)
      toast.success('Generated successfully!', { id: toastId })
      
      const imgResponse = await fetch(response.image_url)
      const blob = await imgResponse.blob()
      const file = new File([blob], response.filename, { type: 'image/png' })

      if (type === 'download') {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = response.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'NewsCard',
            text: `Check out this news card: ${cardData.headline}`,
          })
        } else {
          toast.info('Sharing not supported on this browser. Downloading instead...')
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = response.filename
          link.click()
        }
      }
    } catch (err) {
      console.error('Action failed:', err)
      toast.error('Failed to generate image', { id: toastId })
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-[#14141A] min-w-0 overflow-hidden border-t border-zinc-800/50 md:border-none">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-zinc-800/50 bg-[#1E1E24]">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800/50 p-1.5 rounded transition-colors">
          <span className="text-white font-medium text-xs md:text-sm tracking-wide">newscards.studio</span>
          <ChevronDown size={14} className="text-zinc-500" />
        </div>

        <div className="hidden md:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 text-zinc-400">
            <button className="p-1.5 hover:text-white hover:bg-zinc-700/50 rounded transition-colors"><Undo size={16} /></button>
            <button className="p-1.5 hover:text-white hover:bg-zinc-700/50 rounded transition-colors"><Redo size={16} /></button>
            <div className="w-px h-4 bg-zinc-700 mx-1"></div>
            <button className="p-1.5 hover:text-red-400 hover:bg-zinc-700/50 rounded transition-colors"><Trash2 size={16} /></button>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleAction('download')}
              disabled={generateMutation.isPending}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs px-4 py-2 rounded-md transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              <Download size={14} />
              {generateMutation.isPending ? 'Processing...' : 'Download'}
            </button>
            
            <button 
              onClick={() => handleAction('share')}
              disabled={generateMutation.isPending}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs px-4 py-2 rounded-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-4 md:p-8"
        style={{ backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        <div
          style={{
            width: `${zoom}%`,
            maxWidth: 600,
            minWidth: 200,
            transition: 'width 0.2s',
          }}
        >
          <CardPreview 
            key={`${cardData.headline}-${cardData.photos[0]?.src || 'no-photo'}`}
            ref={cardRef}
            template={template} 
            cardData={cardData} 
            forExport={generateMutation.isPending}
            isGuest={true}
            onPhotoChange={(id, patch) => updatePhotoById(id, patch)}
            onBlurChange={(id, patch) => updateBlurRegion(id, patch)}
            onBlurRemove={(id) => removeBlurRegion(id)}
            onCustomLayerChange={(id, patch) => updateCustomLayer(id, patch)}
            onCustomLayerRemove={(id) => removeCustomLayer(id)}
            onWatermarkChange={(patch) => updateCardData(patch)}
          />
        </div>
      </div>

      <div className="px-5 py-2.5 border-t border-zinc-800/50 flex items-center justify-between bg-[#1E1E24]">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded">
            {template.layout}
          </span>
          <span className="text-[11px] text-zinc-500">
            {template.photoCount} Photo{template.photoCount > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(40, z - 10))} className="text-zinc-500 hover:text-white">-</button>
          <span className="text-[10px] text-zinc-500 w-8 text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="text-zinc-500 hover:text-white">+</button>
        </div>
      </div>
    </div>
  )
}
