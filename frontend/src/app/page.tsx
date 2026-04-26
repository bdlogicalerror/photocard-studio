'use client'
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, LayoutTemplate, Zap, Download } from 'lucide-react';
import { useLanguage } from '@/store/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-red-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      {/* Language Switcher Overlay */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:px-8">
        {/* Header / Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl mb-6 bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-600 bg-clip-text text-transparent pb-2">
            {t.heroTitle}
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-400 sm:text-xl font-medium">
            {t.heroSubtitle}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/studio"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-red-600 border border-transparent rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)]"
            >
              {t.studio}
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#features" className="text-sm font-semibold leading-6 text-zinc-300 hover:text-white transition-colors">
              {t.learnMore} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Mockup Showcase */}
        <div className="w-full max-w-5xl mx-auto mt-8 relative group perspective-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="relative rounded-2xl bg-zinc-900/50 border border-zinc-800 p-2 md:p-4 backdrop-blur-xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.01]">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/20 to-transparent pointer-events-none" />
            <div className="aspect-video w-full rounded-xl overflow-hidden relative bg-zinc-950">
               <Image 
                src="/hero-image.png"
                alt="Studio UI Mockup"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid gap-8 mt-32 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto">
          <div className="flex flex-col p-8 bg-zinc-900/40 rounded-3xl border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors group">
            <div className="flex items-center justify-center w-12 h-12 mb-6 rounded-xl bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t.feature1Title}</h3>
            <p className="text-zinc-400">{t.feature1Desc}</p>
          </div>
          <div className="flex flex-col p-8 bg-zinc-900/40 rounded-3xl border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors group">
            <div className="flex items-center justify-center w-12 h-12 mb-6 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t.feature2Title}</h3>
            <p className="text-zinc-400">{t.feature2Desc}</p>
          </div>
          <div className="flex flex-col p-8 bg-zinc-900/40 rounded-3xl border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors group sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-center w-12 h-12 mb-6 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t.feature3Title}</h3>
            <p className="text-zinc-400">{t.feature3Desc}</p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-40 w-full max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.howItWorksTitle}</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">{t.howItWorksDesc}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-red-500/0 via-red-500/30 to-blue-500/0 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-red-500/50 flex items-center justify-center text-xl font-bold text-red-500 mb-6 shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]">1</div>
              <h4 className="text-xl font-semibold text-white mb-3">{t.step1Title}</h4>
              <p className="text-zinc-400">{t.step1Desc}</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-purple-500/50 flex items-center justify-center text-xl font-bold text-purple-500 mb-6 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]">2</div>
              <h4 className="text-xl font-semibold text-white mb-3">{t.step2Title}</h4>
              <p className="text-zinc-400">{t.step2Desc}</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-blue-500/50 flex items-center justify-center text-xl font-bold text-blue-500 mb-6 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">3</div>
              <h4 className="text-xl font-semibold text-white mb-3">{t.step3Title}</h4>
              <p className="text-zinc-400">{t.step3Desc}</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-40 mb-20 w-full max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 to-transparent blur-3xl -z-10 rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">{t.ctaTitle}</h2>
          <Link
            href="/studio"
            className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-300 bg-zinc-100 text-zinc-950 rounded-full hover:bg-white hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            {t.launchStudio}
            <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-6 text-zinc-500">{t.ctaSubtitle}</p>
        </div>
        
        {/* Footer */}
        <footer className="w-full mt-20 pt-8 border-t border-zinc-800/50 text-center text-zinc-500 text-sm flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
          <p>© 2026 News Cards Studio. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">{t.privacyPolicy}</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">{t.termsOfService}</Link>
            <Link href="/contact" className="hover:text-zinc-300 transition-colors">{t.contactSupport}</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
