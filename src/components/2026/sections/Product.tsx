'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const STACK = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'];

export default function Product() {
  const t = useTranslations('common');

  return (
    <section
      className="px-8 lg:px-20 py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--ds-bg)' }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
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
              style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
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
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
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

          <div className="relative z-10 flex flex-col md:flex-row gap-10 md:gap-16 items-start">
            {/* Left: content */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="text-3xl md:text-4xl font-black tracking-tight"
                  style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
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

              <p
                className="text-lg leading-relaxed max-w-xl"
                style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {t('product_description')}
              </p>

              <div className="flex flex-wrap gap-2">
                {STACK.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-0.5 rounded text-[9px] font-medium uppercase border"
                    style={{
                      color: 'color-mix(in srgb, var(--ds-on-surface-variant) 70%, transparent)',
                      borderColor: 'color-mix(in srgb, var(--ds-outline-variant) 30%, transparent)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-1 pt-2">
                <a
                  href="https://app.lab2next.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold transition-colors hover:opacity-80 w-fit"
                  style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-manrope), sans-serif' }}
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
