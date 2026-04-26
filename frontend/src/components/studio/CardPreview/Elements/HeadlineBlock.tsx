// src/components/studio/CardPreview/Elements/HeadlineBlock.tsx
'use client'
import React, { useContext } from 'react'
import { Template } from '@/lib/types'
import { fontMap, InteractionContext } from '../InteractionContext'

export function HeadlineBlock({ style, headline, subheadline, flex }: {
  style: Template['style'], headline: string, subheadline: string, flex?: number
}) {
  const { setFocus, isInteractive } = useContext(InteractionContext)
  
  return (
    <div 
      onClick={() => setFocus('headline')}
      style={{
        background: style.backgroundColor,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: `${style.padding * 0.1}cqw ${style.padding * 0.125}cqw`,
        flex: flex ?? 1, gap: '1cqw', minHeight: 0, minWidth: 0, overflow: 'hidden',
        cursor: isInteractive ? 'pointer' : 'default'
      }}
    >
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
