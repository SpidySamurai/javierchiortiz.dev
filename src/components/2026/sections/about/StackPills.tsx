import { useTranslations } from 'next-intl';
import type { IconType } from 'react-icons';
import {
  SiApachespark,
  SiClaude,
  SiDjango,
  SiDotnet,
  SiFigma,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPrisma,
  SiPython,
  SiReact,
  SiScala,
  SiShopify,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si';
import { TbSql } from 'react-icons/tb';
import { Reveal, StaggerGroup } from '@/components/2026/ui/Reveal';

interface Tech {
  name: string;
  /** Brand mark, painted in its brand color; omitted when there is no recognizable mark. */
  icon?: IconType;
  color?: string;
}

/** Stack groups: the message key of the label and its technologies, in display order. */
const STACK_GROUPS: { labelKey: string; items: Tech[] }[] = [
  {
    labelKey: 'stack',
    items: [
      { name: 'Next.js', icon: SiNextdotjs, color: '#e2e8f0' },
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'NestJS', icon: SiNestjs, color: '#E0234E' },
      { name: 'Node.js', icon: SiNodedotjs, color: '#6cc24a' },
      { name: 'Prisma', icon: SiPrisma, color: '#5a67d8' },
      { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
    ],
  },
  {
    labelKey: 'about_ai',
    items: [
      { name: 'Claude', icon: SiClaude, color: '#D4A27F' },
      { name: 'OpenAI', icon: SiOpenai, color: '#74AA9C' },
      { name: 'n8n' },
    ],
  },
  {
    labelKey: 'about_tools',
    items: [
      { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
      { name: 'Shopify', icon: SiShopify, color: '#96BF48' },
    ],
  },
  {
    labelKey: 'about_also',
    items: [
      { name: 'Apache Spark', icon: SiApachespark, color: '#E25A1C' },
      { name: 'Scala', icon: SiScala, color: '#DC322F' },
      { name: 'Python', icon: SiPython, color: '#4B8BBE' },
      { name: 'Django', icon: SiDjango, color: '#44B78B' },
      { name: 'SQL Server', icon: TbSql, color: '#c0c1ff' },
      { name: '.NET', icon: SiDotnet, color: '#512BD4' },
    ],
  },
];

/** One group per block: a small label and its pills, each with the tech's logo in its brand color. */
export default function StackPills() {
  const t = useTranslations('common');

  return (
    <StaggerGroup className="flex flex-col gap-6" stagger={0.08}>
      {STACK_GROUPS.map(({ labelKey, items }) => (
        <Reveal key={labelKey} y={14}>
          <p
            className="text-[10px] uppercase tracking-[0.28em] font-bold mb-3"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t(labelKey as Parameters<typeof t>[0])}
          </p>
          <ul className="flex flex-wrap gap-2">
            {items.map(({ name, icon: Icon, color }) => (
              <li
                key={name}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-[10px] text-[13.5px] font-medium"
                style={{
                  backgroundColor: 'var(--ds-surface-high)',
                  color: 'var(--ds-on-surface)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {Icon && <Icon aria-hidden size={16} style={{ color, flexShrink: 0 }} />}
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </StaggerGroup>
  );
}
