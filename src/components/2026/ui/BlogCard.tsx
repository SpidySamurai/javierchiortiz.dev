'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import BlogCover from './BlogCover';
import { getTheme } from '@/data/blogThemes';

// Hoisted: motion.create() must never be called in render.
const MotionLink = motion.create(Link);

/**
 * Cover with scroll-linked parallax (#8) + hover zoom (#2).
 * Lives in its own component so useScroll's target ref is only ever created
 * when a real image element is rendered (never the BlogCover fallback) —
 * avoids "Target ref is defined but not hydrated".
 */
function CoverImage({
  src,
  alt,
  aspect,
  position,
  reduce,
}: {
  src: string;
  alt: string;
  aspect: string;
  position: string;
  reduce: boolean | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // Baseline scale (1.08) exceeds max |y| (3%) so the frame is always overfilled — no bleed.
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.08, 1.14]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-3%', '3%']);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', aspectRatio: aspect, overflow: 'hidden' }}>
      <motion.div style={{ scale, y, width: '100%', height: '100%', willChange: 'transform' }}>
        <motion.img
          variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
          transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: position }}
        />
      </motion.div>
    </div>
  );
}

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
  const reduce = useReducedMotion();
  const title = post.title ?? tb(`${post.slug}.title`);
  const excerpt = post.excerpt ?? tb(`${post.slug}.excerpt`);
  const blogTheme = getTheme(post.theme);
  const accentColor = blogTheme.primary; // dark-only site

  const baseRing = `0 0 0 1px color-mix(in srgb, ${accentColor} 15%, transparent)`;
  const hoverRing = `0 0 0 1px color-mix(in srgb, ${accentColor} 35%, transparent), 0 16px 40px color-mix(in srgb, var(--ds-bg) 50%, transparent)`;

  // Content cascade (#9) — chip → title → excerpt → meta.
  const content = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.06, delayChildren: reduce ? 0 : 0.12 } },
  };
  const line = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <MotionLink
      href={`/${locale}/blog/${post.slug}`}
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : 'hover'}
      variants={{ rest: { y: 0, boxShadow: baseRing }, hover: { y: -8, boxShadow: hoverRing } }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, boxShadow: { duration: 0.25 } }}
      className="group block rounded-xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ds-primary)]"
      style={{ backgroundColor: 'var(--ds-surface-container)', boxShadow: baseRing }}
    >
      {/* Cover */}
      {post.coverImageUrl ? (
        <CoverImage
          src={post.coverImageUrl}
          alt={title}
          aspect={post.coverAspectCard ?? '16/9'}
          position={post.coverImagePositionCard ?? '50% 50%'}
          reduce={reduce}
        />
      ) : (
        <BlogCover theme={post.coverTheme} height="200px" />
      )}

      {/* Content */}
      <motion.div
        className="p-6 space-y-3"
        variants={content}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        <motion.span
          variants={line}
          className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{
            backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
            color: accentColor,
          }}
        >
          {post.category}
        </motion.span>

        <motion.h3
          variants={line}
          className="text-xl font-black leading-tight transition-colors duration-200 group-hover:text-[color:var(--ds-primary)] group-focus-visible:text-[color:var(--ds-primary)]"
          style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          {title}
        </motion.h3>

        <motion.p
          variants={line}
          className="text-sm leading-relaxed line-clamp-3"
          style={{
            color: 'var(--ds-on-surface-variant)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          {excerpt}
        </motion.p>

        <motion.div variants={line} className="flex items-center justify-between pt-2">
          <div
            className="flex items-center gap-3 text-xs"
            style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <span
            className="text-xs font-bold inline-flex items-center gap-1 transition-colors duration-200"
            style={{ color: accentColor, fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {locale === 'es' ? 'Leer' : 'Read'}
            <span
              translate="no"
              aria-hidden
              className="material-symbols-outlined text-sm inline-block transition-transform duration-200 motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"
            >
              arrow_forward
            </span>
          </span>
        </motion.div>
      </motion.div>
    </MotionLink>
  );
}
