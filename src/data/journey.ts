/**
 * The 2026 journey (route /experience), newest first by start date. Copy lives in the messages:
 * `journey_items.<id>` for the entries added in 2026, `experience_items.<id>` for the older
 * ones (those strings come from the 2025 design, which now lives in the portfolio-mk2 repo).
 */
export type JourneyMessageGroup = 'journey_items' | 'experience_items';

export interface JourneyEntry {
  id: string;
  /** Messages group holding `title`, `date`, `description` (and optionally `metric`). */
  group: JourneyMessageGroup;
  url?: string;
}

export const JOURNEY: readonly JourneyEntry[] = [
  {
    id: 'brania',
    group: 'journey_items',
  },
  {
    id: 'vezmex',
    group: 'journey_items',
    url: 'https://vezmex.dev/',
  },
  {
    id: 'lab2next',
    group: 'journey_items',
    url: 'https://lab2next.com/',
  },
  {
    id: 'enti',
    group: 'experience_items',
    url: 'https://en-ti.com/',
  },
  {
    id: 'softtek',
    group: 'experience_items',
    url: 'https://www.softtek.com/',
  },
  {
    id: 'scandia',
    group: 'experience_items',
    url: 'https://www.linkedin.com/company/scandia-manufacturing/people/?viewAsMember=true',
  },
  {
    id: 'education',
    group: 'journey_items',
  },
];
