// src/components/ui/ThemeToggle.tsx
'use client';
import { useTheme } from '@/context/ThemeProvider';
import { Switch } from '@headlessui/react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <Switch
      checked={isLight}
      onChange={(checked: boolean) => setTheme(checked ? 'light' : 'dark')}
      className="group inline-flex items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600 h-6 w-12"
    >
      <span className="rounded-full bg-white shadow-lg transition group-data-checked:translate-x-5 sm:group-data-checked:translate-x-6 size-4 sm:size-5 translate-x-1"></span>
    </Switch>
  )
}