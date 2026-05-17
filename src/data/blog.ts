import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/types/database';

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

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error) return null;
  return data;
}
