'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiNodedotjs,
  SiPython,
  SiDjango,
  SiShopify,
  SiGit,
  SiSass,
} from 'react-icons/si';
import type { IconType } from 'react-icons';

interface Tech {
  name: string;
  icon: IconType;
  color: string;
}

const TECH: Tech[] = [
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#e2e8f0' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'HTML & CSS', icon: SiHtml5, color: '#E34F26' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#6cc24a' },
  { name: 'Python', icon: SiPython, color: '#4B8BBE' },
  { name: 'Django', icon: SiDjango, color: '#44B78B' },
  { name: 'Shopify', icon: SiShopify, color: '#96BF48' },
  { name: 'Git', icon: SiGit, color: '#F05032' },
  { name: 'Sass', icon: SiSass, color: '#CC6699' },
];

const FLOAT_DURATIONS = [3.8, 4.4, 3.2, 5.0, 4.1, 3.6, 4.8, 3.4, 5.2, 4.0, 3.7, 4.5];
const FLOAT_DELAYS = [0, 0.6, 1.2, 0.3, 1.8, 0.9, 0.4, 1.5, 0.7, 1.1, 1.9, 0.2];

function TechChip({ tech, index }: { tech: Tech; index: number }) {
  const Icon = tech.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.055, duration: 0.45, ease: 'easeOut' }}
      whileHover={{ scale: 1.08 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-default select-none"
      style={{
        backgroundColor: 'rgba(192,193,255,0.06)',
        border: '1px solid rgba(192,193,255,0.1)',
        backdropFilter: 'blur(8px)',
        animation: `float-y ${FLOAT_DURATIONS[index]}s ease-in-out ${FLOAT_DELAYS[index]}s infinite`,
        boxShadow: `0 0 0 0 ${tech.color}00`,
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 14px 2px ${tech.color}33`;
        (e.currentTarget as HTMLElement).style.borderColor = `${tech.color}44`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 transparent';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(192,193,255,0.1)';
      }}
    >
      <Icon size={16} style={{ color: tech.color, opacity: 0.85, flexShrink: 0 }} />
      <span
        className="text-xs font-medium whitespace-nowrap"
        style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {tech.name}
      </span>
    </motion.div>
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
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
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
            {(['about_paragraph_1', 'about_paragraph_4'] as const).map((key, i) => (
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

        {/* Right — floating tech icons */}
        <div className="flex flex-wrap gap-3 content-start">
          {TECH.map((tech, i) => (
            <TechChip key={tech.name} tech={tech} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
