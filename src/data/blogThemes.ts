export interface BlogTheme {
  bg: string;
  surface: string;
  primary: string;
  primaryLight?: string;
  onSurface?: string;
}

export const BLOG_THEMES: Record<string, BlogTheme> = {
  default: {
    bg: 'var(--ds-bg)',
    surface: 'var(--ds-surface)',
    primary: 'var(--ds-primary)',
  },
  pilots: {
    bg: '#0a0a0a',
    surface: '#111111',
    primary: '#f0c040',
    primaryLight: '#7a5c00',
    onSurface: '#f0f0f0',
  },
  spiderman: {
    bg: '#0e0c14',
    surface: '#160f22',
    primary: '#cc1a1a',
    primaryLight: '#9e0000',
    onSurface: '#ede8f0',
  },
  karate: {
    bg: '#080808',
    surface: '#111010',
    primary: '#c82020',
    primaryLight: '#9e0000',
    onSurface: '#f0eeec',
  },
};

export function getTheme(key?: string): BlogTheme {
  return BLOG_THEMES[key ?? 'default'] ?? BLOG_THEMES['default'];
}
