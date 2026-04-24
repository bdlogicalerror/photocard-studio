'use client'
import StaticLayout from '@/components/StaticLayout';
import { useLanguage } from '@/store/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <StaticLayout title={t.termsTitle}>
      <div className="space-y-8 text-zinc-300 leading-relaxed">
        <section>
          <p className="text-xl text-zinc-400 font-medium italic border-l-4 border-blue-600 pl-6 py-2 bg-blue-600/5 rounded-r-xl">
            {t.termsContent}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. Acceptable Use</h2>
          <p>
            You agree to use this tool for creating news graphics that are truthful and not misleading. 
            Do not use this tool to create misinformation or harmful content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. Copyright</h2>
          <p>
            You retain all rights to the images you create. However, you must ensure that you have 
            the legal right to use any background images or logos you upload to the studio.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. Disclaimer</h2>
          <p>
            The service is provided "as is". We are not responsible for any loss of data or 
            damages arising from the use of this software.
          </p>
        </section>
      </div>
    </StaticLayout>
  );
}
