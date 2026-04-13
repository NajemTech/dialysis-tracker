import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { translations, type TranslationKey } from '@/constants/translations';
import type { Language } from '@/types';

interface LanguageContextType {
  lang: Language;
  t: TranslationKey;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('dt-language');
    return (saved === 'ar' ? 'ar' : 'en') as Language;
  });

  const setLanguage = useCallback((newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('dt-language', newLang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const value: LanguageContextType = {
    lang,
    t: translations[lang],
    setLanguage,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
