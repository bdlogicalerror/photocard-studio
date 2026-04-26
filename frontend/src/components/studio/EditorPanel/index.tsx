// src/components/studio/EditorPanel/index.tsx
'use client'
import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { RefreshCw } from 'lucide-react'
import { PropertiesTab } from './PropertiesTab'
import { LayersTab } from './LayersTab'

export default function EditorPanel() {
  const { resetCardData } = useStore()
  const [activeTab, setActiveTab] = useState<'properties' | 'layers'>('properties')

  return (
    <div className="w-full h-full bg-[#1E1E24] flex-shrink-0 border-l border-zinc-800/50 overflow-y-auto flex flex-col pb-20 md:pb-0 text-sm">
      {/* Top Tabs */}
      <div className="flex px-4 pt-4 pb-2 border-b border-zinc-800/50 sticky top-0 bg-[#1E1E24] z-10 gap-6">
        <button 
          onClick={() => setActiveTab('properties')}
          className={`font-medium text-xs pb-2 transition-colors ${activeTab === 'properties' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Properties
        </button>
        <button 
          onClick={() => setActiveTab('layers')}
          className={`font-medium text-xs pb-2 transition-colors ${activeTab === 'layers' ? 'text-white border-b-2 border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Layers
        </button>
        <div className="ml-auto flex items-center">
          <button
            onClick={resetCardData}
            className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white transition-colors bg-zinc-800/50 px-2 py-1 rounded"
          >
            <RefreshCw size={10} /> Reset
          </button>
        </div>
      </div>

      {activeTab === 'properties' ? <PropertiesTab /> : <LayersTab />}
    </div>
  )
}
