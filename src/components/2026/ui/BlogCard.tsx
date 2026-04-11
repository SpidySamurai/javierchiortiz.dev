'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import BlogCover from './BlogCover';
import type { BlogPost } from '@/data/blog';
import { getTheme } from '@/data/blogThemes';

interface BlogCardProps {
  post: BlogPost;
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const tb = useTranslations('blog');
  const title = tb(`${post.slug}.title`);
  const excerpt = tb(`${post.slug}.excerpt`);
  const theme = getTheme(post.theme);

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: 'var(--ds-surface-container)',
        boxShadow: `0 0 0 1px color-mix(in srgb, ${theme.primary} 15%, transparent)`,
      }}
    >
      {/* Cover */}
      <BlogCover theme={post.coverTheme} height="200px" />

      {/* Content */}
      <div className="p-6 space-y-3">
        {/* Category pill */}
        <span
          className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{
            backgroundColor: `color-mix(in srgb, ${theme.primary} 12%, transparent)`,
            color: theme.primary,
          }}
        >
          {post.category}
        </span>

        {/* Title */}
        <h3
          className="text-xl font-black leading-tight group-hover:text-[color:var(--ds-primary)] transition-colors duration-200"
          style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          {title}
        </h3>

        {/* Excerpt */}
        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {excerpt}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-2">
          <div
            className="flex items-center gap-3 text-xs"
            style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <span
            className="text-xs font-bold transition-colors duration-200 group-hover:translate-x-1 inline-block transition-transform"
            style={{ color: theme.primary, fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}
