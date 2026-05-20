'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';


export default function Product() {
  const t = useTranslations('common');

  return (
    <section
      id="product"
      data-track-section="product"
      className="px-8 lg:px-20 py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--ds-bg)' }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
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
              {t('product_title')}{' '}
              <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
                {t('product_title_accent')}
              </span>
            </h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
          className="relative rounded-2xl p-8 md:p-12 border overflow-hidden"
          style={{
            backgroundColor: 'var(--ds-surface)',
            borderColor: 'color-mix(in srgb, var(--ds-primary) 15%, transparent)',
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background: 'color-mix(in srgb, var(--ds-primary) 6%, transparent)',
              filter: 'blur(80px)',
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Left: content */}
            <div className="flex-1 space-y-6 w-full lg:w-1/2">
              {/* Title + badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="text-3xl md:text-4xl font-black tracking-tight"
                  style={{
                    color: 'var(--ds-on-surface)',
                    fontFamily: 'var(--font-manrope), sans-serif',
                  }}
                >
                  Lab2Next
                </span>
                <span
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                  style={{
                    color: 'var(--ds-primary)',
                    borderColor: 'color-mix(in srgb, var(--ds-primary) 30%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--ds-primary) 8%, transparent)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  {t('product_badge')}
                </span>
              </div>

              {/* Image — mobile/tablet only */}
              <div className="lg:hidden w-full rounded-xl overflow-hidden border" style={{
                borderColor: 'color-mix(in srgb, var(--ds-primary) 20%, transparent)',
                boxShadow: '0 24px 60px color-mix(in srgb, var(--ds-primary) 12%, transparent)',
              }}>
                <Image
                  src="/utils/img/lab2next-app-screenshot.png"
                  alt="Lab2Next — patient registration dashboard for clinical labs"
                  width={1280}
                  height={800}
                  className="w-full h-auto block"
                  style={{ maxHeight: '260px', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>

              <p
                className="text-lg leading-relaxed"
                style={{
                  color: 'var(--ds-on-surface-variant)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {t('product_description')}
              </p>

              <p
                className="text-sm font-semibold tracking-wide"
                style={{
                  color: 'var(--ds-primary)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {t('product_impact')}
              </p>

              <div className="flex flex-col gap-3 pt-2">
                <div className="flex flex-col gap-1">
                  <a
                    href="https://app.lab2next.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold transition-colors hover:opacity-80 w-fit"
                    style={{
                      color: 'var(--ds-primary)',
                      fontFamily: 'var(--font-manrope), sans-serif',
                    }}
                  >
                    {t('product_cta')}
                  </a>
                  <span
                    className="text-xs italic tracking-widest"
                    style={{
                      color: 'color-mix(in srgb, var(--ds-primary) 55%, transparent)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {t('product_cta_sub')}
                  </span>
                </div>
                <a
                  href="https://lab2next.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors hover:opacity-80 w-fit"
                  style={{
                    color: 'var(--ds-outline)',
                    fontFamily: 'var(--font-manrope), sans-serif',
                  }}
                >
                  {t('product_info')}
                </a>
              </div>
            </div>

            {/* Right: screenshot — desktop only */}
            <div className="hidden lg:block lg:w-1/2 flex-shrink-0">
              <div
                className="relative rounded-xl overflow-hidden border"
                style={{
                  borderColor: 'color-mix(in srgb, var(--ds-primary) 20%, transparent)',
                  boxShadow: '0 24px 60px color-mix(in srgb, var(--ds-primary) 12%, transparent)',
                  transform: 'perspective(1000px) rotateY(-4deg) rotateX(2deg)',
                }}
              >
                <Image
                  src="/utils/img/lab2next-app-screenshot.png"
                  alt="Lab2Next — patient registration dashboard for clinical labs"
                  width={1280}
                  height={800}
                  className="w-full h-auto block"
                  style={{ maxHeight: '340px', objectFit: 'cover', objectPosition: 'top' }}
                />
                {/* Bottom fade */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, transparent, var(--ds-surface))',
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
