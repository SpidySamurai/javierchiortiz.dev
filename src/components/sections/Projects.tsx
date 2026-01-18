import { useMemo, useState } from 'react';
import ProjectItem from '../items/ProjectItem';
import { projects } from '@/data/projects';
import { useTranslations } from 'next-intl';

const Projects = () => {
  const [query, setQuery] = useState('');
  const t = useTranslations('common');

  const localizedProjects = useMemo(() => {
    return projects.map((project, index) => {
      const projectId = project.id || `project_${index}`;
      const title = t(`project_items.${projectId}.title`);
      const description = project.description
        ? t(`project_items.${projectId}.description`)
        : undefined;

      return { ...project, id: projectId, title, description };
    });
  }, [t]);

  type TabId = 'all' | 'work' | 'personal' | 'entry';
  const [activeTab, setActiveTab] = useState<TabId>('all');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'all', label: 'projects_tab_all' },
    { id: 'work', label: 'projects_tab_work' },
    { id: 'personal', label: 'projects_tab_personal' },
    { id: 'entry', label: 'projects_tab_entry' },
  ];

  const filtered = useMemo(() => {
    let result = localizedProjects;

    // Filter by Tab
    if (activeTab === 'work') {
      result = result.filter((p) => p.isWork);
    } else if (activeTab === 'personal') {
      result = result.filter((p) => !p.isWork && p.category !== 'entry');
    } else if (activeTab === 'entry') {
      result = result.filter((p) => p.category === 'entry');
    }

    // Filter by Query
    const q = query.trim().toLowerCase();
    if (!q) return result;

    return result.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(q);
      const inDesc = p.description?.toLowerCase().includes(q);
      const inStack = p.stack?.some((s) => s.toLowerCase().includes(q));
      const inUrl = !!p.projectUrl && p.projectUrl.toLowerCase().includes(q);
      return inTitle || inDesc || inStack || inUrl;
    });
  }, [query, localizedProjects, activeTab]);

  return (
    <section id="projects" className="pl-2 flex flex-col gap-6 text-lg text-default">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-default">{t('projects')}</h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-secondary text-default'
                  : 'bg-surface text-muted hover:text-default hover:bg-surface/80'
                }`}
            >
              {t(tab.label)}
            </button>
          ))}
        </div>

        {/* Search */}
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
