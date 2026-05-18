'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';

const SERVICE_KEYS = ['landing', 'webapp', 'mvp', 'cms', 'crm', 'ai'] as const;
const PROCESS_KEYS = ['idea', 'build', 'launch'] as const;
const PROCESS_ICONS = { idea: 'lightbulb', build: 'build', launch: 'rocket_launch' } as const;

const WA_PHONE = '529904147791';

export default function Services() {
  const t = useTranslations('common');
  const locale = useLocale();
  const waMessage = locale === 'es'
    ? 'Hola Javier, vi tu portfolio y quiero contactarte'
    : 'Hi Javier, I saw your portfolio and want to get in touch';
  const waHref = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waMessage)}`;

  return (
    <section
      id="services"
      data-track-section="services"
      className="px-8 lg:px-20 py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--ds-surface)', scrollMarginTop: '5rem' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <span
            className="text-xs uppercase tracking-[0.3em] font-bold block mb-3"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('services_label')}
          </span>
          <h3
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            {t('services_title')}{' '}
            <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
              {t('services_title_accent')}
            </span>
          </h3>
        </motion.div>

        {/* Services grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
          }}
        >
          {SERVICE_KEYS.map((key) => {
            const item = t.raw(`services_items.${key}`) as { name: string; desc: string };
            return (
              <motion.div
                key={key}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                }}
              >
                <p
                  className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-1"
                  style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
                >
                  {item.name}
                </p>
                <p
                  className="text-sm italic"
                  style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Process */}
        <div className="h-px mb-12" style={{ background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--ds-outline-variant) 30%, transparent), transparent)' }} />
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {PROCESS_KEYS.map((key, i) => {
              const step = t.raw(`services_process.${key}`) as { name: string; desc: string };
              return (
                <div key={key} className="flex flex-col items-center text-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--ds-primary) 12%, transparent)' }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 20, color: 'var(--ds-primary)' }}
                    >
                      {PROCESS_ICONS[key]}
                    </span>
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest block mb-0.5"
                      style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p
                      className="text-base font-black uppercase tracking-tight"
                      style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
                    >
                      {step.name}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.15 }}
        >
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'var(--ds-primary)',
              color: 'var(--ds-on-primary)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {t('services_cta')}
          </a>
        </motion.div>

      </div>
    </section>
  );
}
