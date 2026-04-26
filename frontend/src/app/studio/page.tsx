import React, { useState, useEffect } from 'react'
import TemplateSidebar from '@/components/studio/TemplateSidebar'
import EditorPanel from '@/components/studio/EditorPanel'
import PreviewCanvas from '@/components/studio/PreviewCanvas'
import { LayoutTemplate, SlidersHorizontal, Image as ImageIcon, X } from 'lucide-react'

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'editor' | 'canvas'>('canvas')

  useEffect(() => {
    const handleClose = () => setActiveTab('canvas')
    window.addEventListener('close-sidebar', handleClose)
    return () => window.removeEventListener('close-sidebar', handleClose)
  }, [])

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden relative bg-zinc-950 pb-[60px] md:pb-0">
      
      {/* Templates Sidebar (Overlay on mobile) */}
      <div className={`
        fixed inset-0 z-30 bg-zinc-950 md:relative md:inset-auto md:z-auto
        w-full md:w-[260px] md:h-full flex-shrink-0 border-r border-zinc-800
        ${activeTab === 'templates' ? 'flex' : 'hidden md:flex'}
        flex-col pb-[60px] md:pb-0
      `}>
        <TemplateSidebar />
      </div>

      {/* Center Canvas (Preview) */}
      <div className={`
        flex-1 flex flex-col bg-zinc-950 min-h-0
        ${activeTab === 'canvas' ? 'flex' : 'hidden md:flex'}
      `}>
        <PreviewCanvas />
      </div>

      {/* Editor Panel (Overlay on mobile) */}
      <div className={`
        fixed inset-0 z-30 bg-zinc-950 md:relative md:inset-auto md:z-auto
        w-full md:w-[320px] md:h-full flex-shrink-0 border-l border-zinc-800
        ${activeTab === 'editor' ? 'flex' : 'hidden md:flex'}
        flex-col pb-[60px] md:pb-0
      `}>
        <EditorPanel />
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-zinc-950 border-t border-zinc-800 flex items-center justify-around z-[100]">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 border-r border-zinc-900 ${activeTab === 'templates' ? 'text-blue-500 bg-zinc-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <LayoutTemplate size={20} />
          <span className="text-[10px] font-medium">Templates</span>
        </button>
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 border-r border-zinc-900 ${activeTab === 'canvas' ? 'text-blue-500 bg-zinc-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <ImageIcon size={20} />
          <span className="text-[10px] font-medium">Preview</span>
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${activeTab === 'editor' ? 'text-blue-500 bg-zinc-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <SlidersHorizontal size={20} />
          <span className="text-[10px] font-medium">Editor</span>
        </button>
      </div>
    </div>
  )
}
