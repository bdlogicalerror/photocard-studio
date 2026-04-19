// src/components/EditorPanel.tsx
'use client'
import { useRef, ChangeEvent } from 'react'
import { useStore, useActiveTemplate } from '@/store/useStore'
import { Upload, RefreshCw, Link } from 'lucide-react'
import { TemplateStyle } from '@/lib/types'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-zinc-800 pb-4 mb-4 last:border-0 last:mb-0">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">{title}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] text-zinc-400">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "bg-zinc-800 text-white text-xs px-2.5 py-1.5 rounded border border-zinc-700 outline-none focus:border-zinc-500 w-full"
const textareaCls = `${inputCls} resize-none`

function ColorField({ label, styleKey }: { label: string; styleKey: keyof TemplateStyle }) {
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

function SliderField({ label, styleKey, min, max, step = 1 }: {
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

function PhotoUploader({ idx, label }: { idx: number; label: string }) {
  const { updatePhoto, cardData } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const photo = cardData.photos[idx]

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => updatePhoto(idx, { src: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] text-zinc-400">{label}</label>
      <div
        onClick={() => fileRef.current?.click()}
        className="relative flex items-center justify-center h-20 rounded border border-dashed border-zinc-700 cursor-pointer hover:border-zinc-500 transition-colors overflow-hidden bg-zinc-900"
      >
        {photo?.src ? (
          <>
            <div 
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${photo.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload size={16} className="text-white" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-zinc-500">
            <Upload size={16} />
            <span className="text-[10px]">Upload or paste URL</span>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <input
        type="text"
        placeholder="Or paste image URL..."
        className={inputCls}
        value={photo?.src?.startsWith('http') ? photo.src : ''}
        onChange={e => updatePhoto(idx, { src: e.target.value })}
      />
      {photo?.src && (
        <div className="flex gap-2">
          <Field label="Fit">
            <select
              value={photo.objectFit}
              onChange={e => updatePhoto(idx, { objectFit: e.target.value as any })}
              className={inputCls}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </select>
          </Field>
          <Field label={`Scale: ${(photo.scale ?? 1).toFixed(1)}`}>
            <input
              type="range" min="0.5" max="2" step="0.1" value={photo.scale ?? 1}
              onChange={e => updatePhoto(idx, { scale: Number(e.target.value) })}
              className="w-full accent-red-500 mt-1"
            />
          </Field>
        </div>
      )}
    </div>
  )
}

export default function EditorPanel() {
  const { cardData, updateCardData, updateStyle, resetCardData } = useStore()
  const template = useActiveTemplate()
  const style = template.style

  return (
    <div className="w-full md:w-72 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 overflow-y-auto flex flex-col h-full pb-20 md:pb-10">
      <div className="px-4 py-2 md:py-3 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-950 z-10">
        <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-zinc-400">Edit Card</span>
        <button
          onClick={resetCardData}
          className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <RefreshCw size={10} /> Reset
        </button>
      </div>

      <div className="p-4 flex flex-col gap-0 pb-24 md:pb-0">

        <Section title="Photos">
          {Array.from({ length: template.photoCount }).map((_, i) => (
            <PhotoUploader key={i} idx={i} label={`Photo ${template.photoCount > 1 ? i + 1 : ''}`} />
          ))}
        </Section>

        <Section title="Content">
          <Field label="Headline">
            <textarea
              rows={3}
              value={cardData.headline}
              onChange={e => updateCardData({ headline: e.target.value })}
              className={`${textareaCls} font-bengali`}
              style={{ fontFamily: "'Noto Serif Bengali', serif" }}
            />
          </Field>
          <Field label="Subheadline">
            <input type="text" value={cardData.subheadline} onChange={e => updateCardData({ subheadline: e.target.value })} className={inputCls} />
          </Field>
          {template.layout === 'poll-vote' && (
            <Field label="Poll Options (comma separated)">
              <input
                type="text"
                value={(cardData.pollOptions || ['YES', 'NO']).join(', ')}
                onChange={e => {
                  const opts = e.target.value.split(',').map(s => s.trim())
                  updateCardData({ pollOptions: [opts[0] || 'YES', opts[1] || 'NO'] })
                }}
                className={inputCls}
                placeholder="YES, NO"
              />
            </Field>
          )}
        </Section>

        <Section title="Branding">
          <Field label="Channel name">
            <input type="text" value={cardData.brandName} onChange={e => updateCardData({ brandName: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Handle / username">
            <input type="text" value={cardData.handle} onChange={e => updateCardData({ handle: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Website">
            <input type="text" value={cardData.website} onChange={e => updateCardData({ website: e.target.value })} className={inputCls} />
          </Field>
          <Field label="News Source">
            <input type="text" value={cardData.source || ''} onChange={e => updateCardData({ source: e.target.value })} className={inputCls} placeholder="e.g. Prothom Alo" />
          </Field>
          <Field label="Show brand bar">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={style.showBrandBar}
                onChange={e => updateStyle({ showBrandBar: e.target.checked })}
                className="accent-red-500"
              />
              <span className="text-xs text-zinc-400">Visible</span>
            </label>
          </Field>
        </Section>

        <Section title="Watermark">
          <Field label="Watermark Text">
            <input type="text" value={cardData.watermarkText ?? ''} onChange={e => updateCardData({ watermarkText: e.target.value })} className={inputCls} />
          </Field>
          <div className="flex gap-4">
            <Field label="Show">
              <label className="flex items-center h-full gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={style.showWatermark ?? false}
                  onChange={e => updateStyle({ showWatermark: e.target.checked })}
                  className="accent-red-500"
                />
                <span className="text-xs text-zinc-500">Enable</span>
              </label>
            </Field>
            <div className="flex-1">
              <Field label={`Opacity: ${(style.watermarkOpacity ?? 0.3).toFixed(2)}`}>
                <input
                  type="range" min="0" max="1" step="0.05" value={style.watermarkOpacity ?? 0.3}
                  onChange={e => updateStyle({ watermarkOpacity: Number(e.target.value) })}
                  className="w-full accent-red-500 mt-1"
                />
              </Field>
            </div>
          </div>
        </Section>

        <Section title="Colors">
          <ColorField label="Accent / bar color" styleKey="accentColor" />
          <ColorField label="Headline background" styleKey="backgroundColor" />
          <ColorField label="Headline text" styleKey="headlineColor" />
          <ColorField label="Subheadline text" styleKey="subheadlineColor" />
          <ColorField label="Brand bar background" styleKey="brandBarBg" />
          <ColorField label="Brand logo color" styleKey="brandColor" />
          <ColorField label="Photo divider" styleKey="photoDividerColor" />
        </Section>

        <Section title="Typography">
          <Field label="Font family">
            <select
              value={style.fontFamily}
              onChange={e => updateStyle({ fontFamily: e.target.value as any })}
              className={inputCls}
            >
              <option value="bengali">Noto Serif Bengali</option>
              <option value="bengali-sans">Noto Sans Bengali</option>
              <option value="display">Playfair Display</option>
              <option value="sans">System Sans</option>
            </select>
          </Field>
          <SliderField label="Headline size" styleKey="headlineFontSize" min={20} max={100} />
          <SliderField label="Subheadline size" styleKey="subheadlineFontSize" min={12} max={60} />
          <Field label="Headline weight">
            <select
              value={style.headlineFontWeight}
              onChange={e => updateStyle({ headlineFontWeight: Number(e.target.value) as any })}
              className={inputCls}
            >
              <option value={400}>Regular</option>
              <option value={700}>Bold</option>
              <option value={900}>Black</option>
            </select>
          </Field>
        </Section>

        <Section title="Layout">
          <Field label="Accent bar position">
            <select
              value={style.accentBarPosition}
              onChange={e => updateStyle({ accentBarPosition: e.target.value as any })}
              className={inputCls}
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="none">None</option>
            </select>
          </Field>
          <SliderField label="Accent bar height" styleKey="accentBarHeight" min={2} max={20} />
          <SliderField label="Padding" styleKey="padding" min={10} max={80} />
          <SliderField label="Border radius" styleKey="borderRadius" min={0} max={32} />
          {template.layout === 'full-overlay' && (
            <SliderField label="Overlay opacity" styleKey="overlayOpacity" min={0} max={1} step={0.05} />
          )}
        </Section>

      </div>
    </div>
  )
}
