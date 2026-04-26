// src/components/studio/CardPreview/Layouts/VersusClash.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { HeadlineBlock } from '../Elements/HeadlineBlock'
import { BrandingStack } from '../Elements/BrandingStack'

export function VersusClash({ style, cardData, accentBar }: { style: Template['style'], cardData: CardData, accentBar: React.ReactNode }) {
  const p = cardData.photos || []
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {style.accentBarPosition === 'top' && accentBar}
      <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} flex={0} />
      <div style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}>
          <PhotoSlot {...(p[0] || {})} placeholder="Corner 1" id={p[0]?.id || 'p0'} />
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', marginLeft: '-15%', clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }}>
          <PhotoSlot {...(p[1] || {})} placeholder="Corner 2" id={p[1]?.id || 'p1'} />
        </div>

        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: style.accentColor, width: '12cqw', height: '12cqw', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyCenter: 'center', border: '0.6cqw solid white',
          boxShadow: '0 1cqw 3cqw rgba(0,0,0,0.5)', zIndex: 10,
          display: 'flex', justifyContent: 'center'
        }}>
          <span style={{ color: 'white', fontWeight: 900, fontSize: '4.5cqw', fontStyle: 'italic', fontFamily: 'sans-serif', alignSelf: 'center' }}>VS</span>
        </div>
      </div>
      <BrandingStack style={style} cardData={cardData} />
      {style.accentBarPosition === 'bottom' && accentBar}
    </div>
  )
}
