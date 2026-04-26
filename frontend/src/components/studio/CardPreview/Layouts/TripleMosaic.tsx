// src/components/studio/CardPreview/Layouts/TripleMosaic.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { HeadlineBlock } from '../Elements/HeadlineBlock'
import { BrandBar } from '../Elements/BrandBar'

export function TripleMosaic({ style, cardData, accentBar }: { style: Template['style'], cardData: CardData, accentBar: React.ReactNode }) {
  const p = cardData.photos || []
  return (
    <>
      {style.accentBarPosition === 'top' && accentBar}
      <div style={{ flex: '0 0 55%', overflow: 'hidden', minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4cqw', background: style.photoDividerColor }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4cqw' }}>
          <div style={{ flex: 1 }}><PhotoSlot {...(p[0] || {})} placeholder="Photo 1" id={p[0]?.id || 'p0'} /></div>
          <div style={{ flex: 1 }}><PhotoSlot {...(p[1] || {})} placeholder="Photo 2" id={p[1]?.id || 'p1'} /></div>
        </div>
        <PhotoSlot {...(p[2] || {})} placeholder="Photo 3" id={p[2]?.id || 'p2'} />
      </div>
      <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} />
      <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
      {style.accentBarPosition === 'bottom' && accentBar}
    </>
  )
}
