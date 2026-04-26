// src/components/studio/CardPreview/Layouts/SingleTop.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { HeadlineBlock } from '../Elements/HeadlineBlock'
import { BrandingStack } from '../Elements/BrandingStack'

export function SingleTop({ style, cardData, accentBar }: { style: Template['style'], cardData: CardData, accentBar: React.ReactNode }) {
  const p = cardData.photos || []
  return (
    <>
      {style.accentBarPosition === 'top' && accentBar}
      <div style={{ flex: '0 0 55%', minHeight: 0, overflow: 'hidden' }}>
        <PhotoSlot {...(p[0] || {})} placeholder="Photo" id={p[0]?.id || 'p0'} />
      </div>
      <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} />
      <BrandingStack style={style} cardData={cardData} />
      {style.accentBarPosition === 'bottom' && accentBar}
    </>
  )
}
