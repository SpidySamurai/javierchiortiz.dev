'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import BlogCover from './BlogCover';
import { getTheme } from '@/data/blogThemes';

interface BlogCardPost {
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
  coverAspectCard?: string | null;
}

interface BlogCardProps {
  post: BlogCardPost;
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const tb = useTranslations('blog');
  const { resolvedTheme } = useTheme();
  const title = post.title ?? tb(`${post.slug}.title`);
  const excerpt = post.excerpt ?? tb(`${post.slug}.excerpt`);
  const blogTheme = getTheme(post.theme);
  const accentColor =
    resolvedTheme === 'light' && blogTheme.primaryLight
      ? blogTheme.primaryLight
      : blogTheme.primary;

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: 'var(--ds-surface-container)',
        boxShadow: `0 0 0 1px color-mix(in srgb, ${accentColor} 15%, transparent)`,
      }}
    >
      {/* Cover */}
      {post.coverImageUrl ? (
        <div style={{ width: '100%', aspectRatio: post.coverAspectCard ?? '16/9', overflow: 'hidden' }}>
          <img
            src={post.coverImageUrl}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: post.coverImagePositionCard ?? '50% 50%',
            }}
          />
        </div>
      ) : (
        <BlogCover theme={post.coverTheme} height="200px" />
      )}

      {/* Content */}
      <div className="p-6 space-y-3">
        <span
          className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{
            backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
            color: accentColor,
          }}
        >
          {post.category}
        </span>

        <h3
          className="text-xl font-black leading-tight group-hover:text-[color:var(--ds-primary)] transition-colors duration-200"
          style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          {title}
        </h3>

        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{
            color: 'var(--ds-on-surface-variant)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          {excerpt}
        </p>

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
            style={{ color: accentColor, fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}
