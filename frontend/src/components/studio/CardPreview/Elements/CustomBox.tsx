// src/components/studio/CardPreview/Elements/CustomBox.tsx
'use client'
import React, { useRef, useContext } from 'react'
import { InteractionContext } from '../InteractionContext'

export function CustomBox({ id, src, x, y, width, height, opacity = 1, forExport = false }: { id: string, src: string, x: number, y: number, width: number, height: number, opacity?: number, forExport?: boolean }) {
  const { isInteractive, onCustomLayerChange, onCustomLayerRemove } = useContext(InteractionContext)
  const isDragging = useRef(false)
  const isResizing = useRef(false)
  const startMouse = useRef({ x: 0, y: 0 })

  const shouldShowControls = isInteractive && !forExport

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
      onCustomLayerChange(id, { x: Math.max(0, Math.min(100 - width, x + pdx)), y: Math.max(0, Math.min(100 - height, y + pdy)) })
    } else {
      onCustomLayerChange(id, { width: Math.max(2, width + pdx), height: Math.max(2, height + pdy) })
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
        opacity,
        cursor: shouldShowControls ? 'move' : 'default',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      <img src={src} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
      {shouldShowControls && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); onCustomLayerRemove(id); }}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ 
              position: 'absolute', top: -10, right: -10, 
              background: '#ef4444', color: '#fff', 
              borderRadius: '50%', width: 20, height: 20, 
              fontSize: 10, border: '2px solid white', 
              cursor: 'pointer', zIndex: 110,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            ✕
          </button>
          <div 
            onPointerDown={(e) => handleDown(e, 'resize')}
            style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, cursor: 'nwse-resize', background: 'rgba(255,255,255,0.7)', clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
          />
        </>
      )}
    </div>
  )
}
