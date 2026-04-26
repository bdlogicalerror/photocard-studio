// src/components/studio/CardPreview/Elements/BrandBar.tsx
'use client'
import React, { useContext, useRef } from 'react'
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
  const { updateCardData } = useStore()
  
  // Handlers for Brand Image resizing & moving
  const isDraggingBrand = useRef(false)
  const isResizingBrand = useRef(false)
  const startMouseBrand = useRef({ x: 0, y: 0 })
  const startScaleBrand = useRef(1)

  if (!style.showBrandBar) return null
  
  const itemStyles = cardData.brandItemStyles || {}
  
  const getStyle = (id: string): BrandItemStyle => ({
    ...(style as any).brandItemStyles?.[id],
    ...itemStyles[id]
  })

  const brandName = cardData.brandName || ''
  const isImage = cardData.brandType === 'image'

  // Detect if there's truly no content to display
  const hasContent = !!(brandName || cardData.brandImage || cardData.website || cardData.facebook ||
    cardData.twitter || cardData.instagram || cardData.source ||
    cardData.showQrCode)

  // In non-interactive mode (export), hide bar entirely if no content
  if (!hasContent && !isInteractive) return null

  // In interactive mode with no content, show a '+' placeholder with context menu
  if (!hasContent && isInteractive) {
    return <BrandBarPlaceholder style={style} setFocus={setFocus} />
  }

  const handleImageDown = (e: React.PointerEvent, type: 'move' | 'resize') => {
    if (!isInteractive) return
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    if (type === 'move') isDraggingBrand.current = true
    else isResizingBrand.current = true
    startMouseBrand.current = { x: e.clientX, y: e.clientY }
    startScaleBrand.current = cardData.brandScale || 1
  }

  const handleImageMove = (e: React.PointerEvent) => {
    if (!isDraggingBrand.current && !isResizingBrand.current) return
    const dx = e.clientX - startMouseBrand.current.x
    const dy = e.clientY - startMouseBrand.current.y
    startMouseBrand.current = { x: e.clientX, y: e.clientY }

    if (isDraggingBrand.current) {
      updateCardData({
        brandX: (cardData.brandX || 0) + dx,
        brandY: (cardData.brandY || 0) + dy
      })
    } else {
      const delta = dx / 100
      updateCardData({ brandScale: Math.max(0.1, Math.min(5, startScaleBrand.current + delta)) })
    }
  }

  const handleImageUp = (e: React.PointerEvent) => {
    isDraggingBrand.current = false
    isResizingBrand.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
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
      <div style={{ position: 'relative', height: '4cqw', display: 'flex', alignItems: 'center' }}>
        {isImage ? (
          <div 
            className="group"
            onPointerDown={(e) => handleImageDown(e, 'move')}
            onPointerMove={handleImageMove}
            onPointerUp={handleImageUp}
            style={{
              height: '100%',
              aspectRatio: '1/1', // default aspect, user can scale
              position: 'relative',
              transform: `translate(${cardData.brandX || 0}px, ${cardData.brandY || 0}px) scale(${cardData.brandScale || 1})`,
              cursor: isInteractive ? 'move' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5
            }}
          >
            {cardData.brandImage ? (
              <img 
                src={cardData.brandImage} 
                alt="Brand Logo" 
                crossOrigin="anonymous"
                style={{ height: '100%', width: 'auto', objectFit: 'contain', pointerEvents: 'none' }}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center rounded border border-dashed border-white/20 px-2 text-[0.8cqw] text-white/40">
                Logo
              </div>
            )}
            
            {isInteractive && (
              <div 
                className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -bottom-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-nwse-resize z-10"
                onPointerDown={(e) => handleImageDown(e, 'resize')}
              />
            )}
          </div>
        ) : (
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
        )}
      </div>

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
