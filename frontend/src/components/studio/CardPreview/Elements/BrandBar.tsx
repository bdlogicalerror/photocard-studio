// src/components/studio/CardPreview/Elements/BrandBar.tsx
'use client'
import React, { useContext } from 'react'
import { Template, CardData, BrandItemStyle } from '@/lib/types'
import { InteractionContext } from '../InteractionContext'
import { BrandItem } from './BrandItems/BrandItem'
import { Info, QrCode } from 'lucide-react'
import { getContrastColor } from '../InteractionContext'
import { useStore } from '@/store/useStore'
import { BarPlaceholder } from './BarPlaceholder'

function BrandBarPlaceholder({ style, setFocus }: { style: Template['style'], setFocus: (f: any) => void }) {
  const { updateCardData } = useStore()
  return (
    <BarPlaceholder
      bg={style.brandBarBg || '#111'}
      height="5.5cqw"
      menuItems={[
        { label: 'Brand Name', icon: '🏷️', onClick: () => { setFocus('brand'); updateCardData({ activeProperty: 'brand-brandName' }) } },
        { label: 'Website', icon: '🌐', onClick: () => { setFocus('brand'); updateCardData({ activeProperty: 'brand-website' }) } },
        { label: 'Facebook', icon: '📘', onClick: () => { setFocus('brand'); updateCardData({ activeProperty: 'brand-facebook' }) } },
        { label: 'Twitter / X', icon: '🐦', onClick: () => { setFocus('brand'); updateCardData({ activeProperty: 'brand-twitter' }) } },
        { label: 'Instagram', icon: '📷', onClick: () => { setFocus('brand'); updateCardData({ activeProperty: 'brand-instagram' }) } },
      ]}
    />
  )
}

export function BrandBar({ style, cardData }: { style: Template['style'], cardData: CardData }) {
  const { setFocus, isInteractive } = useContext(InteractionContext)
  
  if (!style.showBrandBar) return null
  
  const itemStyles = cardData.brandItemStyles || {}
  
  const getStyle = (id: string): BrandItemStyle => ({
    ...(style as any).brandItemStyles?.[id],
    ...itemStyles[id]
  })

  const brandName = cardData.brandName || ''
  const parts = brandName.trim().split(' ')

  // Detect if there's truly no content to display
  const hasContent = !!(brandName || cardData.website || cardData.facebook ||
    cardData.twitter || cardData.instagram || cardData.source ||
    cardData.showQrCode)

  // In non-interactive mode (export), hide bar entirely if no content
  if (!hasContent && !isInteractive) return null

  // In interactive mode with no content, show a '+' placeholder with context menu
  if (!hasContent && isInteractive) {
    return <BrandBarPlaceholder style={style} setFocus={setFocus} />
  }

  return (
    <div 
      onClick={() => setFocus('brand')}
      style={{
        background: style.brandBarBg,
        display: 'flex', alignItems: 'center', gap: '1.2cqw',
        padding: '1.2% 3%', flexShrink: 0,
        position: 'relative',
        cursor: isInteractive ? 'pointer' : 'default',
        minHeight: '5.5cqw'
      }}
    >
      {/* Brand Logo/Name (Individual Component) */}
      {/* Brand Logo/Name (Individual Component) */}
      <BrandItem 
        id="brandName" 
        label="Brand Logo / Name" 
        defaultIcon="Image" 
        dataKey="brandName" 
        style={{
          color: style.brandColor || '#ffffff',
          fontSize: 3.4,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900,
          showIcon: false,
          ...getStyle('brandName')
        }} 
      />

      <div style={{ width: '1px', height: '3cqw', background: 'rgba(255,255,255,0.1)', flexShrink: 0, margin: '0 0.4cqw' }} />

      {/* Social & Website Components */}
      <div className="flex items-center gap-2 flex-wrap">
        <BrandItem id="website" label="Website" defaultIcon="Globe" dataKey="website" style={getStyle('website')} />
        <BrandItem id="facebook" label="Facebook" defaultIcon="Facebook" dataKey="facebook" style={getStyle('facebook')} />
        <BrandItem id="twitter" label="Twitter" defaultIcon="Twitter" dataKey="twitter" style={getStyle('twitter')} />
        <BrandItem id="instagram" label="Instagram" defaultIcon="Instagram" dataKey="instagram" style={getStyle('instagram')} />
      </div>

      {/* Source Component */}
      {cardData.showSource !== false && cardData.source && (
        <div style={{ 
          marginLeft: 'auto',
          background: style.accentColor,
          color: getContrastColor(style.accentColor),
          fontSize: '1cqw',
          fontWeight: 800,
          padding: '0.4cqw 1.2cqw',
          borderRadius: '0.4cqw',
          textTransform: 'uppercase',
          letterSpacing: '0.08cqw',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8cqw',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <Info size="1.2cqw" />
          <span>SOURCE: {cardData.source}</span>
        </div>
      )}

      {/* QR Code Component */}
      {cardData.showQrCode && (
        <div 
          style={{
            marginLeft: cardData.showSource === false || !cardData.source ? 'auto' : '0.8cqw',
            background: '#fff',
            padding: '0.4cqw',
            borderRadius: '0.4cqw',
            width: '4.2cqw',
            height: '4.2cqw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
          }}
        >
          {cardData.qrCodeData ? (
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(cardData.qrCodeData)}`}
              alt="QR Code"
              style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
            />
          ) : (
            <QrCode size="3cqw" color="#000" />
          )}
        </div>
      )}
    </div>
  )
}
