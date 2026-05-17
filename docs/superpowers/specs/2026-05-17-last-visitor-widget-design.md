# Last Visitor Widget — Design Spec

## Overview

Small chip in the site header showing where the previous visitor came from.
Example: `🇳🇿 Hamilton, New Zealand`

Goal: add a human, ambient detail to the portfolio — visitors see that other real people from around the world have been here.

## Placement

Left side of the Header component (`src/components/2026/layout/Header.tsx`).
Currently an empty `<div />` sits there — the chip replaces it.
Hidden on mobile (header already has ThemeToggle + LanguageSwitcher + hamburger).

## Architecture

### 1. Supabase table: `visitor_locations`

```sql
create table visitor_locations (
  id         bigserial primary key,
  city       text not null,
  country    text not null,
  country_code char(2) not null,
  created_at timestamptz default now()
);
```

No IP stored. City + country only.

### 2. Extend `/api/analytics` POST

After inserting the page view, geolocate the request IP server-side:

- Source: `ip-api.com/json/{ip}?fields=country,countryCode,city` (free, no key, 45 req/min)
- Get IP from `x-forwarded-for` or `x-real-ip` header
- If city is present and status is "success", insert a row into `visitor_locations`
- Failures are silent (no crash, no error response change)

### 3. New GET `/api/last-visitor`

Returns the second-to-last visitor (previous, not current):

```sql
SELECT city, country, country_code
FROM visitor_locations
ORDER BY created_at DESC
LIMIT 2
```

Return index 1 (the row before the most recent). If fewer than 2 rows exist, return `null`.

Response shape:

```json
{ "city": "Hamilton", "country": "New Zealand", "countryCode": "NZ" }
```

or `{ "visitor": null }` when unavailable.

### 4. `LastVisitorChip` component

`src/components/2026/ui/LastVisitorChip.tsx`

- `'use client'`
- SWR fetches `GET /api/last-visitor` on mount (dedupe interval: 60s)
- Flag emoji derived from country code — no external flag API:
  ```ts
  const flag = (code: string) =>
    code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(c.charCodeAt(0) + 127397));
  ```
- Renders nothing while loading, on error, or when `visitor === null`
- Style: Inter 11px, `var(--ds-outline)` color, no background, no border

### 5. Header integration

Replace `<div />` with `<LastVisitorChip />` in the desktop controls row.
Keep chip hidden on mobile via `hidden xl:block` (or equivalent).

## Edge Cases

| Case                       | Behavior                                    |
| -------------------------- | ------------------------------------------- |
| ip-api.com fails / timeout | Skip geo insert silently                    |
| VPN or localhost IP        | city may be wrong — only skip if city empty |
| First-ever visitor         | Fewer than 2 rows → chip hidden             |
| Rate limit (45/min)        | Fail silently, no geo stored                |
| No city in response        | Skip insert                                 |

## What We Are NOT Building

- No IP storage
- No map, no history list, no analytics UI
- No flag image CDN — emoji only
- No real-time updates — SWR cache is fine

## Files Affected

| File                                         | Change                                         |
| -------------------------------------------- | ---------------------------------------------- |
| `src/app/api/analytics/route.ts`             | Add geo lookup + insert to `visitor_locations` |
| `src/app/api/last-visitor/route.ts`          | New GET route                                  |
| `src/components/2026/ui/LastVisitorChip.tsx` | New component                                  |
| `src/components/2026/layout/Header.tsx`      | Replace `<div />` with `<LastVisitorChip />`   |
| Supabase migration                           | Create `visitor_locations` table               |
