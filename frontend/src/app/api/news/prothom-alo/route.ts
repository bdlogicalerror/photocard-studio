// src/app/api/news/prothom-alo/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rssUrl = "https://www.prothomalo.com/stories.rss"
    const response = await fetch(rssUrl, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
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

      const tMatch = entry.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || entry.match(/<title>([\s\S]*?)<\/title>/)
      const headline = tMatch ? tMatch[1].trim() : "Untitled"

      const iMatch = entry.match(/<media:content [^>]*url="([\s\S]*?)"/) || entry.match(/<media:thumbnail [^>]*url="([\s\S]*?)"/)
      const imageUrl = iMatch ? iMatch[1].trim() : null

      const dMatch = entry.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
      const pubDate = dMatch ? dMatch[1].trim() : ""

      const lMatch = entry.match(/<link>([\s\S]*?)<\/link>/)
      const articleUrl = lMatch ? lMatch[1].trim() : ""

      const catMatch = entry.match(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/) || entry.match(/<category>([\s\S]*?)<\/category>/)
      const category = catMatch ? catMatch[1].trim() : "General"

      items.push({ headline, imageUrl, pubDate, articleUrl, category })
      count++
    }

    return NextResponse.json({ success: true, items })
  } catch (error: any) {
    console.error('Prothom Alo news fetch error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
