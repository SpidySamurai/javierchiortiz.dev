'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { GALLERY } from '@/data/gallery';
import type { DataProject } from '@/types';
import { EASE } from '@/components/2026/ui/Reveal';
import { ScrollFillText } from '@/components/2026/ui/ScrollFillText';
import { GalleryTile, type GalleryTileCopy } from '@/components/2026/sections/projects/GalleryTile';

const FONT_BODY = 'var(--font-inter), sans-serif';
const FONT_HEAD = 'var(--font-manrope), sans-serif';

/**
 * Bento shapes, in gallery order. On a phone every tile is a tall 9:16 box in
 * two columns. From md up the grid has 12 columns of 170px rows: wide tiles
 * play the desktop loop, the narrow one the phone loop.
 */
const TILE_SHAPES = [
  'md:col-span-7 md:row-span-2',
  'md:col-span-5 md:row-span-2',
  'md:col-span-3 md:row-span-2',
  'md:col-span-9 md:row-span-2',
];

export default function Projects() {
  const t = useTranslations('common');
  const reduce = useReducedMotion();

  const copyFor = (project: DataProject): GalleryTileCopy => {
    const id = project.id ?? project.title;
    const title = t(`project_items.${id}.title`);
    const facts: [string, string][] = [
      [t('projects_company'), t(`project_items.${id}.client`)],
      [t('projects_role'), t(`project_items.${id}.role`)],
    ];
    if (t.has(`project_items.${id}.period`)) {
      facts.push([t('projects_period'), t(`project_items.${id}.period`)]);
    }
    return {
      title,
      kind: t(`project_items.${id}.kind`),
      description: t(`project_items.${id}.description`),
      facts,
      liveLabel: t('project_view_demo'),
      liveAria: t('project_live_aria', { title }),
    };
  };

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
              <ScrollFillText>
                {t('projects_title')}{' '}
                <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
                  {t('projects_title_accent')}
                </span>
              </ScrollFillText>
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
          className="text-base md:text-lg leading-relaxed max-w-2xl mb-12"
          style={{ color: 'var(--ds-on-surface-variant)', fontFamily: FONT_BODY }}
        >
          {t('projects_intro')}
        </p>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={reduce ? { duration: 0.3 } : { duration: 0.6, ease: EASE }}
          className="grid grid-cols-2 md:grid-cols-12 md:auto-rows-[170px] gap-2.5"
        >
          {GALLERY.map((project, i) => (
            <GalleryTile
              key={project.id}
              project={project}
              copy={copyFor(project)}
              className={`aspect-[9/16] md:aspect-auto ${
                TILE_SHAPES[i] ?? 'md:col-span-4 md:row-span-2'
              }`}
            />
          ))}
        </motion.div>

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
