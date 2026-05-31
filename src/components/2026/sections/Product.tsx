'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { EASE } from '@/components/2026/ui/Reveal';
import { TextReveal } from '@/components/2026/ui/TextReveal';

export default function Product() {
  const t = useTranslations('common');
  const reduce = useReducedMotion();

  return (
    <section
      id="product"
      data-track-section="product"
      className="px-8 lg:px-20 py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--ds-bg)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header — mirrors the Projects showcase header */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={reduce ? { duration: 0.3 } : { duration: 0.5, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16"
        >
          <div className="space-y-2">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold block"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('product_label')}
            </span>
            <h3
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
              style={{
                color: 'var(--ds-on-surface)',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
            >
              <TextReveal>
                {t('product_title')}{' '}
                <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
                  {t('product_title_accent')}
                </span>
              </TextReveal>
            </h3>
          </div>
        </motion.div>

        {/* Featured block — same visual language as Projects > FeaturedProject */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={reduce ? { duration: 0.3 } : { duration: 0.7, ease: EASE }}
          className="group grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-14"
        >
          {/* Screenshot — clean bordered frame, zooms on hover */}
          <div
            className="relative w-full overflow-hidden rounded-2xl order-1 lg:order-none"
            style={{
              aspectRatio: '16 / 10',
              boxShadow:
                '0 0 0 1px color-mix(in srgb, var(--ds-primary) 18%, transparent), 0 40px 90px -20px color-mix(in srgb, var(--ds-bg) 80%, transparent)',
            }}
          >
            <Image
              src="/utils/img/lab2next-app-screenshot.png"
              alt="Lab2Next — patient registration dashboard for clinical labs"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
            />
          </div>

          {/* Editorial copy */}
          <div className="flex flex-col">
            {/* Live pulse eyebrow */}
            <div className="flex items-center gap-2.5 mb-5">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping"
                  style={{ backgroundColor: '#4ade80' }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: '#4ade80' }} />
              </span>
              <span
                className="text-xs uppercase tracking-[0.3em] font-bold"
                style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {t('product_badge')}
              </span>
            </div>

            <h3
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-5"
              style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              <TextReveal>Lab2Next</TextReveal>
            </h3>

            <p
              className="text-base md:text-lg leading-relaxed mb-4 max-w-xl"
              style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('product_description')}
            </p>

            <p
              className="text-sm font-semibold tracking-wide mb-8"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('product_impact')}
            </p>

            <div className="flex items-center gap-5">
              <a
                href="https://app.lab2next.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-transform duration-200 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ds-primary)]"
                style={{
                  backgroundColor: 'var(--ds-primary)',
                  color: 'var(--ds-on-primary)',
                  fontFamily: 'var(--font-manrope), sans-serif',
                }}
              >
                {t('product_cta')}
                <span
                  translate="no"
                  aria-hidden
                  className="material-symbols-outlined text-base inline-block transition-transform duration-200 motion-safe:group-hover/cta:translate-x-1"
                >
                  arrow_forward
                </span>
              </a>
              <a
                href="https://lab2next.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded focus-visible:[outline-color:var(--ds-primary)]"
                style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-manrope), sans-serif' }}
              >
                {t('product_info')}
              </a>
            </div>

            <span
              className="text-xs italic tracking-widest mt-3"
              style={{
                color: 'color-mix(in srgb, var(--ds-primary) 55%, transparent)',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              {t('product_cta_sub')}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
