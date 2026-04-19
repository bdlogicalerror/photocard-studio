// src/app/api/news/abp-live/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rssUrl = "https://bengali.abplive.com/home/feed"
    const response = await fetch(rssUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      }
    })
    
    if (!response.ok) {
        throw new Error(`Failed to fetch RSS: ${response.status}`)
    }
    
    const xml = await response.text()

    // Extract <item> entries using regex
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    const items = []
    let count = 0
    let match

    while ((match = itemRegex.exec(xml)) !== null && count < 20) {
      const entry = match[1]

      // Extract title
      const tMatch = entry.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || entry.match(/<title>([\s\S]*?)<\/title>/)
      const headline = tMatch ? tMatch[1].trim() : "Untitled"

      // Extract link (articleUrl)
      const lMatch = entry.match(/<link>([\s\S]*?)<\/link>/) || entry.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/)
      const articleUrl = lMatch ? lMatch[1].trim() : ""

      // Extract image URL from media:thumbnail
      const iMatch = entry.match(/<media:thumbnail [^>]*url="([\s\S]*?)"/)
      const imageUrl = iMatch ? iMatch[1].trim() : null

      // Extract pubDate
      const dMatch = entry.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || entry.match(/<pubDate><!\[CDATA\[([\s\S]*?)\]\]><\/pubDate>/)
      const pubDate = dMatch ? dMatch[1].trim() : ""

      items.push({ headline, imageUrl, pubDate, articleUrl })
      count++
    }

    return NextResponse.json({ success: true, items })
  } catch (error: any) {
    console.error('ABP Live fetch error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
