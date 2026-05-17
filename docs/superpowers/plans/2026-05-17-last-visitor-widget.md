# Last Visitor Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a small chip in the site header (desktop only) with the location and flag of the previous visitor — e.g., `🇳🇿 Hamilton, New Zealand`.

**Architecture:** On every page view, the existing `/api/analytics` POST geolocates the request IP via ip-api.com (free, server-side, no key) and inserts city/country into a new `visitor_locations` Supabase table. A new GET `/api/last-visitor` returns the second-to-last row (previous visitor). `LastVisitorChip` fetches this via SWR and renders in the Header.

**Tech Stack:** Next.js 15 App Router, TypeScript, Supabase (service role), SWR, Tailwind CSS 4

---

## File Map

| File                                         | Action                                       |
| -------------------------------------------- | -------------------------------------------- |
| Supabase: `visitor_locations` table          | Create via migration                         |
| `src/types/database.ts`                      | Add `visitor_locations` types                |
| `src/app/api/analytics/route.ts`             | Extend POST: geo lookup + insert             |
| `src/app/api/last-visitor/route.ts`          | Create GET route                             |
| `src/components/2026/ui/LastVisitorChip.tsx` | Create component                             |
| `src/components/2026/layout/Header.tsx`      | Replace `<div />` with `<LastVisitorChip />` |

---

## Task 1: Create `visitor_locations` Supabase table

**Files:**

- Supabase remote (via MCP `mcp__supabase__apply_migration`)

- [ ] **Step 1: Apply migration**

Use the Supabase MCP tool `mcp__supabase__apply_migration` with this SQL:

```sql
create table public.visitor_locations (
  id         bigserial primary key,
  city       text not null,
  country    text not null,
  country_code char(2) not null,
  created_at timestamptz default now()
);

-- Allow anonymous reads for the GET endpoint (uses anon key)
alter table public.visitor_locations enable row level security;

create policy "public read" on public.visitor_locations
  for select using (true);

-- Inserts only from service role (API route uses service key)
create policy "service insert" on public.visitor_locations
  for insert with check (true);
```

- [ ] **Step 2: Verify table exists**

Use `mcp__supabase__list_tables` and confirm `visitor_locations` appears.

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "feat(db): add visitor_locations table via Supabase migration"
```

---

## Task 2: Add types for `visitor_locations` to `database.ts`

**Files:**

- Modify: `src/types/database.ts`

- [ ] **Step 1: Add table types**

In `src/types/database.ts`, inside the `Tables` object (after `page_views` block, before `posts`), add:

```typescript
      visitor_locations: {
        Row: {
          id: number
          city: string
          country: string
          country_code: string
          created_at: string
        }
        Insert: {
          id?: number
          city: string
          country: string
          country_code: string
          created_at?: string
        }
        Update: {
          id?: number
          city?: string
          country?: string
          country_code?: string
          created_at?: string
        }
        Relationships: []
      }
```

- [ ] **Step 2: Add convenience alias at bottom of file**

After the existing aliases (`Post`, `ContactMessage`, `PageView`), add:

```typescript
export type VisitorLocation = Tables<'visitor_locations'>;
```

- [ ] **Step 3: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/types/database.ts
git commit -m "feat(types): add visitor_locations table types"
```

---

## Task 3: Extend `/api/analytics` POST with geo lookup

**Files:**

- Modify: `src/app/api/analytics/route.ts`

- [ ] **Step 1: Replace the entire file**

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip');
}

async function geolocateIp(
  ip: string
): Promise<{ city: string; country: string; countryCode: string } | null> {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'success' || !data.city) return null;
    return { city: data.city, country: data.country, countryCode: data.countryCode };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { path, locale } = body;
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  const referrer = req.headers.get('referer') ?? null;
  await supabase.from('page_views').insert({ path, locale: locale ?? null, referrer });

  const ip = getClientIp(req);
  if (ip) {
    const geo = await geolocateIp(ip);
    if (geo) {
      await supabase.from('visitor_locations').insert({
        city: geo.city,
        country: geo.country,
        country_code: geo.countryCode,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Manual smoke test**

Start dev server (`pnpm dev` if not running). Then:

```bash
curl -s -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"path":"/test","locale":"en"}' | cat
```

Expected output: `{"ok":true}`

Then check Supabase `visitor_locations` table has a new row (city may be empty in local dev since localhost IP won't geolocate — that's fine, it silently skips).

- [ ] **Step 4: Commit**

```bash
git add src/app/api/analytics/route.ts
git commit -m "feat(api): geolocate visitor IP and store in visitor_locations"
```

---

## Task 4: Create GET `/api/last-visitor` route

**Files:**

- Create: `src/app/api/last-visitor/route.ts`

- [ ] **Step 1: Create the file**

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const revalidate = 0;

export async function GET() {
  const { data, error } = await supabase
    .from('visitor_locations')
    .select('city, country, country_code')
    .order('created_at', { ascending: false })
    .limit(2);

  if (error || !data || data.length < 2) {
    return NextResponse.json({ visitor: null });
  }

  const prev = data[1];
  return NextResponse.json({
    visitor: {
      city: prev.city,
      country: prev.country,
      countryCode: prev.country_code,
    },
  });
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Manual smoke test**

```bash
curl -s http://localhost:3000/api/last-visitor | cat
```

Expected (if fewer than 2 rows in DB): `{"visitor":null}`
Expected (if 2+ rows): `{"visitor":{"city":"SomeCity","country":"SomeCountry","countryCode":"XX"}}`

- [ ] **Step 4: Commit**

```bash
git add src/app/api/last-visitor/route.ts
git commit -m "feat(api): add GET /api/last-visitor endpoint"
```

---

## Task 5: Create `LastVisitorChip` component

**Files:**

- Create: `src/components/2026/ui/LastVisitorChip.tsx`

- [ ] **Step 1: Create the file**

```typescript
'use client';

import useSWR from 'swr';

interface VisitorData {
  visitor: {
    city: string;
    country: string;
    countryCode: string;
  } | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function countryFlag(code: string): string {
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(c.charCodeAt(0) + 127397));
}

export default function LastVisitorChip() {
  const { data } = useSWR<VisitorData>('/api/last-visitor', fetcher, {
    dedupingInterval: 60_000,
    revalidateOnFocus: false,
  });

  const visitor = data?.visitor;
  if (!visitor) return null;

  return (
    <div
      className="flex items-center gap-1.5 select-none"
      title={`Last visitor from ${visitor.city}, ${visitor.country}`}
    >
      <span aria-hidden="true" className="text-sm leading-none">
        {countryFlag(visitor.countryCode)}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '11px',
          color: 'var(--ds-outline)',
        }}
      >
        {visitor.city}, {visitor.country}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Visual check**

Temporarily add to any page: `import LastVisitorChip from '@/components/2026/ui/LastVisitorChip'; <LastVisitorChip />` and verify it renders correctly when the API returns a visitor. Remove temporary addition after check.

- [ ] **Step 4: Commit**

```bash
git add src/components/2026/ui/LastVisitorChip.tsx
git commit -m "feat(ui): add LastVisitorChip component"
```

---

## Task 6: Wire `LastVisitorChip` into Header

**Files:**

- Modify: `src/components/2026/layout/Header.tsx`

- [ ] **Step 1: Add import**

At the top of `src/components/2026/layout/Header.tsx`, after the existing imports, add:

```typescript
import LastVisitorChip from '@/components/2026/ui/LastVisitorChip';
```

- [ ] **Step 2: Replace the empty `<div />`**

In the `Header` component's return, find:

```tsx
<div />
```

Replace with:

```tsx
<div className="hidden xl:block">
  <LastVisitorChip />
</div>
```

- [ ] **Step 3: Verify TypeScript**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Visual check in browser**

Open `http://localhost:3000` on desktop (>1280px wide). The header left side should show the chip if the DB has 2+ visitor rows. On mobile it should not appear.

To seed test data if DB is empty (run in Supabase SQL editor or via MCP):

```sql
insert into visitor_locations (city, country, country_code) values
  ('Mexico City', 'Mexico', 'MX'),
  ('Hamilton', 'New Zealand', 'NZ');
```

After seeding, refresh the page. Header left should show: `🇲🇽 Mexico City, Mexico`

- [ ] **Step 5: Commit**

```bash
git add src/components/2026/layout/Header.tsx
git commit -m "feat(header): add LastVisitorChip to desktop header"
```

---

## Task 7: Lint and final check

- [ ] **Step 1: Run linter**

```bash
pnpm lint
```

Expected: no errors.

- [ ] **Step 2: TypeScript full check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: End-to-end verification**

1. Open the site in browser at `http://localhost:3000`
2. The page load triggers `POST /api/analytics`
3. Check Supabase `visitor_locations` table — new row should appear (will be empty in local dev since localhost IP doesn't geolocate, which is correct behavior)
4. Chip shows previous visitor if 2+ rows with real city data exist
5. On mobile viewport (<1280px) chip is not visible
6. Chip shows nothing on error or while loading (no flash/layout shift)
