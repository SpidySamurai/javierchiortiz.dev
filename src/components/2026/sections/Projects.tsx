'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { projects } from '@/data/projects';
import type { DataProject } from '@/types';

function CategoryPill({ label }: { label: string }) {
  return (
    <span
      className="self-start px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
      style={{
        backgroundColor: 'var(--ds-secondary-container)',
        color: 'var(--ds-on-secondary)',
      }}
    >
      {label}
    </span>
  );
}

function SmallChip({ label }: { label: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-[11px] uppercase border"
      style={{
        color: 'var(--ds-outline)',
        borderColor: 'color-mix(in srgb, var(--ds-outline-variant) 30%, transparent)',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
    >
      {label}
    </span>
  );
}

function getCategoryLabel(project: DataProject): string {
  if (project.category === 'entry') return 'Practice';
  if (project.isWork && project.company) return project.company;
  if (project.isWork) return 'Work';
  if (project.id === 'lab2next') return 'SaaS';
  return 'Personal';
}

function ProjectImage({
  imageUrl,
  title,
  imagePosition,
}: {
  imageUrl: string;
  title: string;
  imagePosition?: string;
}) {
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
    <>
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="absolute inset-0 w-full object-cover"
        style={{ objectPosition: imagePosition ?? 'center 8%' }}
      />
    </>
  );
}

function ProjectCard({
  project,
  index,
  t,
}: {
  project: DataProject;
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  // Common span and layout classes strictly designed to fit 8 projects into a perfect 6-row by 12-column Grid
  const shapes = [
    'md:col-span-8 md:row-span-2', // 0: Large (Rows 1-2, cols 1-8)
    'md:col-span-4 md:row-span-3', // 1: Tall (Rows 1-3, cols 9-12)
    'md:col-span-4 md:row-span-2', // 2: Square (Rows 3-4, cols 1-4)
    'md:col-span-4 md:row-span-2', // 3: Square (Rows 3-4, cols 5-8)
    'md:col-span-4 md:row-span-1', // 4: Short (Row 4, cols 9-12) -> Finishes 4 rows exactly!
    'md:col-span-6 md:row-span-2', // 5: Wide square (Rows 5-6, cols 1-6)
    'md:col-span-6 md:row-span-1', // 6: Wide short (Row 5, cols 7-12)
    'md:col-span-3 md:row-span-1', // 7: Small (Row 6, cols 7-9)
  ];

  const shapeClass = shapes[index] || 'md:col-span-4 md:row-span-2';

  const isLarge = index === 0;
  const isTall = index === 1;
  const isSquare = index === 2 || index === 3 || index === 5;
  const isShort = index === 4 || index === 6 || index === 7;

  const bgColor = index % 2 === 0 ? 'var(--ds-surface-container)' : 'var(--ds-surface-high)';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.95 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: (index % 4) * 0.08 }}
      className={`${shapeClass} group relative overflow-hidden rounded-xl transition-shadow duration-300 hover:shadow-[inset_0_0_0_1px_rgba(192,193,255,0.4),0_8px_32px_rgba(11,19,38,0.4)]`}
      style={{ backgroundColor: bgColor }}
    >
      <ProjectImage
        imageUrl={project.imageUrl}
        title={project.title}
        imagePosition={project.imagePosition}
      />

      {/* Gradients */}
      {isLarge && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, var(--ds-bg) 0%, color-mix(in srgb, var(--ds-bg) 20%, transparent) 50%, transparent 100%)`,
          }}
        />
      )}
      {isTall && (
        <>
          {/* Full-card dark tint so light-bg screenshots blend with dark theme */}
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(11,19,38,0.35)' }} />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, var(--ds-bg) 0%, color-mix(in srgb, var(--ds-bg) 20%, transparent) 55%, transparent 100%)',
            }}
          />
        </>
      )}
      {(isSquare || isShort) && (
        <div
          className="absolute inset-0"
          style={{
            background: project.imageUrl
              ? `linear-gradient(to top, var(--ds-surface-container) 0%, color-mix(in srgb, var(--ds-surface-container) 85%, transparent) 70%, transparent 100%)`
              : undefined,
          }}
        />
      )}
      {/* Mobile: universal stronger gradient so text is always legible */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            'linear-gradient(to top, var(--ds-surface-container) 0%, color-mix(in srgb, var(--ds-surface-container) 60%, transparent) 55%, transparent 100%)',
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
        <CategoryPill label={getCategoryLabel(project)} />

        <h4
          className={`font-bold line-clamp-1 ${
            isLarge ? 'text-3xl md:text-4xl' : isTall || isSquare ? 'text-2xl' : 'text-lg'
          }`}
          style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          {project.title}
        </h4>

        {!isShort && (
          <p
            className={`text-sm leading-relaxed line-clamp-2 ${isLarge ? 'max-w-md' : ''}`}
            style={{
              color: 'var(--ds-on-surface-variant)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {project.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {project.stack?.slice(0, isShort ? 2 : isLarge ? 6 : 4).map((tech) => (
            <SmallChip key={tech} label={tech} />
          ))}
          {project.stack && project.stack.length > (isShort ? 2 : isLarge ? 6 : 4) && (
            <SmallChip label={`+${project.stack.length - (isShort ? 2 : isLarge ? 6 : 4)}`} />
          )}
        </div>

        <div className="flex items-center gap-4 pt-1">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--ds-outline)' }}
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
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('project_view_demo')} →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const t = useTranslations('common');
  const [showMore, setShowMore] = useState(false);

  const visibleProjects = projects.filter((p) => !p.hidden);

  // Show 4 projects initially, or all if expanded
  const displayedProjects = showMore ? visibleProjects : visibleProjects.slice(0, 4);

  return (
    <section
      id="projects"
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
              <ProjectCard key={project.id} project={project} index={i} t={t} />
            ))}

            {/* More Projects — slot 4 */}
            {!showMore && visibleProjects.length > 4 && (
              <motion.button
                layout
                key="more-btn"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
                onClick={() => setShowMore(true)}
                className="col-span-1 md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-xl flex items-center justify-center p-8 transition-colors duration-300 hover:bg-[#222a3d] border border-dashed text-left w-full h-full"
                style={{
                  backgroundColor: 'var(--ds-surface)',
                  borderColor: 'color-mix(in srgb, var(--ds-primary) 20%, transparent)',
                }}
              >
                <div className="text-center">
                  <span
                    className="material-symbols-outlined text-3xl block mb-2 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: 'var(--ds-primary)' }}
                  >
                    grid_view
                  </span>
                  <h4
                    className="text-sm font-bold uppercase tracking-widest"
                    style={{
                      color: 'var(--ds-on-surface)',
                      fontFamily: 'var(--font-manrope), sans-serif',
                    }}
                  >
                    {t('projects_more')}
                  </h4>
                </div>
              </motion.button>
            )}

            {/* Show Less — slot final */}
            {showMore && (
              <motion.button
                key="less-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut', delay: 0.3 }}
                onClick={() => {
                  setShowMore(false);
                  setTimeout(() => {
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                  }, 500);
                }}
                className="col-span-1 md:col-start-10 md:col-span-3 md:row-start-6 md:row-span-1 group relative overflow-hidden rounded-xl flex items-center justify-center p-6 transition-colors duration-300 hover:bg-[#222a3d] border border-dashed"
                style={{
                  backgroundColor: 'var(--ds-surface)',
                  borderColor: 'color-mix(in srgb, var(--ds-primary) 20%, transparent)',
                }}
              >
                <div className="flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <span
                    className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:-translate-y-1 block"
                    style={{ color: 'var(--ds-primary)' }}
                  >
                    expand_less
                  </span>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{
                      color: 'var(--ds-primary)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    Less
                  </span>
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
        {/* end bento grid */}
      </div>
    </section>
  );
}
