import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let browser
  try {
    const { cardData, templateId, styleOverrides } = await request.json()
    if (!cardData || !templateId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const dataBase64 = Buffer.from(JSON.stringify(cardData), 'utf-8').toString('base64')
    const styleBase64 = styleOverrides ? Buffer.from(JSON.stringify(styleOverrides), 'utf-8').toString('base64') : ''
    
    // In Docker, we use chromium via PUPPETEER_EXECUTABLE_PATH
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH

    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })

    const page = await browser.newPage()
    
    // Next.js runs on this port
    const port = process.env.PORT || 3000
    const targetUrl = `http://localhost:${port}/render?data=${encodeURIComponent(dataBase64)}&templateId=${templateId}&style=${encodeURIComponent(styleBase64)}`
    
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 3 })
    await page.goto(targetUrl, { waitUntil: 'networkidle0' })
    
    const element = await page.$('#render-container')
    if (!element) {
      return NextResponse.json({ error: 'Preview element not found' }, { status: 500 })
    }

    const screenshotBuffer = await element.screenshot()

    return new Response(screenshotBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
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
