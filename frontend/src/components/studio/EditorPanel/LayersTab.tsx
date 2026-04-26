// src/components/studio/EditorPanel/LayersTab.tsx
'use client'
import React, { useState } from 'react'
import { useStore, useActiveTemplate } from '@/store/useStore'
import { Section } from './UI/Section'
import { LayerItem } from './UI/LayerItem'
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import clsx from 'clsx'

export function LayersTab() {
  const { cardData, updateStyle, updateCardData, removeCustomLayer } = useStore()
  const template = useActiveTemplate()
  const style = template.style
  const [dragOver, setDragOver] = useState<string | null>(null)

  const swapBrandingOrder = () => {
    updateCardData({ 
      sponsorOrder: cardData.sponsorOrder === 'brand-first' ? 'sponsor-first' : 'brand-first' 
    })
  }

  // Branding bars order
  const brandingOrder = cardData.sponsorOrder || 'brand-first'
  const bars = brandingOrder === 'brand-first' 
    ? ['brand', 'sponsor'] 
    : ['sponsor', 'brand']

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    e.dataTransfer.setData('type', type)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetType: string) => {
    e.preventDefault()
    setDragOver(null)
    const draggedType = e.dataTransfer.getData('type')
    if (draggedType !== targetType) {
      swapBrandingOrder()
    }
  }

  return (
    <div className="p-3 flex flex-col gap-1 max-h-screen overflow-y-auto custom-scrollbar">
      <Section title="Active Layers">
        <div className="flex flex-col gap-1.5">
          {/* Dynamic Branding Order */}
          {bars.map((type, idx) => (
            <div 
              key={type}
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onDragOver={(e) => { e.preventDefault(); setDragOver(type) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, type)}
              className={clsx(
                "flex items-center gap-2 p-1 rounded-lg transition-all",
                dragOver === type ? "bg-blue-500/20 border-blue-500/50" : "bg-transparent border-transparent",
                "border"
              )}
            >
              <div className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400">
                <GripVertical size={14} />
              </div>
              
              <div className="flex-1">
                {type === 'brand' ? (
                  <LayerItem 
                    name="Brand Bar" 
                    visible={style.showBrandBar} 
                    onToggle={() => updateStyle({ showBrandBar: !style.showBrandBar })} 
                  />
                ) : (
                  <LayerItem 
                    name="Sponsor Bar" 
                    visible={cardData.showSponsor ?? false} 
                    onToggle={() => updateCardData({ showSponsor: !cardData.showSponsor })} 
                  />
                )}
              </div>

              <div className="flex flex-col gap-0.5">
                <button 
                  onClick={swapBrandingOrder}
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-blue-500 transition-colors"
                  title={idx === 0 ? "Move Down" : "Move Up"}
                >
                  {idx === 0 ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
              </div>
            </div>
          ))}

          <div className="h-px bg-zinc-800/50 my-2" />
          
          <LayerItem name="Watermark" visible={style.showWatermark ?? false} onToggle={() => updateStyle({ showWatermark: !(style.showWatermark ?? false) })} />
          
          <div className="h-px bg-zinc-800/50 my-2" />
          
          <LayerItem name="Headline Text" visible={true} locked />
          <LayerItem name="Subheadline Text" visible={true} locked />
          
          <div className="h-px bg-zinc-800/50 my-2" />
          
          {Array.from({ length: template.photoCount }).map((_, i) => (
            <LayerItem key={i} name={`Photo ${i + 1}`} visible={true} locked />
          ))}
          
          {cardData.blurRegions?.map((blur, idx) => (
            <LayerItem key={blur.id} name={`Blur Region ${idx + 1}`} visible={true} locked />
          ))}

          {cardData.customLayers?.map((layer, idx) => (
            <LayerItem 
              key={layer.id} 
              name={`Graphic ${idx + 1}`} 
              visible={true} 
              onToggle={() => removeCustomLayer(layer.id)} 
            />
          ))}
          
          <div className="h-px bg-zinc-800/50 my-2" />
          <LayerItem name="Background Base" visible={true} locked />
        </div>
      </Section>
    </div>
  )
}
