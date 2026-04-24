// src/app/studio/page.tsx
'use client'
import { useState } from 'react'
import TemplateSidebar from '@/components/TemplateSidebar'
import EditorPanel from '@/components/EditorPanel'
import PreviewCanvas from '@/components/PreviewCanvas'
import { LayoutTemplate, SlidersHorizontal, Image as ImageIcon } from 'lucide-react'

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'editor' | 'canvas'>('canvas')

  return (
    <div className="flex flex-col md:flex-row w-full h-full overflow-hidden relative bg-zinc-950 pb-[60px] md:pb-0">
      
      {/* Desktop Left Sidebar / Mobile Tab Content */}
      <div className={`w-full md:w-[260px] h-[50vh] md:h-full flex-shrink-0 border-r border-zinc-800 ${activeTab === 'templates' ? 'block' : 'hidden md:block'}`}>
        <TemplateSidebar />
      </div>

      {/* Center Canvas (Preview) */}
      <div className={`w-full md:flex-1 h-[50vh] md:h-full flex flex-col bg-zinc-950 ${activeTab === 'canvas' ? 'block' : 'block md:block'}`}>
        <PreviewCanvas />
      </div>

      {/* Desktop Right Sidebar / Mobile Tab Content */}
      <div className={`w-full md:w-[320px] h-[50vh] md:h-full flex-shrink-0 border-l border-zinc-800 ${activeTab === 'editor' ? 'block' : 'hidden md:block'}`}>
        <EditorPanel />
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 h-[60px] bg-zinc-950 border-t border-zinc-800 flex items-center justify-around z-20">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 border-r border-zinc-900 ${activeTab === 'templates' ? 'text-red-500 bg-zinc-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <LayoutTemplate size={20} />
          <span className="text-[10px] font-medium">Templates</span>
        </button>
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 border-r border-zinc-900 ${activeTab === 'canvas' ? 'text-red-500 bg-zinc-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <ImageIcon size={20} />
          <span className="text-[10px] font-medium">Preview</span>
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${activeTab === 'editor' ? 'text-red-500 bg-zinc-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <SlidersHorizontal size={20} />
          <span className="text-[10px] font-medium">Editor</span>
        </button>
      </div>
    </div>
  )
}
