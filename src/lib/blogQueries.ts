import { cache } from 'react';
import { publicClient } from '@/lib/supabase/public';
import type { Post } from '@/types/database';

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = publicClient;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const supabase = publicClient;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error) return null;
  return data;
});
