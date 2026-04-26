'use client'

import React, { useEffect, useState } from 'react'
import CardPreview from '@/components/studio/CardPreview'
import { BUILT_IN_TEMPLATES } from '@/lib/types'

export default function RenderPage() {
  const [data, setData] = useState<any>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Check if data is already injected
    if (typeof window !== 'undefined' && (window as any).__INJECTED_CARD_DATA__) {
      setData((window as any).__INJECTED_CARD_DATA__)
    }

    // Listen for the event indicating data is ready
    const handleDataReady = () => {
      if ((window as any).__INJECTED_CARD_DATA__) {
        setData((window as any).__INJECTED_CARD_DATA__)
      }
    }

    window.addEventListener('render-data-ready', handleDataReady)
    
    // Also support legacy searchParams (base64) just in case
    const searchParams = new URLSearchParams(window.location.search)
    const baseData = searchParams.get('data')
    if (baseData && !data) {
       try {
         setData(JSON.parse(atob(baseData)))
       } catch(e) {}
    }

    return () => window.removeEventListener('render-data-ready', handleDataReady)
  }, [])

  useEffect(() => {
    if (data) {
      // Small delay to ensure images/fonts are painted in the DOM
      setTimeout(() => setReady(true), 1500)
    }
  }, [data])

  if (!data) {
    return <div id="waiting">Waiting for payload...</div>
  }

  const baseTemplate = BUILT_IN_TEMPLATES.find((t) => t.id === data.template_id) || BUILT_IN_TEMPLATES[0]
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
