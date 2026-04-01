'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { projects } from '@/data/projects';
import type { DataProject } from '@/types';

function CategoryPill({ label }: { label: string }) {
  return (
    <span
      className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
      style={{
        backgroundColor: 'rgba(62,60,143,0.8)',
        color: '#afadff',
        backdropFilter: 'blur(8px)',
      }}
    >
      {label}
    </span>
  );
}

function SmallChip({ label }: { label: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-[9px] uppercase border"
      style={{
        color: '#908fa0',
        borderColor: 'rgba(70,69,84,0.3)',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
    >
      {label}
    </span>
  );
}

function getCategoryLabel(project: DataProject): string {
  if (project.isWork) return 'Work';
  if (project.category === 'entry') return 'Entry';
  return 'Personal';
}

function getProjectUrl(project: DataProject): string | null {
  return project.liveUrl ?? project.repoUrl ?? null;
}

function ProjectImage({ imageUrl, title }: { imageUrl: string; title: string }) {
  if (!imageUrl) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: '#222a3d' }}
      >
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: '#908fa0', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Image Pending
        </span>
      </div>
    );
  }
  return (
    <img
      src={imageUrl}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

function ProjectLink({ project, label }: { project: DataProject; label: string }) {
  const url = getProjectUrl(project);
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block text-sm font-medium transition-opacity hover:opacity-70"
      style={{ color: '#c0c1ff' }}
    >
      {label}
    </a>
  );
}

export default function Projects() {
  const t = useTranslations('common');
  const [expanded, setExpanded] = useState(false);

  const featuredProjects = projects.filter((p) => !p.hidden && p.category === 'featured');
  const entryProjects = projects.filter((p) => !p.hidden && p.category === 'entry');

  const primaryFeatured = featuredProjects[0];
  const secondaryFeatured = featuredProjects[1];
  const tertiaryFeatured = featuredProjects[2];
  const additionalProjects = [...featuredProjects.slice(3), ...entryProjects];

  return (
    <section
      id="projects"
      className="py-28 px-8"
      style={{ backgroundColor: '#0b1326', scrollMarginTop: '5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="space-y-2">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold block"
              style={{ color: '#c0c1ff', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('projects_label')}
            </span>
            <h2
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
              style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              {t('projects_title')}{' '}
              <span style={{ color: '#c0c1ff', fontStyle: 'italic' }}>{t('projects_title_accent')}</span>
            </h2>
          </div>
          <span
            className="text-sm uppercase tracking-widest pb-2"
            style={{ color: '#908fa0', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('projects_subtitle')}
          </span>
        </div>

        {/* Bento grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8"
          style={{ gridAutoRows: 'minmax(240px, auto)' }}
        >
          {/* Primary featured: col-span-8 row-span-2 (large) */}
          {primaryFeatured && (
            <div
              className="md:col-span-8 md:row-span-2 group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-[0.98]"
              style={{ backgroundColor: '#171f33' }}
            >
              <ProjectImage imageUrl={primaryFeatured.imageUrl} title={primaryFeatured.title} />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, #0b1326 0%, rgba(11,19,38,0.2) 50%, transparent 100%)',
                }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-10 space-y-4 w-full">
                <div className="flex gap-3 flex-wrap">
                  <CategoryPill label={getCategoryLabel(primaryFeatured)} />
                </div>
                <h4
                  className="text-4xl font-bold"
                  style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
                >
                  {primaryFeatured.title}
                </h4>
                <p
                  className="max-w-md text-sm leading-relaxed"
                  style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {primaryFeatured.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {primaryFeatured.stack?.map((tech) => (
                    <SmallChip key={tech} label={tech} />
                  ))}
                </div>
                <ProjectLink project={primaryFeatured} label={t('project_view_study')} />
              </div>
            </div>
          )}

          {/* Secondary featured: col-span-4 row-span-3 (tall vertical) */}
          {secondaryFeatured && (
            <div
              className="md:col-span-4 md:row-span-3 group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-[0.98]"
              style={{ backgroundColor: '#222a3d' }}
            >
              <ProjectImage imageUrl={secondaryFeatured.imageUrl} title={secondaryFeatured.title} />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, #0b1326 0%, transparent 60%)',
                }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8 space-y-3">
                <CategoryPill label={getCategoryLabel(secondaryFeatured)} />
                <h4
                  className="text-2xl font-bold"
                  style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
                >
                  {secondaryFeatured.title}
                </h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {secondaryFeatured.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {secondaryFeatured.stack?.map((tech) => (
                    <SmallChip key={tech} label={tech} />
                  ))}
                </div>
                <ProjectLink project={secondaryFeatured} label={t('project_view_study')} />
              </div>
            </div>
          )}

          {/* Tertiary featured: col-span-4 row-span-2 (content card) */}
          {tertiaryFeatured && (
            <div
              className="md:col-span-4 md:row-span-2 group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-[0.98]"
              style={{ backgroundColor: '#171f33' }}
            >
              <ProjectImage imageUrl={tertiaryFeatured.imageUrl} title={tertiaryFeatured.title} />

              <div
                className="absolute inset-0 p-8 flex flex-col justify-between"
                style={{
                  background: tertiaryFeatured.imageUrl
                    ? 'linear-gradient(to top, #171f33 0%, rgba(23,31,51,0.7) 60%, transparent 100%)'
                    : undefined,
                }}
              >
                <div className="space-y-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(192,193,255,0.1)' }}
                  >
                    <span className="material-symbols-outlined" style={{ color: '#c0c1ff' }}>
                      code
                    </span>
                  </div>
                  <CategoryPill label={getCategoryLabel(tertiaryFeatured)} />
                  <h4
                    className="text-xl font-bold"
                    style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
                  >
                    {tertiaryFeatured.title}
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
                  >
                    {tertiaryFeatured.description}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {tertiaryFeatured.stack?.map((tech) => (
                      <SmallChip key={tech} label={tech} />
                    ))}
                  </div>
                  <ProjectLink project={tertiaryFeatured} label={t('project_view_study')} />
                </div>
              </div>
            </div>
          )}

          {/* More Projects button — shown when not expanded */}
          {!expanded && (
            <div
              className="md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-xl flex items-center justify-center p-8 cursor-pointer transition-all duration-500 hover:scale-[0.98]"
              style={{ backgroundColor: '#131b2e' }}
              onClick={() => setExpanded(true)}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = '#222a3d')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = '#131b2e')}
            >
              <div className="text-center">
                <span
                  className="material-symbols-outlined text-3xl block mb-2"
                  style={{ color: '#c0c1ff' }}
                >
                  folder_open
                </span>
                <h4
                  className="text-sm font-bold uppercase tracking-widest"
                  style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
                >
                  {t('projects_more')}
                </h4>
              </div>
            </div>
          )}

          {/* Additional projects — shown when expanded */}
          {expanded &&
            additionalProjects.map((project) => (
              <div
                key={project.id}
                className="md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-[0.98]"
                style={{ backgroundColor: '#131b2e' }}
              >
                <ProjectImage imageUrl={project.imageUrl} title={project.title} />

                {/* Gradient overlay */}
                {project.imageUrl && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, #131b2e 0%, rgba(19,27,46,0.7) 60%, transparent 100%)',
                    }}
                  />
                )}

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <CategoryPill label={getCategoryLabel(project)} />
                    <h4
                      className="text-lg font-bold"
                      style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
                    >
                      {project.title}
                    </h4>
                    <p
                      className="text-xs leading-relaxed line-clamp-3"
                      style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {project.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {project.stack?.map((tech) => (
                        <SmallChip key={tech} label={tech} />
                      ))}
                    </div>
                    <ProjectLink project={project} label={t('project_view_study')} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
