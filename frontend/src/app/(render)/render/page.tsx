'use client'

import React, { useEffect, useState } from 'react'
import CardPreview from '@/components/studio/CardPreview'
import { BUILT_IN_TEMPLATES } from '@/lib/types'

export default function RenderPage() {
  const [data, setData] = useState<any>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    console.log('RenderPage: mounted');
    // Check if data is already injected
    if (typeof window !== 'undefined' && (window as any).__INJECTED_CARD_DATA__) {
      console.log('RenderPage: Found pre-injected data');
      setData((window as any).__INJECTED_CARD_DATA__)
    }

    // Listen for the event indicating data is ready
    const handleDataReady = () => {
      console.log('RenderPage: Received render-data-ready event');
      if ((window as any).__INJECTED_CARD_DATA__) {
        console.log('RenderPage: Data found after event');
        const rawData = (window as any).__INJECTED_CARD_DATA__;
        
        // Helper to fix proxied URLs
        const fixProxyUrl = (url: string | null | undefined) => {
          if (url && url.includes('/api/proxy-image')) {
            const urlMatch = url.match(/url=([^&]+)/);
            if (urlMatch) {
              return `/api/proxy-image?url=${urlMatch[1]}&t=${Date.now()}`;
            }
          }
          return url;
        };

        // Sanitize all potential image fields
        if (rawData.photos) {
          rawData.photos = rawData.photos.map((p: any) => ({ ...p, src: fixProxyUrl(p.src) }));
        }
        if (rawData.brandImage) rawData.brandImage = fixProxyUrl(rawData.brandImage);
        if (rawData.sponsorImage) rawData.sponsorImage = fixProxyUrl(rawData.sponsorImage);
        if (rawData.customLayers) {
          rawData.customLayers = rawData.customLayers.map((l: any) => ({ ...l, src: fixProxyUrl(l.src) }));
        }
        
        setData(rawData)
      } else {
        console.error('RenderPage: Event received but __INJECTED_CARD_DATA__ is missing!');
      }
    }

    window.addEventListener('render-data-ready', handleDataReady)
    
    // Also support legacy searchParams (base64) just in case
    const searchParams = new URLSearchParams(window.location.search)
    const baseData = searchParams.get('data')
    if (baseData && !data) {
       console.log('RenderPage: Found data in query params');
       try {
         setData(JSON.parse(atob(baseData)))
       } catch(e) {
         console.error('RenderPage: Failed to parse query param data', e);
       }
    }

    return () => window.removeEventListener('render-data-ready', handleDataReady)
  }, [])

  useEffect(() => {
    if (data) {
      console.log('RenderPage: Data state updated, setting ready in 1.5s');
      // Small delay to ensure images/fonts are painted in the DOM
      const timer = setTimeout(() => {
        console.log('RenderPage: Setting ready=true');
        setReady(true);
      }, 1500)
      return () => clearTimeout(timer);
    }
  }, [data])

  if (!data) {
    return <div id="waiting">Waiting for payload...</div>
  }

  const baseTemplate = BUILT_IN_TEMPLATES.find((t) => t.id === data.template_id) || BUILT_IN_TEMPLATES[0] || { id: 'default', style: {}, layout: 'single-top' }
  const template = { ...baseTemplate }

  return (
    <div 
      className="w-screen h-screen flex items-center justify-center bg-transparent m-0 p-0 overflow-hidden"
      data-render-complete={ready ? "true" : "false"}
    >
      <div 
        style={{ 
          width: data.variant === 'portrait' ? 1080 : data.variant === 'landscape' ? 1200 : 1080,
          height: data.variant === 'portrait' ? 1920 : data.variant === 'landscape' ? 630 : 1080
        }} 
      >
        <CardPreview 
          template={template} 
          cardData={data} 
          forExport={true}
          isGuest={false} // Backend adds guest branding
        />
      </div>
    </div>
  )
}
