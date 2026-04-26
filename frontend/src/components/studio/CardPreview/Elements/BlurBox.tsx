// src/components/studio/CardPreview/Elements/BlurBox.tsx
'use client'
import React, { useRef, useContext } from 'react'
import { InteractionContext } from '../InteractionContext'

export function BlurBox({ id, x, y, width, height, blur = 16, forExport = false }: { id: string, x: number, y: number, width: number, height: number, blur?: number, forExport?: boolean }) {
  const { isInteractive, onBlurChange, onBlurRemove } = useContext(InteractionContext)
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
        boxShadow: shouldShowControls ? '0 0.5cqw 1.5cqw rgba(0,0,0,0.3)' : 'none',
        borderRadius: '1.2cqw',
        cursor: shouldShowControls ? 'move' : 'default',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
      }}
    >
      {shouldShowControls && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); onBlurRemove(id); }}
            onPointerDown={(e) => e.stopPropagation()} 
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
