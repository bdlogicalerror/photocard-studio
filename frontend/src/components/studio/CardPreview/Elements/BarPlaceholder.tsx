// src/components/studio/CardPreview/Elements/BarPlaceholder.tsx
'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'

interface MenuItem {
  label: string
  icon: string
  onClick: () => void
}

interface BarPlaceholderProps {
  bg: string
  height: string
  menuItems: MenuItem[]
}

export function BarPlaceholder({ bg, height, menuItems }: BarPlaceholderProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        height,
        cursor: 'pointer',
        border: '1px dashed rgba(255,255,255,0.15)',
        transition: 'border-color 0.2s',
        overflow: 'visible'
      }}
      onClick={() => setOpen(prev => !prev)}
    >
      {/* '+' button — always visible, pulses brighter on group-hover */}
      <div
        className="flex items-center gap-[0.8cqw] opacity-30 group-hover:opacity-80 transition-opacity"
        style={{ fontFamily: 'sans-serif', color: 'white', fontSize: '1.1cqw', userSelect: 'none' }}
      >
        <div
          style={{
            width: '2.2cqw',
            height: '2.2cqw',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Plus size="1.2cqw" />
        </div>
        <span style={{ fontSize: '1cqw' }}>Add content</span>
      </div>

      {/* Context menu */}
      {open && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: '105%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            padding: '6px',
            zIndex: 9999,
            minWidth: '160px',
            fontFamily: 'sans-serif',
            fontSize: '13px'
          }}
        >
          <div style={{ padding: '4px 8px 6px', color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
            Add to bar
          </div>
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick(); setOpen(false) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '7px 10px',
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: 'rgba(255,255,255,0.85)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '12px',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
