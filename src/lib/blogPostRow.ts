import type { Post } from '@/types/database';
import type { BlogRowPost } from '@/components/2026/sections/blog/BlogRow';

/** Anything that translates a `common` message key: `useTranslations` and `getTranslations` both fit. */
export interface CommonTranslator {
  (key: string, values?: Record<string, string | number>): string;
  has(key: string): boolean;
}

/** Stable key for a stored category name ("Music" and "music " are the same tab). */
export function categoryKey(category: string): string {
  return category.trim().toLowerCase();
}

/** Category label in the reader's language; unknown categories keep their stored name. */
export function categoryLabel(category: string, t: CommonTranslator): string {
  const key = `blog_categories.${categoryKey(category)}`;
  return t.has(key) ? t(key) : category;
}

/** A post as the editorial list renders it, plus the key the category tabs filter on. */
export interface BlogRowItem {
  categoryKey: string;
  row: BlogRowPost;
}

/** Maps a stored post to a BlogRow, localized for `locale`. The one adapter the home and the index share. */
export function adaptPostRow(post: Post, locale: string, t: CommonTranslator): BlogRowItem {
  // read_time is stored as free text (e.g. "5 min read"); localize the common shape, keep anything else as is.
  const minutes = /^\s*(\d+)\s*min/i.exec(post.read_time)?.[1];
  return {
    categoryKey: categoryKey(post.category),
    row: {
      slug: post.slug,
      date: post.published_at
        ? new Date(post.published_at).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
            month: 'long',
            year: 'numeric',
          })
        : '',
      category: categoryLabel(post.category, t),
      readTime: minutes ? t('blog_read_time', { n: Number(minutes) }) : post.read_time,
      coverTheme: (post.cover_theme as BlogRowPost['coverTheme']) ?? 'pilots',
      title: locale === 'es' ? post.title_es : post.title_en,
      excerpt: (locale === 'es' ? post.excerpt_es : post.excerpt_en) ?? undefined,
      coverImageUrl: post.cover_image_url,
      coverImagePosition: post.cover_image_position_card,
    },
  };
}
