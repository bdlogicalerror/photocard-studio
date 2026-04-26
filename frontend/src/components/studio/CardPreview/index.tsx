// src/components/studio/CardPreview/index.tsx
'use client'
import React, { forwardRef, useEffect, useState } from 'react'
import { Template, CardData } from '@/lib/types'
import { InteractionContext } from './InteractionContext'
import { BlurBox } from './Elements/BlurBox'
import { CustomBox } from './Elements/CustomBox'
import { SponsorComponent } from './Elements/SponsorComponent'

// Layouts
import { DualTop } from './Layouts/DualTop'
import { SingleTop } from './Layouts/SingleTop'
import { SingleBottom } from './Layouts/SingleBottom'
import { FullOverlay } from './Layouts/FullOverlay'
import { DualSide } from './Layouts/DualSide'
import { TripleMosaic } from './Layouts/TripleMosaic'
import { PollVote } from './Layouts/PollVote'
import { VersusClash } from './Layouts/VersusClash'
import { QuoteFocus } from './Layouts/QuoteFocus'
import { BreakingAlert } from './Layouts/BreakingAlert'
import { StatHighlight } from './Layouts/StatHighlight'
import { PortraitEditorial } from './Layouts/PortraitEditorial'
import { ImpactHero } from './Layouts/ImpactHero'
import { NewsReel } from './Layouts/NewsReel'
import { ModernDuo } from './Layouts/ModernDuo'

type Props = {
  template: Template
  cardData: CardData
  forExport?: boolean
  onPhotoChange?: (id: string, patch: any) => void
  onBlurChange?: (id: string, patch: any) => void
  onBlurRemove?: (id: string) => void
  onCustomLayerChange?: (id: string, patch: any) => void
  onCustomLayerRemove?: (id: string) => void
  isGuest?: boolean
}

const CardPreview = forwardRef<HTMLDivElement, Props>(({ 
  template, cardData, forExport = false, isGuest = false,
  onPhotoChange = () => {}, 
  onBlurChange = () => {}, 
  onBlurRemove = () => {}, 
  onCustomLayerChange = () => {}, 
  onCustomLayerRemove = () => {} 
}, ref) => {
  const { style, layout } = template
  const blurRegions = cardData.blurRegions || []
  const customLayers = cardData.customLayers || []

  const [dateStr, setDateStr] = useState<string>('')
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))
  }, [])

  const accentBar = style.accentBarPosition !== 'none' && (
    <div style={{ height: `calc(${style.accentBarHeight / 8}cqw)`, background: style.accentColor, flexShrink: 0 }} />
  )

  const renderLayout = () => {
    switch (layout) {
      case 'dual-top':
        return <DualTop style={style} cardData={cardData} accentBar={accentBar} />
      case 'single-top':
        return <SingleTop style={style} cardData={cardData} accentBar={accentBar} />
      case 'single-bottom':
        return <SingleBottom style={style} cardData={cardData} accentBar={accentBar} />
      case 'full-overlay':
        return <FullOverlay style={style} cardData={cardData} />
      case 'dual-side':
        return <DualSide style={style} cardData={cardData} accentBar={accentBar} />
      case 'dual-side-reverse':
        return <DualSide style={style} cardData={cardData} accentBar={accentBar} reverse />
      case 'triple-mosaic':
        return <TripleMosaic style={style} cardData={cardData} accentBar={accentBar} />
      case 'poll-vote':
        return <PollVote style={style} cardData={cardData} accentBar={accentBar} />
      case 'versus-clash':
        return <VersusClash style={style} cardData={cardData} accentBar={accentBar} />
      case 'quote-focus':
        return <QuoteFocus style={style} cardData={cardData} accentBar={accentBar} />
      case 'breaking-alert':
        return <BreakingAlert style={style} cardData={cardData} accentBar={accentBar} />
      case 'stat-highlight':
        return <StatHighlight style={style} cardData={cardData} accentBar={accentBar} />
      case 'portrait-editorial':
        return <PortraitEditorial style={style} cardData={cardData} accentBar={accentBar} />
      case 'impact-hero':
        return <ImpactHero style={style} cardData={cardData} accentBar={accentBar} />
      case 'news-reel':
        return <NewsReel style={style} cardData={cardData} />
      case 'modern-duo':
        return <ModernDuo style={style} cardData={cardData} accentBar={accentBar} />
      default:
        return (
          <div className="flex items-center justify-center h-full bg-zinc-900 text-zinc-500 text-xs">
            Layout "{layout}" not found
          </div>
        )
    }
  }

  return (
    <InteractionContext.Provider value={{ 
      isInteractive: !forExport, 
      onPhotoChange, 
      onBlurChange, 
      onBlurRemove, 
      onCustomLayerChange, 
      onCustomLayerRemove 
    }}>
      <div 
        ref={ref}
        className="relative shadow-2xl overflow-hidden bg-white select-none"
        style={{ 
          width: '100%', 
          aspectRatio: '1/1', 
          containerType: 'size',
          borderRadius: `${style.borderRadius}px`
        }}
      >
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {renderLayout()}
          {blurRegions.map(br => <BlurBox key={br.id} {...br} forExport={forExport} />)}
          {customLayers.map(cl => <CustomBox key={cl.id} {...cl} forExport={forExport} />)}
          <SponsorComponent cardData={cardData} />

          {/* Anti-Screenshot Watermark for Guests */}
          {isGuest && (
            <div 
              className="absolute right-[4%] top-1/2 -translate-y-1/2 select-none pointer-events-none"
              style={{
                fontSize: '2cqw',
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.25)',
                textShadow: '0.5px 0.5px 1px rgba(0, 0, 0, 0.5)',
                fontFamily: 'sans-serif',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap'
              }}
            >
              ai.newscards.xyz
            </div>
          )}
        </div>
      </div>
    </InteractionContext.Provider>
  )
})

CardPreview.displayName = 'CardPreview'

export default CardPreview
