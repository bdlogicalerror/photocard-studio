// src/components/studio/CardPreview/Layouts/QuoteFocus.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { BrandBar } from '../Elements/BrandBar'
import { fontMap } from '../InteractionContext'

export function QuoteFocus({ style, cardData, accentBar }: { style: Template['style'], cardData: CardData, accentBar: React.ReactNode }) {
  const p = cardData.photos || []
  return (
    <>
      {style.accentBarPosition === 'top' && accentBar}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, background: style.backgroundColor }}>
        <div style={{ flex: 1, padding: '4cqw', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: '0', left: '2cqw', fontSize: '25cqw', color: style.accentColor,
            opacity: 0.15, fontFamily: 'serif', lineHeight: 1, pointerEvents: 'none'
          }}>“</div>
          <p style={{
            fontFamily: fontMap[style.fontFamily], fontWeight: style.headlineFontWeight,
            fontSize: `calc(${style.headlineFontSize / 8}cqw)`, color: style.headlineColor,
            lineHeight: 1.3, margin: '0 0 2cqw 0', zIndex: 1, position: 'relative'
          }}>“{cardData.headline}”</p>
          {cardData.subheadline && (
            <p style={{
              fontFamily: fontMap[style.fontFamily], fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
              color: style.subheadlineColor, margin: 0, fontWeight: 700, borderLeft: `0.4cqw solid ${style.accentColor}`, paddingLeft: '1.5cqw'
            }}>{cardData.subheadline}</p>
          )}
        </div>
        <div style={{ flex: '0 0 45%', overflow: 'hidden' }}>
           <PhotoSlot {...(p[0] || {})} placeholder="Photo" id={p[0]?.id || 'p0'} />
        </div>
      </div>
      <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
      {style.accentBarPosition === 'bottom' && accentBar}
    </>
  )
}
