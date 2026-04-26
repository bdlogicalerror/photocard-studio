// src/components/studio/CardPreview/Layouts/DualTop.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { HeadlineBlock } from '../Elements/HeadlineBlock'
import { BrandBar } from '../Elements/BrandBar'
import { BrandingStack } from '../Elements/BrandingStack'

export function DualTop({ style, cardData, accentBar }: { style: Template['style'], cardData: CardData, accentBar: React.ReactNode }) {
  const p = cardData.photos || []
  return (
    <>
      {style.accentBarPosition === 'top' && accentBar}
      <div style={{ flex: '0 0 55%', minHeight: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4cqw', background: style.photoDividerColor }}>
        <PhotoSlot {...(p[0] || {})} placeholder="Photo 1" id={p[0]?.id || 'p0'} />
        <PhotoSlot {...(p[1] || {})} placeholder="Photo 2" id={p[1]?.id || 'p1'} />
      </div>
      <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} />
      <BrandingStack style={style} cardData={cardData} />
      {style.accentBarPosition === 'bottom' && accentBar}
    </>
  )
}
