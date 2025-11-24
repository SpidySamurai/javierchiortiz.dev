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

type LanguageProviderProps = {
  children: React.ReactNode;
  initialLanguage: AvailableLanguage;
};

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<AvailableLanguage>(initialLanguage);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('portfolio:lang') as AvailableLanguage | null;
    if (stored && LANGUAGES.includes(stored)) {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem('portfolio:lang', language);
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.cookie = `portfolio:lang=${language}; path=/; max-age=31536000`;
    }
    void i18n.changeLanguage(language);
  }, [language]);

  const setLanguage = useCallback((lng: AvailableLanguage) => {
    setLanguageState(lng);
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
