'use client';

import { useMemo, useState } from 'react';
import ProjectItem from '../items/ProjectItem';
import { projects } from '@/data/projects';
import { useTranslation } from 'react-i18next';

const Projects = () => {
  const [query, setQuery] = useState('');
  const { t } = useTranslation('common');

  const localizedProjects = useMemo(() => {
    return projects.map((project, index) => {
      const projectId = project.id || `project_${index}`;
      const title = t(`project_items.${projectId}.title`, { defaultValue: project.title });
      const description = project.description
        ? t(`project_items.${projectId}.description`, { defaultValue: project.description })
        : undefined;

      return { ...project, id: projectId, title, description };
    });
  }, [t]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return localizedProjects;

    return localizedProjects.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(q);
      const inDesc = p.description?.toLowerCase().includes(q);
      const inStack = p.stack?.some((s) => s.toLowerCase().includes(q));
      const inUrl = !!p.projectUrl && p.projectUrl.toLowerCase().includes(q);
      return inTitle || inDesc || inStack || inUrl;
    });
  }, [query, localizedProjects]);

  return (
    <section id="projects" className="pl-2 flex flex-col gap-6 text-lg text-default">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold mb-2 text-default">{t('projects')}</h2>

        <div className="flex items-center gap-2">
          <label htmlFor="projects-search" className="sr-only">
            {t('projects_search_label')}
          </label>
          <input
            id="projects-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('projects_search_placeholder')}
            className="w-full max-w-md bg-surface/40 text-default placeholder:text-muted px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          {query && (
            <button
              aria-label={t('projects_clear')}
              onClick={() => setQuery('')}
              className="ml-2 text-sm text-muted hover:text-default"
            >
              {t('projects_clear')}
            </button>
          )}
        </div>
      </div>

      <div className="pt-2 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <p className="text-muted">{t('projects_empty', { query })}</p>
        ) : (
          filtered.map((project) => <ProjectItem key={project.id ?? project.title} {...project} />)
        )}
      </div>
    </section>
  );
};

export default Projects;
