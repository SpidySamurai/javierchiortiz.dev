'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiHtml5,
  SiCss3,
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
} from 'react-icons/si';
import { TbSql } from 'react-icons/tb';
import type { IconType } from 'react-icons';

interface Tech {
  name: string;
  icon: IconType;
  color: string;
}

const STACK: Tech[] = [
  { name: 'Next.js', icon: SiNextdotjs, color: '#e2e8f0' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'NestJS', icon: SiNestjs, color: '#E0234E' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#6cc24a' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'HTML', icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS', icon: SiCss3, color: '#1572B6' },
  { name: 'Sass', icon: SiSass, color: '#CC6699' },
  { name: 'Prisma', icon: SiPrisma, color: '#5a67d8' },
];

const TOOLS: Tech[] = [
  { name: 'Git', icon: SiGit, color: '#F05032' },
  { name: 'Shopify', icon: SiShopify, color: '#96BF48' },
  { name: 'Webpack', icon: SiWebpack, color: '#8DD6F9' },
  { name: 'Claude', icon: SiClaude, color: '#D4A27F' },
  { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
];

const ALSO: Tech[] = [
  { name: 'Python', icon: SiPython, color: '#4B8BBE' },
  { name: 'Django', icon: SiDjango, color: '#44B78B' },
  { name: '.NET', icon: SiDotnet, color: '#512BD4' },
  { name: 'SQL Server', icon: TbSql, color: '#c0c1ff' },
  { name: 'Apache Spark', icon: SiApachespark, color: '#E25A1C' },
  { name: 'Scala', icon: SiScala, color: '#DC322F' },
];

const floatDuration = (i: number) => 3.2 + (i % 5) * 0.42;
const floatDelay = (i: number) => (i * 0.38) % 2.2;

function TechChip({ tech, globalIndex, muted = false }: { tech: Tech; globalIndex: number; muted?: boolean }) {
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
        backgroundColor: muted ? 'rgba(192,193,255,0.03)' : 'rgba(192,193,255,0.06)',
        border: '1px solid rgba(192,193,255,0.1)',
        backdropFilter: 'blur(8px)',
        animation: `float-y ${floatDuration(globalIndex)}s ease-in-out ${floatDelay(globalIndex)}s infinite`,
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 14px 2px ${tech.color}33`;
        (e.currentTarget as HTMLElement).style.borderColor = `${tech.color}44`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(192,193,255,0.1)';
      }}
    >
      <Icon
        size={14}
        style={{ color: tech.color, opacity: muted ? 0.6 : 0.85, flexShrink: 0 }}
      />
      <span
        className="text-xs font-medium whitespace-nowrap"
        style={{
          color: muted ? '#908fa0' : '#c7c4d7',
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
        style={{ color: muted ? '#908fa0' : '#c0c1ff', fontFamily: 'var(--font-inter), sans-serif' }}
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

  return (
    <section
      id="about"
      className="py-28 px-8 lg:px-20"
      style={{ backgroundColor: '#0b1326', scrollMarginTop: '5rem' }}
    >
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left — text */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.3em] font-bold mb-4"
            style={{ color: '#c0c1ff', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('about_label')}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-10"
            style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            {t('about_title')} <em style={{ color: '#c0c1ff' }}>{t('about_title_accent')}</em>
          </motion.h2>

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
                style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {t(key)}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Right — tech groups */}
        <div className="flex flex-col gap-8">
          <TechGroup labelKey="stack" items={STACK} startIndex={0} />
          <TechGroup labelKey="about_tools" items={TOOLS} startIndex={STACK.length} />
          <TechGroup labelKey="about_also" items={ALSO} startIndex={STACK.length + TOOLS.length} muted />
        </div>
      </div>
    </section>
  );
}
