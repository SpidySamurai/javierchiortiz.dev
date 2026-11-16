import { useTranslations } from 'next-intl';
import { Reveal, StaggerGroup } from '@/components/2026/ui/Reveal';

/** Stack groups: the message key of the label and the names shown on its row. */
const STACK_GROUPS = [
  { labelKey: 'stack', names: ['Next.js', 'React', 'TypeScript', 'NestJS', 'Node.js', 'Prisma', 'Tailwind'] },
  { labelKey: 'about_ai', names: ['Claude', 'OpenAI', 'n8n'] },
  { labelKey: 'about_tools', names: ['Figma', 'Shopify'] },
  {
    labelKey: 'about_also',
    names: ['Apache Spark', 'Scala', 'Python', 'Django', 'SQL Server', '.NET'],
  },
] as const;

/** Text rows, one per group, separated by hairlines (same pattern as the "Why work with me" list). */
export default function StackRows() {
  const t = useTranslations('common');

  return (
    <StaggerGroup className="flex flex-col" stagger={0.08}>
      {STACK_GROUPS.map(({ labelKey, names }) => (
        <Reveal key={labelKey} y={14}>
          <div
            className="py-4"
            style={{ boxShadow: '0 1px 0 color-mix(in srgb, var(--ds-on-surface) 7%, transparent)' }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.28em] font-bold mb-1.5"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t(labelKey)}
            </p>
            <p
              className="text-base leading-relaxed"
              style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {names.join(' · ')}
            </p>
          </div>
        </Reveal>
      ))}
    </StaggerGroup>
  );
}
