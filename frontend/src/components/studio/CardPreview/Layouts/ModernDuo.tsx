// src/components/studio/CardPreview/Layouts/ModernDuo.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { HeadlineBlock } from '../Elements/HeadlineBlock'
import { BrandingStack } from '../Elements/BrandingStack'

export function ModernDuo({ style, cardData, accentBar }: { style: Template['style'], cardData: CardData, accentBar: React.ReactNode }) {
  const p = cardData.photos || []
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: style.backgroundColor, padding: '4cqw' }}>
      <div style={{ display: 'flex', gap: '3cqw', flex: '0 0 45%', minHeight: 0 }}>
        <div style={{ flex: 1, borderRadius: '2cqw', overflow: 'hidden' }}>
          <PhotoSlot {...(p[0] || {})} placeholder="Photo 1" id={p[0]?.id || 'p0'} />
        </div>
        <div style={{ flex: 1, borderRadius: '2cqw', overflow: 'hidden' }}>
          <PhotoSlot {...(p[1] || {})} placeholder="Photo 2" id={p[1]?.id || 'p1'} />
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2cqw', padding: '2cqw 0' }}>
        <div style={{ height: '0.6cqw', width: '15cqw', background: style.accentColor }} />
        <p style={{
          fontFamily: fontMap[style.fontFamily], fontWeight: 800,
          fontSize: `calc(${style.headlineFontSize / 8}cqw)`, color: style.headlineColor,
          lineHeight: 1.1, margin: 0
        }}>{cardData.headline}</p>
        {cardData.subheadline && (
          <p style={{
            fontFamily: 'sans-serif', fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
            color: style.subheadlineColor, margin: 0, letterSpacing: '0.05cqw'
          }}>{cardData.subheadline}</p>
        )}
      </div>
      
      <BrandingStack style={{ ...style, showBrandBar: true }} cardData={cardData} />
    </div>
  )
}
