import type { Post } from '@/types/database';
import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import MarkdownRenderer from '@/components/2026/blog/MarkdownRenderer';
import BlogCover from '@/components/2026/ui/BlogCover';
import { getTheme } from '@/data/blogThemes';
import { getSidebarCollapsed } from '@/lib/sidebarState';
import Link from 'next/link';

export default async function MarkdownPost({ post, locale }: { post: Post; locale: string }) {
  const sidebarCollapsed = await getSidebarCollapsed();
  const title = locale === 'es' ? post.title_es : post.title_en;
  const content = locale === 'es' ? post.content_es : post.content_en;
  const hasImageHero = !!post.cover_image_url;
  const hasThemeHero = !!post.cover_theme && !hasImageHero;

  // theme_config (DB override) → cover_theme key lookup → default
  const baseTheme = getTheme(post.cover_theme ?? undefined);
  const theme = post.theme_config ? { ...baseTheme, ...post.theme_config } : baseTheme;

  return (
    <div
      className="ds-2026"
      style={
        {
          minHeight: '100vh',
          backgroundColor: theme.bg,
          '--ds-bg': theme.bg,
          '--ds-surface': theme.surface,
          '--ds-primary': theme.primary,
          '--ds-on-surface': theme.onSurface ?? 'var(--ds-on-surface)',
        } as React.CSSProperties
      }
    >
      <Header />
      <Sidebar defaultCollapsed={sidebarCollapsed} />
      <main className="sidebar-main pt-20">
        {/* Hero */}
        {hasImageHero && (
          <div style={{ width: '100%', height: 420, overflow: 'hidden' }}>
            <img
              src={post.cover_image_url!}
              alt={title ?? ''}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: post.cover_image_position_hero ?? '50% 50%',
              }}
            />
          </div>
        )}
        {hasThemeHero && (
          <BlogCover theme={post.cover_theme as 'pilots' | 'spiderman' | 'karate'} height="420px" />
        )}

        <article className="max-w-3xl mx-auto px-8 py-16">
          {/* Back */}
          <Link
            href={`/${locale}/blog`}
            style={{
              display: 'inline-block',
              marginBottom: '2rem',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--ds-outline)',
              fontFamily: 'var(--font-inter), sans-serif',
              textDecoration: 'none',
            }}
          >
            ← Blog
          </Link>

          <header className="mb-12 space-y-4">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {post.category}
            </span>
            <h1
              className="text-4xl md:text-5xl font-black tracking-tight leading-tight"
              style={{
                color: 'var(--ds-on-surface)',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
            >
              {title}
            </h1>
            <p className="text-sm" style={{ color: 'var(--ds-on-surface-variant)' }}>
              {post.read_time}
              {post.published_at && (
                <>
                  {' '}
                  &middot;{' '}
                  {new Date(post.published_at).toLocaleDateString(
                    locale === 'es' ? 'es-MX' : 'en-US',
                    { month: 'long', day: 'numeric', year: 'numeric' }
                  )}
                </>
              )}
            </p>
          </header>

          <MarkdownRenderer content={content ?? ''} />
        </article>
      </main>
    </div>
  );
}
