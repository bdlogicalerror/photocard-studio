// src/components/studio/CardPreview/Layouts/ImpactHero.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { BrandingStack } from '../Elements/BrandingStack'
import { fontMap } from '../InteractionContext'

export function ImpactHero({ style, cardData, accentBar }: { style: Template['style'], cardData: CardData, accentBar: React.ReactNode }) {
  const p = cardData.photos || []
  return (
    <>
      <div style={{ position: 'relative', flex: 1, display: 'flex', overflow: 'hidden', background: style.backgroundColor }}>
        <div style={{ flex: 1, padding: '6cqw 4cqw', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', zIndex: 2 }}>
          {cardData.subheadline && (
            <p style={{
              fontFamily: 'sans-serif', fontWeight: 900, fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
              color: style.accentColor, margin: '0 0 1cqw 0', textTransform: 'uppercase', letterSpacing: '0.2cqw'
            }}>{cardData.subheadline}</p>
          )}
          <p style={{
            fontFamily: fontMap[style.fontFamily], fontWeight: 900,
            fontSize: `calc(${style.headlineFontSize / 8}cqw)`, color: style.headlineColor,
            lineHeight: 0.9, margin: 0, textTransform: 'uppercase', wordBreak: 'break-all'
          }}>{cardData.headline}</p>
        </div>
        <div style={{ 
          position: 'absolute', top: '4cqw', right: '4cqw', width: '45%', height: '45%', 
          borderRadius: '2cqw', overflow: 'hidden', transform: 'rotate(3deg)',
          boxShadow: '0 2cqw 4cqw rgba(0,0,0,0.5)', border: `0.5cqw solid ${style.accentColor}`,
          zIndex: 1
        }}>
           <PhotoSlot {...(p[0] || {})} placeholder="Impact Photo" id={p[0]?.id || 'p0'} />
        </div>
      </div>
      <BrandingStack style={style} cardData={cardData} />
    </>
  )
}
