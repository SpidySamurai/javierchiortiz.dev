// src/context/ThemeProvider.tsx
'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';
type AppliedTheme = 'dark' | 'light';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  initialThemePreference: Theme;
  initialAppliedTheme: AppliedTheme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark' || value === 'system';

const resolveAppliedTheme = (theme: Theme): AppliedTheme => {
  if (theme === 'dark') return 'dark';
  if (theme === 'light') return 'light';
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function ThemeProvider({ children, initialThemePreference, initialAppliedTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialThemePreference);
  const [appliedTheme, setAppliedTheme] = useState<AppliedTheme>(initialAppliedTheme);

  // Primer render: sincroniza con localStorage si tiene preferencias diferentes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('theme');
    if (stored && isTheme(stored)) {
      setThemeState(stored);
    }
  }, []);

  // Escucha cambios en otras pestañas
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'theme' && event.newValue && isTheme(event.newValue)) {
        setThemeState(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Calcula qué tema aplicar cuando cambia la preferencia
  useEffect(() => {
    setAppliedTheme(resolveAppliedTheme(theme));
  }, [theme]);

  // Si el usuario usa "system", escucha cambios del SO
  useEffect(() => {
    if (typeof window === 'undefined' || theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => {
      setAppliedTheme(event.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [theme]);

  // Aplica tema y persiste preferencia + resultado
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', appliedTheme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore
    }
    document.cookie = `portfolio:theme=${theme}; path=/; max-age=31536000`;
    document.cookie = `portfolio:theme-applied=${appliedTheme}; path=/; max-age=31536000`;
  }, [theme, appliedTheme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
