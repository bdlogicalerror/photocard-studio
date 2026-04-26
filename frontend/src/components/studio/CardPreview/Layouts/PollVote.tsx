// src/components/studio/CardPreview/Layouts/PollVote.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { PhotoSlot } from '../Elements/PhotoSlot'
import { HeadlineBlock } from '../Elements/HeadlineBlock'
import { BrandBar } from '../Elements/BrandBar'

export function PollVote({ style, cardData, accentBar }: { style: Template['style'], cardData: CardData, accentBar: React.ReactNode }) {
  const p = cardData.photos || []
  const opts = cardData.pollOptions || ['YES', 'NO']
  return (
    <>
      {style.accentBarPosition === 'top' && accentBar}
      <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} flex={0} />
      <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
        <PhotoSlot {...(p[0] || {})} placeholder="Subject Photo" id={p[0]?.id || 'p0'} />
      </div>
      
      <div style={{
        background: style.backgroundColor, padding: '2cqw 4cqw 3cqw',
        display: 'flex', gap: '2cqw', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          flex: 1, background: '#22c55e', color: '#fff', textAlign: 'center', padding: '1.5cqw 0',
          borderRadius: '1.5cqw', fontSize: '3.5cqw', fontWeight: 900, fontFamily: 'sans-serif',
          boxShadow: '0 0.5cqw 1cqw rgba(0,0,0,0.2)', border: '0.3cqw solid rgba(255,255,255,0.2)'
        }}>👍 {opts[0]}</div>
        <div style={{
          flex: 1, background: '#ef4444', color: '#fff', textAlign: 'center', padding: '1.5cqw 0',
          borderRadius: '1.5cqw', fontSize: '3.5cqw', fontWeight: 900, fontFamily: 'sans-serif',
          boxShadow: '0 0.5cqw 1cqw rgba(0,0,0,0.2)', border: '0.3cqw solid rgba(255,255,255,0.2)'
        }}>👎 {opts[1]}</div>
      </div>

      <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
      {style.accentBarPosition === 'bottom' && accentBar}
    </>
  )
}
