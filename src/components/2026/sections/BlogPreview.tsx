'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import type { Post } from '@/types/database';
import BlogCard from '@/components/2026/ui/BlogCard';
import { Reveal, EASE } from '@/components/2026/ui/Reveal';
import { ScrollFillText } from '@/components/2026/ui/ScrollFillText';
import { StandUp } from '@/components/2026/ui/StandUp';

// Hoisted so the motion component identity is stable across renders.
const MotionLink = motion.create(Link);

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
  coverAspectCard?: string | null;
}

function adaptPost(
  post: Post,
  locale: string,
  formatReadTime: (minutes: number) => string
): BlogCardShape {
  // read_time is stored as free text (e.g. "5 min read"); localize the common shape, keep anything else as is.
  const minutes = /^\s*(\d+)\s*min/i.exec(post.read_time)?.[1];
  return {
    slug: post.slug,
    date: post.published_at
      ? new Date(post.published_at).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
          month: 'long',
          year: 'numeric',
        })
      : '',
    category: post.category,
    readTime: minutes ? formatReadTime(Number(minutes)) : post.read_time,
    coverTheme: (post.cover_theme as 'pilots' | 'spiderman' | 'karate') ?? 'pilots',
    theme: post.cover_theme ?? undefined,
    title: locale === 'es' ? post.title_es : post.title_en,
    excerpt: (locale === 'es' ? post.excerpt_es : post.excerpt_en) ?? undefined,
    coverImageUrl: post.cover_image_url,
    coverImagePositionCard: post.cover_image_position_card,
    coverAspectCard: post.cover_image_aspect_card,
  };
}

export default function BlogPreview({ posts }: { posts: Post[] }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const adapted = posts.slice(0, 2).map((p) => adaptPost(p, locale, (n) => t('blog_read_time', { n })));

  // Parent owns timing; each card item carries the actual reveal values.
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
  const item = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y: 28, scale: 0.97 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE } },
      };

  return (
    <section
      id="blog"
      data-track-section="blog"
      className="py-28 px-8"
      style={{ backgroundColor: 'var(--ds-surface)', scrollMarginTop: '5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        <Reveal y={20} className="space-y-2 mb-16">
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
            <ScrollFillText>
              {t('blog_title')}{' '}
              <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
                {t('blog_title_accent')}
              </span>
            </ScrollFillText>
          </h2>
        </Reveal>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {adapted.map((post, i) => (
            <StandUp key={post.slug} lead={i === 0 ? 0.124 : 0}>
              <motion.div variants={item} className="h-full">
                <BlogCard post={post} locale={locale} />
              </motion.div>
            </StandUp>
          ))}
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={reduce ? { duration: 0.3 } : { duration: 0.45, ease: EASE, delay: 0.15 }}
          className="mt-12 flex justify-center"
        >
          <MotionLink
            href={`/${locale}/blog`}
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-colors duration-200 hover:bg-[color:color-mix(in_srgb,var(--ds-primary)_12%,transparent)]"
            style={{
              color: 'var(--ds-primary)',
              boxShadow: '0 0 0 1px color-mix(in srgb, var(--ds-primary) 25%, transparent)',
              fontFamily: 'var(--font-manrope), sans-serif',
            }}
          >
            {t('blog_view_all')}
            <span
              translate="no"
              aria-hidden
              className="material-symbols-outlined text-base inline-block transition-transform duration-200 motion-safe:group-hover:translate-x-1"
            >
              arrow_forward
            </span>
          </MotionLink>
        </motion.div>
      </div>
    </section>
  );
}
