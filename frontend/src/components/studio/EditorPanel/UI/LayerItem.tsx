// src/components/studio/EditorPanel/UI/LayerItem.tsx
'use client'
import React from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

export function LayerItem({ name, visible, locked, onToggle }: { name: string, visible: boolean, locked?: boolean, onToggle?: () => void }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 bg-zinc-800/30 border border-zinc-700/30 rounded-lg group hover:bg-zinc-800/60 transition-colors">
      <span className="text-xs text-zinc-300 font-medium">{name}</span>
      <div className="flex items-center gap-2">
        {locked ? (
          <Lock size={14} className="text-zinc-600" />
        ) : (
          <button onClick={onToggle} className="text-zinc-400 hover:text-white transition-colors">
            {visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
      </div>
    </div>
  )
}
