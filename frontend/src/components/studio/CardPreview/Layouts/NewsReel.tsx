// src/components/studio/CardPreview/Layouts/NewsReel.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { BrandingStack } from '../Elements/BrandingStack'
import { fontMap } from '../InteractionContext'

export function NewsReel({ style, cardData }: { style: Template['style'], cardData: CardData }) {
  const p = cardData.photos || []
  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#000', padding: '3cqw' }}>
      <div style={{ flex: 1, position: 'relative', borderRadius: '4cqw', overflow: 'hidden' }}>
        <PhotoSlot {...(p[0] || {})} placeholder="Reel Photo" id={p[0]?.id || 'p0'} />
        
        {/* Glassy Content Overlay */}
        <div style={{
          position: 'absolute', bottom: '3cqw', left: '3cqw', right: '3cqw',
          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(10px)',
          borderRadius: '3cqw', padding: '4cqw', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', gap: '1.5cqw'
        }}>
          <div style={{ width: '8cqw', height: '1cqw', background: style.accentColor, borderRadius: '1cqw' }} />
          <p style={{
            fontFamily: fontMap[style.fontFamily], fontWeight: 700,
            fontSize: `calc(${style.headlineFontSize / 8}cqw)`, color: '#fff',
            lineHeight: 1.2, margin: 0
          }}>{cardData.headline}</p>
          {cardData.subheadline && (
            <p style={{
              fontFamily: 'sans-serif', fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
              color: 'rgba(255,255,255,0.7)', margin: 0
            }}>{cardData.subheadline}</p>
          )}
        </div>
      </div>
      <div style={{ marginTop: '2cqw' }}>
        <BrandingStack style={style} cardData={cardData} />
      </div>
    </div>
  )
}
