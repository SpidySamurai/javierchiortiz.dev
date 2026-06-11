'use client';

import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { projects } from '@/data/projects';
import type { DataProject } from '@/types';
import { EASE } from '@/components/2026/ui/Reveal';
import { TextReveal } from '@/components/2026/ui/TextReveal';

const TILT_SPRING = { stiffness: 130, damping: 16, mass: 0.4 };

function ProjectImage({
  imageUrl,
  title,
  description,
  imagePosition,
  isTall,
}: {
  imageUrl: string;
  title: string;
  description: string;
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
      alt={`${title} — ${description}`}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      className="absolute inset-0 w-full object-cover"
      style={{ objectPosition: position }}
    />
  );
}

function ProjectCard({
  project,
  isDark,
  reduce,
  item,
  t,
  shapeClass,
  variant,
  accentIndex,
}: {
  project: DataProject;
  isDark: boolean;
  reduce: boolean | null;
  item: Variants;
  t: ReturnType<typeof useTranslations>;
  shapeClass: string;
  variant: 'large' | 'tall' | 'short';
  accentIndex: number;
}) {
  const isLarge = variant === 'large';
  const isTall = variant === 'tall';
  const isSquare = false;
  const isShort = variant === 'short';

  const bgColor = accentIndex % 2 === 0 ? 'var(--ds-surface-container)' : 'var(--ds-surface-high)';

  // Pointer tilt (rotation) + cursor-follow glow share one mousemove pass.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-14, 14], [7, -7]), TILT_SPRING);
  const rotY = useSpring(useTransform(mx, [-14, 14], [-7, 7]), TILT_SPRING);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${gx}px ${gy}px, color-mix(in srgb, var(--ds-primary) 14%, transparent), transparent 75%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mx.set(((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 14);
      my.set(((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 14);
      gx.set(e.clientX - rect.left);
      gy.set(e.clientY - rect.top);
    },
    [mx, my, gx, gy, reduce],
  );

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const imageOrigin = isTall ? 'center 5%' : 'center top';

  return (
    <motion.div variants={item} className={shapeClass}>
      <motion.div
        className="group relative h-full overflow-hidden rounded-xl"
        style={{
          backgroundColor: bgColor,
          rotateX: reduce ? 0 : rotX,
          rotateY: reduce ? 0 : rotY,
          transformPerspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial="rest"
        animate="rest"
        whileHover={reduce ? undefined : 'hover'}
        variants={{
          rest: { y: 0, boxShadow: '0 0 0 0px transparent' },
          hover: {
            y: -6,
            boxShadow:
              'inset 0 0 0 1px color-mix(in srgb, var(--ds-primary) 40%, transparent), 0 12px 40px color-mix(in srgb, var(--ds-bg) 50%, transparent)',
          },
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 22, boxShadow: { duration: 0.25 } }}
      >
        {/* Screenshot — scales up on hover via propagated variant */}
        <motion.div
          className="absolute inset-0"
          variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
          transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          style={{ transformOrigin: imageOrigin }}
        >
          <ProjectImage
            imageUrl={project.imageUrl}
            title={project.title}
            description={project.description ?? ''}
            imagePosition={project.imagePosition}
            isTall={isTall}
          />
        </motion.div>

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

        {/* Cursor-follow spotlight — desktop only, suppressed under reduced-motion */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute inset-0 hidden md:block opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
            style={{ background: glow, willChange: 'background' }}
          />
        )}

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

          <p
            className={`leading-relaxed ${isShort ? 'text-xs line-clamp-1' : `text-sm line-clamp-2 ${isLarge ? 'max-w-md' : ''}`}`}
            style={{
              color: isDark ? 'var(--ds-on-surface-variant)' : 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {project.description}
          </p>

          <div className="flex items-center gap-4 pt-1">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded focus-visible:[outline-color:var(--ds-primary)]"
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
                className="group/demo inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded focus-visible:[outline-color:var(--ds-primary)]"
                style={{ color: isDark ? 'var(--ds-primary)' : 'rgba(200,210,255,0.95)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {t('project_view_demo')}
                <span
                  translate="no"
                  aria-hidden
                  className="material-symbols-outlined text-base inline-block transition-transform duration-200 motion-safe:group-hover/demo:translate-x-0.5 motion-safe:group-focus-visible/demo:translate-x-0.5"
                >
                  arrow_forward
                </span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FeaturedProject({
  project,
  reduce,
  t,
  eyebrow,
}: {
  project: DataProject;
  reduce: boolean | null;
  t: ReturnType<typeof useTranslations>;
  eyebrow: string;
}) {
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={reduce ? { duration: 0.3 } : { duration: 0.7, ease: EASE }}
      className="group grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-14 mb-10 md:mb-14"
    >
      {/* Screenshot — clean bordered frame, zooms on hover */}
      <div
        className="relative w-full overflow-hidden rounded-2xl order-1 lg:order-none"
        style={{
          aspectRatio: '16 / 10',
          boxShadow:
            '0 0 0 1px color-mix(in srgb, var(--ds-primary) 18%, transparent), 0 40px 90px -20px color-mix(in srgb, var(--ds-bg) 80%, transparent)',
        }}
      >
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={`${project.title} — ${project.description ?? ''}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'var(--ds-surface-high)' }}>
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--ds-outline)' }}>
              Image Pending
            </span>
          </div>
        )}
      </div>

      {/* Editorial copy */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping"
              style={{ backgroundColor: '#4ade80' }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: '#4ade80' }} />
          </span>
          <span
            className="text-xs uppercase tracking-[0.3em] font-bold"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {eyebrow}
          </span>
        </div>

        <h3
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-5"
          style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          <TextReveal>{project.title}</TextReveal>
        </h3>

        <p
          className="text-base md:text-lg leading-relaxed mb-7 max-w-xl"
          style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {project.description}
        </p>

        <div className="flex items-center gap-5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-transform duration-200 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ds-primary)]"
              style={{
                backgroundColor: 'var(--ds-primary)',
                color: 'var(--ds-on-primary)',
                fontFamily: 'var(--font-manrope), sans-serif',
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
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded focus-visible:[outline-color:var(--ds-primary)]"
              style={{ color: 'var(--ds-outline)' }}
            >
              <FaGithub size={15} />
              <span style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Code</span>
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
  const isDark = true; // dark-only site — no theme branching (avoids hydration mismatch)
  const reduce = useReducedMotion();

  const visibleProjects = projects.filter((p) => !p.hidden && p.category !== 'entry');
  // Lab2Next leads as a featured editorial block; the rest fill the bento.
  const featured = visibleProjects.find((p) => p.id === 'lab2next') ?? visibleProjects[0];
  const restProjects = visibleProjects.filter((p) => p.id !== featured?.id).slice(0, 4);

  // Bento shapes for the 4 remaining projects: two large, two short, + CTA.
  const REST_SHAPES: { cls: string; variant: 'large' | 'short' }[] = [
    { cls: 'md:col-span-6 md:row-span-2', variant: 'large' },
    { cls: 'md:col-span-6 md:row-span-2', variant: 'large' },
    { cls: 'md:col-span-4 md:row-span-1', variant: 'short' },
    { cls: 'md:col-span-4 md:row-span-1', variant: 'short' },
  ];

  // Bento entrance: grid orchestrates, each child carries the reveal values.
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE } },
      };

  // Magnetic pull on the lead-conversion CTA (mirrors the project-card spring).
  const ctaMx = useMotionValue(0);
  const ctaMy = useMotionValue(0);
  const ctaSx = useSpring(ctaMx, TILT_SPRING);
  const ctaSy = useSpring(ctaMy, TILT_SPRING);

  const handleCtaMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (reduce) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const px = ((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 18;
      const py = ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 18;
      ctaMx.set(Math.max(-20, Math.min(20, px)));
      ctaMy.set(Math.max(-20, Math.min(20, py)));
    },
    [ctaMx, ctaMy, reduce],
  );

  const handleCtaLeave = useCallback(() => {
    ctaMx.set(0);
    ctaMy.set(0);
  }, [ctaMx, ctaMy]);

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
            style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('projects_subtitle')}
          </span>
        </motion.div>

        {/* Featured lead project */}
        {featured && (
          <FeaturedProject project={featured} reduce={reduce} t={t} eyebrow="Featured · Landing page" />
        )}

        {/* Bento grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
          style={{ gridAutoRows: 'minmax(280px, auto)' }}
        >
          {restProjects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              isDark={isDark}
              reduce={reduce}
              item={item}
              t={t}
              shapeClass={REST_SHAPES[i]?.cls ?? 'md:col-span-4 md:row-span-1'}
              variant={REST_SHAPES[i]?.variant ?? 'short'}
              accentIndex={i}
            />
          ))}

          {/* WhatsApp CTA — slot 6, magnetic lead action */}
          <motion.a
            key="wa-cta"
            href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(WA_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            variants={item}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            onMouseMove={handleCtaMove}
            onMouseLeave={handleCtaLeave}
            className="col-span-1 md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-xl flex items-center justify-center p-6 border border-dashed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ds-primary)]"
            style={{
              x: ctaSx,
              y: ctaSy,
              backgroundColor: 'var(--ds-surface)',
              borderColor: 'color-mix(in srgb, var(--ds-primary) 25%, transparent)',
            }}
          >
            <div className="text-center">
              <span
                translate="no"
                className="material-symbols-outlined text-3xl block mb-3 transition-transform duration-300 motion-safe:group-hover:scale-110"
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
        </motion.div>
        {/* end bento grid */}
      </div>
    </section>
  );
}
