'use client';

import React, { useEffect, useMemo, useState, useCallback, createContext, useContext } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { AvailableLanguage, LANGUAGES } from '@/lib/i18n';

interface LanguageContextValue {
  language: AvailableLanguage;
  setLanguage: (lng: AvailableLanguage) => void;
  languages: AvailableLanguage[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AvailableLanguage>('es');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('portfolio:lang') as AvailableLanguage | null) : null;
    if (stored && LANGUAGES.includes(stored)) {
      setLanguageState(stored);
      i18n.changeLanguage(stored).catch(() => undefined);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLanguage = useCallback((lng: AvailableLanguage) => {
    setLanguageState(lng);
    localStorage.setItem('portfolio:lang', lng);
    document.documentElement.lang = lng;
    void i18n.changeLanguage(lng);
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage, languages: LANGUAGES }),
    [language, setLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
