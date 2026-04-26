// src/components/studio/CardPreview/Layouts/PortraitEditorial.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { BrandingStack } from '../Elements/BrandingStack'
import { fontMap } from '../InteractionContext'

export function PortraitEditorial({ style, cardData, accentBar }: { style: Template['style'], cardData: CardData, accentBar: React.ReactNode }) {
  const p = cardData.photos || []
  return (
    <>
      {style.accentBarPosition === 'top' && accentBar}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, background: style.backgroundColor }}>
        <div style={{ flex: '0 0 45%', overflow: 'hidden', borderRight: `0.1cqw solid ${style.accentColor}` }}>
           <PhotoSlot {...(p[0] || {})} placeholder="Portrait Photo" id={p[0]?.id || 'p0'} />
        </div>
        <div style={{ flex: 1, padding: '4cqw 3cqw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '2cqw' }}>
          <div style={{ width: '4cqw', height: '0.4cqw', background: style.accentColor }} />
          <p style={{
            fontFamily: fontMap[style.fontFamily], fontWeight: style.headlineFontWeight,
            fontSize: `calc(${style.headlineFontSize / 8}cqw)`, color: style.headlineColor,
            lineHeight: 1.1, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.05cqw'
          }}>{cardData.headline}</p>
          {cardData.subheadline && (
            <p style={{
              fontFamily: 'sans-serif', fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
              color: style.subheadlineColor, margin: 0, fontWeight: 300, lineHeight: 1.4,
              fontStyle: 'italic', opacity: 0.8
            }}>{cardData.subheadline}</p>
          )}
        </div>
      </div>
      <BrandingStack style={style} cardData={cardData} />
      {style.accentBarPosition === 'bottom' && accentBar}
    </>
  )
}
