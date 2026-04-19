import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let browser
  try {
    const { cardData, templateId, styleOverrides, permanent = false } = await request.json()
    if (!cardData || !templateId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // URL Rewriting for Tunnel/Internal Networking:
    // If photos point to our own public domain, rewrite them to localhost for Puppeteer.
    const host = request.headers.get('host') || ''
    const port = process.env.PORT || 3000
    const internalOrigin = `http://127.0.0.1:${port}`

    if (cardData.photos && Array.isArray(cardData.photos)) {
      cardData.photos = cardData.photos.map((p: any) => {
        if (p.src && p.src.startsWith('http') && (p.src.includes(host) || (host && p.src.includes(host.split(':')[0])))) {
          try {
            const urlObj = new URL(p.src)
            p.src = `${internalOrigin}${urlObj.pathname}${urlObj.search}${urlObj.hash}`
          } catch (e) {}
        }
        return p
      })
    }

    const dataBase64 = Buffer.from(JSON.stringify(cardData), 'utf-8').toString('base64')
    const styleBase64 = styleOverrides ? Buffer.from(JSON.stringify(styleOverrides), 'utf-8').toString('base64') : ''
    
    // In Docker, we use chromium via PUPPETEER_EXECUTABLE_PATH
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH

    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--hide-scrollbars'
      ],
    })

    const page = await browser.newPage()
    
    // Use 127.0.0.1 for more reliable internal container networking
    const targetUrl = `http://127.0.0.1:${port}/render?data=${encodeURIComponent(dataBase64)}&templateId=${templateId}&style=${encodeURIComponent(styleBase64)}`
    
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 3 })
    await page.goto(targetUrl, { waitUntil: 'networkidle0' })
    
    const element = await page.$('#render-container')
    if (!element) {
      return NextResponse.json({ error: 'Preview element not found' }, { status: 500 })
    }

    const screenshotBuffer = await element.screenshot()

    const filename = `${uuidv4()}.png`
    let filePath: string
    let previewUrl: string

    if (permanent) {
      const exportDist = path.join(process.cwd(), 'public', 'exports')
      try {
        await fs.mkdir(exportDist, { recursive: true })
      } catch (e) {}
      filePath = path.join(exportDist, filename)
      previewUrl = `/exports/${filename}`
    } else {
      const tmpDir = os.tmpdir()
      filePath = path.join(tmpDir, filename)
      previewUrl = `/api/tmp/${filename}`
    }

    console.log(`Writing photocard to: ${filePath}`)
    await fs.writeFile(filePath, screenshotBuffer as any)

    return NextResponse.json({ 
      success: true, 
      filename,
      url: previewUrl,
      data: Buffer.from(screenshotBuffer as any).toString('base64')
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    console.error('Image generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
