import React, { useRef, useContext } from 'react'
import { Template, CardData, BrandItemStyle } from '@/lib/types'
import { useStore } from '@/store/useStore'
import { InteractionContext } from '../InteractionContext'
import { BrandItem } from './BrandItems/BrandItem'
import { BarPlaceholder } from './BarPlaceholder'

export function SponsorBar({ style, cardData }: { style: Template['style'], cardData: CardData }) {
  const { updateCardData } = useStore()
  const { isInteractive, setFocus } = useContext(InteractionContext)
  const isResizing = useRef(false)
  const startX = useRef(0)
  const startScale = useRef(1)
  
  // Handlers for image panning & zooming
  const isDraggingImage = useRef(false)
  const isResizingImage = useRef(false)
  const resizeDir = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 })
  const startMouse = useRef({ x: 0, y: 0 })
  const startImageScale = useRef({ x: 1, y: 1 })

  // Handlers for QR Code panning
  const isDraggingQr = useRef(false)
  const startMouseQr = useRef({ x: 0, y: 0 })

  const handleResizeDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractive) return
    e.stopPropagation()
    isResizing.current = true
    startX.current = e.clientX
    startScale.current = cardData.sponsorScale || 1
    const target = e.currentTarget as HTMLDivElement
    target.setPointerCapture(e.pointerId)
  }

  const handleResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing.current) return
    const delta = (e.clientX - startX.current) / 100 
    const newScale = Math.max(0.1, Math.min(3, startScale.current + delta))
    updateCardData({ sponsorScale: newScale })
  }

  const handleResizeUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isResizing.current = false
    const target = e.currentTarget as HTMLDivElement
    target.releasePointerCapture(e.pointerId)
  }

  if (!cardData.showSponsor) return null

  // Detect if there's truly any sponsor content
  const hasSponsorContent = !!(
    cardData.sponsorText ||
    cardData.sponsorLabelText ||
    cardData.sponsorImage ||
    cardData.showSponsorQrCode
  )

  // In non-interactive mode (export), hide bar if no content
  if (!hasSponsorContent && !isInteractive) return null

  // In interactive mode with no content, show a '+' placeholder with context menu
  if (!hasSponsorContent && isInteractive) {
    const bgColor = cardData.sponsorBgColor || (style as any).sponsorBg || '#111111'
    return (
      <BarPlaceholder
        bg={bgColor}
        height={`${cardData.sponsorHeight || 5.5}cqw`}
        menuItems={[
          { label: 'Sponsor Text', icon: '🔤', onClick: () => { setFocus('sponsor'); updateCardData({ sponsorType: 'text', sponsorLabelText: 'Sponsored by' }) } },
          { label: 'Sponsor Image', icon: '🖼️', onClick: () => { setFocus('sponsor'); updateCardData({ sponsorType: 'image' }) } },
          { label: 'QR Code', icon: '📱', onClick: () => { setFocus('sponsor'); updateCardData({ showSponsorQrCode: true }) } },
        ]}
      />
    )
  }

  const itemStyles = cardData.brandItemStyles || {}
  const getStyle = (id: string): BrandItemStyle => ({
    ...(style as any).brandItemStyles?.[id],
    ...itemStyles[id]
  })

  const isImage = cardData.sponsorType === 'image'

  const handleImageDown = (e: React.PointerEvent<HTMLDivElement>, action: 'move' | 'resize', dx = 0, dy = 0) => {
    if (!isInteractive || !isImage) return
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    startMouse.current = { x: e.clientX, y: e.clientY }
    if (action === 'move') {
      isDraggingImage.current = true
    } else {
      isResizingImage.current = true
      resizeDir.current = { dx, dy }
      startImageScale.current = {
        x: cardData.sponsorScaleX ?? cardData.sponsorScale ?? 1,
        y: cardData.sponsorScaleY ?? cardData.sponsorScale ?? 1
      }
    }
  }

  const handleImageMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingImage.current && !isResizingImage.current) return
    const target = e.currentTarget as HTMLDivElement
    const rect = target.parentElement?.getBoundingClientRect()
    if (!rect) return

    const dx = e.clientX - startMouse.current.x
    const dy = e.clientY - startMouse.current.y
    startMouse.current = { x: e.clientX, y: e.clientY }

    if (isDraggingImage.current) {
      const pdx = (dx / rect.width) * 100
      const pdy = (dy / rect.height) * 100
      updateCardData({
        sponsorX: Math.max(-100, Math.min(200, (cardData.sponsorX ?? 50) + pdx)),
        sponsorY: Math.max(-100, Math.min(200, (cardData.sponsorY ?? 50) + pdy))
      })
    } else if (isResizingImage.current) {
      const { dx: dirX, dy: dirY } = resizeDir.current
      const scaleStepX = (dx / rect.width) * dirX * 3
      const scaleStepY = (dy / rect.height) * dirY * 3
      const updates: Partial<typeof cardData> = {}
      if (dirX !== 0) updates.sponsorScaleX = Math.max(0.05, Math.min(10, startImageScale.current.x + scaleStepX))
      if (dirY !== 0) updates.sponsorScaleY = Math.max(0.05, Math.min(10, startImageScale.current.y + scaleStepY))
      updateCardData(updates)
      // keep start so delta accumulates from start (not incremental)
      startMouse.current = { x: e.clientX, y: e.clientY }
      startImageScale.current = {
        x: updates.sponsorScaleX ?? startImageScale.current.x,
        y: updates.sponsorScaleY ?? startImageScale.current.y
      }
    }
  }

  const handleImageUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingImage.current = false
    isResizingImage.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const handleImageWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isInteractive || !isImage) return
    e.preventDefault()
    e.stopPropagation()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.max(0.1, Math.min(10, (cardData.sponsorScale || 1) + delta))
    updateCardData({ sponsorScale: newScale })
  }

  const content = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1cqw',
      position: 'relative',
      paddingRight: isInteractive ? '20px' : '0',
      flex: 1,
      zIndex: 1 // Above background
    }}>
      {!isImage && (
        <BrandItem 
          id="sponsorText" 
          label="Sponsor Text" 
          defaultIcon="Star" 
          dataKey="sponsorText" 
          focusTarget="sponsor"
          style={{
            fontSize: 3 * (cardData.sponsorScale || 1),
            fontWeight: 600,
            color: '#ffffff',
            showIcon: false,
            ...getStyle('sponsorText')
          }} 
        />
      )}

      {cardData.showSponsorQrCode && (
        <div 
          className="group"
          style={{
            position: 'absolute',
            right: '4cqw', // Start right-aligned
            height: '4cqw', // Independent base height
            display: 'flex',
            alignItems: 'center',
            padding: '0.4cqw',
            transform: `translate(${cardData.sponsorQrX || 0}px, ${cardData.sponsorQrY || 0}px)`,
            cursor: isInteractive ? 'move' : 'default',
            zIndex: 10
          }}
          onPointerDown={(e) => {
            if (!isInteractive) return
            e.stopPropagation()
            e.currentTarget.setPointerCapture(e.pointerId)
            isDraggingQr.current = true
            startMouseQr.current = { x: e.clientX, y: e.clientY }
          }}
          onPointerMove={(e) => {
            if (!isDraggingQr.current) return
            const dx = e.clientX - startMouseQr.current.x
            const dy = e.clientY - startMouseQr.current.y
            startMouseQr.current = { x: e.clientX, y: e.clientY }
            
            updateCardData({
              sponsorQrX: (cardData.sponsorQrX || 0) + dx,
              sponsorQrY: (cardData.sponsorQrY || 0) + dy
            })
          }}
          onPointerUp={(e) => {
            isDraggingQr.current = false
            e.currentTarget.releasePointerCapture(e.pointerId)
          }}
        >
          <div style={{
            background: '#fff',
            padding: '0.4cqw',
            borderRadius: '0.4cqw',
            height: '100%',
            aspectRatio: '1/1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transform: `scale(${cardData.sponsorQrScale || 1})`,
            transformOrigin: 'right center',
          }}>
            {cardData.sponsorQrCodeData ? (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(cardData.sponsorQrCodeData)}`}
                alt="Sponsor QR Code"
                style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-black/10 flex items-center justify-center rounded-sm">
                <span className="text-[0.6cqw] font-bold text-black/40">QR</span>
              </div>
            )}
          </div>
          {isInteractive && (
            <div 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onPointerDown={(e) => {
                if (!isInteractive) return
                e.stopPropagation()
                isResizing.current = true
                startX.current = e.clientX
                startScale.current = cardData.sponsorQrScale || 1
                e.currentTarget.setPointerCapture(e.pointerId)
              }}
              onPointerMove={(e) => {
                if (!isResizing.current) return
                const delta = (startX.current - e.clientX) / 100 // inverted drag for right-aligned
                updateCardData({ sponsorQrScale: Math.max(0.1, Math.min(3, startScale.current + delta)) })
              }}
              onPointerUp={(e) => {
                isResizing.current = false
                e.currentTarget.releasePointerCapture(e.pointerId)
              }}
              style={{
                position: 'absolute',
                left: -6,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 14,
                height: 14,
                background: '#eab308',
                borderRadius: '50%',
                cursor: 'ew-resize',
                zIndex: 10,
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          )}
        </div>
      )}
    </div>
  )

  const bgColor = cardData.sponsorBgColor || style.sponsorBgColor || 'rgba(0,0,0,0.15)'
  const minHeight = `${cardData.sponsorHeight || style.sponsorHeight || 5.5}cqw`

  return (
    <div 
      onClick={() => setFocus('sponsor')}
      style={{
        background: bgColor,
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.2cqw',
        padding: '1.5% 4%', 
        flexShrink: 0,
        height: minHeight,
        position: 'relative',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        cursor: isInteractive ? 'pointer' : 'default',
        // removed overflow: hidden to allow dropdowns to pop out
      }}
    >
      {/* Floating Image Layer for Sponsor Type 'image' */}
      {isImage && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
          {cardData.sponsorImage ? (() => {
            const fit = cardData.sponsorImageFit === 'contain' ? 'contain' : 'cover'
            const posX = cardData.sponsorX ?? 50
            const posY = cardData.sponsorY ?? 50
            const scale = cardData.sponsorScale ?? 1

            return (
              <div
                onPointerDown={(e) => handleImageDown(e, 'move')}
                onPointerMove={handleImageMove}
                onPointerUp={handleImageUp}
                onWheel={handleImageWheel}
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  cursor: isInteractive ? 'move' : 'default',
                  touchAction: 'none',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={cardData.sponsorImage}
                  crossOrigin="anonymous"
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: fit,
                    objectPosition: `${posX}% ${posY}%`,
                    transform: `scale(${scale})`,
                    pointerEvents: 'none',
                    display: 'block'
                  }}
                />
              </div>
            )
          })() : (
            <div className="w-full h-full bg-black/40 flex items-center justify-center text-white/40 text-[1.2cqw]">
              Click to configure Sponsor Image
            </div>
          )}
        </div>
      )}

      {!isImage && (
        <BrandItem 
          id="sponsorLabelText" 
          label="Label Text" 
          defaultIcon="Type" 
          dataKey="sponsorLabelText" 
          focusTarget="sponsor"
          style={{
            fontSize: 1, // cqw
            fontWeight: 400,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            showIcon: false,
            ...getStyle('sponsorLabelText')
          }} 
        />
      )}
      {content}
    </div>
  )
}
