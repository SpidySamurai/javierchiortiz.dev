'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import type { Post } from '@/types/database';
import { BlogRow } from '@/components/2026/sections/blog/BlogRow';
import { adaptPostRow } from '@/lib/blogPostRow';
import { Reveal, EASE } from '@/components/2026/ui/Reveal';
import { ScrollFillText } from '@/components/2026/ui/ScrollFillText';

// Hoisted so the motion component identity is stable across renders.
const MotionLink = motion.create(Link);

export default function BlogPreview({ posts }: { posts: Post[] }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const adapted = posts.slice(0, 2).map((p) => adaptPostRow(p, locale, t).row);

  // Parent owns timing; each card item carries the actual reveal values.
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const item = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      };

  return (
    <section
      id="blog"
      data-track-section="blog"
      className="py-28 px-8"
      style={{ backgroundColor: 'var(--ds-surface)', scrollMarginTop: '5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-14 lg:items-end mb-12">
          <Reveal y={20} className="space-y-2">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold block"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              BLOG
            </span>
            <h2
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
              style={{
                color: 'var(--ds-on-surface)',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
            >
              <ScrollFillText>
                {t('blog_title')}{' '}
                <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
                  {t('blog_title_accent')}
                </span>
              </ScrollFillText>
            </h2>
          </Reveal>
          <p
            className="text-base leading-relaxed max-w-xl"
            style={{
              color: 'var(--ds-on-surface-variant)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {t('blog_lead')}
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="flex flex-col"
          style={{ boxShadow: '0 -1px 0 color-mix(in srgb, var(--ds-on-surface) 7%, transparent)' }}
        >
          {/* Editorial list, same hairline language as Why, About and the journey */}
          {adapted.map((post) => (
            <motion.div key={post.slug} variants={item}>
              <BlogRow
                post={post}
                href={`/${locale}/blog/${post.slug}`}
                readLabel={t('blog_read')}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={reduce ? { duration: 0.3 } : { duration: 0.45, ease: EASE, delay: 0.15 }}
          className="mt-10 flex"
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
