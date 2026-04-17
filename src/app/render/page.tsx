import React from 'react'
import CardPreview from '@/components/CardPreview'
import { BUILT_IN_TEMPLATES } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default function RenderPage({
  searchParams,
}: {
  searchParams: { data?: string; templateId?: string; style?: string }
}) {
  const { data, templateId, style } = searchParams

  if (!data || !templateId) {
    return <div>Missing data or templateId</div>
  }

  try {
    const cardData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
    const baseTemplate = BUILT_IN_TEMPLATES.find((t) => t.id === templateId) || BUILT_IN_TEMPLATES[0]
    const styleOverrides = style ? JSON.parse(Buffer.from(style, 'base64').toString('utf-8')) : {}
    const template = { ...baseTemplate, style: { ...baseTemplate.style, ...styleOverrides } }

    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white m-0 p-0 overflow-hidden">
        <div style={{ width: 1080 }} id="render-container">
          <CardPreview template={template} cardData={cardData} forExport />
        </div>
      </div>
    )
  } catch (err) {
    console.error('Failed to parse:', err)
    return <div>Failed to parse parameters</div>
  }
}
