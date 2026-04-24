'use client'
import StaticLayout from '@/components/StaticLayout';
import { useLanguage } from '@/store/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <StaticLayout title={t.privacyTitle}>
      <div className="space-y-8 text-zinc-300 leading-relaxed">
        <section>
          <p className="text-xl text-zinc-400 font-medium italic border-l-4 border-red-600 pl-6 py-2 bg-red-600/5 rounded-r-xl">
            {t.privacyContent}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">{t.lastUpdated}</h2>
          <p>April 24, 2026</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. Data Collection</h2>
          <p>
            We do not collect any personal data. All images you upload are processed locally in your browser 
            and are never uploaded to our servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. Local Storage</h2>
          <p>
            We use browser Local Storage to save your preferences and current card data so you can continue 
            your work later. This data stays on your computer.
          </p>
        </section>
      </div>
    </StaticLayout>
  );
}
