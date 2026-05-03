'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { BlogPost } from '@/data/blog';
import { getTheme } from '@/data/blogThemes';
import BlogCover from '@/components/2026/ui/BlogCover';
import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import ScrollProgress from '@/components/2026/ui/ScrollProgress';
import CustomCursor from '@/components/2026/ui/CustomCursor';

interface BlogPostLayoutProps {
  post: BlogPost;
  locale: string;
  heroSlot?: React.ReactNode;
  midSlot?: React.ReactNode;
}

export default function BlogPostLayout({ post, locale, heroSlot, midSlot }: BlogPostLayoutProps) {
  const tb = useTranslations('blog');
  const title = tb(`${post.slug}.title`);
  const sections = tb.raw(`${post.slug}.sections`) as Array<{ heading?: string; body: string[] }>;
  const theme = getTheme(post.theme);

  const themeVars = post.theme && post.theme !== 'default'
    ? {
        '--ds-bg': theme.bg,
        '--ds-surface': theme.surface,
        '--ds-primary': theme.primary,
        '--ds-on-surface': theme.onSurface,
        backgroundColor: theme.bg,
      } as React.CSSProperties
    : { minHeight: '100vh' } as React.CSSProperties;

  return (
    <div className="ds-2026" style={{ minHeight: '100vh', ...themeVars }}>
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <Sidebar />

      <main className="xl:ml-64 pt-20">
        <article style={{ backgroundColor: 'var(--ds-bg)' }}>
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="mt-8 overflow-hidden"
            style={{ height: '420px' }}
          >
            {heroSlot ?? (
              <BlogCover theme={post.coverTheme} height="420px" />
            )}
          </motion.div>

          {/* Back button */}
          <div className="px-8 mt-8 max-w-4xl mx-auto">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70"
              style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              ← Blog
            </Link>
          </div>

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
            className="mt-8 px-8 max-w-4xl mx-auto flex items-center gap-4 flex-wrap"
          >
            <span
              className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--ds-primary) 12%, transparent)',
                color: 'var(--ds-primary)',
              }}
            >
              {post.category}
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {post.date}
            </span>
            <span style={{ color: 'var(--ds-outline-variant)' }}>·</span>
            <span
              className="text-xs"
              style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {post.readTime}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.18 }}
            className="mt-6 px-8 max-w-4xl mx-auto text-4xl md:text-6xl font-black tracking-tighter leading-none"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            {title}
          </motion.h1>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.28 }}
            className="mt-12 px-8 pb-28 max-w-4xl mx-auto space-y-10"
          >
            {sections.map((section, i) => (
              <React.Fragment key={i}>
                <div className="space-y-4">
                  {section.heading && (
                    <h2
                      className="text-xl font-bold"
                      style={{
                        color: 'var(--ds-on-surface)',
                        fontFamily: 'var(--font-manrope), sans-serif',
                      }}
                    >
                      {section.heading}
                    </h2>
                  )}
                  {section.body.map((paragraph, j) => (
                    <p
                      key={j}
                      className="text-base leading-relaxed"
                      style={{
                        color: 'var(--ds-on-surface)',
                        opacity: 0.7,
                        fontFamily: 'var(--font-inter), sans-serif',
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                {i === 0 && midSlot}
              </React.Fragment>
            ))}
          </motion.div>
        </article>
      </main>
    </div>
  );
}
