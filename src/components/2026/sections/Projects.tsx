'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { projects } from '@/data/projects';
import type { DataProject } from '@/types';
import { EASE } from '@/components/2026/ui/Reveal';
import { TextReveal } from '@/components/2026/ui/TextReveal';

const FONT_BODY = 'var(--font-inter), sans-serif';
const FONT_HEAD = 'var(--font-manrope), sans-serif';

// Desktop and mobile walkthroughs share one height: 16:9 next to a tall phone capture.
const MEDIA_COLUMNS = 'minmax(0, 1fr) minmax(0, 0.317fr)';

function WalkthroughVideo({
  src,
  poster,
  radius,
  label,
  reduce,
}: {
  src: string;
  poster?: string;
  radius: number;
  label: string;
  reduce: boolean | null;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.35 });

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (inView && !reduce) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, reduce]);

  return (
    <video
      ref={ref}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      className="absolute inset-0 block h-full w-full object-cover"
      style={{ borderRadius: radius, backgroundColor: 'var(--ds-surface-high)' }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3" style={{ backgroundColor: 'var(--ds-surface-high)', borderRadius: 6 }}>
      <dt
        className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1"
        style={{ color: 'var(--ds-outline)', fontFamily: FONT_BODY }}
      >
        {label}
      </dt>
      <dd
        className="text-sm leading-snug"
        style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_BODY }}
      >
        {value}
      </dd>
    </div>
  );
}

function ProjectPanel({
  project,
  index,
  full,
  reduce,
  t,
}: {
  project: DataProject;
  index: number;
  full: boolean;
  reduce: boolean | null;
  t: ReturnType<typeof useTranslations>;
}) {
  const id = project.id ?? project.title;
  const title = t(`project_items.${id}.title`);
  const domain = project.liveUrl ? new URL(project.liveUrl).hostname.replace(/^www\./, '') : '';

  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={reduce ? { duration: 0.3 } : { duration: 0.6, ease: EASE }}
      className={`flex flex-col gap-6 rounded-xl p-6 md:p-8 ${full ? 'md:col-span-2' : ''}`}
      style={{ backgroundColor: 'var(--ds-surface-container)' }}
    >
      <header className={`flex flex-col gap-4 ${full ? 'md:flex-row md:items-end md:justify-between' : ''}`}>
        <div className="space-y-3 max-w-2xl">
          <span
            className="text-xs font-bold tracking-[0.3em] block"
            style={{ color: 'var(--ds-primary)', fontFamily: FONT_BODY }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3
            className="text-2xl md:text-4xl font-black tracking-tight"
            style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_HEAD }}
          >
            {title}
          </h3>
          <p
            className="text-sm md:text-base leading-relaxed"
            style={{ color: 'var(--ds-on-surface-variant)', fontFamily: FONT_BODY }}
          >
            {t(`project_items.${id}.description`)}
          </p>
        </div>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('project_live_aria', { title })}
            className="group/cta inline-flex shrink-0 self-start items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-transform duration-200 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ds-primary)]"
            style={{
              backgroundColor: 'var(--ds-primary)',
              color: 'var(--ds-on-primary)',
              fontFamily: FONT_HEAD,
            }}
          >
            {t('project_view_demo')}
            <span
              translate="no"
              aria-hidden
              className="material-symbols-outlined text-base inline-block transition-transform duration-200 motion-safe:group-hover/cta:translate-x-1"
            >
              arrow_forward
            </span>
          </a>
        )}
      </header>

      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <InfoCell label={t('projects_client')} value={t(`project_items.${id}.client`)} />
        <InfoCell label={t('projects_role')} value={t(`project_items.${id}.role`)} />
        <InfoCell label={t('projects_period')} value={t(`project_items.${id}.period`)} />
      </dl>

      {project.videoDesktop && project.videoMobile && (
        <div className="grid gap-3 md:gap-4" style={{ gridTemplateColumns: MEDIA_COLUMNS }}>
          <div className="relative" style={{ aspectRatio: '16 / 9' }}>
            <WalkthroughVideo
              src={project.videoDesktop}
              poster={project.posterDesktop}
              radius={6}
              label={`${title}, desktop`}
              reduce={reduce}
            />
          </div>
          <div className="relative">
            <WalkthroughVideo
              src={project.videoMobile}
              poster={project.posterMobile}
              radius={8}
              label={`${title}, mobile`}
              reduce={reduce}
            />
          </div>
        </div>
      )}

      <footer
        className="flex items-center justify-between gap-4 pt-1 text-xs"
        style={{ color: 'var(--ds-outline)', fontFamily: FONT_BODY }}
      >
        <span className="tracking-wide">{domain}</span>
        <span className="inline-flex items-center gap-2 uppercase tracking-widest font-bold">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: 'var(--ds-primary)' }}
          />
          {t('project_status.complete')}
        </span>
      </footer>
    </motion.article>
  );
}

export default function Projects() {
  const t = useTranslations('common');
  const reduce = useReducedMotion();

  const panels = projects.filter(
    (p) => !p.hidden && p.category !== 'entry' && p.id !== 'lab2next' && p.videoDesktop,
  );

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
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={reduce ? { duration: 0.3 } : { duration: 0.5, ease: EASE }}
          className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4"
        >
          <div className="space-y-2">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold block"
              style={{ color: 'var(--ds-primary)', fontFamily: FONT_BODY }}
            >
              {t('projects_label')}
            </span>
            <h2
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
              style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_HEAD }}
            >
              <TextReveal>
                {t('projects_title')}{' '}
                <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
                  {t('projects_title_accent')}
                </span>
              </TextReveal>
            </h2>
          </div>
          <span
            className="text-sm uppercase tracking-widest pb-2"
            style={{ color: 'var(--ds-outline)', fontFamily: FONT_BODY }}
          >
            {t('projects_subtitle')}
          </span>
        </motion.div>

        <p
          className="text-base md:text-lg leading-relaxed max-w-2xl mb-12 md:mb-16"
          style={{ color: 'var(--ds-on-surface-variant)', fontFamily: FONT_BODY }}
        >
          {t('projects_intro')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {panels.map((project, i) => (
            <ProjectPanel
              key={project.id}
              project={project}
              index={i}
              full={i === 0}
              reduce={reduce}
              t={t}
            />
          ))}
        </div>

        <p
          className="mt-12 text-sm max-w-2xl"
          style={{ color: 'var(--ds-outline)', fontFamily: FONT_BODY }}
        >
          {t('projects_confidentiality')}
        </p>
      </div>
    </section>
  );
}
