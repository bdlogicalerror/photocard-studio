// src/components/TemplateSidebar.tsx
'use client'
import { useState } from 'react'
import { useStore, useActiveTemplate } from '@/store/useStore'
import { Template, TemplateLayout, DEFAULT_STYLE } from '@/lib/types'
import { Plus, Copy, Trash2, Pencil, Check, X } from 'lucide-react'
import clsx from 'clsx'

const LAYOUT_OPTIONS: { value: TemplateLayout; label: string; photos: 1 | 2 | 3 }[] = [
  { value: 'dual-top',         label: '2 Photos Top',      photos: 2 },
  { value: 'single-top',       label: '1 Photo Top',       photos: 1 },
  { value: 'single-bottom',    label: '1 Photo Bottom',    photos: 1 },
  { value: 'full-overlay',     label: 'Full Overlay',      photos: 1 },
  { value: 'dual-side',        label: 'Photo Left',        photos: 1 },
  { value: 'dual-side-reverse',label: 'Photo Right',       photos: 1 },
  { value: 'triple-mosaic',    label: '3 Photo Mosaic',    photos: 3 },
]

const LAYOUT_ICONS: Record<TemplateLayout, string> = {
  'dual-top':          '▬▬\n████',
  'single-top':        '████\n▬▬▬▬',
  'single-bottom':     '▬▬▬▬\n████',
  'full-overlay':      '▓▓▓▓',
  'dual-side':         '█▬',
  'dual-side-reverse': '▬█',
  'triple-mosaic':     '▬█\n▬█',
}

function LayoutThumb({ layout }: { layout: TemplateLayout }) {
  const colors: Record<TemplateLayout, string> = {
    'dual-top': 'bg-zinc-700',
    'single-top': 'bg-zinc-700',
    'single-bottom': 'bg-zinc-700',
    'full-overlay': 'bg-zinc-700',
    'dual-side': 'bg-zinc-700',
    'dual-side-reverse': 'bg-zinc-700',
    'triple-mosaic': 'bg-zinc-700',
  }
  const w = 36, h = 36
  const layouts: Record<TemplateLayout, React.ReactNode> = {
    'dual-top': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="17" height="20" fill="#555"/>
        <rect x="19" y="0" width="17" height="20" fill="#555"/>
        <rect x="0" y="22" width="36" height="10" fill="#c0392b"/>
        <rect x="0" y="34" width="36" height="2" fill="#111"/>
      </svg>
    ),
    'single-top': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="36" height="20" fill="#555"/>
        <rect x="0" y="22" width="36" height="10" fill="#c0392b"/>
        <rect x="0" y="34" width="36" height="2" fill="#111"/>
      </svg>
    ),
    'single-bottom': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="36" height="12" fill="#c0392b"/>
        <rect x="0" y="14" width="36" height="18" fill="#555"/>
        <rect x="0" y="34" width="36" height="2" fill="#111"/>
      </svg>
    ),
    'full-overlay': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="36" height="36" fill="#555"/>
        <rect x="0" y="22" width="36" height="14" fill="rgba(0,0,0,0.55)"/>
      </svg>
    ),
    'dual-side': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="16" height="32" fill="#555"/>
        <rect x="18" y="0" width="18" height="32" fill="#c0392b"/>
        <rect x="0" y="34" width="36" height="2" fill="#111"/>
      </svg>
    ),
    'dual-side-reverse': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="18" height="32" fill="#c0392b"/>
        <rect x="20" y="0" width="16" height="32" fill="#555"/>
        <rect x="0" y="34" width="36" height="2" fill="#111"/>
      </svg>
    ),
    'triple-mosaic': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="16" height="9" fill="#555"/>
        <rect x="0" y="11" width="16" height="9" fill="#666"/>
        <rect x="18" y="0" width="18" height="20" fill="#777"/>
        <rect x="0" y="22" width="36" height="10" fill="#c0392b"/>
        <rect x="0" y="34" width="36" height="2" fill="#111"/>
      </svg>
    ),
  }
  return <div className="flex items-center justify-center">{layouts[layout]}</div>
}

export default function TemplateSidebar() {
  const { templates, activeTemplateId, setActiveTemplate, duplicateTemplate, deleteTemplate, renameTemplate, addTemplate } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newLayout, setNewLayout] = useState<TemplateLayout>('single-top')

  const startEdit = (t: Template) => { setEditingId(t.id); setEditName(t.name) }
  const saveEdit = () => { if (editingId && editName.trim()) renameTemplate(editingId, editName.trim()); setEditingId(null) }

  const handleAdd = () => {
    if (!newName.trim()) return
    const opt = LAYOUT_OPTIONS.find(l => l.value === newLayout)!
    addTemplate({
      name: newName.trim(),
      description: opt.label,
      layout: newLayout,
      photoCount: opt.photos,
      isBuiltIn: false,
      style: { ...DEFAULT_STYLE },
    })
    setNewName('')
    setShowNewForm(false)
  }

  return (
    <aside className="w-full md:w-56 flex-shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Templates</span>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {showNewForm && (
        <div className="px-3 py-3 border-b border-zinc-800 bg-zinc-900 flex flex-col gap-2">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Template name"
            className="w-full bg-zinc-800 text-white text-xs px-2 py-1.5 rounded border border-zinc-700 outline-none focus:border-zinc-500"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <select
            value={newLayout}
            onChange={e => setNewLayout(e.target.value as TemplateLayout)}
            className="w-full bg-zinc-800 text-white text-xs px-2 py-1.5 rounded border border-zinc-700 outline-none"
          >
            {LAYOUT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="flex gap-1">
            <button onClick={handleAdd} className="flex-1 text-xs py-1 rounded bg-red-700 hover:bg-red-600 text-white transition-colors">
              Create
            </button>
            <button onClick={() => setShowNewForm(false)} className="flex-1 text-xs py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {templates.map(t => (
          <div
            key={t.id}
            className={clsx(
              'group relative flex items-center gap-2 px-3 py-2.5 cursor-pointer border-b border-zinc-800/50 transition-colors',
              t.id === activeTemplateId ? 'bg-zinc-800' : 'hover:bg-zinc-900'
            )}
            onClick={() => setActiveTemplate(t.id)}
          >
            <div className="flex-shrink-0">
              <LayoutThumb layout={t.layout} />
            </div>
            <div className="flex-1 min-w-0">
              {editingId === t.id ? (
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="flex-1 bg-zinc-700 text-white text-xs px-1.5 py-0.5 rounded outline-none w-full"
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingId(null) }}
                  />
                  <button onClick={saveEdit} className="text-green-400 hover:text-green-300"><Check size={12}/></button>
                  <button onClick={() => setEditingId(null)} className="text-zinc-500 hover:text-zinc-300"><X size={12}/></button>
                </div>
              ) : (
                <>
                  <p className="text-xs font-medium text-white truncate leading-tight">{t.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{t.description}</p>
                </>
              )}
            </div>
            {editingId !== t.id && (
              <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <button onClick={() => startEdit(t)} className="p-0.5 text-zinc-500 hover:text-white transition-colors"><Pencil size={10}/></button>
                <button onClick={() => duplicateTemplate(t.id)} className="p-0.5 text-zinc-500 hover:text-white transition-colors"><Copy size={10}/></button>
                {!t.isBuiltIn && templates.length > 1 && (
                  <button onClick={() => deleteTemplate(t.id)} className="p-0.5 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 size={10}/></button>
                )}
              </div>
            )}
            {t.id === activeTemplateId && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500" />
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
