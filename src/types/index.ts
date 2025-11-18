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
