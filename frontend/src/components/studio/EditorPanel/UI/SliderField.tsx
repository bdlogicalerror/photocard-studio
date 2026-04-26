// src/components/studio/EditorPanel/UI/SliderField.tsx
'use client'
import React from 'react'
import { useStore } from '@/store/useStore'
import { TemplateStyle } from '@/lib/types'
import { Field } from './Field'

export function SliderField({ label, styleKey, min, max, step = 1 }: {
  label: string; styleKey: keyof TemplateStyle; min: number; max: number; step?: number
}) {
  const { updateStyle, templates, activeTemplateId } = useStore()
  const t = templates.find(t => t.id === activeTemplateId)!
  const val = t.style[styleKey] as number
  return (
    <Field label={`${label}: ${val}`}>
      <input
        type="range" min={min} max={max} step={step} value={val}
        onChange={e => updateStyle({ [styleKey]: Number(e.target.value) })}
        className="w-full accent-red-500"
      />
    </Field>
  )
}
