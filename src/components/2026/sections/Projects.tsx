import { useTranslations } from 'next-intl';

// TODO: replace with real project data / CMS feed
const PROJECTS = [
  {
    key: 'wallet-app',
    category: 'Fintech',
    tags: ['React', 'Next.js', 'TypeScript'],
    demo: null,
    code: null,
  },
  {
    key: 'scandia-ecommerce',
    category: 'E-commerce',
    tags: ['Shopify', 'Liquid', 'CSS'],
    demo: 'https://scandia.com',
    code: null,
  },
  {
    key: 'spa-rick-and-morty',
    category: 'Practice',
    tags: ['React', 'REST API'],
    demo: null,
    code: 'https://github.com',
  },
] as const;

function CategoryChip({ label }: { label: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
      style={{
        color: 'var(--ds-on-surface-variant)',
        background: 'color-mix(in srgb, var(--ds-outline-variant) 20%, transparent)',
        fontFamily: 'var(--ds-font-body)',
        letterSpacing: '0.06em',
      }}
    >
      {label}
    </span>
  );
}

function TechChip({ label }: { label: string }) {
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: 'var(--ds-secondary-container)',
        color: 'var(--ds-on-secondary)',
        fontFamily: 'var(--ds-font-body)',
      }}
    >
      {label}
    </span>
  );
}

export default function Projects() {
  const t = useTranslations('common');

  return (
    <section
      id="projects"
      className="w-full max-w-screen-xl mx-auto px-6 py-20"
      style={{ scrollMarginTop: '4.5rem' }}
    >
      {/* Section label */}
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--ds-font-body)', letterSpacing: '0.1em' }}
      >
        {t('projects')}
      </p>

      <h2
        className="text-3xl lg:text-4xl font-bold mb-14"
        style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--ds-font-display)', letterSpacing: '-0.02em' }}
      >
        Featured Work
      </h2>

      <div className="flex flex-col gap-px">
        {PROJECTS.map((project) => {
          const item = t.raw(`project_items.${project.key}`) as { title: string; description: string };

          return (
            <article
              key={project.key}
              className="group flex flex-col lg:flex-row lg:items-start gap-6 py-8 transition-colors"
              style={{ borderTop: '1px solid color-mix(in srgb, var(--ds-outline-variant) 20%, transparent)' }}
            >
              {/* Thumbnail — placeholder */}
              <div
                className="w-full lg:w-48 h-28 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: 'var(--ds-surface-container)' }}
                aria-hidden="true"
              >
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--ds-outline)', fontFamily: 'var(--ds-font-body)' }}
                >
                  Image pending
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CategoryChip label={project.category} />
                </div>

                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--ds-font-display)' }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--ds-font-body)', lineHeight: '1.6' }}
                >
                  {item.description}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {project.tags.map((tag) => (
                    <TechChip key={tag} label={tag} />
                  ))}

                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-sm font-medium transition-opacity hover:opacity-70"
                      style={{ color: 'var(--ds-primary)', fontFamily: 'var(--ds-font-body)' }}
                      aria-label={t('project_live_aria', { title: item.title })}
                    >
                      {t('project_view_demo')} ↗
                    </a>
                  )}

                  {project.code && (
                    <a
                      href={project.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium transition-opacity hover:opacity-70"
                      style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--ds-font-body)' }}
                      aria-label={t('project_code_aria', { title: item.title })}
                    >
                      {t('project_view_code')}
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
