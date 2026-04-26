// src/components/studio/CardPreview/Elements/UniversalBadge.tsx
'use client'
import React, { useContext, useState, useRef, useEffect } from 'react'
import { BrandItemStyle, CardData } from '@/lib/types'
import { InteractionContext } from '../InteractionContext'
import * as Icons from 'lucide-react'
import { useStore } from '@/store/useStore'
import clsx from 'clsx'

interface UniversalBadgeProps {
  id: string
  label: string
  defaultIcon?: string
  dataKey: keyof CardData
  style?: Partial<BrandItemStyle>
  focusTarget?: string
  onSettingsOpen?: () => void
  popupPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export function UniversalBadge({ id, label, defaultIcon, dataKey, style = {}, focusTarget, onSettingsOpen, popupPosition = 'top-left' }: UniversalBadgeProps) {
  const { isInteractive, setFocus } = useContext(InteractionContext)
  const { cardData, updateCardData } = useStore()
  const [showSettings, setShowSettings] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  const value = cardData[dataKey] as string
  const currentStyles = cardData.brandItemStyles || {}
  const itemStyleOverrides = currentStyles[id] || {}
  const combinedStyle = { ...style, ...itemStyleOverrides }
  
  const iconName = combinedStyle.icon || defaultIcon
  const Icon = (iconName && Icons[iconName as keyof typeof Icons] ? Icons[iconName as keyof typeof Icons] : Icons.Settings) as React.ElementType

  const focusPrefix = focusTarget || 'brand'
  const activeProperty = cardData.activeProperty

  useEffect(() => {
    if (activeProperty === `${focusPrefix}-${id}`) {
      setShowSettings(true)
    } else {
      setShowSettings(false)
    }
  }, [activeProperty, id, focusPrefix])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        if (activeProperty === `${focusPrefix}-${id}`) {
          updateCardData({ activeProperty: undefined })
        }
      }
    }
    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSettings, id, activeProperty, focusPrefix, updateCardData])

  if (combinedStyle.visible === false) return null

  const displayValue = value || `[${label}]`
  const isEmpty = !value

  // In export/non-interactive mode, hide completely when empty
  if (isEmpty && !isInteractive) return null

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8cqw',
    padding: combinedStyle.backgroundColor && combinedStyle.backgroundColor !== 'transparent' ? '0.4cqw 1cqw' : '0 0.4cqw',
    borderRadius: `${combinedStyle.borderRadius ?? 0.4}cqw`,
    backgroundColor: combinedStyle.backgroundColor || 'transparent',
    border: combinedStyle.showBorder ? `${combinedStyle.borderWidth || 1}px solid ${combinedStyle.borderColor || 'rgba(255,255,255,0.2)'}` : 'none',
    color: combinedStyle.color || 'rgba(255,255,255,0.8)',
    fontSize: `${combinedStyle.fontSize || 1.2}cqw`,
    fontFamily: combinedStyle.fontFamily || 'sans-serif',
    fontWeight: combinedStyle.fontWeight || 500,
    textTransform: (combinedStyle.textTransform || 'none') as any,
    letterSpacing: combinedStyle.letterSpacing || 'normal',
    cursor: isInteractive ? 'pointer' : 'default',
    position: 'relative',
    transition: 'all 0.2s'
  }

  const updateStyle = (patch: Partial<BrandItemStyle>) => {
    const currentStyles = cardData.brandItemStyles || {}
    const currentItemStyle = currentStyles[id] || {}
    updateCardData({
      brandItemStyles: {
        ...currentStyles,
        [id]: { ...currentItemStyle, ...patch }
      }
    })
  }

  let popupClasses = "absolute bottom-full left-0 mb-2"
  if (popupPosition === 'bottom-right') popupClasses = "absolute top-full right-0 mt-2"
  if (popupPosition === 'bottom-left') popupClasses = "absolute top-full left-0 mt-2"
  if (popupPosition === 'top-right') popupClasses = "absolute bottom-full right-0 mb-2"

  return (
    <div 
      className="group"
      onClick={(e) => {
        if (!isInteractive) return
        e.stopPropagation()
        setFocus(focusPrefix as any)
        updateCardData({ activeProperty: `${focusPrefix}-${id}` })
        if (onSettingsOpen) onSettingsOpen()
      }}
      style={itemStyle}
    >
      {combinedStyle.showIcon !== false && !isEmpty && <Icon size={`${(combinedStyle.fontSize || 1.2) * 1.2}cqw`} className="shrink-0" />}
      {/* When empty: invisible by default, bold label appears only on hover */}
      {!isEmpty ? (
        <span className="whitespace-nowrap">{displayValue}</span>
      ) : isInteractive ? (
        <span className="whitespace-nowrap font-bold opacity-0 group-hover:opacity-70 transition-opacity" style={{ fontSize: `${Math.max(1.4, (combinedStyle.fontSize || 1.2) * 1.1)}cqw` }}>+ {label}</span>
      ) : null}

      {showSettings && isInteractive && (
        <div 
          ref={popupRef}
          onClick={(e) => e.stopPropagation()}
          className={`${popupClasses} w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-3 z-[200] flex flex-col gap-3 cursor-default`}
          style={{ fontSize: '14px', fontFamily: 'sans-serif', transform: 'translateX(0)', fontWeight: 400, letterSpacing: 'normal', textTransform: 'none', lineHeight: '1.4' }}
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-1">
            <span className="font-bold text-[10px] uppercase text-zinc-500">{label} Settings</span>
            <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-white">
              <Icons.X size={12} />
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-zinc-500 uppercase font-bold">Content Text</label>
              <input 
                type="text" 
                value={value || ''} 
                onChange={(e) => updateCardData({ [dataKey]: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-zinc-500 uppercase font-bold">Text Color</label>
              <input 
                type="color" 
                value={style.color || '#ffffff'} 
                onChange={(e) => updateStyle({ color: e.target.value })}
                className="w-full h-6 rounded bg-transparent border-none cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-zinc-500 uppercase font-bold">BG Color</label>
              <input 
                type="color" 
                value={style.backgroundColor || '#1a1a1a'} 
                onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                className="w-full h-6 rounded bg-transparent border-none cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-zinc-500 uppercase font-bold">Font Size ({style.fontSize || 1.2}cqw)</label>
              <input 
                type="range" min="0.5" max="6" step="0.1"
                value={style.fontSize || 1.2} 
                onChange={(e) => updateStyle({ fontSize: parseFloat(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">Show Icon</span>
              <input 
                type="checkbox" 
                checked={style.showIcon !== false}
                onChange={(e) => updateStyle({ showIcon: e.target.checked })}
                className="accent-blue-500"
              />
            </div>

            <div className="h-px bg-zinc-800 my-1" />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">Show Border</span>
              <input 
                type="checkbox" 
                checked={style.showBorder || false}
                onChange={(e) => updateStyle({ showBorder: e.target.checked })}
                className="accent-blue-500"
              />
            </div>
            
            {style.showBorder && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-zinc-500 uppercase font-bold">Border Color</label>
                  <input 
                    type="color" 
                    value={style.borderColor || '#ffffff'} 
                    onChange={(e) => updateStyle({ borderColor: e.target.value })}
                    className="w-full h-6 rounded bg-transparent border-none cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-zinc-500 uppercase font-bold">Border Width ({style.borderWidth || 1}px)</label>
                  <input 
                    type="range" min="1" max="5" step="1"
                    value={style.borderWidth || 1} 
                    onChange={(e) => updateStyle({ borderWidth: parseInt(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                </div>
              </>
            )}
            
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-zinc-500 uppercase font-bold">Border Radius</label>
              <input 
                type="range" min="0" max="2" step="0.1"
                value={style.borderRadius || 0.4} 
                onChange={(e) => updateStyle({ borderRadius: parseFloat(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
