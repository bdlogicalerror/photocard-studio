import React, { useContext, useRef } from 'react'
import { InteractionContext } from '../InteractionContext'
import { DateItem } from './BrandItems/DateItem'
import { useStore, useActiveTemplate } from '@/store/useStore'

export function DateBox() {
  const { isInteractive } = useContext(InteractionContext)
  const { cardData, updateCardData } = useStore()
  const template = useActiveTemplate()
  const isDragging = useRef(false)
  const startMouse = useRef({ x: 0, y: 0 })

  if (!cardData.showDate && !isInteractive) return null

  // Default position: Top Right
  const posX = cardData.dateX ?? 95 // 95% from left (slight right padding)
  const posY = cardData.dateY ?? 5  // 5% from top (top padding)

  const handleDown = (e: React.PointerEvent) => {
    if (!isInteractive) return
    e.stopPropagation()
    isDragging.current = true
    startMouse.current = { x: e.clientX, y: e.clientY }

    const handleWindowMove = (ev: PointerEvent) => {
      if (!isDragging.current) return
      
      const dx = ev.clientX - startMouse.current.x
      const dy = ev.clientY - startMouse.current.y
      startMouse.current = { x: ev.clientX, y: ev.clientY }

      // Get container size using parent node of this DateBox
      const container = document.getElementById('card-preview-container') || document.body
      const rect = container.getBoundingClientRect()
      
      const pdx = (dx / rect.width) * 100
      const pdy = (dy / rect.height) * 100
      
      // We use current functional update to avoid stale closures, or rely on store state
      useStore.getState().updateCardData({ 
        dateX: Math.max(0, Math.min(100, (useStore.getState().cardData.dateX ?? 95) + pdx)), 
        dateY: Math.max(0, Math.min(100, (useStore.getState().cardData.dateY ?? 5) + pdy)) 
      })
    }

    const handleWindowUp = () => {
      isDragging.current = false
      window.removeEventListener('pointermove', handleWindowMove)
      window.removeEventListener('pointerup', handleWindowUp)
    }

    window.addEventListener('pointermove', handleWindowMove)
    window.addEventListener('pointerup', handleWindowUp)
  }

  return (
    <div
      onPointerDown={handleDown}
      style={{
        position: 'absolute',
        left: `${posX}%`,
        top: `${posY}%`,
        transform: 'translate(-50%, -50%)',
        cursor: isInteractive ? 'move' : 'default',
        zIndex: 200, // above watermark and other elements
      }}
    >
      <DateItem 
        id="dateBadge" 
        label="Date" 
        dataKey="dateText" 
        defaultIcon="Calendar"
        focusTarget="date"
        popupPosition="bottom-right"
        style={{
          showIcon: false,
          backgroundColor: template.style.accentColor || '#ef4444',
          color: '#ffffff',
          fontSize: 1.5,
          fontWeight: 700,
          borderRadius: 0.5,
          ...(cardData.brandItemStyles?.['dateBadge'] || {})
        }}
      />
    </div>
  )
}
