// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { LanguageProvider } from '@/store/LanguageContext'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'News Cards Studio',
  description: 'Bengali news photocard generator with multiple templates',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;700;900&family=Noto+Sans+Bengali:wght@400;700&family=Playfair+Display:wght@400;700;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-zinc-950 text-white antialiased min-h-screen flex flex-col">
        <Toaster richColors position="top-center" />
        <Providers>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  )
}
