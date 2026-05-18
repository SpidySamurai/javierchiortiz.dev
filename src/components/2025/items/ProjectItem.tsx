'use client';

import { useRef, useEffect } from 'react';
// using native <img> for pan behavior; next/image was removed here intentionally
import TechStack from './TechStack';
import { useTranslations } from 'next-intl';

type ProjectItemProps = {
  id?: string;
  title: string;
  imageUrl: string;
  description?: string;
  stack?: string[];
  projectUrl?: string;
  liveUrl?: string | null;
  repoUrl?: string | null;
  category?: string;
  status?: string;
  hidden?: boolean;
  isWork?: boolean;
  company?: string;
  companyUrl?: string;
};

export default function ProjectItem({
  // id,
  title,
  imageUrl,
  description,
  stack = [],
  // projectUrl,
  liveUrl,
  repoUrl,
  category,
  status,
  hidden,
  isWork,
  company,
  companyUrl,
}: ProjectItemProps) {
  const t = useTranslations('common');
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const imgNatural = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // Recompute pan amount on resize if we have natural image dimensions
  useEffect(() => {
    function handleResize() {
      const wrapper = wrapperRef.current;
      if (!wrapper || !imgNatural.current.w) return;
      const wrapperWidth = wrapper.clientWidth;
      const scale = wrapperWidth / imgNatural.current.w;
      const scaledHeight = imgNatural.current.h * scale;
      const wrapperHeight = wrapper.clientHeight;
      const delta = Math.max(0, scaledHeight - wrapperHeight);
      wrapper.style.setProperty('--pan-amount', `-${Math.round(delta)}px`);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (hidden) return null;

  return (
    <div className="block">
      <div className="rounded-lg overflow-hidden transition-transform duration-300 p-4 space-y-4 hover:bg-surface hover:scale-[1.01] project-card">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-default">{title}</h3>
            {(category === 'entry' || isWork) && (
              <span className="text-xs px-2 py-0.5 rounded bg-surface text-muted">
                {t(isWork ? 'projects_work_label' : 'projects_entry_label')} •{' '}
                {t(`project_status.${status || 'wip'}`)}
              </span>
            )}
          </div>
          {company && (
            <div className="text-sm font-medium text-secondary">
              {companyUrl ? (
                <a
                  href={companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  @ {company}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ) : (
                <span>@ {company}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div
            ref={wrapperRef}
            className="w-full sm:w-1/3 max-w-[320px] relative aspect-[16/9] rounded-md overflow-hidden project-image-wrapper"
          >
            <img
              src={imageUrl}
              alt={title}
              className="rounded-md project-image"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onLoad={(e) => {
                const imgEl = e.currentTarget;
                if (!wrapperRef.current || !imgEl.naturalWidth) return;
                imgNatural.current = { w: imgEl.naturalWidth, h: imgEl.naturalHeight };
                const wrapper = wrapperRef.current;
                const wrapperWidth = wrapper.clientWidth;
                const scale = wrapperWidth / imgEl.naturalWidth;
                const scaledHeight = imgEl.naturalHeight * scale;
                const wrapperHeight = wrapper.clientHeight;
                const delta = Math.max(0, scaledHeight - wrapperHeight);
                wrapper.style.setProperty('--pan-amount', `-${Math.round(delta)}px`);
              }}
            />
          </div>

          <div className="sm:flex-1">
            <p className="text-sm text-muted">{description}</p>

            <div className="mt-4 flex items-center gap-3">
              {/* Live / Demo button */}
              {liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-secondary text-default hover:bg-secondary-light"
                  aria-label={t('project_live_aria', { title })}
                >
                  {t(isWork ? 'project_visit_site' : 'project_view_demo')}
                </a>
              ) : (
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-surface text-muted cursor-not-allowed"
                  aria-disabled
                  title={t('project_demo_unavailable')}
                >
                  {t('project_view_demo')}
                </button>
              )}

              {/* Code / Repo button */}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-surface text-default hover:bg-surface/80"
                  aria-label={t('project_code_aria', { title })}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.71.08-.71 1.18.08 1.8 1.21 1.8 1.21 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.74-1.56-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.19-3.07-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.17a11.1 11.1 0 0 1 2.9-.39c.98.01 1.97.13 2.9.39 2.2-1.49 3.17-1.17 3.17-1.17.63 1.59.23 2.77.11 3.06.74.8 1.19 1.82 1.19 3.07 0 4.4-2.69 5.37-5.25 5.65.42.36.8 1.07.8 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.71 21.38 24 17.08 24 12c0-6.35-5.15-11.5-12-11.5z" />
                  </svg>
                  {t('project_view_code')}
                </a>
              )}
            </div>

            <div className="mt-3">
              <TechStack stack={stack} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
