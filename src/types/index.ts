import type { IconType } from 'react-icons';

export type TechId = string;

export interface TechInfo {
  icon?: IconType;
  label: string;
  color: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description?: string;
  coverImage?: string;
  tech?: TechId[];
  url?: string;
  repo?: string;
  featured?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  from: string;
  to?: string;
  details?: string[];
}

// Data shapes used by the local static data files (src/data/*)
// These types match the shape used in src/data/projects.ts and src/data/experiences.ts
export type DataProject = {
  id?: string;
  title: string;
  imageUrl: string;
  description?: string;
  stack?: string[];
  projectUrl?: string; // legacy
  liveUrl?: string | null;
  repoUrl?: string | null;
  category?: 'featured' | 'entry' | 'other';
  status?: 'complete' | 'wip' | 'planning' | 'archived';
  hidden?: boolean;
};

export type DataExperience = {
  title: string;
  date: string;
  description: string;
  stack: string[];
};
