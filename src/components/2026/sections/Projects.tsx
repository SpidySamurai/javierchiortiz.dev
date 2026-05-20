'use client';

import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useCallback } from 'react';
import { projects } from '@/data/projects';
import type { DataProject } from '@/types';

function ProjectImage({
  imageUrl,
  title,
  imagePosition,
  isTall,
}: {
  imageUrl: string;
  title: string;
  imagePosition?: string;
  isTall: boolean;
}) {
  // Shape-aware default: always anchor to top so header/hero of screenshot shows.
  // Tall cards get slight vertical offset so they show more than just nav bar.
  const defaultPosition = isTall ? 'center 5%' : 'center top';
  const position = imagePosition ?? defaultPosition;

  if (!imageUrl) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: 'var(--ds-surface-high)' }}
      >
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Image Pending
        </span>
      </div>
    );
  }
  return (
    <Image
      src={imageUrl}
      alt={title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      className="absolute inset-0 w-full object-cover"
      style={{ objectPosition: position }}
    />
  );
}

function ProjectCard({
  project,
  index,
  isDark,
  t,
}: {
  project: DataProject;
  index: number;
  isDark: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  // 5 projects + CTA in a 5-row × 12-col grid
  // Row 1-2: hero (8) | tall (4)
  // Row 3:   short (4) | short (4) | tall continues (4)
  // Row 4-5: wide (6) | CTA (6)
  const shapes = [
    'md:col-span-8 md:row-span-2', // 0: Hero
    'md:col-span-4 md:row-span-3', // 1: Tall
    'md:col-span-4 md:row-span-1', // 2: Short
    'md:col-span-4 md:row-span-1', // 3: Short
    'md:col-span-8 md:row-span-1', // 4: Wide short
  ];

  const shapeClass = shapes[index] || 'md:col-span-4 md:row-span-2';

  const isLarge = index === 0;
  const isTall = index === 1;
  const isSquare = false;
  const isShort = index === 2 || index === 3 || index === 4;

  const bgColor = index % 2 === 0 ? 'var(--ds-surface-container)' : 'var(--ds-surface-high)';

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 130, damping: 16, mass: 0.4 };
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 14);
    my.set(((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 14);
  }, [mx, my]);

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.95 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: (index % 4) * 0.08 }}
      className={`${shapeClass} group relative overflow-hidden rounded-xl`}
      style={{ backgroundColor: bgColor, x: sx, y: sy }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        boxShadow:
          'inset 0 0 0 1px color-mix(in srgb, var(--ds-primary) 40%, transparent), 0 8px 32px color-mix(in srgb, var(--ds-bg) 40%, transparent)',
      }}
    >
      <ProjectImage
        imageUrl={project.imageUrl}
        title={project.title}
        imagePosition={project.imagePosition}
        isTall={isTall}
      />

      {/* Gradients — dark: blend into bg; light: dark overlay for clean image contrast */}
      {isLarge && (
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? `linear-gradient(to top, var(--ds-bg) 0%, color-mix(in srgb, var(--ds-bg) 40%, transparent) 50%, transparent 100%)`
              : `linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)`,
          }}
        />
      )}
      {isTall && (
        <>
          {isDark && (
            <div className="absolute inset-0" style={{ backgroundColor: 'color-mix(in srgb, var(--ds-bg) 25%, transparent)' }} />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? 'linear-gradient(to top, var(--ds-bg) 0%, color-mix(in srgb, var(--ds-bg) 40%, transparent) 52%, transparent 100%)'
                : 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 52%, transparent 100%)',
            }}
          />
        </>
      )}
      {(isSquare || isShort) && (
        <div
          className="absolute inset-0"
          style={{
            background: project.imageUrl
              ? isDark
                ? `linear-gradient(to top, var(--ds-bg) 0%, color-mix(in srgb, var(--ds-bg) 70%, transparent) 55%, transparent 100%)`
                : `linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)`
              : undefined,
          }}
        />
      )}
      {/* Mobile: universal gradient so text is legible */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background: isDark
            ? 'linear-gradient(to top, var(--ds-bg) 0%, color-mix(in srgb, var(--ds-bg) 60%, transparent) 55%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)',
        }}
      />

      {/* Content — consistent order: tier → title → desc → stack → links */}
      <div
        className={`absolute ${
          isLarge || isTall
            ? 'bottom-0 left-0 w-full p-8 md:p-10 space-y-3'
            : 'inset-0 p-6 md:p-8 flex flex-col justify-end space-y-3'
        }`}
      >
        <h4
          className={`font-bold line-clamp-1 ${
            isLarge ? 'text-3xl md:text-4xl' : isTall || isSquare ? 'text-2xl' : 'text-lg'
          }`}
          style={{
            color: isDark ? 'var(--ds-on-surface)' : 'rgba(255,255,255,0.97)',
            fontFamily: 'var(--font-manrope), sans-serif',
          }}
        >
          {project.title}
        </h4>

        {!isShort && (
          <p
            className={`text-sm leading-relaxed line-clamp-2 ${isLarge ? 'max-w-md' : ''}`}
            style={{
              color: isDark ? 'var(--ds-on-surface-variant)' : 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {project.description}
          </p>
        )}

        <div className="flex items-center gap-4 pt-1">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: isDark ? 'var(--ds-outline)' : 'rgba(255,255,255,0.6)' }}
            >
              <FaGithub size={14} />
              <span style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Code</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: isDark ? 'var(--ds-primary)' : 'rgba(200,210,255,0.95)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('project_view_demo')} →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const WA_PHONE = '529904147791';
const WA_MESSAGE = "Hi! I saw your portfolio and I'd like to start a project together.";

export default function Projects() {
  const t = useTranslations('common');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  const visibleProjects = projects.filter((p) => !p.hidden && p.category !== 'entry');
  const displayedProjects = visibleProjects.slice(0, 5);

  return (
    <section
      id="projects"
      data-track-section="projects"
      className="py-28 px-8"
      style={{ backgroundColor: 'var(--ds-bg)', scrollMarginTop: '5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4"
        >
          <div className="space-y-2">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold block"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('projects_label')}
            </span>
            <h2
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
              style={{
                color: 'var(--ds-on-surface)',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
            >
              {t('projects_title')}{' '}
              <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
                {t('projects_title_accent')}
              </span>
            </h2>
          </div>
          <span
            className="text-sm uppercase tracking-widest pb-2"
            style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('projects_subtitle')}
          </span>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
          style={{ gridAutoRows: 'minmax(280px, auto)' }}
        >
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} isDark={isDark} t={t} />
            ))}

            {/* WhatsApp CTA — slot 6 */}
            <motion.a
              layout
              key="wa-cta"
              href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(WA_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.25 }}
              className="col-span-1 md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-xl flex items-center justify-center p-6 border border-dashed"
              style={{
                backgroundColor: 'var(--ds-surface)',
                borderColor: 'color-mix(in srgb, var(--ds-primary) 25%, transparent)',
              }}
            >
              <div className="text-center">
                <span
                  translate="no"
                  className="material-symbols-outlined text-3xl block mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: 'var(--ds-primary)', fontVariationSettings: "'FILL' 0" }}
                >
                  chat
                </span>
                <h4
                  className="text-sm font-bold uppercase tracking-widest mb-1"
                  style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
                >
                  Start a project
                </h4>
                <p
                  className="text-xs"
                  style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Let&apos;s build something together
                </p>
              </div>
            </motion.a>
          </AnimatePresence>
        </motion.div>
        {/* end bento grid */}
      </div>
    </section>
  );
}
