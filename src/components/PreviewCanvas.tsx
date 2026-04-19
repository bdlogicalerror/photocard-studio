// src/components/PreviewCanvas.tsx
'use client'
import { useRef, useState } from 'react'
import { useStore, useActiveTemplate } from '@/store/useStore'
import CardPreview from './CardPreview'
import { Download, ZoomIn, ZoomOut, Maximize2, Facebook, Share2 } from 'lucide-react'

export default function PreviewCanvas() {
  const { cardData, updatePhotoById, updateBlurRegion, removeBlurRegion } = useStore()
  const template = useActiveTemplate()
  const [exporting, setExporting] = useState(false)
  const [zoom, setZoom] = useState(100)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    setExporting(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const el = document.getElementById('card-preview')
      if (!el) return
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setExporting(false)
    }
  }

  const handleShare = async () => {
    setExporting(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const el = document.getElementById('card-preview')
      if (!el) return
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const dataUrl = canvas.toDataURL('image/png')
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'photocard.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Photocard Studio',
          text: `Check out this photocard: ${cardData.headline}`,
        })
      } else {
        // Fallback for desktop/unsupported browsers
        const link = document.createElement('a')
        link.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}.png`
        link.href = dataUrl
        link.click()
        alert('Sharing directly is not supported on this browser. The image has been downloaded—you can now upload it to Facebook manually.')
      }
    } catch (err) {
      console.error('Share failed:', err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0d0d0d] min-w-0 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 md:px-5 py-2 md:py-3 gap-2 border-b border-zinc-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(z => Math.max(40, z - 10))}
            className="w-7 h-7 flex items-center justify-center rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[10px] md:text-xs text-zinc-500 w-8 md:w-10 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(z => Math.min(150, z + 10))}
            className="w-7 h-7 flex items-center justify-center rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] md:text-[11px] text-zinc-600 hidden xs:inline">1080 × 1080 px</span>
          <button
            onClick={handleShare}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded bg-[#1877F2] hover:bg-[#166fe5] disabled:opacity-50 text-white text-[10px] md:text-xs font-medium transition-colors"
          >
            <Facebook size={12} className="md:w-[13px] md:h-[13px]" />
            {exporting ? '...' : (
              <span className="whitespace-nowrap">Facebook Share</span>
            )}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white text-[10px] md:text-xs font-medium transition-colors border border-zinc-700"
          >
            <Download size={12} className="md:w-[13px] md:h-[13px]" />
            {exporting ? '...' : (
              <span className="whitespace-nowrap text-zinc-300">PNG</span>
            )}
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 md:p-8"
        style={{ backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        <div
          ref={cardRef}
          style={{
            width: `${zoom}%`,
            maxWidth: 600,
            minWidth: 200,
            transition: 'width 0.2s',
          }}
        >
          <CardPreview 
            template={template} 
            cardData={cardData} 
            onPhotoChange={(id, patch) => updatePhotoById(id, patch)}
            onBlurChange={(id, patch) => updateBlurRegion(id, patch)}
            onBlurRemove={(id) => removeBlurRegion(id)}
          />
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="px-5 py-2 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-[10px] text-zinc-600">
          Template: <span className="text-zinc-400">{template.name}</span>
          {' · '}
          Layout: <span className="text-zinc-400">{template.layout}</span>
          {' · '}
          Photos: <span className="text-zinc-400">{template.photoCount}</span>
        </span>
        <span className="text-[10px] text-zinc-600">Output: 3240 × 3240 px (3× scale)</span>
      </div>
    </div>
  )
}
