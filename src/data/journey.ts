/**
 * The 2026 journey (route /experience), newest first by start date. Copy lives in the messages:
 * `journey_items.<id>` for the entries added in 2026, `experience_items.<id>` for the older
 * ones (those strings are shared with the /2025 site and must not change).
 */
export type JourneyMessageGroup = 'journey_items' | 'experience_items';

export type JourneyTier =
  | 'tier_contract'
  | 'tier_own_agency'
  | 'tier_own_product'
  | 'tier_consulting'
  | 'tier_enterprise'
  | 'tier_ecommerce'
  | 'tier_education';

export interface JourneyEntry {
  id: string;
  /** Messages group holding `title`, `date`, `description` (and optionally `metric`). */
  group: JourneyMessageGroup;
  tier: JourneyTier;
  url?: string;
}

export const JOURNEY: readonly JourneyEntry[] = [
  {
    id: 'brania',
    group: 'journey_items',
    tier: 'tier_contract',
  },
  {
    id: 'vezmex',
    group: 'journey_items',
    tier: 'tier_own_agency',
    url: 'https://vezmex.dev/',
  },
  {
    id: 'lab2next',
    group: 'journey_items',
    tier: 'tier_own_product',
    url: 'https://lab2next.com/',
  },
  {
    id: 'enti',
    group: 'experience_items',
    tier: 'tier_consulting',
    url: 'https://en-ti.com/',
  },
  {
    id: 'softtek',
    group: 'experience_items',
    tier: 'tier_enterprise',
    url: 'https://www.softtek.com/',
  },
  {
    id: 'scandia',
    group: 'experience_items',
    tier: 'tier_ecommerce',
    url: 'https://www.linkedin.com/company/scandia-manufacturing/people/?viewAsMember=true',
  },
  {
    id: 'education',
    group: 'journey_items',
    tier: 'tier_education',
  },
];
