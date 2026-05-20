'use client';

import { ThemeProvider as NextThemesProvider, useTheme, type ThemeProviderProps } from 'next-themes';
import { MotionConfig } from 'framer-motion';
import { useEffect } from 'react';

function ThemeCookieSync() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (resolvedTheme) {
      document.cookie = `theme=${resolvedTheme}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [resolvedTheme]);
  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <MotionConfig reducedMotion="user">
        <ThemeCookieSync />
        {children}
      </MotionConfig>
    </NextThemesProvider>
  );
}
