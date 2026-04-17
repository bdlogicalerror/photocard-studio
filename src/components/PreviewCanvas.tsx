// src/components/PreviewCanvas.tsx
'use client'
import { useRef, useState } from 'react'
import { useStore, useActiveTemplate } from '@/store/useStore'
import CardPreview from './CardPreview'
import { Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

export default function PreviewCanvas() {
  const { cardData } = useStore()
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

  return (
    <div className="flex-1 flex flex-col bg-[#0d0d0d] min-w-0 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap flex-col sm:flex-row items-center justify-between px-3 md:px-5 py-3 gap-3 border-b border-zinc-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(z => Math.max(40, z - 10))}
            className="w-7 h-7 flex items-center justify-center rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-xs text-zinc-500 w-10 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(z => Math.min(150, z + 10))}
            className="w-7 h-7 flex items-center justify-center rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="w-7 h-7 flex items-center justify-center rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors ml-1"
          >
            <Maximize2 size={12} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-zinc-600">1080 × 1080 px</span>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-1.5 rounded bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-medium transition-colors"
          >
            <Download size={13} />
            {exporting ? 'Exporting...' : 'Export PNG'}
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
          <CardPreview template={template} cardData={cardData} />
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
