import ReactCountryFlag from 'react-country-flag';

const FONT_BODY = 'var(--font-inter), sans-serif';
const FONT_HEAD = 'var(--font-manrope), sans-serif';
const HAIRLINE = 'color-mix(in srgb, var(--ds-on-surface) 7%, transparent)';

export interface RankedCountry {
  code: string;
  /** Already localized country name. */
  name: string;
  visits: number;
}

/**
 * Hairline ranking of the countries that visit the most: rank, flag, name, a thin bar relative to
 * the first place and the visit count. `moreLabel` closes the list when more countries exist.
 */
export function CountryRanking({
  title,
  countries,
  locale,
  moreLabel,
}: {
  title: string;
  /** Sorted by visits, descending; already trimmed to what should be shown. */
  countries: RankedCountry[];
  locale: string;
  moreLabel?: string;
}) {
  const top = countries[0]?.visits ?? 1;

  return (
    <div className="min-w-0">
      <h2
        className="text-xs uppercase tracking-[0.3em] font-bold mb-4"
        style={{ color: 'var(--ds-primary)', fontFamily: FONT_BODY }}
      >
        {title}
      </h2>
      <ol className="flex flex-col" style={{ boxShadow: `0 -1px 0 ${HAIRLINE}` }}>
        {countries.map((country, i) => (
          <li
            key={country.code}
            className="grid grid-cols-[1.75rem_1.5rem_minmax(0,1fr)_3.5rem] items-center gap-x-3 py-3.5"
            style={{ boxShadow: `0 1px 0 ${HAIRLINE}` }}
          >
            <span
              className="text-xs font-bold tabular-nums"
              style={{ color: 'var(--ds-outline)', fontFamily: FONT_HEAD }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <ReactCountryFlag
              countryCode={country.code}
              svg
              aria-hidden="true"
              style={{ width: '1.25em', height: '1.25em' }}
            />
            <div className="min-w-0">
              <span
                className="block truncate text-sm font-bold"
                style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_HEAD }}
              >
                {country.name}
              </span>
              <div
                aria-hidden
                className="mt-2 h-1 rounded-full overflow-hidden"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--ds-on-surface) 8%, transparent)',
                }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(2, (country.visits / top) * 100)}%`,
                    backgroundColor: 'var(--ds-primary)',
                  }}
                />
              </div>
            </div>
            <span
              className="text-sm font-bold tabular-nums text-right"
              style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_HEAD }}
            >
              {country.visits.toLocaleString(locale)}
            </span>
          </li>
        ))}
      </ol>
      {moreLabel && (
        <p
          className="mt-4 text-sm"
          style={{ color: 'var(--ds-outline)', fontFamily: FONT_BODY }}
        >
          {moreLabel}
        </p>
      )}
    </div>
  );
}
