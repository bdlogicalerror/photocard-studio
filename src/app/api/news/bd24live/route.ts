import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'feedparser/2.0',
]

async function fetchFeed(url: string): Promise<string> {
  for (const ua of USER_AGENTS) {
    try {
      const res = await fetch(url, {
        cache: 'no-store',
        headers: {
          'User-Agent': ua,
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        },
        signal: AbortSignal.timeout(8000),
      })
      if (res.ok) {
        const text = await res.text()
        // Make sure it's actually XML/RSS, not an HTML error page
        if (text.trim().startsWith('<') && text.includes('<item>')) {
          return text
        }
      }
    } catch (_) {
      // try next user-agent
    }
  }
  throw new Error('BD24Live feed is currently unavailable (server error). Please try again later.')
}

export async function GET() {
  try {
    const rssUrl = "https://www.bd24live.com/bangla/feed/"
    const xml = await fetchFeed(rssUrl)

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

      // Robust image extraction — try multiple tag patterns
      let imageUrl: string | null = null
      const mediaMatch = entry.match(/<(?:media:content|media:thumbnail)[^>]+url=["']([^"']+)["']/i)
      if (mediaMatch) {
        imageUrl = mediaMatch[1].trim()
      } else {
        const enclosureMatch = entry.match(/<enclosure[^>]+url=["']([^"']+)["']/i)
        if (enclosureMatch) {
          imageUrl = enclosureMatch[1].trim()
        } else {
          // Fallback: img src inside description or content:encoded
          const imgMatch = entry.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp|jfif|gif)(?:\?[^"']*)?)['"]/i)
          if (imgMatch) imageUrl = imgMatch[1].trim()
        }
      }

      // Extract pubDate
      const dMatch = entry.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
      const pubDate = dMatch ? dMatch[1].trim() : ""

      const lMatch = entry.match(/<link>([\s\S]*?)<\/link>/)
      const articleUrl = lMatch ? lMatch[1].trim() : ""

      items.push({ headline, imageUrl, pubDate, articleUrl })
      count++
    }

    if (items.length === 0) {
      throw new Error('No news items found in the BD24Live feed.')
    }

    return NextResponse.json({ success: true, items })
  } catch (error: any) {
    console.error("BD24Live fetch error:", error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
