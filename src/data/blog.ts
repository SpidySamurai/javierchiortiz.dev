export interface BlogPost {
  slug: string;
  date: string;
  category: string;
  readTime: string;
  coverTheme: 'pilots' | 'spiderman' | 'karate';
  theme?: string;
  youtubeId?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'twenty-one-pilots',
    date: 'April 2026',
    category: 'Music',
    readTime: '6 min read',
    coverTheme: 'pilots',
    theme: 'pilots',
    youtubeId: 'bYsCJv7Pc0s',
  },
  {
    slug: 'spider-man',
    date: 'April 2026',
    category: 'Culture',
    readTime: '7 min read',
    coverTheme: 'spiderman',
    theme: 'spiderman',
  },
  {
    slug: 'karate',
    date: 'April 2026',
    category: 'Life',
    readTime: '5 min read',
    coverTheme: 'karate',
    theme: 'karate',
  },
];

