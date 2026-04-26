// src/components/studio/CardPreview/Layouts/BreakingAlert.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { HeadlineBlock } from '../Elements/HeadlineBlock'
import { BrandingStack } from '../Elements/BrandingStack'

export function BreakingAlert({ style, cardData, accentBar }: { style: Template['style'], cardData: CardData, accentBar: React.ReactNode }) {
  const p = cardData.photos || []
  return (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {style.accentBarPosition === 'top' && accentBar}
      <div style={{ position: 'relative', flex: '0 0 60%', overflow: 'hidden' }}>
        <PhotoSlot {...(p[0] || {})} placeholder="Photo" id={p[0]?.id || 'p0'} />
        <div style={{
          position: 'absolute', top: '1.5cqw', left: 0, background: style.accentColor, color: style.backgroundColor,
          padding: '0.8cqw 2.5cqw 0.8cqw 1.5cqw', fontWeight: 900, fontSize: '2.5cqw', fontFamily: 'sans-serif',
          textTransform: 'uppercase', clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)', boxShadow: '0 1cqw 2cqw rgba(0,0,0,0.5)'
        }}>
          BREAKING NEWS
        </div>
        <div style={{ position: 'absolute', inset: '50% 0 0 0', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
      </div>
      
      <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} />
      <BrandingStack style={style} cardData={cardData} />
      {style.accentBarPosition === 'bottom' && accentBar}
    </div>
  )
}
