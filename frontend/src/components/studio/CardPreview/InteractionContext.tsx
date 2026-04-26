// src/components/studio/CardPreview/InteractionContext.tsx
'use client'
import React from 'react'

export const InteractionContext = React.createContext({
  isInteractive: false,
  onPhotoChange: (id: string, patch: any) => {},
  onBlurChange: (id: string, patch: any) => {},
  onBlurRemove: (id: string) => {},
  onCustomLayerChange: (id: string, patch: any) => {},
  onCustomLayerRemove: (id: string) => {}
})

export const fontMap: Record<string, string> = {
  bengali: "'Noto Serif Bengali', serif",
  'bengali-sans': "'Noto Sans Bengali', sans-serif",
  display: "'Playfair Display', serif",
  sans: "system-ui, sans-serif",
}

export function getContrastColor(hexcolor: string) {
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
