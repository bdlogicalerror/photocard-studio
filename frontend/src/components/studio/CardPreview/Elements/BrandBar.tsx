// src/components/studio/CardPreview/Elements/BrandBar.tsx
'use client'
import React from 'react'
import { Template } from '@/lib/types'
import { getContrastColor } from '../InteractionContext'

export function BrandBar({ style, brandName = '', handle, website, source }: { style: Template['style'], brandName?: string, handle?: string, website?: string, source?: string }) {
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
