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
          color: '#fff',
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

export default function CardPreview({ template, cardData, forExport = false }: Props) {
  const { style, layout, photoCount } = template
  const p = cardData.photos || []

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
}
