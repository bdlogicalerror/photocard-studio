// src/components/CardPreview.tsx
'use client'
import React from 'react'
import { Template, CardData } from '@/lib/types'
import clsx from 'clsx'

type Props = {
  template: Template
  cardData: CardData
  forExport?: boolean
}

const fontMap: Record<string, string> = {
  bengali: "'Noto Serif Bengali', serif",
  'bengali-sans': "'Noto Sans Bengali', sans-serif",
  display: "'Playfair Display', serif",
  sans: "system-ui, sans-serif",
}

function PhotoSlot({ src, objectFit = 'cover', objectPosition = 'center', scale = 1, placeholder }: {
  src?: string | null
  objectFit?: string
  objectPosition?: string
  scale?: number
  placeholder: string
}) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', background: '#2a2a2a' }}>
      {src ? (
        <img
          src={src}
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: objectFit as any,
            objectPosition,
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            display: 'block',
          }}
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

function BrandBar({ style, brandName = '', handle, website }: { style: Template['style'], brandName?: string, handle?: string, website?: string }) {
  if (!style.showBrandBar) return null
  const parts = (brandName || '').trim().split(' ')
  return (
    <div style={{
      background: style.brandBarBg,
      display: 'flex', alignItems: 'center', gap: '1.2cqw',
      padding: '2% 4%', flexShrink: 0,
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

export default function CardPreview({ template, cardData, forExport = false }: Props) {
  const { style, layout, photoCount } = template
  const p = cardData.photos || []

  const accentBar = style.accentBarPosition !== 'none' && (
    <div style={{ height: `calc(${style.accentBarHeight / 8}cqw)`, background: style.accentColor, flexShrink: 0 }} />
  )

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
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} />
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
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} />
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
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} />
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
              <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} />
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
            <BrandBar style={style} brandName={cardData.brandName} handle={cardData.handle} website={cardData.website} />
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
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} />
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
            <BrandBar style={style} brandName={cardData.brandName || ''} handle={cardData.handle || ''} website={cardData.website || ''} />
            {style.accentBarPosition === 'bottom' && accentBar}
          </>
        )

      default:
        return null
    }
  }

  return (
    <div
      id="card-preview"
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
      {renderLayout()}
      <div style={{
        position: 'absolute', top: '2.5cqw', right: '2.5cqw',
        background: 'rgba(0,0,0,0.65)', color: '#fff', padding: '0.5cqw 1.2cqw',
        borderRadius: `calc(${Math.max(4, style.borderRadius - 4) / 8}cqw)`, 
        fontSize: `calc(${(style.subheadlineFontSize * 0.5) / 8}cqw)`,
        fontFamily: 'sans-serif', zIndex: 10,
        pointerEvents: 'none'
      }}>
        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </div>
  )
}
