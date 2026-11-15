'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { EASE } from '@/components/2026/ui/Reveal';
import { TextReveal } from '@/components/2026/ui/TextReveal';
import { ResponsiveLoop } from '@/components/2026/ui/ResponsiveLoop';
import {
  LAB2NEXT_APP_URL,
  LAB2NEXT_CAPABILITIES,
  LAB2NEXT_LOOP,
  LAB2NEXT_SITE_URL,
} from '@/data/lab2next';

const FONT_BODY = 'var(--font-inter), sans-serif';
const FONT_HEAD = 'var(--font-manrope), sans-serif';

/** Lab2Next, the flagship: what the product does for a lab and the app itself, in motion. */
export default function Product() {
  const t = useTranslations('common');
  const reduce = useReducedMotion();

  return (
    <section
      id="product"
      data-track-section="product"
      className="px-8 lg:px-20 py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--ds-surface)' }}
    >
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={reduce ? { duration: 0.3 } : { duration: 0.6, ease: EASE }}
        className="max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 lg:items-end">
          <div>
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold block mb-3"
              style={{ color: 'var(--ds-primary)', fontFamily: FONT_BODY }}
            >
              {t('product_label')}
            </span>
            <h2
              className="text-5xl md:text-6xl font-black uppercase tracking-tighter"
              style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_HEAD }}
            >
              <TextReveal>
                Lab2
                <span style={{ color: 'var(--ds-primary-vivid)', fontStyle: 'italic' }}>Next</span>
              </TextReveal>
            </h2>
            <p
              className="text-base md:text-lg leading-relaxed mt-5 max-w-xl"
              style={{ color: 'var(--ds-on-surface-variant)', fontFamily: FONT_BODY }}
            >
              {t('product_description')}
            </p>
            <p
              className="text-sm font-semibold tracking-wide mt-4"
              style={{ color: 'var(--ds-primary)', fontFamily: FONT_BODY }}
            >
              {t('product_impact')}
            </p>
            <div className="flex flex-wrap items-center gap-5 mt-8">
              <a
                href={LAB2NEXT_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-transform duration-200 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ds-primary)]"
                style={{
                  backgroundColor: 'var(--ds-primary)',
                  color: 'var(--ds-on-primary)',
                  fontFamily: FONT_HEAD,
                }}
              >
                {t('product_cta')}
                <span
                  translate="no"
                  aria-hidden
                  className="material-symbols-outlined text-base inline-block transition-transform duration-200 motion-safe:group-hover/cta:translate-x-1"
                >
                  arrow_outward
                </span>
              </a>
              <a
                href={LAB2NEXT_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded focus-visible:[outline-color:var(--ds-primary)]"
                style={{ color: 'var(--ds-on-surface-variant)', fontFamily: FONT_HEAD }}
              >
                {t('product_info')}
              </a>
            </div>
          </div>

          {/* What it does for a lab */}
          <dl>
            {LAB2NEXT_CAPABILITIES.map((key) => (
              <div
                key={key}
                className="grid grid-cols-[7.5rem_1fr] gap-4 py-3"
                style={{
                  boxShadow: '0 1px 0 color-mix(in srgb, var(--ds-primary) 8%, transparent)',
                }}
              >
                <dt
                  className="text-[11px] uppercase tracking-[0.16em] font-bold pt-0.5"
                  style={{ color: 'var(--ds-outline)', fontFamily: FONT_BODY }}
                >
                  {t(`product_caps.${key}.title`)}
                </dt>
                <dd
                  className="text-[15px] leading-relaxed"
                  style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_BODY }}
                >
                  {t(`product_caps.${key}.desc`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The app in motion: the wide box plays the desktop walkthrough, the narrow one the phone */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-2.5 mt-12">
          <ResponsiveLoop
            sources={LAB2NEXT_LOOP}
            label={t('product_loop_aria')}
            className="aspect-[9/14] md:aspect-video"
          />
          <ResponsiveLoop
            sources={{
              desktop: LAB2NEXT_LOOP.mobile,
              mobile: LAB2NEXT_LOOP.mobile,
              desktopPoster: LAB2NEXT_LOOP.mobilePoster,
              mobilePoster: LAB2NEXT_LOOP.mobilePoster,
            }}
            label={t('product_loop_aria')}
            className="hidden md:block"
          />
        </div>
      </motion.div>
    </section>
  );
}
