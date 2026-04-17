// src/app/page.tsx
'use client'
import { useState } from 'react'
import TemplateSidebar from '@/components/TemplateSidebar'
import EditorPanel from '@/components/EditorPanel'
import PreviewCanvas from '@/components/PreviewCanvas'
import { Layers, LayoutTemplate, SlidersHorizontal, Image as ImageIcon } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'templates' | 'editor' | 'preview'>('preview')

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0d0d0d]">
      {/* App header — thin top bar */}
      <div className="absolute top-0 left-0 right-0 h-10 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 gap-3 z-20">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-red-500" />
          <span className="text-sm font-semibold tracking-tight text-white hidden sm:inline">Photocard Studio</span>
          <span className="text-sm font-semibold tracking-tight text-white sm:hidden">PC Studio</span>
        </div>
        <div className="w-px h-4 bg-zinc-800" />
        <span className="text-[11px] text-zinc-500 truncate max-w-[200px]">Bengali news card generator</span>
      </div>

      {/* Main layout below header */}
      <div className="flex w-full flex-1 pt-10 overflow-hidden relative pb-[60px] md:pb-0 h-full">
        <div className={`w-full md:w-auto md:block h-full flex-shrink-0 ${activeTab === 'templates' ? 'block' : 'hidden'}`}>
          <TemplateSidebar />
        </div>
        <div className={`w-full md:w-auto md:block h-full flex-shrink-0 ${activeTab === 'editor' ? 'block' : 'hidden'}`}>
          <EditorPanel />
        </div>
        <div className={`w-full md:flex flex-1 h-full min-w-0 ${activeTab === 'preview' ? 'flex flex-col' : 'hidden'}`}>
          <PreviewCanvas />
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 h-[60px] bg-zinc-950 border-t border-zinc-800 flex items-center justify-around z-20">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${activeTab === 'templates' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <LayoutTemplate size={20} />
          <span className="text-[10px] font-medium">Templates</span>
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 border-x border-zinc-800 ${activeTab === 'editor' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <SlidersHorizontal size={20} />
          <span className="text-[10px] font-medium">Edit</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${activeTab === 'preview' ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <ImageIcon size={20} />
          <span className="text-[10px] font-medium">Preview</span>
        </button>
      </div>
    </div>
  )
}
