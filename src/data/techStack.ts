// src/data/techIcons.ts
import { IconType } from 'react-icons';
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiScala,
  SiApachespark,
  SiDotnet,
  SiJavascript,
  SiRuby,
  SiCss3,
  SiHtml5,
  SiSass,
  SiPython,
  SiDjango,
  SiSharp,
} from 'react-icons/si';

export const techIcons: Record<
  string,
  { icon?: IconType; label: string; color: string }
> = {
  TypeScript: {
    icon: SiTypescript,
    label: 'TypeScript',
    color: '#3178C6',
  },
  JS: {
    icon: SiJavascript,
    label: 'JavaScript',
    color: '#F7DF1E',
  },
  Next: {
    icon: SiNextdotjs,
    label: 'Next.js',
    color: '#ffffff',
  },
  React: {
    icon: SiReact,
    label: 'React',
    color: '#61DAFB',
  },
  Tailwind: {
    icon: SiTailwindcss,
    label: 'Tailwind',
    color: '#38BDF8',
  },
  CSS: {
    icon: SiCss3,
    label: 'CSS3',
    color: '#1572B6',
  },
  HTML: {
    icon: SiHtml5,
    label: 'HTML5',
    color: '#E34F26',
  },
  SQL: {
    label: 'SQL Server',
    color: '#CC2927',
  },
  Scala: {
    icon: SiScala,
    label: 'Scala',
    color: '#DC322F',
  },
  Spark: {
    icon: SiApachespark,
    label: 'Apache Spark',
    color: '#E25A1C',
  },
  DotNet: {
    icon: SiDotnet,
    label: '.NET',
    color: '#512BD4',
  },
  Ruby: {
    icon: SiRuby,
    label: 'Ruby',
    color: '#CC342D',
  },
  ROR: {
    icon: SiRuby,
    label: 'Ruby On Rails',
    color: '#CC0000',
  },
  SASS: {
    icon: SiSass,
    label: 'SASS',
    color: '#CC6699',
  },
  Python: {
    icon: SiPython,
    label: 'Python',
    color: '#3776AB',
  },
  Django: {
    icon: SiDjango,
    label: 'Django',
    color: '#ffffff',
  },
  CSharp: {
    icon: SiSharp,
    label: 'C#',
    color: '#239120',
  },
};
