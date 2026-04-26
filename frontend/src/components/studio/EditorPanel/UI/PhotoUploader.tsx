// src/components/studio/EditorPanel/UI/PhotoUploader.tsx
'use client'
import { useRef, ChangeEvent } from 'react'
import { useStore } from '@/store/useStore'
import { Upload, ZoomIn } from 'lucide-react'
import { Field, inputCls } from './Field'

export function PhotoUploader({ idx, label }: { idx: number; label: string }) {
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
        value={photo?.src?.startsWith('http') ? (photo.src.includes('proxy-image?url=') ? decodeURIComponent(photo.src.split('url=')[1]) : photo.src) : ''}
        onChange={e => {
          const url = e.target.value.trim()
          if (!url) {
            updatePhoto(idx, { src: null })
            return
          }
          if (url.startsWith('http')) {
            const proxied = `${window.location.origin}/api/proxy-image?url=${encodeURIComponent(url)}&t=${Date.now()}`
            updatePhoto(idx, { src: proxied })
          } else {
            updatePhoto(idx, { src: url })
          }
        }}
      />
      {photo?.src && (
        <div className="flex flex-col gap-3 mt-2 bg-zinc-900/50 p-3 rounded border border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <ZoomIn size={14} />
            <span className="text-[10px] uppercase font-bold tracking-wider">Image Adjustments</span>
          </div>
          <Field label={`Zoom Level: ${(photo.scale ?? 1).toFixed(1)}x`}>
            <input
              type="range" min="0.5" max="3" step="0.1" value={photo.scale ?? 1}
              onChange={e => updatePhoto(idx, { scale: Number(e.target.value) })}
              className="w-full accent-red-500 mt-1"
            />
          </Field>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Field label="Fit Mode">
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
            <Field label="Position (X% Y%)">
               <input
                 type="text"
                 value={photo.objectPosition}
                 onChange={e => updatePhoto(idx, { objectPosition: e.target.value })}
                 className={inputCls}
                 placeholder="50% 50%"
               />
            </Field>
          </div>
        </div>
      )}
    </div>
  )
}
