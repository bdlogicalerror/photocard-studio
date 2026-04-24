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
  { value: 'poll-vote',        label: 'Poll / Vote',       photos: 1 },
  { value: 'versus-clash',     label: 'VS Clash',          photos: 2 },
  { value: 'quote-focus',      label: 'Quote Focus',       photos: 1 },
  { value: 'breaking-alert',   label: 'Breaking News',     photos: 1 },
  { value: 'stat-highlight',   label: 'Factoid / Stat',    photos: 1 },
  { value: 'portrait-editorial', label: 'Editorial',       photos: 1 },
  { value: 'impact-hero',      label: 'Impact / Big',      photos: 1 },
  { value: 'news-reel',        label: 'Social Reel',       photos: 1 },
  { value: 'modern-duo',       label: 'Vertical Split',    photos: 2 },
]

const LAYOUT_ICONS: Record<TemplateLayout, string> = {
  'dual-top':          '▬▬\n████',
  'single-top':        '████\n▬▬▬▬',
  'single-bottom':     '▬▬▬▬\n████',
  'full-overlay':      '▓▓▓▓',
  'dual-side':         '█▬',
  'dual-side-reverse': '▬█',
  'triple-mosaic':     '▬█\n▬█',
  'poll-vote':         '████\n[Y][N]',
  'versus-clash':      '████\n-VS-',
  'quote-focus':       '❝██❞\n████',
  'breaking-alert':    '!██!\n████',
  'stat-highlight':    '100%\n████',
  'portrait-editorial':'█▬▬\n█▬▬',
  'impact-hero':       '███\n██-█',
  'news-reel':         '  ▓  \n ███ ',
  'modern-duo':        '▬▬\n▬▬',
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
    'poll-vote': 'bg-zinc-700',
    'versus-clash': 'bg-zinc-700',
    'quote-focus': 'bg-zinc-700',
    'breaking-alert': 'bg-red-700',
    'stat-highlight': 'bg-green-700',
    'portrait-editorial': 'bg-blue-700',
    'impact-hero': 'bg-zinc-800',
    'news-reel': 'bg-sky-700',
    'modern-duo': 'bg-zinc-600',
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
    'poll-vote': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="36" height="24" fill="#555"/>
        <rect x="2" y="26" width="15" height="8" rx="2" fill="#22c55e"/>
        <rect x="19" y="26" width="15" height="8" rx="2" fill="#ef4444"/>
      </svg>
    ),
    'versus-clash': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <polygon points="0,0 22,0 14,36 0,36" fill="#555"/>
        <polygon points="22,0 36,0 36,36 14,36" fill="#777"/>
        <circle cx="18" cy="18" r="6" fill="#ef4444"/>
      </svg>
    ),
    'quote-focus': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="20" height="36" fill="#333"/>
        <text x="2" y="20" fontSize="24" fill="#fbbf24" opacity="0.3" fontFamily="serif">“</text>
        <rect x="22" y="0" width="14" height="36" fill="#555"/>
      </svg>
    ),
    'breaking-alert': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="36" height="24" fill="#555"/>
        <polygon points="0,2 36,2 33,8 0,8" fill="#ef4444"/>
        <rect x="0" y="24" width="36" height="12" fill="#c0392b"/>
      </svg>
    ),
    'stat-highlight': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="16" height="36" fill="#555"/>
        <rect x="18" y="0" width="18" height="36" fill="#166534"/>
        <text x="19" y="16" fontSize="12" fontWeight="bold" fill="#86efac">00%</text>
        <rect x="0" y="34" width="36" height="2" fill="#111"/>
      </svg>
    ),
    'portrait-editorial': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="16" height="36" fill="#555"/>
        <rect x="18" y="4" width="18" height="4" fill="#3b82f6"/>
        <rect x="18" y="10" width="18" height="2" fill="#fff"/>
        <rect x="18" y="14" width="18" height="2" fill="#fff"/>
        <rect x="18" y="18" width="12" height="2" fill="#fff"/>
      </svg>
    ),
    'impact-hero': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="36" height="36" fill="#555"/>
        <rect x="4" y="20" width="28" height="12" fill="rgba(0,0,0,0.8)"/>
        <rect x="6" y="24" width="24" height="4" fill="#ef4444"/>
      </svg>
    ),
    'news-reel': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="8" y="0" width="20" height="36" fill="#555"/>
        <rect x="10" y="28" width="16" height="4" fill="#0ea5e9"/>
      </svg>
    ),
    'modern-duo': (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <rect x="0" y="0" width="17" height="36" fill="#555"/>
        <rect x="19" y="0" width="17" height="36" fill="#666"/>
        <rect x="0" y="30" width="36" height="6" fill="#27272a"/>
      </svg>
    ),
  }
  return <div className="flex items-center justify-center">{layouts[layout]}</div>
}

export default function TemplateSidebar() {
  const { templates, activeTemplateId, setActiveTemplate, duplicateTemplate, deleteTemplate, renameTemplate, addTemplate, _hasHydrated } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newLayout, setNewLayout] = useState<TemplateLayout>('single-top')

  if (!_hasHydrated) return <div className="p-8 text-center text-zinc-500 text-xs animate-pulse">Loading templates...</div>

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
    <aside className="w-full h-full flex flex-col bg-[#1E1E24] text-zinc-400 overflow-hidden text-sm">
      {/* Logo Area */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-zinc-200 to-zinc-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-zinc-900 font-bold text-xl italic">S</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-white tracking-wider">DESIGN</span>
            <span className="font-light tracking-wider text-xs">STUDIO</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-white font-medium text-xs">
          Jb
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col gap-2 p-4">
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors w-full text-left">
          <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          <span className="font-medium tracking-wide text-xs">DASHBOARD</span>
        </button>
        <button className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-zinc-800/40 text-white w-full text-left border border-zinc-700/30">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            <span className="font-medium tracking-wide text-xs">PROJECT</span>
          </div>
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Active</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors w-full text-left">
          <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <span className="font-medium tracking-wide text-xs">TEMPLATES</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors w-full text-left">
          <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          <span className="font-medium tracking-wide text-xs">ASSETS</span>
        </button>
      </div>

      <div className="w-full h-px bg-zinc-800/50 my-2"></div>

      {/* Templates List */}
      <div className="flex items-center justify-between px-6 py-3">
        <span className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">Layouts</span>
        <button onClick={() => setShowNewForm(!showNewForm)} className="text-zinc-500 hover:text-white transition-colors">
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

      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-hide">
        {templates.map(t => (
          <div
            key={t.id}
            className={clsx(
              'group relative flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg cursor-pointer transition-all duration-200 border',
              t.id === activeTemplateId 
                ? 'bg-zinc-800/60 border-zinc-700/50 text-white shadow-lg' 
                : 'border-transparent hover:bg-zinc-800/30 text-zinc-400 hover:text-zinc-200'
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
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
