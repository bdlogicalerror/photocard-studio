// src/components/studio/EditorPanel/LayersTab.tsx
'use client'
import React from 'react'
import { useStore, useActiveTemplate } from '@/store/useStore'
import { Section } from './UI/Section'
import { LayerItem } from './UI/LayerItem'

export function LayersTab() {
  const { cardData, updateStyle, removeCustomLayer } = useStore()
  const template = useActiveTemplate()
  const style = template.style

  return (
    <div className="p-5 flex flex-col gap-2">
      <Section title="Document Layers">
        <div className="flex flex-col gap-2">
          <LayerItem name="Brand Bar" visible={style.showBrandBar} onToggle={() => updateStyle({ showBrandBar: !style.showBrandBar })} />
          <LayerItem name="Watermark" visible={style.showWatermark ?? false} onToggle={() => updateStyle({ showWatermark: !(style.showWatermark ?? false) })} />
          <LayerItem name="Ad Bar" visible={style.showAdBar ?? false} onToggle={() => updateStyle({ showAdBar: !(style.showAdBar ?? false) })} />
          
          <div className="h-px bg-zinc-800 my-1" />
          
          <LayerItem name="Headline Text" visible={true} locked />
          <LayerItem name="Subheadline Text" visible={true} locked />
          
          <div className="h-px bg-zinc-800 my-1" />
          
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
          
          <div className="h-px bg-zinc-800 my-1" />
          <LayerItem name="Background Base" visible={true} locked />
        </div>
      </Section>
    </div>
  )
}
