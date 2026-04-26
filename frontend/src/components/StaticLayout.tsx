'use client'
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/store/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function StaticLayout({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode 
}) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-red-500/30 flex flex-col">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">{t.backToHome}</span>
          </Link>
          
          <div className="flex items-center gap-4">
             <LanguageSwitcher />
             <Link href="/studio" className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all">
                {t.studio}
             </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tight bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
          {title}
        </h1>
        
        <div className="prose prose-invert prose-zinc max-w-none">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-zinc-800/50 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-zinc-500 text-sm">
          <p>© 2026 News Cards Studio. All rights reserved.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">{t.privacyPolicy}</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">{t.termsOfService}</Link>
            <Link href="/contact" className="hover:text-zinc-300 transition-colors">{t.contactSupport}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
