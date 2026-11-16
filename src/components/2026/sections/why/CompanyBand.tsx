import type { Company } from '@/data/companies';

const TONE = 'color-mix(in srgb, var(--ds-on-surface) 55%, transparent)';
const HAIRLINE = 'color-mix(in srgb, var(--ds-on-surface) 7%, transparent)';

/** One company as a link to its site; on hover or focus it lifts from the muted tone to full text color. */
function CompanyMark({ company, hidden = false }: { company: Company; hidden?: boolean }) {
  const { logo } = company;
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={hidden ? -1 : undefined}
      className="company-link inline-flex items-center gap-2.5 shrink-0 whitespace-nowrap rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--ds-primary)]"
    >
      {logo && (
        <span
          aria-hidden
          className="block shrink-0"
          style={{
            width: logo.width,
            height: logo.height,
            backgroundColor: 'currentColor',
            WebkitMask: `url(${logo.src}) center / contain no-repeat`,
            mask: `url(${logo.src}) center / contain no-repeat`,
          }}
        />
      )}
      {company.name}
    </a>
  );
}

/**
 * A slow marquee of the companies Javier worked at and with: logo (when there is one) and name,
 * in one muted tone, each linking to its site. Hover or keyboard focus pauses the band so a link
 * can be clicked. The second copy only closes the loop (hidden and out of the tab order);
 * reduced motion shows one static row.
 */
export function CompanyBand({ label, companies }: { label: string; companies: readonly Company[] }) {
  return (
    <div className="mt-20">
      <p
        className="text-xs uppercase tracking-[0.24em] font-bold"
        style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {label}
      </p>
      <div
        className="company-band mt-4 overflow-hidden py-6"
        style={{ boxShadow: `0 1px 0 ${HAIRLINE}, 0 -1px 0 ${HAIRLINE}` }}
      >
        <div
          className="company-band-track flex w-max gap-16 text-lg md:text-[19px] font-bold leading-none"
          style={{ color: TONE, fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          <ul aria-label={label} className="flex gap-16">
            {companies.map((c) => (
              <li key={c.name}>
                <CompanyMark company={c} />
              </li>
            ))}
          </ul>
          <ul aria-hidden className="company-band-copy flex gap-16">
            {companies.map((c) => (
              <li key={c.name}>
                <CompanyMark company={c} hidden />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
