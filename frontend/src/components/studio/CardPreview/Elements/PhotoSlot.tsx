// src/components/studio/CardPreview/Elements/PhotoSlot.tsx
'use client'
import React, { useRef, useContext } from 'react'
import { InteractionContext } from '../InteractionContext'

export function PhotoSlot({ src, objectFit = 'cover', objectPosition = 'center', scale = 1, placeholder, id, index }: {
  src?: string | null
  objectFit?: string
  objectPosition?: string
  scale?: number
  placeholder: string
  id?: string
  index?: number
}) {
  const { isInteractive, onPhotoChange, setFocus } = useContext(InteractionContext)
  const isDragging = useRef(false)
  const startMouse = useRef({ x: 0, y: 0 })

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
          onClick={() => setFocus('photo')}
          onWheel={handleWheel}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      ) : (
        <div 
          onClick={() => setFocus('photo')}
          style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#666', fontSize: 13, fontFamily: 'sans-serif',
            flexDirection: 'column', gap: 8, cursor: isInteractive ? 'pointer' : 'default'
          }}
        >
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
