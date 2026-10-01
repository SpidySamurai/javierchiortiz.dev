'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { TextReveal } from '@/components/2026/ui/TextReveal';
import { whatsappUrl } from '@/lib/contact';
import Factory from './services/Factory';
import MobileProcess from './services/MobileProcess';

const SERVICE_KEYS = ['agents', 'rag', 'evals', 'automations', 'saas', 'webapps'] as const;

function ServiceRow({ index, name, desc }: { index: number; name: string; desc: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
      }}
      className="group relative"
    >
      {/* Hover glow — vivid periwinkle wash behind the row */}
      <div
        aria-hidden
        className="absolute -inset-x-4 -inset-y-3 -z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'color-mix(in srgb, var(--ds-primary-vivid) 8%, transparent)' }}
      />

      {/* Index + name */}
      <div className="flex items-baseline gap-4">
        <span
          className="text-xl md:text-2xl font-black tabular-nums leading-none"
          style={{ color: 'var(--ds-primary-vivid)', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          {String(index).padStart(2, '0')}
        </span>
        <p
          className="flex items-center gap-2 text-2xl md:text-3xl font-black tracking-tight leading-tight transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          {name}
          <span
            translate="no"
            aria-hidden
            className="material-symbols-outlined text-xl -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            style={{ color: 'var(--ds-primary-vivid)' }}
          >
            arrow_forward
          </span>
        </p>
      </div>

      {/* Description — aligned under the name */}
      <p
        className="text-sm italic pl-10 mt-1"
        style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {desc}
      </p>

      {/* Animated hairline divider — draws in on reveal, glows on hover */}
      <div className="relative mt-4 h-px overflow-hidden">
        <motion.div
          className="absolute inset-0"
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 } },
          }}
          style={{
            transformOrigin: 'left',
            background:
              'linear-gradient(to right, color-mix(in srgb, var(--ds-outline-variant) 45%, transparent), transparent)',
          }}
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            transformOrigin: 'left',
            background: 'linear-gradient(to right, var(--ds-primary-vivid), transparent 65%)',
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Services() {
  const t = useTranslations('common');
  const waHref = whatsappUrl(t('contact_wa_message'));

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
            <TextReveal>
              {t('services_title')}{' '}
              <span style={{ color: 'var(--ds-primary-vivid)', fontStyle: 'italic' }}>
                {t('services_title_accent')}
              </span>
            </TextReveal>
          </h3>
        </motion.div>

        {/* Services grid — numbered editorial rows */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
        >
          {SERVICE_KEYS.map((key, i) => {
            const item = t.raw(`services_items.${key}`) as { name: string; desc: string };
            return <ServiceRow key={key} index={i + 1} name={item.name} desc={item.desc} />;
          })}
        </motion.div>

        {/* Separator */}
        <div
          className="h-px mb-12"
          style={{
            background:
              'linear-gradient(to right, transparent, color-mix(in srgb, var(--ds-outline-variant) 30%, transparent), transparent)',
          }}
        />

        {/* Mobile: step cycler */}
        <motion.div
          className="md:hidden mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
        >
          <MobileProcess />
        </motion.div>

        {/* Desktop: the factory */}
        <motion.div
          className="hidden md:block mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
        >
          <Factory />
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
