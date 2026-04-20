// src/app/api/news/drb/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

async function fetchImageFromPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    if (!res.ok) return null
    const html = await res.text()
    
    // Look for <div class="lead-newss">...<img src="...">...</div>
    // We'll target the first image inside lead-newss
    const leadNewsMatch = html.match(/class="lead-newss"[\s\S]*?<img [\s\S]*?src="([^"]+)"/)
    if (leadNewsMatch) {
      return leadNewsMatch[1]
    }
    
    // Fallback: look for any og:image
    const ogMatch = html.match(/property="og:image" content="([^"]+)"/)
    return ogMatch ? ogMatch[1] : null
  } catch (e) {
    console.error(`Error fetching DRB image from ${url}:`, e)
    return null
  }
}

export async function GET() {
  try {
    const rssUrl = "https://www.drb.news/feed/"
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
    const rawItems = []
    let count = 0
    let match

    while ((match = itemRegex.exec(xml)) !== null && count < 15) { // Limit to 15 for scraping performance
      const entry = match[1]

      const tMatch = entry.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || entry.match(/<title>([\s\S]*?)<\/title>/)
      const headline = tMatch ? tMatch[1].trim() : "Untitled"

      // User explicitly asked for <guid isPermaLink="false">
      const gMatch = entry.match(/<guid isPermaLink="false">([\s\S]*?)<\/guid>/)
      const articleUrl = gMatch ? gMatch[1].trim() : ""

      const dMatch = entry.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
      const pubDate = dMatch ? dMatch[1].trim() : ""

      const catMatch = entry.match(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/) || entry.match(/<category>([\s\S]*?)<\/category>/)
      const category = catMatch ? catMatch[1].trim() : "General"

      rawItems.push({ headline, pubDate, articleUrl, category })
      count++
    }

    // Now, parallel fetch images for these items
    const items = await Promise.all(rawItems.map(async (item) => {
      const imageUrl = item.articleUrl ? await fetchImageFromPage(item.articleUrl) : null
      return { ...item, imageUrl }
    }))

    return NextResponse.json({ success: true, items })
  } catch (error: any) {
    console.error('DRB news fetch error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
