// src/components/studio/CardPreview/Elements/BrandingStack.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import { BrandBar } from './BrandBar'
import { SponsorBar } from './SponsorBar'

export function BrandingStack({ style, cardData }: { style: Template['style'], cardData: CardData }) {
  const brandBar = (
    <BrandBar 
      style={style} 
      cardData={cardData} 
    />
  )
  
  const sponsorBar = (
    <SponsorBar style={style} cardData={cardData} />
  )

  if (cardData.sponsorOrder === 'sponsor-first') {
    return (
      <div className="flex flex-col">
        {sponsorBar}
        {brandBar}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {brandBar}
      {sponsorBar}
    </div>
  )
}
