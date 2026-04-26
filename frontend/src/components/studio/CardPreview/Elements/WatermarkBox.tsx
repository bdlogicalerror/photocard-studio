// src/components/studio/CardPreview/Elements/WatermarkBox.tsx
'use client'
import React, { useRef, useContext } from 'react'
import { InteractionContext } from '../InteractionContext'

type Props = {
  text: string
  x: number
  y: number
  rotation: number
  size: number
  opacity: number
  forExport?: boolean
}

export function WatermarkBox({ text, x, y, rotation, size, opacity, forExport = false }: Props) {
  const { isInteractive, onWatermarkChange, setFocus } = useContext(InteractionContext)
  const isDragging = useRef(false)
  const isRotating = useRef(false)
  const isResizing = useRef(false)
  const startMouse = useRef({ x: 0, y: 0 })
  const startRotation = useRef(0)
  const startSize = useRef(0)

  const shouldShowControls = isInteractive && !forExport

  const handleDown = (e: React.PointerEvent, type: 'move' | 'rotate' | 'resize') => {
    if (!isInteractive) return
    e.stopPropagation()
    const target = e.currentTarget as HTMLDivElement
    target.setPointerCapture(e.pointerId)
    
    if (type === 'move') {
      isDragging.current = true
    } else if (type === 'rotate') {
      isRotating.current = true
      const rect = target.parentElement?.getBoundingClientRect()
      if (rect) {
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        startRotation.current = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) - rotation
      }
    } else if (type === 'resize') {
      isResizing.current = true
      startSize.current = size
    }
    startMouse.current = { x: e.clientX, y: e.clientY }
  }

  const handleMove = (e: React.PointerEvent) => {
    if (!isDragging.current && !isRotating.current && !isResizing.current) return
    
    const target = e.currentTarget as HTMLDivElement
    const rect = target.parentElement?.parentElement?.getBoundingClientRect()
    if (!rect) return

    if (isDragging.current) {
      const dx = e.clientX - startMouse.current.x
      const dy = e.clientY - startMouse.current.y
      startMouse.current = { x: e.clientX, y: e.clientY }

      const pdx = (dx / rect.width) * 100
      const pdy = (dy / rect.height) * 100
      
      onWatermarkChange({ 
        watermarkX: Math.max(0, Math.min(100, x + pdx)), 
        watermarkY: Math.max(0, Math.min(100, y + pdy)) 
      })
    } else if (isRotating.current) {
      const boxRect = target.parentElement?.getBoundingClientRect()
      if (boxRect) {
        const centerX = boxRect.left + boxRect.width / 2
        const centerY = boxRect.top + boxRect.height / 2
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
        onWatermarkChange({ watermarkRotation: (currentAngle - startRotation.current + 360) % 360 })
      }
    } else if (isResizing.current) {
      const dx = e.clientX - startMouse.current.x
      const pdx = (dx / rect.width) * 100
      onWatermarkChange({ watermarkSize: Math.max(0.5, Math.min(10, startSize.current + pdx)) })
    }
  }

  const handleUp = (e: React.PointerEvent) => {
    isDragging.current = false
    isRotating.current = false
    isResizing.current = false
    const target = e.currentTarget as HTMLDivElement
    target.releasePointerCapture(e.pointerId)
  }

  return (
    <div
      className="group"
      onPointerDown={(e) => handleDown(e, 'move')}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onClick={() => setFocus('watermark')}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        cursor: shouldShowControls ? 'move' : 'default',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        padding: '8px',
        border: shouldShowControls ? '1px dashed rgba(255,255,255,0.4)' : 'none',
      }}
    >
      <div style={{ opacity, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ 
          fontSize: `${size}cqw`, 
          fontWeight: 500, 
          color: 'white', 
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap',
        }}>
          {text}
        </span>
      </div>

      {shouldShowControls && (
        <>
          {/* Rotation Handle - hover only */}
          <div 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onPointerDown={(e) => handleDown(e, 'rotate')}
            style={{ 
              position: 'absolute', 
              top: -25, 
              left: '50%', 
              transform: 'translateX(-50%)',
              width: 14, height: 14, 
              cursor: 'grab', 
              background: '#fff', 
              borderRadius: '50%',
              border: '2px solid #3b82f6',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          />
          {/* Resize Handle - hover only */}
          <div 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onPointerDown={(e) => handleDown(e, 'resize')}
            style={{ 
              position: 'absolute', 
              bottom: -5, 
              right: -5, 
              width: 12, height: 12, 
              cursor: 'nwse-resize', 
              background: '#fff', 
              borderRadius: '2px',
              border: '1px solid #3b82f6'
            }}
          />
        </>
      )}
    </div>
  )
}
