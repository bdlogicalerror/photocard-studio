// src/components/studio/EditorPanel/PropertiesTab.tsx
'use client'
import React, { useEffect, useRef, useState, ChangeEvent } from 'react'
import { useStore, useActiveTemplate } from '@/store/useStore'
import { Upload, Shield, ChevronDown, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { Field, inputCls, textareaCls } from './UI/Field'
import { ColorField } from './UI/ColorField'
import { SliderField } from './UI/SliderField'
import { PhotoUploader } from './UI/PhotoUploader'

export function PropertiesTab() {
  const { 
    cardData, updateCardData, updateStyle, addBlurRegion, 
    addCustomLayer, removeCustomLayer 
  } = useStore()
  const template = useActiveTemplate()
  const style = template?.style
  
  // Group references for scrolling
  const groups: Record<string, React.RefObject<HTMLDivElement>> = {
    photos: useRef<HTMLDivElement>(null),
    content: useRef<HTMLDivElement>(null),
    branding: useRef<HTMLDivElement>(null),
    watermark: useRef<HTMLDivElement>(null),
    date: useRef<HTMLDivElement>(null),
    graphics: useRef<HTMLDivElement>(null),
    privacy: useRef<HTMLDivElement>(null),
    colors: useRef<HTMLDivElement>(null),
    typography: useRef<HTMLDivElement>(null),
    layout: useRef<HTMLDivElement>(null),
  }

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    photos: true,
    content: true,
    branding: true
  })

  const toggleGroup = (id: string) => {
    setOpenGroups((prev: Record<string, boolean>) => ({ ...prev, [id]: !prev[id] }))
  }

  // Handle auto-focus from CardPreview
  useEffect(() => {
    if (cardData.activeProperty) {
      let targetGroup = ''
      const prop = cardData.activeProperty
      if (prop.startsWith('photo')) targetGroup = 'photos'
      else if (prop === 'headline' || prop === 'subheadline') targetGroup = 'content'
      else if (prop === 'sponsor' || prop === 'brand') targetGroup = 'branding'
      else if (prop === 'watermark') targetGroup = 'watermark'
      
      if (targetGroup && groups[targetGroup].current) {
        setOpenGroups((prev: Record<string, boolean>) => ({ ...prev, [targetGroup]: true }))
        
        // Small delay to allow the accordion to expand before scrolling
        setTimeout(() => {
          groups[targetGroup].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
        
        // Reset active property after a delay to allow re-focusing the same element
        const timer = setTimeout(() => updateCardData({ activeProperty: undefined }), 2000)
        return () => clearTimeout(timer)
      }
    }
  }, [cardData.activeProperty])

  if (!template || !style) {
    return (
      <div className="p-8 text-center animate-pulse">
        <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest italic">Loading Editor...</span>
      </div>
    )
  }

  const GroupHeader = ({ id, title, icon: Icon }: { id: string, title: string, icon?: React.ElementType }) => (
    <div 
      onClick={() => toggleGroup(id)}
      className={clsx(
        "flex items-center justify-between p-3 cursor-pointer transition-all rounded-xl mb-1",
        openGroups[id] ? "bg-zinc-800/50 text-white" : "bg-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon size={16} className={openGroups[id] ? "text-blue-500" : "text-zinc-500"} />}
        <span className="text-[11px] uppercase tracking-wider font-bold">{title}</span>
      </div>
      {openGroups[id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
    </div>
  )

  return (
    <div className="p-3 flex flex-col gap-1 max-h-screen overflow-y-auto custom-scrollbar pb-20">
      
      {/* Photos Group */}
      <div ref={groups.photos} className="scroll-mt-4">
        <GroupHeader id="photos" title="Photos" />
        {openGroups.photos && (
          <div className="p-3 bg-zinc-900/20 rounded-xl mb-4 space-y-4">
            {Array.from({ length: template.photoCount }).map((_, i) => (
              <div key={i}>
                <PhotoUploader idx={i} label={`Photo ${template.photoCount > 1 ? i + 1 : ''}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Group */}
      <div ref={groups.content} className="scroll-mt-4">
        <GroupHeader id="content" title="Text Content" />
        {openGroups.content && (
          <div className="p-3 bg-zinc-900/20 rounded-xl mb-4 space-y-4">
            <Field label="Headline">
              <textarea
                rows={3}
                value={cardData.headline}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateCardData({ headline: e.target.value })}
                className={`${textareaCls} font-bengali`}
                style={{ fontFamily: "'Noto Serif Bengali', serif" }}
              />
            </Field>
            <SliderField label="Headline size" styleKey="headlineFontSize" min={20} max={100} />

            <Field label="Subheadline">
              <input type="text" value={cardData.subheadline} onChange={(e: ChangeEvent<HTMLInputElement>) => updateCardData({ subheadline: e.target.value })} className={inputCls} />
            </Field>
            <SliderField label="Subheadline size" styleKey="subheadlineFontSize" min={12} max={60} />
            
            {template.layout === 'poll-vote' && (
              <Field label="Poll Options (comma separated)">
                <input
                  type="text"
                  value={(cardData.pollOptions || ['YES', 'NO']).join(', ')}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const opts = e.target.value.split(',').map(s => s.trim())
                    updateCardData({ pollOptions: [opts[0] || 'YES', opts[1] || 'NO'] })
                  }}
                  className={inputCls}
                  placeholder="YES, NO"
                />
              </Field>
            )}
          </div>
        )}
      </div>

      {/* Branding Group */}
      <div ref={groups.branding} className="scroll-mt-4">
        <GroupHeader id="branding" title="Branding & Sponsorship" />
        {openGroups.branding && (
          <div className="p-3 bg-zinc-900/20 rounded-xl mb-4 space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Main Branding</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800 mb-2">
                  {(['image', 'text'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => updateCardData({ brandType: type })}
                      className={clsx(
                        "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-tight rounded-md transition-all",
                        (cardData.brandType || 'text') === type 
                          ? "bg-blue-600 text-white shadow-sm" 
                          : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {cardData.brandType === 'image' ? (
                  <div className="space-y-3">
                    <Field label="Brand Logo Image">
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          placeholder="Image URL" 
                          value={cardData.brandImage?.startsWith('http') && cardData.brandImage.includes('proxy-image?url=') ? decodeURIComponent(cardData.brandImage.split('url=')[1].split('&')[0]) : (cardData.brandImage || '')} 
                          onChange={(e) => {
                            const url = e.target.value.trim()
                            if (!url) {
                              updateCardData({ brandImage: undefined })
                              return
                            }
                            if (url.startsWith('http')) {
                              const proxied = `/api/proxy-image?url=${encodeURIComponent(url)}&t=${Date.now()}`
                              updateCardData({ brandImage: proxied })
                            } else {
                              updateCardData({ brandImage: url })
                            }
                          }} 
                          className={inputCls} 
                        />
                        <div className="flex items-center gap-2">
                          <label className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-900 transition-all text-center">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase">Upload File</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onload = (ev) => updateCardData({ brandImage: ev.target?.result as string })
                                  reader.readAsDataURL(file)
                                }
                              }} 
                            />
                          </label>
                        </div>
                      </div>
                    </Field>
                  </div>
                ) : (
                  <Field label="Brand Name">
                    <button 
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => updateCardData({ activeProperty: 'brand-brandName' })}
                      className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950/50 border border-zinc-800/80 rounded-lg hover:border-blue-500/50 hover:bg-zinc-900 transition-all text-left group"
                    >
                      <span className="text-xs text-zinc-300 truncate">{cardData.brandName || 'Not set'}</span>
                      <span className="text-[10px] text-zinc-600 group-hover:text-blue-500 transition-colors">Edit Settings</span>
                    </button>
                  </Field>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Field label="Website">
                  <button 
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => updateCardData({ activeProperty: 'brand-website' })}
                    className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950/50 border border-zinc-800/80 rounded-lg hover:border-blue-500/50 hover:bg-zinc-900 transition-all text-left group"
                  >
                    <span className="text-xs text-zinc-300 truncate">{cardData.website || 'Not set'}</span>
                    <span className="text-[10px] text-zinc-600 group-hover:text-blue-500 transition-colors">Edit</span>
                  </button>
                </Field>
                <Field label="Facebook">
                  <button 
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => updateCardData({ activeProperty: 'brand-facebook' })}
                    className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950/50 border border-zinc-800/80 rounded-lg hover:border-blue-500/50 hover:bg-zinc-900 transition-all text-left group"
                  >
                    <span className="text-xs text-zinc-300 truncate">{cardData.facebook || 'Not set'}</span>
                    <span className="text-[10px] text-zinc-600 group-hover:text-blue-500 transition-colors">Edit</span>
                  </button>
                </Field>
                <Field label="Twitter">
                  <button 
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => updateCardData({ activeProperty: 'brand-twitter' })}
                    className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950/50 border border-zinc-800/80 rounded-lg hover:border-blue-500/50 hover:bg-zinc-900 transition-all text-left group"
                  >
                    <span className="text-xs text-zinc-300 truncate">{cardData.twitter || 'Not set'}</span>
                    <span className="text-[10px] text-zinc-600 group-hover:text-blue-500 transition-colors">Edit</span>
                  </button>
                </Field>
                <Field label="Instagram">
                  <button 
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => updateCardData({ activeProperty: 'brand-instagram' })}
                    className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950/50 border border-zinc-800/80 rounded-lg hover:border-blue-500/50 hover:bg-zinc-900 transition-all text-left group"
                  >
                    <span className="text-xs text-zinc-300 truncate">{cardData.instagram || 'Not set'}</span>
                    <span className="text-[10px] text-zinc-600 group-hover:text-blue-500 transition-colors">Edit</span>
                  </button>
                </Field>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <Field label="Source Text">
                    <input type="text" value={cardData.source || ''} onChange={(e) => updateCardData({ source: e.target.value })} className={inputCls} />
                  </Field>
                </div>
                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cardData.showSource !== false}
                      onChange={(e) => updateCardData({ showSource: e.target.checked })}
                      className="accent-blue-500"
                    />
                    <span className="text-[10px] text-zinc-500 font-bold">Show</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-zinc-950/30 rounded-xl border border-zinc-800/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">QR Code</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cardData.showQrCode || false}
                      onChange={(e) => updateCardData({ showQrCode: e.target.checked })}
                      className="accent-blue-500"
                    />
                    <span className="text-[10px] text-zinc-500 font-bold">Show</span>
                  </label>
                </div>
                {cardData.showQrCode && (
                  <Field label="QR Data (URL/Text)">
                    <input 
                      type="text" 
                      value={cardData.qrCodeData || ''} 
                      onChange={(e) => updateCardData({ qrCodeData: e.target.value })} 
                      className={inputCls} 
                      placeholder="https://..."
                    />
                  </Field>
                )}
              </div>
            </div>

            <div className="h-px bg-zinc-800/50 my-2" />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Sponsorship</span>
                <button
                  onClick={() => updateCardData({ sponsorOrder: cardData.sponsorOrder === 'brand-first' ? 'sponsor-first' : 'brand-first' })}
                  className="text-[10px] text-blue-500 font-bold hover:underline"
                >
                  {cardData.sponsorOrder === 'brand-first' ? 'Brand First ↑' : 'Sponsor First ↑'}
                </button>
              </div>

              <div className="flex items-center gap-4 p-2 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cardData.showSponsor}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateCardData({ showSponsor: e.target.checked })}
                    className="accent-blue-500"
                  />
                  <span className="text-xs text-zinc-400 font-bold">Enabled</span>
                </label>
              </div>

              {cardData.showSponsor && (
                <div className="space-y-4 p-3 bg-zinc-950/30 rounded-xl border border-zinc-800/50">
                  <div className="flex gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
                    {(['image', 'text'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => updateCardData({ sponsorType: type })}
                        className={clsx(
                          "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-tight rounded-md transition-all",
                          (cardData.sponsorType || 'image') === type 
                            ? "bg-blue-600 text-white shadow-sm" 
                            : "text-zinc-500 hover:text-zinc-300"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {cardData.sponsorType === 'image' ? (
                    <div className="space-y-3">
                      <div 
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = 'image/*'
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (ev) => updateCardData({ sponsorImage: ev.target?.result as string })
                              reader.readAsDataURL(file)
                            }
                          }
                          input.click()
                        }}
                        className="h-16 border border-dashed border-zinc-700 rounded-xl bg-zinc-900/50 flex items-center justify-center cursor-pointer hover:border-zinc-500 transition-all overflow-hidden"
                      >
                        {cardData.sponsorImage ? (
                          <img src={cardData.sponsorImage} alt="Sponsor" className="h-full object-contain p-2" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-zinc-500">
                            <Upload size={16} />
                            <span className="text-[10px] font-medium">Upload Logo</span>
                          </div>
                        )}
                      </div>
                      
                      {cardData.sponsorImage && (
                        <div className="space-y-2">
                          {/* Image Fit Mode */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Image Fit</span>
                            <div className="grid grid-cols-2 gap-1">
                              {(['cover', 'contain'] as const).map(mode => (
                                <button
                                  key={mode}
                                  onClick={() => updateCardData({ sponsorImageFit: mode })}
                                  className={`py-1.5 text-[10px] font-bold rounded-lg capitalize transition-all ${
                                    (cardData.sponsorImageFit || 'cover') === mode
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                  }`}
                                >
                                  {mode === 'cover' ? '⬛ Fill' : '🔲 Fit'}
                                </button>
                              ))}
                            </div>
                            <p className="text-[9px] text-zinc-600">
                              {(cardData.sponsorImageFit || 'cover') === 'cover' && 'Image fills the entire bar (may crop)'}
                              {cardData.sponsorImageFit === 'contain' && 'Image fits inside bar (letterboxed)'}
                            </p>
                          </div>
                          <Field label={`Logo Scale: ${(cardData.sponsorScale ?? 1.0).toFixed(2)}x`}>
                            <input
                              type="range" min="0.1" max="5.0" step="0.05"
                              value={cardData.sponsorScale ?? 1.0}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => updateCardData({ sponsorScale: parseFloat(e.target.value) })}
                              className="w-full accent-blue-500"
                            />
                          </Field>
                          <button
                            onClick={() => updateCardData({ sponsorImage: undefined })}
                            className="w-full py-1.5 text-[10px] text-red-500/80 font-bold hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            Clear Image
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Field label="Label Text (e.g. Sponsored by)">
                        <button 
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => updateCardData({ activeProperty: 'sponsor-sponsorLabelText' })}
                          className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950/50 border border-zinc-800/80 rounded-lg hover:border-blue-500/50 hover:bg-zinc-900 transition-all text-left group"
                        >
                          <span className="text-xs text-zinc-300 truncate">{cardData.sponsorLabelText || 'Sponsored by'}</span>
                          <span className="text-[10px] text-zinc-600 group-hover:text-blue-500 transition-colors">Edit Settings</span>
                        </button>
                      </Field>
                      <Field label="Sponsor Text">
                        <button 
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => updateCardData({ activeProperty: 'sponsor-sponsorText' })}
                          className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950/50 border border-zinc-800/80 rounded-lg hover:border-blue-500/50 hover:bg-zinc-900 transition-all text-left group"
                        >
                          <span className="text-xs text-zinc-300 truncate">{cardData.sponsorText || 'Sponsor Name'}</span>
                          <span className="text-[10px] text-zinc-600 group-hover:text-blue-500 transition-colors">Edit Settings</span>
                        </button>
                      </Field>
                    </div>
                  )}

                  <div className="p-3 bg-zinc-950/30 rounded-xl border border-zinc-800/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Sponsor QR Code</span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cardData.showSponsorQrCode || false}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateCardData({ showSponsorQrCode: e.target.checked })}
                          className="accent-blue-500"
                        />
                        <span className="text-[10px] text-zinc-500 font-bold">Show</span>
                      </label>
                    </div>
                    {cardData.showSponsorQrCode && (
                      <Field label="QR Data (URL/Text)">
                        <input 
                          type="text" 
                          value={cardData.sponsorQrCodeData || ''} 
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateCardData({ sponsorQrCodeData: e.target.value })} 
                          className={inputCls} 
                          placeholder="https://..."
                        />
                      </Field>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="BG Color">
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={cardData.sponsorBgColor || '#111111'} 
                          onChange={(e: ChangeEvent<HTMLInputElement>) => updateCardData({ sponsorBgColor: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                        />
                        <span className="text-[10px] text-zinc-500 font-mono uppercase">{cardData.sponsorBgColor || '#111111'}</span>
                      </div>
                    </Field>
                    <Field label={`Height: ${cardData.sponsorHeight || 5.5}cqw`}>
                      <input 
                        type="range" min="2" max="15" step="0.5" 
                        value={cardData.sponsorHeight || 5.5} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => updateCardData({ sponsorHeight: parseFloat(e.target.value) })}
                        className="w-full accent-blue-500" 
                      />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Watermark Group */}
      <div ref={groups.watermark} className="scroll-mt-4">
        <GroupHeader id="watermark" title="Watermark" />
        {openGroups.watermark && (
          <div className="p-3 bg-zinc-900/20 rounded-xl mb-4 space-y-4">
            <Field label="Watermark Text">
              <input type="text" value={cardData.watermarkText ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => updateCardData({ watermarkText: e.target.value })} className={inputCls} />
            </Field>
            <div className="flex gap-4">
              <Field label="Show">
                <label className="flex items-center h-full gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={style.showWatermark ?? false}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateStyle({ showWatermark: e.target.checked })}
                    className="accent-blue-500"
                  />
                  <span className="text-xs text-zinc-500">Enable</span>
                </label>
              </Field>
              <div className="flex-1">
                <Field label={`Opacity: ${(style.watermarkOpacity ?? 0.3).toFixed(2)}`}>
                  <input
                    type="range" min="0" max="1" step="0.05" value={style.watermarkOpacity ?? 0.3}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateStyle({ watermarkOpacity: Number(e.target.value) })}
                    className="w-full accent-blue-500 mt-1"
                  />
                </Field>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Date Badge Group */}
      <div ref={groups.date} className="scroll-mt-4">
        <GroupHeader id="date" title="Date Badge" />
        {openGroups.date && (
          <div className="p-3 bg-zinc-900/20 rounded-xl mb-4 space-y-4">
            <Field label="Date Text">
              <input 
                type="text" 
                value={cardData.dateText ?? ''} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => updateCardData({ dateText: e.target.value })} 
                className={inputCls} 
                placeholder="24 OCT 2024"
              />
            </Field>
            <Field label="Show">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cardData.showDate ?? false}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateCardData({ showDate: e.target.checked })}
                  className="accent-blue-500"
                />
                <span className="text-xs text-zinc-500">Enable Badge</span>
              </label>
            </Field>
            <div className="text-[10px] text-zinc-500 bg-blue-500/10 text-blue-400 p-2 rounded-lg border border-blue-500/20">
              Tip: Click the date badge on the preview to edit its colors and styling! Drag it to reposition.
            </div>
          </div>
        )}
      </div>

      {/* Graphics & Overlays */}
      <div ref={groups.graphics} className="scroll-mt-4">
        <GroupHeader id="graphics" title="Overlays & Graphics" />
        {openGroups.graphics && (
          <div className="p-3 bg-zinc-900/20 rounded-xl mb-4 space-y-3">
             <p className="text-[10px] text-zinc-500 mb-2">Import transparent PNGs and place them anywhere on the card.</p>
             <button 
               onClick={() => {
                 const input = document.createElement('input')
                 input.type = 'file'
                 input.accept = 'image/*'
                 input.onchange = (e: any) => {
                   const file = e.target.files?.[0]
                   if (file) {
                     const reader = new FileReader()
                     reader.onload = (ev) => addCustomLayer(ev.target?.result as string)
                     reader.readAsDataURL(file)
                   }
                 }
                 input.click()
               }}
               className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
             >
               <Upload size={14} />
               Add Custom Graphic
             </button>
             
             {cardData.customLayers?.map((layer: any, idx: number) => (
               <div key={layer.id} className="p-2 bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <img src={layer.src} className="w-8 h-8 object-contain rounded" alt="" />
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Graphic {idx + 1}</span>
                 </div>
                 <button 
                   onClick={() => removeCustomLayer(layer.id)}
                   className="p-1.5 text-zinc-500 hover:text-red-500"
                 >
                   <Upload size={14} />
                 </button>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* Privacy Group */}
      <div ref={groups.privacy} className="scroll-mt-4">
        <GroupHeader id="privacy" title="Privacy & Tools" />
        {openGroups.privacy && (
          <div className="p-3 bg-zinc-900/20 rounded-xl mb-4">
             <p className="text-[10px] text-zinc-500 mb-3 leading-relaxed">Add a movable blur box to censor faces or sensitive information.</p>
             <button 
               onClick={addBlurRegion}
               className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all border border-zinc-700/50 shadow-sm"
             >
               <Shield size={14} className="text-red-500" />
               Add Blur Region
             </button>
          </div>
        )}
      </div>

      {/* Styles & Layout */}
      <div ref={groups.colors} className="scroll-mt-4">
        <GroupHeader id="colors" title="Style Colors" />
        {openGroups.colors && (
          <div className="p-3 bg-zinc-900/20 rounded-xl mb-4 space-y-2">
            <ColorField label="Accent / bar color" styleKey="accentColor" />
            <ColorField label="Headline background" styleKey="backgroundColor" />
            <ColorField label="Headline text" styleKey="headlineColor" />
            <ColorField label="Subheadline text" styleKey="subheadlineColor" />
            <ColorField label="Brand bar background" styleKey="brandBarBg" />
            <ColorField label="Brand logo color" styleKey="brandColor" />
            <ColorField label="Photo divider" styleKey="photoDividerColor" />
          </div>
        )}
      </div>

      <div ref={groups.typography} className="scroll-mt-4">
        <GroupHeader id="typography" title="Typography" />
        {openGroups.typography && (
          <div className="p-3 bg-zinc-900/20 rounded-xl mb-4 space-y-4">
            <Field label="Font family">
              <select
                value={style.fontFamily}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => updateStyle({ fontFamily: e.target.value as any })}
                className={inputCls}
              >
                <option value="bengali">Noto Serif Bengali</option>
                <option value="bengali-sans">Noto Sans Bengali</option>
                <option value="display">Playfair Display</option>
                <option value="sans">System Sans</option>
              </select>
            </Field>
            <Field label="Headline weight">
              <select
                value={style.headlineFontWeight}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => updateStyle({ headlineFontWeight: Number(e.target.value) as any })}
                className={inputCls}
              >
                <option value={400}>Regular</option>
                <option value={700}>Bold</option>
                <option value={900}>Black</option>
              </select>
            </Field>
          </div>
        )}
      </div>

      <div ref={groups.layout} className="scroll-mt-4">
        <GroupHeader id="layout" title="Layout Settings" />
        {openGroups.layout && (
          <div className="p-3 bg-zinc-900/20 rounded-xl mb-4 space-y-4">
            <Field label="Accent bar position">
              <select
                value={style.accentBarPosition}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => updateStyle({ accentBarPosition: e.target.value as any })}
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
          </div>
        )}
      </div>
    </div>
  )
}
