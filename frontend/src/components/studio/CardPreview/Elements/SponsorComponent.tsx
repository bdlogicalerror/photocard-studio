// src/components/studio/CardPreview/Elements/SponsorComponent.tsx
'use client'
import React from 'react'
import { CardData } from '@/lib/types'

export function SponsorComponent({ cardData }: { cardData: CardData }) {
  if (!cardData.sponsorLogo) return null

  return (
    <div style={{
      position: 'absolute',
      bottom: '2%',
      left: '2%',
      right: '2%',
      height: '12%', // Fixed area for branding
      display: 'flex',
      alignItems: 'center',
      justifyContent: 
        cardData.sponsorLogoAlign === 'left' ? 'flex-start' : 
        cardData.sponsorLogoAlign === 'center' ? 'center' : 'flex-end',
      pointerEvents: 'none',
      zIndex: 150
    }}>
      <div style={{
        height: '100%',
        width: 'auto',
        display: 'flex',
        alignItems: 'center',
        transform: `scale(${cardData.sponsorLogoScale || 1})`,
        transformOrigin: 
          cardData.sponsorLogoAlign === 'left' ? 'left center' : 
          cardData.sponsorLogoAlign === 'center' ? 'center center' : 'right center',
      }}>
        <img src={cardData.sponsorLogo} crossOrigin="anonymous" style={{ maxHeight: '100%', width: 'auto', objectFit: 'contain' }} />
      </div>
    </div>
  )
}
