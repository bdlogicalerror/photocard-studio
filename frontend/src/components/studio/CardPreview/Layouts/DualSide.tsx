// src/components/studio/CardPreview/Layouts/DualSide.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { BrandingStack } from '../Elements/BrandingStack'
import { fontMap } from '../InteractionContext'

export function DualSide({ style, cardData, accentBar, reverse = false }: { style: Template['style'], cardData: CardData, accentBar: React.ReactNode, reverse?: boolean }) {
  const p = cardData.photos || []
  
  const photo = (
    <div style={{ flex: '0 0 50%', overflow: 'hidden', minWidth: 0 }}>
      <PhotoSlot {...(p[0] || {})} placeholder="Photo" id={p[0]?.id || 'p0'} />
    </div>
  )
  
  const content = (
    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', background: style.backgroundColor, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `${style.padding * 0.125}cqw` }}>
      <p style={{
        fontFamily: fontMap[style.fontFamily], fontWeight: style.headlineFontWeight,
        fontSize: `calc(${(style.headlineFontSize * 0.9) / 8}cqw)`, color: style.headlineColor,
        lineHeight: 1.2, margin: 0,
        overflowWrap: 'break-word'
      }}>{cardData.headline || 'Headline goes here'}</p>
      {cardData.subheadline && (
        <p style={{
          fontFamily: fontMap[style.fontFamily], fontSize: `calc(${(style.subheadlineFontSize * 0.9) / 8}cqw)`,
          color: style.subheadlineColor, lineHeight: 1.3, margin: '1cqw 0 0',
          opacity: 0.9
        }}>{cardData.subheadline}</p>
      )}
    </div>
  )

  return (
    <>
      {style.accentBarPosition === 'top' && accentBar}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, display: 'flex' }}>
        {reverse ? <>{content}{photo}</> : <>{photo}{content}</>}
      </div>
      <BrandingStack style={style} cardData={cardData} />
      {style.accentBarPosition === 'bottom' && accentBar}
    </>
  )
}
