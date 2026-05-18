export const NAV_ITEMS = [
  { id: 'experience', icon: 'work', key: 'experience' },
  { id: 'projects', icon: 'grid_view', key: 'projects' },
  { id: 'about', icon: 'person', key: 'about' },
  { id: 'services', icon: 'design_services', key: 'services_label' },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
export const SECTION_IDS = NAV_ITEMS.map((item) => item.id) as string[];
