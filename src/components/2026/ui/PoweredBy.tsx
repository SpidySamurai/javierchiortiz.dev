import type { Company } from '@/data/companies';
import { LogoMark } from '@/components/2026/ui/LogoMark';

/** "Powered by" credit linking to the company's site, with its mark in the muted footer tone. */
export function PoweredBy({ company }: { company: Company }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Powered by ${company.name}`}
      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors text-[var(--ds-outline)] hover:text-[var(--ds-on-surface)] rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--ds-primary)]"
      style={{ fontFamily: 'var(--font-inter), sans-serif', textDecoration: 'none' }}
    >
      Powered by
      {company.logo ? <LogoMark logo={company.logo} scale={0.5} /> : company.name}
    </a>
  );
}
