// src/app/page.tsx
'use client'
import { useState } from 'react'
import TemplateSidebar from '@/components/TemplateSidebar'
import EditorPanel from '@/components/EditorPanel'
import PreviewCanvas from '@/components/PreviewCanvas'
import { LayoutTemplate, SlidersHorizontal } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'templates' | 'editor'>('editor')

  return (
    <div className="flex flex-col md:flex-row w-full h-full overflow-hidden relative pb-[60px] md:pb-0">
      
      {/* Preview Area (Top on mobile, Right on desktop) */}
      <div className="h-[50vh] md:h-full md:flex-1 order-1 md:order-2 border-b md:border-b-0 border-zinc-800 bg-zinc-900/50">
        <PreviewCanvas />
      </div>

      {/* Panels Area (Bottom on mobile, Left on desktop) */}
      <div className="h-[50vh] md:h-full md:w-auto order-2 md:order-1 flex overflow-hidden">
        <div className={`w-full md:w-auto h-full flex-shrink-0 ${activeTab === 'templates' ? 'block' : 'hidden md:block'}`}>
          <TemplateSidebar />
        </div>
        <div className={`w-full md:w-auto h-full flex-shrink-0 ${activeTab === 'editor' ? 'block' : 'hidden md:block'}`}>
          <EditorPanel />
        </div>
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
          onClick={() => setActiveTab('editor')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${activeTab === 'editor' ? 'text-red-500 bg-zinc-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <SlidersHorizontal size={20} />
          <span className="text-[10px] font-medium">Edit Panel</span>
        </button>
      </div>
    </div>
  )
}
