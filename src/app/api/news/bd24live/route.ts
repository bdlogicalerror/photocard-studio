import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rssUrl = "https://www.bd24live.com/bangla/feed/"
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

      // Extract title
      const tMatch = entry.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || entry.match(/<title>([\s\S]*?)<\/title>/)
      const headline = tMatch ? tMatch[1].trim() : "Untitled"

      // Robust image extraction
      let imageUrl = null
      
      // 1. Try media:content or media:thumbnail
      const mediaMatch = entry.match(/<(?:media:content|media:thumbnail)[^>]+url=["']([^"']+)["']/i)
      if (mediaMatch) {
         imageUrl = mediaMatch[1].trim()
      } 
      
      // 2. Try enclosure
      if (!imageUrl) {
        const enclosureMatch = entry.match(/<enclosure[^>]+url=["']([^"']+)["']/i)
        if (enclosureMatch) imageUrl = enclosureMatch[1].trim()
      }

      // 3. Fallback to img src in description or content:encoded
      if (!imageUrl) {
        const imgMatch = entry.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp|jfif|gif|svg)(?:\?[^"']*)?)["']/i)
        if (imgMatch) imageUrl = imgMatch[1].trim()
      }

      // Extract pubDate
      const dMatch = entry.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
      const pubDate = dMatch ? dMatch[1].trim() : ""

      items.push({ headline, imageUrl, pubDate })
      count++
    }

    return NextResponse.json({ success: true, items })
  } catch (error: any) {
    console.error("BD24Live fetch error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
