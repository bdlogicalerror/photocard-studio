'use client'
import StaticLayout from '@/components/StaticLayout';
import { useLanguage } from '@/store/LanguageContext';
import { Mail, Twitter, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <StaticLayout title={t.contactTitle}>
      <div className="space-y-12 text-zinc-300 leading-relaxed">
        <section>
          <p className="text-xl text-zinc-400 font-medium">
            {t.contactDesc}
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-red-600/50 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t.emailUs}</h3>
            <p className="text-red-500 font-semibold text-lg">support@photocardstudio.com</p>
          </div>

          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Twitter size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t.followUs}</h3>
            <p className="text-blue-500 font-semibold text-lg">@PhotocardStudio</p>
          </div>
        </div>

        <section className="bg-zinc-900/30 p-10 rounded-3xl border border-dashed border-zinc-800 text-center">
          <MessageSquare className="mx-auto mb-4 text-zinc-600" size={32} />
          <h2 className="text-xl font-bold text-white mb-2">Open Source</h2>
          <p className="max-w-md mx-auto text-zinc-500">
            News Cards Studio is built by journalists for journalists. If you are a developer, 
            you can contribute to our GitHub repository.
          </p>
        </section>
      </div>
    </StaticLayout>
  );
}
