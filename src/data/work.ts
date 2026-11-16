import type { LoopSources } from '@/types';
import { GALLERY } from '@/data/gallery';
import { LAB2NEXT_LOOP, LAB2NEXT_SITE_URL } from '@/data/lab2next';

/**
 * One entry of the Work page. Every text is a message key under the `common` namespace, so the
 * data stays language-free and a new project only needs its copy added to both message files.
 */
export interface WorkEntry {
  id: string;
  title: string;
  kind: string;
  description: string;
  role: string;
  period: string;
  /** Headline number shown prominently under the description, when the project has one. */
  metric?: string;
  liveUrl: string;
  loop: LoopSources;
}

const LAB2NEXT_ENTRY: WorkEntry = {
  id: 'lab2next',
  title: 'project_items.lab2next.title',
  kind: 'work_kind_product',
  description: 'product_description',
  role: 'work_lab2next_role',
  period: 'work_lab2next_period',
  metric: 'journey_items.lab2next.metric',
  liveUrl: LAB2NEXT_SITE_URL,
  loop: LAB2NEXT_LOOP,
};

/** Client work, in gallery order. Copy lives under `common.project_items.<id>`. */
const GALLERY_ENTRIES: WorkEntry[] = GALLERY.flatMap((project) => {
  const id = project.id ?? project.title;
  if (!project.liveUrl || !project.videoDesktop || !project.videoMobile) return [];
  return [
    {
      id,
      title: `project_items.${id}.title`,
      kind: `project_items.${id}.kind`,
      description: `project_items.${id}.description`,
      role: `project_items.${id}.role`,
      period: `project_items.${id}.period`,
      liveUrl: project.liveUrl,
      loop: {
        desktop: project.videoDesktop,
        mobile: project.videoMobile,
        desktopPoster: project.posterDesktop,
        mobilePoster: project.posterMobile,
      },
    },
  ];
});

/** The Work page, top to bottom. Append a project here to add it to the list. */
export const WORK: WorkEntry[] = [LAB2NEXT_ENTRY, ...GALLERY_ENTRIES];

/** A public repository shown in the Work page's open source list. Copy: `common.work_oss_items.<id>`. */
export interface OpenSourceEntry {
  id: string;
  /** Repository name under github.com/SpidySamurai. */
  repo: string;
}

export const GITHUB_USER = 'SpidySamurai';

/** The open source list, top to bottom. Append a repository here to add it. */
export const OPEN_SOURCE: OpenSourceEntry[] = [
  { id: 'lab2next-showcase', repo: 'lab2next-showcase' },
  { id: 'agents-tree', repo: 'claude-vezmex-team-tree' },
  { id: 'dev-environment-bootstrap', repo: 'dev-environment-bootstrap' },
  { id: 'solid-with-figures', repo: 'SOLID_with_figures' },
  { id: 'portfolio', repo: 'javierchiortiz.dev' },
];
