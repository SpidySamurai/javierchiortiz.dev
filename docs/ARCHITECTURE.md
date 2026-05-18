# Architecture Guide

## Layer Model

Dependencies flow **downward only**. A layer must not import from a layer above it.

| Layer | Path | Responsibility |
|-------|------|----------------|
| Route | `src/app/**/page.tsx` (Server Component) | Fetch data, compose feature components, no UI logic |
| Data | `src/lib/` | Supabase queries, pure logic — no JSX, no state |
| Hooks | `src/hooks/` | Client stateful logic — no JSX, no direct DB calls |
| Primitives | `src/components/2026/ui/` | Dumb presentational atoms, DS tokens only |
| Features | `src/components/2026/{sections,layout,blog}/` | Compose primitives + hooks |
| Admin UI | `src/app/admin/_components/` | Admin-scoped components, colocated with routes |
| Providers | `src/components/providers/` | Cross-cutting context only, no business logic |

## SOLID Rules

**S — Single Responsibility**
One component = one job. Data prep ≠ presentation ≠ side-effects. Components over 250 lines are a split signal.

**O — Open/Closed**
Extend via `variant`/`size` props and composition. Never duplicate a shared component for a one-off need, and never modify a primitive to fit a single caller.

**L — Liskov Substitution**
Components in the same role share a consistent prop contract. Primitives in `ui/` should be interchangeable at their usage sites.

**I — Interface Segregation**
Narrow prop interfaces. Pass the specific field a component needs, not the whole parent object.

**D — Dependency Inversion**
Components depend on hooks and context (abstractions), not on direct `fetch` or Supabase calls. Data flows: server component fetches → passes as props → client component consumes.

## `'use client'` Rule

Push the boundary to the **leaf**. A component gets `'use client'` only if it **itself** uses `useState`, `useEffect`, event handlers, or browser APIs — not because a child needs it. Server components can render client components.

```
// Good — thin client leaf
'use client';
export default function AnalyticsTracker() {
  usePageView();
  useSectionTracking();
  return null;
}

// Bad — entire shell forced client for hooks it delegates
'use client';
export default function HomeShell({ posts }) {
  usePageView(); // move to AnalyticsTracker
  ...
}
```

## Data Flow Pattern

```
src/app/admin/posts/page.tsx        ← Server: fetch
  └─ <PostList initialPosts={...} /> ← Client: render + mutate via Supabase anon key + RLS
```

Server components fetch with `createClient()` from `src/lib/supabase/server.ts`.
Client components use `createClient()` from `src/lib/supabase/client.ts` with RLS enforcing auth.

## Shared Primitives

Before creating a new styled element, check `src/components/2026/ui/`:

| Component | Use for |
|-----------|---------|
| `Chip` | Category pills, tech tags, tier badges, outline chips |
| `BlogCard` | Blog post preview cards |
| `LastVisitorChip` | Geo visitor display |
| `ThemeToggle` | Light/dark toggle |
| `LanguageSwitcher` | Locale toggle |

When a new pattern appears in **2+ places**, extract it to `ui/` before the third use.

## Admin Colocation

All admin UI lives in `src/app/admin/_components/`. Do not add admin components to `src/components/admin/` (that directory is now empty).

## Known Debt (fix when next touching the file)

- `PostEditor.tsx` (~590 ln) — extract toolbar, ThemeColorPicker, preview pane
- `Hero.tsx` (~409 ln) / `Timeline.tsx` (~437 ln) — move hardcoded data to `src/data/`
- `GamerCardContext.tsx` — lazy-load modal at usage site, not provider mount
- `PostHogProvider.tsx` — guard init against double-call on hydration
- Remaining `'use client'` sections — audit each against the leaf rule
