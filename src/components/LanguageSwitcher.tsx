'use client'
import { useLanguage } from '@/store/LanguageContext';
import { Languages } from 'lucide-react';
import clsx from 'clsx';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full p-1 shadow-lg">
      <button
        onClick={() => setLanguage('en')}
        className={clsx(
          "px-3 py-1 text-[10px] font-bold rounded-full transition-all uppercase tracking-wider",
          language === 'en' ? "bg-red-600 text-white" : "text-zinc-500 hover:text-zinc-300"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('bn')}
        className={clsx(
          "px-3 py-1 text-[10px] font-bold rounded-full transition-all uppercase tracking-wider",
          language === 'bn' ? "bg-red-600 text-white" : "text-zinc-500 hover:text-zinc-300"
        )}
      >
        BN
      </button>
    </div>
  );
}
