// src/components/studio/EditorPanel/PropertiesTab.tsx
'use client'
import React from 'react'
import { useStore, useActiveTemplate } from '@/store/useStore'
import { Upload, Shield, EyeOff } from 'lucide-react'
import clsx from 'clsx'
import { Section } from './UI/Section'
import { Field, inputCls, textareaCls } from './UI/Field'
import { ColorField } from './UI/ColorField'
import { SliderField } from './UI/SliderField'
import { PhotoUploader } from './UI/PhotoUploader'

export function PropertiesTab() {
  const { 
    cardData, updateCardData, updateStyle, addBlurRegion, 
    setSponsorLogo, addCustomGraphic, updateCustomLayer, removeCustomLayer, addCustomLayer 
  } = useStore()
  const template = useActiveTemplate()
  const style = template.style

  return (
    <div className="p-5 flex flex-col gap-2">
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
        <div className="mb-4">
          <SliderField label="Headline size" styleKey="headlineFontSize" min={20} max={100} />
        </div>

        <Field label="Subheadline">
          <input type="text" value={cardData.subheadline} onChange={e => updateCardData({ subheadline: e.target.value })} className={inputCls} />
        </Field>
        <div className="mb-4">
          <SliderField label="Subheadline size" styleKey="subheadlineFontSize" min={12} max={60} />
        </div>
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

      <Section title="Privacy & Tools">
         <p className="text-[10px] text-zinc-500 mb-3 leading-relaxed">Add a movable blur box to censor faces, names, or sensitive information in the news photo.</p>
         <button 
           onClick={addBlurRegion}
           className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all border border-zinc-700/50 shadow-sm"
         >
           <Shield size={14} className="text-red-500" />
           Add Blur Region
         </button>
      </Section>

      <Section title="Overlays & Graphics">
         <p className="text-[10px] text-zinc-500 mb-3 leading-relaxed">Import transparent PNGs and place them anywhere on the card. Great for badges, special icons, or floating elements.</p>
         <div className="flex flex-col gap-3">
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
             className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
           >
             <Upload size={14} />
             Add Custom Graphic
           </button>
           
           {cardData.customLayers?.map((layer, idx) => (
             <div key={layer.id} className="bg-zinc-900/50 p-3 rounded border border-zinc-800 flex flex-col gap-2">
               <div className="flex items-center justify-between">
                 <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Graphic {idx + 1}</span>
                 <button onClick={() => removeCustomLayer(layer.id)} className="text-red-500 hover:text-red-400">
                   <EyeOff size={12} />
                 </button>
               </div>
               <Field label={`Opacity: ${(layer.opacity ?? 1).toFixed(2)}`}>
                 <input
                   type="range" min="0" max="1" step="0.05" value={layer.opacity ?? 1}
                   onChange={e => updateCustomLayer(layer.id, { opacity: Number(e.target.value) })}
                   className="w-full accent-blue-500"
                 />
               </Field>
             </div>
           ))}
         </div>
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
        <Field label="Sponsor Logo (Fixed Bottom)">
          <div className="flex flex-col gap-3 mt-1">
            <div 
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (ev) => setSponsorLogo(ev.target?.result as string)
                    reader.readAsDataURL(file)
                  }
                }
                input.click()
              }}
              className="h-16 border border-dashed border-zinc-700 rounded-xl bg-zinc-900/50 flex items-center justify-center cursor-pointer hover:border-zinc-500 hover:bg-zinc-900 transition-all overflow-hidden"
            >
              {cardData.sponsorLogo ? (
                <img src={cardData.sponsorLogo} alt="Sponsor" className="h-full object-contain p-2" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-zinc-500">
                  <Upload size={16} />
                  <span className="text-[10px] font-medium">Upload Logo</span>
                </div>
              )}
            </div>
            
            {cardData.sponsorLogo && (
              <div className="space-y-3 p-3 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                <Field label={`Scale: ${(cardData.sponsorLogoScale ?? 1.0).toFixed(2)}x`}>
                  <input 
                    type="range" min="0.1" max="2.0" step="0.05" 
                    value={cardData.sponsorLogoScale ?? 1.0} 
                    onChange={e => updateCardData({ sponsorLogoScale: parseFloat(e.target.value) })}
                    className="w-full accent-blue-500" 
                  />
                </Field>
                
                <Field label="Alignment">
                  <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
                    {(['left', 'center', 'right'] as const).map(align => (
                      <button
                        key={align}
                        onClick={() => updateCardData({ sponsorLogoAlign: align })}
                        className={clsx(
                          "py-1.5 text-[10px] font-bold uppercase tracking-tight rounded-md transition-all",
                          (cardData.sponsorLogoAlign || 'right') === align 
                            ? "bg-blue-600 text-white shadow-sm" 
                            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                        )}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </Field>

                <button 
                  onClick={() => setSponsorLogo(undefined)}
                  className="w-full py-2 text-[10px] text-red-500/80 font-bold hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                >
                  Remove Logo
                </button>
              </div>
            )}
          </div>
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
  )
}
