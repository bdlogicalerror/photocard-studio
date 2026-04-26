// src/components/studio/EditorPanel/UI/ColorField.tsx
'use client'
import React from 'react'
import { useStore } from '@/store/useStore'
import { TemplateStyle } from '@/lib/types'
import { Field, inputCls } from './Field'

export function ColorField({ label, styleKey }: { label: string; styleKey: keyof TemplateStyle }) {
  const { updateStyle, templates, activeTemplateId } = useStore()
  const t = templates.find(t => t.id === activeTemplateId)!
  const val = t.style[styleKey] as string
  return (
    <Field label={label}>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={val.startsWith('rgba') ? '#000000' : val}
          onChange={e => updateStyle({ [styleKey]: e.target.value })}
          className="w-8 h-7 rounded cursor-pointer bg-zinc-800 border border-zinc-700 p-0.5 flex-shrink-0"
        />
        <input
          type="text"
          value={val}
          onChange={e => updateStyle({ [styleKey]: e.target.value })}
          className={inputCls}
          placeholder="#ffffff"
        />
      </div>
    </Field>
  )
}
