// src/components/studio/EditorPanel/UI/Field.tsx
'use client'
import React from 'react'

export const inputCls = "bg-[#1E1E24] text-white text-xs px-3 py-2 rounded-lg border border-zinc-700/50 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 w-full transition-all"
export const textareaCls = `${inputCls} resize-none`

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] text-zinc-400">{label}</label>
      {children}
    </div>
  )
}
