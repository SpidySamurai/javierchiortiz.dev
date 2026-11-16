import type { DataProject } from '@/types';
import { projects } from './projects';

/**
 * brania.ai lives only in the 2026 gallery: /2025 lists every entry of
 * `projects`, and that design is kept as it was.
 */
const brania: DataProject = {
  id: 'brania',
  title: 'brania.ai',
  imageUrl: '/utils/img/projects/brania-desktop.jpg',
  liveUrl: 'https://www.brania.ai/',
  category: 'featured',
  isWork: true,
  company: 'BRANIA',
  companyUrl: 'https://www.brania.ai/',
  videoDesktop: '/videos/projects/brania-desktop.mp4',
  videoMobile: '/videos/projects/brania-mobile.mp4',
  posterDesktop: '/utils/img/projects/brania-desktop.jpg',
  posterMobile: '/utils/img/projects/brania-mobile.jpg',
};

/** The 2026 work gallery, in bento order. Copy for each one lives under `common.project_items`. */
const GALLERY_IDS = ['brania', 'scandia-ecommerce', 'saunas-com', 'sun-valley-salt'] as const;

const byId = new Map([...projects, brania].map((p) => [p.id, p]));

export const GALLERY: DataProject[] = GALLERY_IDS.map((id) => {
  const project = byId.get(id);
  if (!project) throw new Error(`Gallery project not found: ${id}`);
  return project;
});
