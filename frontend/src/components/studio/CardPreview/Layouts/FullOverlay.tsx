// src/components/studio/CardPreview/Layouts/FullOverlay.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { BrandingStack } from '../Elements/BrandingStack'
import { fontMap } from '../InteractionContext'

export function FullOverlay({ style, cardData }: { style: Template['style'], cardData: CardData }) {
  const p = cardData.photos || []
  return (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
      <PhotoSlot {...(p[0] || {})} placeholder="Photo" id={p[0]?.id || 'p0'} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to top, rgba(0,0,0,${style.overlayOpacity + 0.3}) 0%, rgba(0,0,0,${style.overlayOpacity * 0.5}) 50%, transparent 100%)`,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: `${style.padding * 0.125}cqw`,
        display: 'flex', flexDirection: 'column', gap: '1cqw',
      }}>
        <p style={{
          fontFamily: fontMap[style.fontFamily],
          fontWeight: style.headlineFontWeight,
          fontSize: `calc(${style.headlineFontSize / 8}cqw)`,
          color: style.headlineColor,
          lineHeight: 1.2, margin: 0,
          overflowWrap: 'break-word'
        }}>{cardData.headline || 'Headline goes here'}</p>
        {cardData.subheadline && (
          <p style={{
            fontFamily: fontMap[style.fontFamily],
            fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
            color: style.subheadlineColor,
            margin: 0,
            opacity: 0.9
          }}>{cardData.subheadline || ''}</p>
        )}
        <BrandingStack style={style} cardData={cardData} />
      </div>
      {style.accentBarPosition !== 'none' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `calc(${style.accentBarHeight / 8}cqw)`, background: style.accentColor }} />
      )}
    </div>
  )
}
