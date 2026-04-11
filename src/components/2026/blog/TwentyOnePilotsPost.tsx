'use client';

import { motion } from 'framer-motion';
import type { BlogPost } from '@/data/blog';
import BlogPostLayout from './BlogPostLayout';

export default function TwentyOnePilotsPost({ post, locale }: { post: BlogPost; locale: string }) {
  const heroSlot = (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 80% 20%, rgba(160,0,0,0.25) 0%, transparent 55%), #050505',
      }}
    >
      {/* Animated |-/ symbol */}
      <motion.span
        className="select-none pointer-events-none absolute"
        animate={{ opacity: [0.04, 0.12, 0.06, 0.16, 0.04] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: 'clamp(120px, 22vw, 220px)',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '-0.04em',
          userSelect: 'none',
        }}
      >
        |-/
      </motion.span>

      {/* Thin red vertical accent line on right edge */}
      <div
        className="absolute top-0 right-0 w-[2px] h-full"
        style={{
          background: 'linear-gradient(to bottom, #b00000 0%, transparent 100%)',
          opacity: 0.6,
        }}
      />

      {/* Bottom gradient fade to background */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: '40%',
          background: 'linear-gradient(to top, var(--ds-bg) 0%, transparent 40%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );

  const midSlot = post.youtubeId ? (
    <div className="my-8">
      <div
        className="rounded-xl overflow-hidden"
        style={{ aspectRatio: '16/9' }}
      >
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${post.youtubeId}`}
          allowFullScreen
          title="Twenty One Pilots"
          style={{ border: 'none', display: 'block' }}
        />
      </div>
      <p
        className="mt-3 text-sm italic"
        style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        — A song that explains it better than words.
      </p>
    </div>
  ) : null;

  return <BlogPostLayout post={post} locale={locale} heroSlot={heroSlot} midSlot={midSlot} />;
}
