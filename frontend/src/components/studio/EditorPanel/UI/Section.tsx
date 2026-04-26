// src/components/studio/EditorPanel/UI/Section.tsx
'use client'
import React from 'react'

export function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <div className="border-b border-zinc-800/50 pb-4 mb-4 last:border-0 last:mb-0">
      <div className="flex items-center justify-between mb-3 cursor-pointer group">
        <p className="text-[11px] uppercase tracking-wider text-zinc-300 font-semibold group-hover:text-white transition-colors">{title}</p>
        <svg className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
