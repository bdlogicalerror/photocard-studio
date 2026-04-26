import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return new Response('Missing url parameter', { status: 400 })
  }

  // Basic security: only allow http/https URLs
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return new Response('Invalid URL', { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': new URL(url).origin,
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return new Response(`Failed to fetch image: ${response.status}`, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = await response.arrayBuffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=60, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error: any) {
    console.error('Image proxy error:', error.message)
    return new Response('Failed to proxy image', { status: 502 })
  }
}
