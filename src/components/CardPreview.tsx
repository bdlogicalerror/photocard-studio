// src/components/CardPreview.tsx
'use client'
import React, { forwardRef } from 'react'
import { Template, CardData } from '@/lib/types'
import clsx from 'clsx'

type Props = {
  template: Template
  cardData: CardData
  forExport?: boolean
  onPhotoChange?: (id: string, patch: any) => void
  onBlurChange?: (id: string, patch: any) => void
  onBlurRemove?: (id: string) => void
}

const fontMap: Record<string, string> = {
  bengali: "'Noto Serif Bengali', serif",
  'bengali-sans': "'Noto Sans Bengali', sans-serif",
  display: "'Playfair Display', serif",
  sans: "system-ui, sans-serif",
}

function getContrastColor(hexcolor: string) {
  if (!hexcolor || hexcolor === 'transparent' || hexcolor.startsWith('rgba(0,0,0,0)')) return '#ffffff'
  
  // Handle rgba
  if (hexcolor.startsWith('rgba')) {
    const match = hexcolor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (match) {
      const r = parseInt(match[1])
      const g = parseInt(match[2])
      const b = parseInt(match[3])
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
      return (yiq >= 128) ? '#000000' : '#ffffff'
    }
  }

  // Handle hex
  let hex = hexcolor.replace("#", "")
  if (hex.length === 3) hex = hex.split('').map(s => s + s).join('')
  
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
  return (yiq >= 128) ? '#000000' : '#ffffff'
}

const InteractionContext = React.createContext({
  isInteractive: false,
  onPhotoChange: (id: string, patch: any) => {},
  onBlurChange: (id: string, patch: any) => {},
  onBlurRemove: (id: string) => {}
})

function PhotoSlot({ src, objectFit = 'cover', objectPosition = 'center', scale = 1, placeholder, id }: {
  src?: string | null
  objectFit?: string
  objectPosition?: string
  scale?: number
  placeholder: string
  id?: string
}) {
  const { isInteractive, onPhotoChange } = React.useContext(InteractionContext)
  const isDragging = React.useRef(false)
  const startMouse = React.useRef({ x: 0, y: 0 })

  const getInitialPos = () => {
    if (!objectPosition || objectPosition === 'center') return { x: 50, y: 50 }
    const match = objectPosition.match(/(-?[\d.]+)%\s+(-?[\d.]+)%/)
    if (match) return { x: parseFloat(match[1]), y: parseFloat(match[2]) }
    return { x: 50, y: 50 }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractive || !src || objectFit !== 'cover') return
    e.currentTarget.setPointerCapture(e.pointerId)
    isDragging.current = true
    startMouse.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    const dx = e.clientX - startMouse.current.x
    const dy = e.clientY - startMouse.current.y
    startMouse.current = { x: e.clientX, y: e.clientY }

    const cur = getInitialPos()
    // Adjusted pan speed based on scale
    const factor = 0.5 / (scale || 1)
    const newX = Math.max(0, Math.min(100, cur.x - dx * factor))
    const newY = Math.max(0, Math.min(100, cur.y - dy * factor))

    if (id) {
      onPhotoChange(id, { objectPosition: `${newX.toFixed(1)}% ${newY.toFixed(1)}%` })
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    isDragging.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!isInteractive || !src || objectFit !== 'cover') return
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newScale = Math.max(1, Math.min(5, (scale || 1) + delta))
    if (id) {
      onPhotoChange(id, { scale: newScale })
    }
  }

  const bgSizeMap: Record<string, string> = {
    'cover': 'cover',
    'contain': 'contain',
    'fill': '100% 100%'
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', background: '#2a2a2a' }}>
      {src ? (
        <img
          src={src}
          alt={placeholder}
          crossOrigin="anonymous"
          style={{
            width: '100%',
            height: '100%',
            objectFit: objectFit as any,
            objectPosition,
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            cursor: isInteractive && objectFit === 'cover' ? 'move' : 'default',
            touchAction: 'none',
            display: 'block'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      ) : (
        <div style={{
          width: '100%', height: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#666', fontSize: 13, fontFamily: 'sans-serif',
          flexDirection: 'column', gap: 8,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          <span>{placeholder}</span>
        </div>
      )}
    </div>
  )
}

function BrandBar({ style, brandName = '', handle, website, source }: { style: Template['style'], brandName?: string, handle?: string, website?: string, source?: string }) {
  if (!style.showBrandBar) return null
  const parts = (brandName || '').trim().split(' ')
  return (
    <div style={{
      background: style.brandBarBg,
      display: 'flex', alignItems: 'center', gap: '1.2cqw',
      padding: '2% 4%', flexShrink: 0,
      position: 'relative'
    }}>
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 900, fontSize: '3cqw', letterSpacing: '-0.1cqw',
        color: '#fff',
      }}>
        <span style={{ color: style.brandColor }}>{parts[0]}</span>
        {parts.length > 1 ? ' ' + parts.slice(1).join(' ') : ''}
      </span>
      <div style={{ width: '0.1cqw', height: '2.5cqw', background: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
      {website && (
        <span style={{ fontSize: '1.3cqw', color: 'rgba(255,255,255,0.65)', fontFamily: 'sans-serif' }}>
          🌐 {website}
        </span>
      )}
      {handle && (
        <span style={{ fontSize: '1.3cqw', color: 'rgba(255,255,255,0.65)', fontFamily: 'sans-serif' }}>
          📱 {handle}
        </span>
      )}
      {source && (
        <div style={{ 
          marginLeft: 'auto',
          background: style.accentColor,
          color: getContrastColor(style.accentColor),
          fontSize: '1.1cqw',
          fontWeight: 700,
          padding: '0.4cqw 1cqw',
          borderRadius: '0.4cqw',
          textTransform: 'uppercase',
          letterSpacing: '0.05cqw'
        }}>
          SOURCE: {source}
        </div>
      )}
    </div>
  )
}

function HeadlineBlock({ style, headline, subheadline, flex }: {
  style: Template['style'], headline: string, subheadline: string, flex?: number
}) {
  return (
    <div style={{
      background: style.backgroundColor,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: `${style.padding * 0.1}cqw ${style.padding * 0.125}cqw`,
      flex: flex ?? 1, gap: '1cqw', minHeight: 0, minWidth: 0, overflow: 'hidden'
    }}>
      <p style={{
        fontFamily: fontMap[style.fontFamily],
        fontWeight: style.headlineFontWeight,
        fontSize: `calc(${style.headlineFontSize / 8}cqw)`,
        color: style.headlineColor,
        lineHeight: 1.2, margin: 0,
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        hyphens: 'auto'
      }}>{headline || 'Headline goes here'}</p>
      {subheadline && (
        <p style={{
          fontFamily: fontMap[style.fontFamily],
          fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
          color: style.subheadlineColor,
          lineHeight: 1.3, margin: 0, fontWeight: 400,
          opacity: 0.9
        }}>{subheadline}</p>
      )}
    </div>
  )
}

function BlurBox({ id, x, y, width, height, blur = 16 }: { id: string, x: number, y: number, width: number, height: number, blur?: number }) {
  const { isInteractive, onBlurChange, onBlurRemove } = React.useContext(InteractionContext)
  const isDragging = React.useRef(false)
  const isResizing = React.useRef(false)
  const startMouse = React.useRef({ x: 0, y: 0 })

  const handleDown = (e: React.PointerEvent, type: 'move' | 'resize') => {
    if (!isInteractive) return
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    if (type === 'move') isDragging.current = true
    else isResizing.current = true
    startMouse.current = { x: e.clientX, y: e.clientY }
  }

  const handleMove = (e: React.PointerEvent) => {
    if (!isDragging.current && !isResizing.current) return
    const dx = e.clientX - startMouse.current.x
    const dy = e.clientY - startMouse.current.y
    startMouse.current = { x: e.clientX, y: e.clientY }

    const rect = e.currentTarget.parentElement?.getBoundingClientRect()
    if (!rect) return

    const pdx = (dx / rect.width) * 100
    const pdy = (dy / rect.height) * 100

    if (isDragging.current) {
      onBlurChange(id, { x: Math.max(0, Math.min(100 - width, x + pdx)), y: Math.max(0, Math.min(100 - height, y + pdy)) })
    } else {
      onBlurChange(id, { width: Math.max(5, width + pdx), height: Math.max(5, height + pdy) })
    }
  }

  const handleUp = (e: React.PointerEvent) => {
    isDragging.current = false
    isResizing.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <div
      onPointerDown={(e) => handleDown(e, 'move')}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: 'rgba(255,255,255,0.02)',
        boxShadow: isInteractive ? '0 0.5cqw 1.5cqw rgba(0,0,0,0.3)' : 'none',
        borderRadius: '1.2cqw',
        cursor: isInteractive ? 'move' : 'default',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
      }}
    >
      {/* Fallback for html2canvas which doesn't support backdrop-filter */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
        <rect width="100%" height="100%" rx="1.2cqw" ry="1.2cqw" fill="rgba(255,255,255,0.3)" filter={`url(#svgBlurFilter-${blur})`} />
      </svg>

      {isInteractive && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); onBlurRemove(id); }}
            onPointerDown={(e) => e.stopPropagation()} // Fix deletion by stopping propagation to move handler
            className="flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            style={{ 
              position: 'absolute', top: -14, right: -14, 
              background: '#ef4444', color: '#fff', 
              borderRadius: '50%', width: 28, height: 28, 
              fontSize: 14, border: '2px solid white', 
              cursor: 'pointer', zIndex: 60,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            ✕
          </button>
          
          {/* Blur Intensity Slider */}
          <div 
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute', bottom: -35, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.8)', padding: '4px 10px', borderRadius: '100px',
              display: 'flex', alignItems: 'center', gap: '8px', zIndex: 60,
              backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              minWidth: '100px'
            }}
          >
            <span style={{ color: 'white', fontSize: '9px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>BLUR</span>
            <input 
              type="range" min="0" max="64" step="1" value={blur}
              onChange={(e) => onBlurChange(id, { blur: parseInt(e.target.value) })}
              style={{ width: '60px', height: '4px', accentColor: '#ef4444', cursor: 'pointer' }}
            />
          </div>
          <div 
            onPointerDown={(e) => handleDown(e, 'resize')}
            style={{ position: 'absolute', bottom: 0, right: 0, width: 15, height: 15, cursor: 'nwse-resize', background: 'rgba(255,255,255,0.5)', clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
          />
        </>
      )}
    </div>
  )
}

const CardPreview = React.forwardRef<HTMLDivElement, Props>(({ template, cardData, forExport = false, onPhotoChange, onBlurChange, onBlurRemove }, ref) => {
  const { style, layout, photoCount } = template
  const p = cardData.photos || []
  const blurRegions = cardData.blurRegions || []

  // Global SVG filter for html2canvas compatibility
  const BlurFilters = () => {
    // Collect all unique blur values used in the card
    const blurValues = Array.from(new Set(blurRegions.map(b => b.blur || 16)))
    return (
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          {blurValues.map(v => (
            <filter id={`svgBlurFilter-${v}`} key={v}>
              <feGaussianBlur stdDeviation={v * 0.75} />
            </filter>
          ))}
        </defs>
      </svg>
    )
  }

  // Wrap layouts to include blur regions
  const withBlurs = (children: React.ReactNode) => (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {children}
      {blurRegions.map(br => <BlurBox key={br.id} {...br} />)}
    </div>
  )

  const accentBar = style.accentBarPosition !== 'none' && (
    <div style={{ height: `calc(${style.accentBarHeight / 8}cqw)`, background: style.accentColor, flexShrink: 0 }} />
  )

  const [dateStr, setDateStr] = React.useState<string>('')
  React.useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }))
  }, [])

  const renderLayout = () => {
    switch (layout) {
      case 'dual-top':
        return (
          <>
            {style.accentBarPosition === 'top' && accentBar}
            <div style={{ flex: '0 0 55%', minHeight: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4cqw', background: style.photoDividerColor }}>
              <PhotoSlot {...(p[0] || {})} placeholder="Photo 1" />
              <PhotoSlot {...(p[1] || {})} placeholder="Photo 2" />
            </div>
            <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} />
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </>
        )

      case 'single-top':
        return (
          <>
            {style.accentBarPosition === 'top' && accentBar}
            <div style={{ flex: '0 0 55%', minHeight: 0, overflow: 'hidden' }}>
              <PhotoSlot {...(p[0] || {})} placeholder="Photo" />
            </div>
            <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} />
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </>
        )

      case 'single-bottom':
        return (
          <>
            {style.accentBarPosition === 'top' && accentBar}
            <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} />
            <div style={{ flex: '0 0 55%', minHeight: 0, overflow: 'hidden' }}>
              <PhotoSlot {...(p[0] || {})} placeholder="Photo" />
            </div>
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </>
        )

      case 'full-overlay':
        return (
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
            <PhotoSlot {...(p[0] || {})} placeholder="Photo" />
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(to top, rgba(0,0,0,${style.overlayOpacity + 0.3}) 0%, rgba(0,0,0,${style.overlayOpacity * 0.5}) 50%, transparent 100%)`,
            }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: `${style.padding * 0.125}cqw`,
              display: 'flex', flexDirection: 'column', gap: '1cqw',
            }}>
              <p style={{
                fontFamily: fontMap[style.fontFamily],
                fontWeight: style.headlineFontWeight,
                fontSize: `calc(${style.headlineFontSize / 8}cqw)`,
                color: style.headlineColor,
                lineHeight: 1.2, margin: 0,
                overflowWrap: 'break-word'
              }}>{cardData.headline || 'Headline goes here'}</p>
              {cardData.subheadline && (
                <p style={{
                  fontFamily: fontMap[style.fontFamily],
                  fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
                  color: style.subheadlineColor,
                  margin: 0,
                  opacity: 0.9
                }}>{cardData.subheadline || ''}</p>
              )}
              <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
            </div>
            {style.accentBarPosition !== 'none' && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `calc(${style.accentBarHeight / 8}cqw)`, background: style.accentColor }} />
            )}
          </div>
        )

      case 'dual-side':
        return (
          <>
            {style.accentBarPosition === 'top' && accentBar}
            <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, display: 'flex' }}>
              <div style={{ flex: '0 0 50%', overflow: 'hidden', minWidth: 0 }}>
                <PhotoSlot {...(p[0] || {})} placeholder="Photo" />
              </div>
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
            </div>
            <BrandBar style={style} brandName={cardData.brandName} handle={cardData.handle} website={cardData.website} source={cardData.source} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </>
        )

      case 'dual-side-reverse':
        return (
          <>
            {style.accentBarPosition === 'top' && accentBar}
            <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, display: 'flex' }}>
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
              <div style={{ flex: '0 0 50%', overflow: 'hidden', minWidth: 0 }}>
                <PhotoSlot {...(p[0] || {})} placeholder="Photo" />
              </div>
            </div>
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </>
        )

      case 'triple-mosaic':
        return (
          <>
            {style.accentBarPosition === 'top' && accentBar}
            <div style={{ flex: '0 0 55%', overflow: 'hidden', minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4cqw', background: style.photoDividerColor }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4cqw' }}>
                <div style={{ flex: 1 }}><PhotoSlot {...(p[0] || {})} placeholder="Photo 1" /></div>
                <div style={{ flex: 1 }}><PhotoSlot {...(p[1] || {})} placeholder="Photo 2" /></div>
              </div>
              <PhotoSlot {...(p[2] || {})} placeholder="Photo 3" />
            </div>
            <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} />
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </>
        )

      case 'poll-vote':
        const opts = cardData.pollOptions || ['YES', 'NO']
        return (
          <>
            {style.accentBarPosition === 'top' && accentBar}
            <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} flex={0} />
            <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
              <PhotoSlot {...(p[0] || {})} placeholder="Subject Photo" />
            </div>
            
            {/* Poll Buttons Overlay */}
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

      case 'versus-clash':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {style.accentBarPosition === 'top' && accentBar}
            <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} flex={0} />
            <div style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}>
                <PhotoSlot {...(p[0] || {})} placeholder="Corner 1" />
              </div>
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', marginLeft: '-15%', clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }}>
                <PhotoSlot {...(p[1] || {})} placeholder="Corner 2" />
              </div>

              {/* VS Badge */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: style.accentColor, width: '12cqw', height: '12cqw', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0.6cqw solid white',
                boxShadow: '0 1cqw 3cqw rgba(0,0,0,0.5)', zIndex: 10
              }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: '4.5cqw', fontStyle: 'italic', fontFamily: 'sans-serif' }}>VS</span>
              </div>
            </div>
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </div>
        )

      case 'quote-focus':
        return (
          <>
            {style.accentBarPosition === 'top' && accentBar}
            <div style={{ flex: 1, display: 'flex', minHeight: 0, background: style.backgroundColor }}>
              <div style={{ flex: 1, padding: '4cqw', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                {/* Giant Quote Mark Background */}
                <div style={{
                  position: 'absolute', top: '0', left: '2cqw', fontSize: '25cqw', color: style.accentColor,
                  opacity: 0.15, fontFamily: 'serif', lineHeight: 1, pointerEvents: 'none'
                }}>“</div>
                <p style={{
                  fontFamily: fontMap[style.fontFamily], fontWeight: style.headlineFontWeight,
                  fontSize: `calc(${style.headlineFontSize / 8}cqw)`, color: style.headlineColor,
                  lineHeight: 1.3, margin: '0 0 2cqw 0', zIndex: 1, position: 'relative'
                }}>“{cardData.headline}”</p>
                {cardData.subheadline && (
                  <p style={{
                    fontFamily: fontMap[style.fontFamily], fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
                    color: style.subheadlineColor, margin: 0, fontWeight: 700, borderLeft: `0.4cqw solid ${style.accentColor}`, paddingLeft: '1.5cqw'
                  }}>{cardData.subheadline}</p>
                )}
              </div>
              <div style={{ flex: '0 0 45%', overflow: 'hidden' }}>
                 <PhotoSlot {...(p[0] || {})} placeholder="Photo" />
              </div>
            </div>
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </>
        )

      case 'breaking-alert':
        return (
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {style.accentBarPosition === 'top' && accentBar}
            <div style={{ position: 'relative', flex: '0 0 60%', overflow: 'hidden' }}>
              <PhotoSlot {...(p[0] || {})} placeholder="Photo" />
              {/* BREAKING Ribbon */}
              <div style={{
                position: 'absolute', top: '1.5cqw', left: 0, background: style.accentColor, color: style.backgroundColor,
                padding: '0.8cqw 2.5cqw 0.8cqw 1.5cqw', fontWeight: 900, fontSize: '2.5cqw', fontFamily: 'sans-serif',
                textTransform: 'uppercase', clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)', boxShadow: '0 1cqw 2cqw rgba(0,0,0,0.5)'
              }}>
                BREAKING NEWS
              </div>
              {/* Optional slight dark gradient from bottom of image */}
              <div style={{ position: 'absolute', inset: '50% 0 0 0', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
            </div>
            
            <HeadlineBlock style={style} headline={cardData.headline || ''} subheadline={cardData.subheadline || ''} />
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </div>
        )

      case 'stat-highlight':
        return (
          <>
            {style.accentBarPosition === 'top' && accentBar}
            <div style={{ flex: '0 0 45%', minHeight: 0, overflow: 'hidden' }}>
              <PhotoSlot {...(p[0] || {})} placeholder="Photo" />
            </div>
            <div style={{
              background: style.backgroundColor, display: 'flex', flexDirection: 'column', 
              justifyContent: 'center', padding: '3cqw 4cqw', flex: 1, gap: '1cqw'
            }}>
              {/* Massive Subheadline (used for the stat) */}
              <p style={{
                fontFamily: 'sans-serif', fontWeight: 900,
                fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
                color: style.accentColor, lineHeight: 1, margin: 0, letterSpacing: '-0.2cqw'
              }}>{cardData.subheadline || '00%'}</p>
              
              {/* Standard Headline explaining the stat */}
              <p style={{
                fontFamily: fontMap[style.fontFamily], fontWeight: style.headlineFontWeight,
                fontSize: `calc(${style.headlineFontSize / 8}cqw)`, color: style.headlineColor,
                lineHeight: 1.2, margin: 0
              }}>{cardData.headline || 'Statistic description goes here'}</p>
            </div>
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} source={cardData.source} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </>
        )

      case 'portrait-editorial':
        return (
          <>
            {style.accentBarPosition === 'top' && accentBar}
            <div style={{ flex: 1, display: 'flex', minHeight: 0, background: style.backgroundColor }}>
              <div style={{ flex: '0 0 50%', overflow: 'hidden' }}>
                <PhotoSlot {...(p[0] || {})} placeholder="Cover Portrait" />
              </div>
              <div style={{ 
                flex: 1, padding: `${style.padding * 0.15}cqw`, 
                display: 'flex', flexDirection: 'column', justifyContent: 'center', 
                gap: '2cqw', position: 'relative', overflow: 'hidden' 
              }}>
                <div style={{ height: '3cqw', width: '30%', background: style.accentColor, opacity: 0.5, borderRadius: '1.5cqw' }} />
                <p style={{
                  fontFamily: fontMap[style.fontFamily], fontSize: `calc(${style.headlineFontSize / 8}cqw)`,
                  lineHeight: 1.1, fontWeight: 900, color: style.headlineColor, margin: 0, letterSpacing: '-0.1cqw'
                }}>{cardData.headline}</p>
                {cardData.subheadline && (
                  <p style={{
                    fontFamily: fontMap[style.fontFamily], fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
                    opacity: 0.7, color: style.subheadlineColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.2cqw'
                  }}>{cardData.subheadline}</p>
                )}
              </div>
            </div>
            <BrandBar style={style} brandName={cardData.brandName} handle={cardData.handle} website={cardData.website} source={cardData.source} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </>
        )

      case 'impact-hero':
        return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: style.backgroundColor, padding: `${style.padding * 0.125}cqw` }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: '3cqw' }}>
              <p style={{
                flex: 1, fontFamily: fontMap[style.fontFamily], fontWeight: 900,
                fontSize: `calc(${style.headlineFontSize / 8}cqw)`, color: style.headlineColor,
                lineHeight: 1, margin: 0, letterSpacing: '-0.3cqw', textTransform: 'uppercase'
              }}>{cardData.headline}</p>
              <div style={{ flex: '0 0 35%', aspectRatio: '1/1', borderRadius: '2cqw', overflow: 'hidden', border: `0.5cqw solid ${style.accentColor}` }}>
                 <PhotoSlot {...(p[0] || {})} placeholder="Hero" />
              </div>
            </div>
            {cardData.subheadline && (
              <p style={{
                fontFamily: fontMap[style.fontFamily], fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
                color: style.subheadlineColor, margin: '2cqw 0', fontWeight: 600, borderLeft: `0.5cqw solid ${style.accentColor}`, paddingLeft: '2cqw'
              }}>{cardData.subheadline}</p>
            )}
            <BrandBar style={style} brandName={cardData.brandName} handle={cardData.handle} website={cardData.website} source={cardData.source} />
          </div>
        )

      case 'news-reel':
        return (
          <div style={{ flex: 1, background: style.backgroundColor, padding: '2cqw', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, borderRadius: '4cqw', overflow: 'hidden', position: 'relative' }}>
               <PhotoSlot {...(p[0] || {})} placeholder="REEL IMAGE" />
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
               
               <div style={{
                 position: 'absolute', bottom: '3cqw', left: '3cqw', right: '3cqw',
                 background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
                 borderRadius: '3cqw', padding: '3cqw', border: '1px solid rgba(255,255,255,0.2)',
                 boxShadow: '0 2cqw 4cqw rgba(0,0,0,0.3)'
               }}>
                  <p style={{
                    fontFamily: fontMap[style.fontFamily], fontSize: `calc(${style.headlineFontSize / 8}cqw)`,
                    fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2
                  }}>{cardData.headline}</p>
                  {cardData.subheadline && (
                    <p style={{
                      fontFamily: fontMap[style.fontFamily], fontSize: `calc(${style.subheadlineFontSize / 8}cqw)`,
                      color: 'rgba(255,255,255,0.8)', margin: '1cqw 0 0', fontWeight: 500
                    }}>{cardData.subheadline}</p>
                  )}
               </div>
               
               <div style={{ position: 'absolute', top: '3cqw', right: '3cqw' }}>
                  <BrandBar style={{ ...style, brandBarBg: 'rgba(0,0,0,0.6)', borderRadius: 100 }} brandName={cardData.brandName} source={cardData.source} website="" handle="" />
               </div>
            </div>
          </div>
        )

      case 'modern-duo':
        return (
          <>
            {style.accentBarPosition === 'top' && accentBar}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: style.photoDividerColor, gap: '0.6cqw' }}>
               <div style={{ flex: 1, overflow: 'hidden' }}><PhotoSlot {...(p[0] || {})} placeholder="Top" /></div>
               <div style={{ height: `calc(${style.accentBarHeight / 8}cqw)`, background: style.accentColor }} />
               <div style={{ flex: 1, overflow: 'hidden' }}><PhotoSlot {...(p[1] || {})} placeholder="Bottom" /></div>
            </div>
            <div style={{ background: style.backgroundColor, padding: '3.5cqw 4cqw' }}>
              <p style={{
                fontFamily: fontMap[style.fontFamily], fontWeight: 900,
                fontSize: `calc(${style.headlineFontSize / 8}cqw)`, color: style.headlineColor,
                lineHeight: 1.2, margin: 0, textAlign: 'center'
              }}>{cardData.headline}</p>
            </div>
            <BrandBar style={style} brandName={cardData.brandName} handle={cardData.handle} website={cardData.website} source={cardData.source} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </>
        )

      default:
        return null
    }
  }

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#fff',
        borderRadius: `calc(${style.borderRadius / 8}cqw)`,
        fontFamily: fontMap[style.fontFamily],
        position: 'relative',
        containerType: 'inline-size',
      }}
    >
      <InteractionContext.Provider value={{ 
        isInteractive: !!onPhotoChange, 
        onPhotoChange: onPhotoChange || (() => {}),
        onBlurChange: onBlurChange || (() => {}),
        onBlurRemove: onBlurRemove || (() => {})
      }}>
        <BlurFilters />
        {withBlurs(renderLayout())}
      </InteractionContext.Provider>
      {style.showWatermark && cardData.watermarkText && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-30deg)',
          fontSize: '10cqw',
          fontWeight: 900,
          color: 'rgba(255,255,255,1)',
          opacity: style.watermarkOpacity,
          mixBlendMode: 'overlay',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 5,
          fontFamily: fontMap[style.fontFamily],
          textTransform: 'uppercase',
          letterSpacing: '0.4cqw',
        }}>
          {cardData.watermarkText}
        </div>
      )}

      <div style={{
        position: 'absolute', top: '2cqw', left: '2cqw',
        background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '0.4cqw 1cqw',
        borderRadius: '0.4cqw',
        fontSize: '1.2cqw',
        fontWeight: 600,
        fontFamily: 'sans-serif', zIndex: 10,
        pointerEvents: 'none',
        backdropFilter: 'blur(4px)',
        border: '0.1cqw solid rgba(255,255,255,0.1)'
      }}>
        {dateStr}
      </div>
    </div>
  )
})

CardPreview.displayName = 'CardPreview'
export default CardPreview
