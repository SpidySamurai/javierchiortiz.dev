'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { TextReveal } from '@/components/2026/ui/TextReveal';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiNestjs,
  SiSass,
  SiGit,
  SiShopify,
  SiWebpack,
  SiTailwindcss,
  SiPython,
  SiDjango,
  SiJavascript,
  SiDotnet,
  SiClaude,
  SiPrisma,
  SiFigma,
  SiApachespark,
  SiScala,
  SiOpenai,
  SiReplit,
} from 'react-icons/si';
import { TbSql } from 'react-icons/tb';
import type { IconType } from 'react-icons';

interface Tech {
  name: string;
  icon?: IconType;
  color: string;
}

const STACK: Tech[] = [
  { name: 'Next.js', icon: SiNextdotjs, color: '#e2e8f0' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'NestJS', icon: SiNestjs, color: '#E0234E' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#6cc24a' },
  { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Prisma', icon: SiPrisma, color: '#5a67d8' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'HTML', icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS', icon: SiCss, color: '#1572B6' },
  { name: 'Sass', icon: SiSass, color: '#CC6699' },
];

const AI: Tech[] = [
  { name: 'Claude', icon: SiClaude, color: '#D4A27F' },
  { name: 'OpenAI', icon: SiOpenai, color: '#74AA9C' },
  { name: 'n8n', color: '#EA4B71' },
  { name: 'Lovable', color: '#a855f7' },
  { name: 'Replit', icon: SiReplit, color: '#F26207' },
];

const TOOLS: Tech[] = [
  { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
  { name: 'Shopify', icon: SiShopify, color: '#96BF48' },
  { name: 'Webpack', icon: SiWebpack, color: '#8DD6F9' },
];

const ALSO: Tech[] = [
  { name: 'Apache Spark', icon: SiApachespark, color: '#E25A1C' },
  { name: 'Scala', icon: SiScala, color: '#DC322F' },
  { name: 'SQL Server', icon: TbSql, color: '#c0c1ff' },
  { name: 'Python', icon: SiPython, color: '#4B8BBE' },
  { name: 'Django', icon: SiDjango, color: '#44B78B' },
  { name: '.NET', icon: SiDotnet, color: '#512BD4' },
];

const floatDuration = (i: number) => 3.2 + (i % 5) * 0.42;
const floatDelay = (i: number) => (i * 0.38) % 2.2;

function TechChip({
  tech,
  globalIndex,
  muted = false,
}: {
  tech: Tech;
  globalIndex: number;
  muted?: boolean;
}) {
  const Icon = tech.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: globalIndex * 0.045, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.08 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-default select-none"
      style={{
        backgroundColor: muted
          ? 'color-mix(in srgb, var(--ds-primary) 3%, var(--ds-surface))'
          : 'color-mix(in srgb, var(--ds-primary) 8%, var(--ds-surface))',
        border: '1px solid color-mix(in srgb, var(--ds-primary) 12%, transparent)',
        animation: `float-y ${floatDuration(globalIndex)}s ease-in-out ${floatDelay(
          globalIndex
        )}s infinite`,
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 14px 2px ${tech.color}33`;
        (e.currentTarget as HTMLElement).style.borderColor = `${tech.color}44`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '';
        (e.currentTarget as HTMLElement).style.borderColor =
          'color-mix(in srgb, var(--ds-primary) 10%, transparent)';
      }}
    >
      {Icon && <Icon size={14} style={{ color: tech.color, opacity: muted ? 0.6 : 0.85, flexShrink: 0 }} />}
      <span
        className="text-xs font-medium whitespace-nowrap"
        style={{
          color: muted ? 'var(--ds-outline)' : 'var(--ds-on-surface-variant)',
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        {tech.name}
      </span>
    </motion.div>
  );
}

function TechGroup({
  labelKey,
  items,
  startIndex,
  muted = false,
}: {
  labelKey: string;
  items: Tech[];
  startIndex: number;
  muted?: boolean;
}) {
  const t = useTranslations('common');
  return (
    <div className="flex flex-col gap-3">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: startIndex * 0.045, duration: 0.4 }}
        className="text-[10px] uppercase tracking-[0.28em] font-bold"
        style={{
          color: muted ? 'var(--ds-outline)' : 'var(--ds-primary)',
          fontFamily: 'var(--font-inter), sans-serif',
        }}
      >
        {t(labelKey as Parameters<typeof t>[0])}
      </motion.p>
      <div className="flex flex-wrap gap-2.5">
        {items.map((tech, i) => (
          <TechChip key={tech.name} tech={tech} globalIndex={startIndex + i} muted={muted} />
        ))}
      </div>
    </div>
  );
}

export default function About() {
  const t = useTranslations('common');
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  // Pause the ~26 infinite float-y chip animations while About is off-screen.
  const inView = useInView(sectionRef, { margin: '120px' });

  return (
    <section
      ref={sectionRef}
      id="about"
      data-track-section="about"
      data-floats-paused={inView ? undefined : ''}
      className="py-28 px-8 lg:px-20"
      style={{ backgroundColor: 'var(--ds-about-bg)', scrollMarginTop: '5rem' }}
    >
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left — text */}
        <div className="min-w-0">
          {/* Person header — name + role, no photo */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <p
              className="text-lg font-bold leading-tight"
              style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              Javier Chi Ortíz
            </p>
            <p
              className="text-xs uppercase tracking-[0.2em] font-bold mt-0.5"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('hero_subtitle')}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.3em] font-bold mb-4"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('about_label')}
          </motion.p>

          <h2
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-10"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            <TextReveal delay={0.1}>
              {t('about_title')}{' '}
              <em style={{ color: 'var(--ds-primary)' }}>{t('about_title_accent')}</em>
            </TextReveal>
          </h2>

          <div className="flex flex-col gap-5">
            {(
              [
                'about_paragraph_1',
                'about_paragraph_2',
                'about_paragraph_3',
                'about_paragraph_4',
              ] as const
            ).map((key, i) => (
              <motion.p
                key={key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="text-base leading-relaxed"
                style={{
                  color: 'var(--ds-on-surface-variant)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {t(key)}
              </motion.p>
            ))}
          </div>

          {/* Company marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="overflow-hidden mt-6 w-full"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            }}
          >
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="flex gap-3"
              style={{ width: 'max-content' }}
            >
              {[
                { name: 'ENTI', label: 'Consulting' },
                { name: 'Softtek', label: 'Enterprise' },
                { name: 'Scandia', label: 'E-commerce' },
                { name: 'IOTAM', label: 'Startup' },
                { name: 'BrightCoders', label: 'Internship' },
                { name: 'ENTI', label: 'Consulting' },
                { name: 'Softtek', label: 'Enterprise' },
                { name: 'Scandia', label: 'E-commerce' },
                { name: 'IOTAM', label: 'Startup' },
                { name: 'BrightCoders', label: 'Internship' },
              ].map((company, i) => (
                <Link
                  key={i}
                  href={`/${locale}/experience`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0 transition-opacity hover:opacity-70"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--ds-outline-variant) 15%, transparent)',
                    fontFamily: 'var(--font-manrope), sans-serif',
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: 'var(--ds-on-surface-variant)' }}
                  >
                    {company.name}
                  </span>
                  <span
                    className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                      color: 'var(--ds-outline)',
                      backgroundColor: 'color-mix(in srgb, var(--ds-outline-variant) 20%, transparent)',
                    }}
                  >
                    {company.label}
                  </span>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right — tech groups */}
        <div className="flex flex-col gap-8 min-w-0">
          <TechGroup labelKey="stack" items={STACK} startIndex={0} />
          <TechGroup labelKey="about_ai" items={AI} startIndex={STACK.length} />
          <TechGroup labelKey="about_tools" items={TOOLS} startIndex={STACK.length + AI.length} />
          <TechGroup
            labelKey="about_also"
            items={ALSO}
            startIndex={STACK.length + AI.length + TOOLS.length}
            muted
          />

          <motion.blockquote
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="pt-5 px-5 pb-5 rounded-xl relative"
            style={{ backgroundColor: 'color-mix(in srgb, var(--ds-primary) 6%, transparent)' }}
          >
            <span
              className="block text-3xl font-black leading-none mb-2 select-none"
              style={{
                color: 'var(--ds-primary)',
                opacity: 0.4,
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p
              className="text-sm leading-relaxed italic mb-3"
              style={{
                color: 'var(--ds-on-surface-variant)',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              {t('about_quote')}
            </p>
            <cite
              className="text-xs not-italic tracking-widest uppercase"
              style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              — {t('about_quote_author')}
            </cite>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}
