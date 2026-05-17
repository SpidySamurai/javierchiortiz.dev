// src/components/ui/ThemeToggle.tsx
'use client';
import { useTheme } from 'next-themes';
import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  // Montaje seguro para evitar mismatch (opcional si next-themes maneja hydration mismatch, pero buena práctica)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-6 w-12 bg-gray-200 rounded-full" />; // Placeholder para evitar layout shift

  const isLight = resolvedTheme === 'light';

  return (
    <Switch
      checked={isLight}
      onChange={(checked: boolean) => setTheme(checked ? 'light' : 'dark')}
      className="group inline-flex items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600 h-6 w-12"
    >
      <span className="rounded-full bg-white shadow-lg transition group-data-checked:translate-x-5 sm:group-data-checked:translate-x-6 size-4 sm:size-5 translate-x-1"></span>
    </Switch>
  );
}
