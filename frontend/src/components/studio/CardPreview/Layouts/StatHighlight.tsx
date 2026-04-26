// src/components/studio/CardPreview/Layouts/StatHighlight.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { BrandingStack } from '../Elements/BrandingStack'
import { fontMap } from '../InteractionContext'

export function StatHighlight({ style, cardData, accentBar }: { style: Template['style'], cardData: CardData, accentBar: React.ReactNode }) {
  const p = cardData.photos || []
  return (
    <>
      {style.accentBarPosition === 'top' && accentBar}
      <div style={{ flex: '0 0 45%', minHeight: 0, overflow: 'hidden' }}>
        <PhotoSlot {...(p[0] || {})} placeholder="Photo" id={p[0]?.id || 'p0'} />
      </div>
      <div style={{
        background: style.backgroundColor, display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', padding: '3cqw 4cqw', flex: 1, gap: '1cqw'
      }}>
        <p style={{
          fontFamily: 'sans-serif', fontWeight: 900,
          fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
          color: style.accentColor, lineHeight: 1, margin: 0, letterSpacing: '-0.2cqw'
        }}>{cardData.subheadline || '00%'}</p>
        
        <p style={{
          fontFamily: fontMap[style.fontFamily], fontWeight: style.headlineFontWeight,
          fontSize: `calc(${style.headlineFontSize / 8}cqw)`, color: style.headlineColor,
          lineHeight: 1.2, margin: 0
        }}>{cardData.headline || 'Statistic description goes here'}</p>
      </div>
      <BrandingStack style={style} cardData={cardData} />
      {style.accentBarPosition === 'bottom' && accentBar}
    </>
  )
}
