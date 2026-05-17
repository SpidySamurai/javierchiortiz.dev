'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Post } from '@/types/database';
import BlogCard from '@/components/2026/ui/BlogCard';

interface BlogCardShape {
  slug: string;
  date: string;
  category: string;
  readTime: string;
  coverTheme: 'pilots' | 'spiderman' | 'karate';
  theme?: string;
  title?: string;
  excerpt?: string;
  coverImageUrl?: string | null;
  coverImagePositionCard?: string | null;
}

function adaptPost(post: Post, locale: string): BlogCardShape {
  return {
    slug: post.slug,
    date: post.published_at
      ? new Date(post.published_at).toLocaleDateString(
          locale === 'es' ? 'es-MX' : 'en-US',
          { month: 'long', year: 'numeric' }
        )
      : '',
    category: post.category,
    readTime: post.read_time,
    coverTheme: (post.cover_theme as 'pilots' | 'spiderman' | 'karate') ?? 'pilots',
    theme: post.cover_theme ?? undefined,
    title: locale === 'es' ? post.title_es : post.title_en,
    excerpt: (locale === 'es' ? post.excerpt_es : post.excerpt_en) ?? undefined,
    coverImageUrl: post.cover_image_url,
    coverImagePositionCard: post.cover_image_position_card,
  };
}

export default function BlogPreview({ posts }: { posts: Post[] }) {
  const locale = useLocale();
  const adapted = posts.slice(0, 2).map((p) => adaptPost(p, locale));

  return (
    <section
      id="blog"
      className="py-28 px-8"
      style={{ backgroundColor: 'var(--ds-surface)', scrollMarginTop: '5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-2 mb-16"
        >
          <span
            className="text-xs uppercase tracking-[0.3em] font-bold block"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            BLOG
          </span>
          <h2
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            Thoughts &{' '}
            <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>Beyond Code</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {adapted.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.25 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all duration-200 hover:opacity-80"
            style={{
              color: 'var(--ds-primary)',
              border: '1px solid color-mix(in srgb, var(--ds-primary) 25%, transparent)',
              fontFamily: 'var(--font-manrope), sans-serif',
            }}
          >
            View all posts
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
