# Web Portfolio — Javier

## Routes

| Route     | Content                       | Status                               |
| --------- | ----------------------------- | ------------------------------------ |
| `/`       | New design 2026 (Timeline V4) | In progress — branch `redesign/2026` |
| `/2025`   | Current design (legacy)       | Migrated                             |
| `/v2025/` | Old version                   | Untouched                            |

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + PostCSS — no `tailwind.config.js`, uses CSS `@theme`
- **i18n**: next-intl (locale routing at `src/app/[locale]/`)
- **Theming**: next-themes (`data-theme` attribute, `ThemeProvider`)
- **Icons**: Material Symbols Outlined (Google Fonts, `<span className="material-symbols-outlined">`)
- **Fonts**: Manrope (`--font-manrope`, headlines) + Inter (`--font-inter`, body) via next/font
- **Data fetching**: SWR for client, direct Supabase for server components
- **Dev tools**: ESLint 9, Prettier, Puppeteer (screenshots)

## Commands

- `pnpm dev` — Start dev server (Turbopack)
- `pnpm build` — Production build
- `pnpm lint` — Run ESLint
- `pnpm format` — Format with Prettier

## Project Structure

```
src/
  app/[locale]/
    layout.tsx          # Shared: providers, fonts, Material Symbols link
    page.tsx            # NEW 2026 design root
    2025/page.tsx       # Legacy 2025 design
  components/
    2026/               # New design components
      layout/           # Header.tsx, Sidebar.tsx
      sections/         # Hero.tsx, Timeline.tsx, Projects.tsx, About.tsx, Footer.tsx
      ui/               # Chip, GlobeCanvas, LastVisitorChip, etc.
    ui/ThemeToggle.tsx  # Existing — reuse as-is
    providers/          # GamerCardContext.tsx, ThemeProvider.tsx
  messages/
    en/common.json      # English translations
    es/common.json      # Spanish translations
```

## Design System (2026)

DS vars are scoped under `.ds-2026` — all pages must have that class on their root wrapper.

Colors (use CSS vars, not hardcoded hex):

| Token | Hex |
|-------|-----|
| `--ds-bg` | `#0b1326` |
| `--ds-surface` | `#131b2e` |
| `--ds-surface-container` | `#171f33` |
| `--ds-surface-high` | `#222a3d` |
| `--ds-surface-highest` | `#2d3449` |
| `--ds-surface-bright` | `#31394d` |
| `--ds-on-surface` | `#dae2fd` |
| `--ds-on-surface-variant` | `#c7c4d7` |
| `--ds-primary` | `#c0c1ff` |
| `--ds-primary-container` | `#8083ff` |
| `--ds-on-primary` | `#1000a9` |
| `--ds-secondary-container` | `#3e3c8f` |
| `--ds-on-secondary` | `#afadff` |
| `--ds-outline` | `#908fa0` |
| `--ds-outline-variant` | `#464554` |

Font usage:

```tsx
style={{ fontFamily: 'var(--font-manrope), sans-serif' }}  // headlines
style={{ fontFamily: 'var(--font-inter), sans-serif' }}    // body/labels
```

## Architecture

### Layer model (dependencies flow downward only)

| Layer | Path | Responsibility |
|-------|------|----------------|
| Route | `src/app/**/page.tsx` (Server) | Fetch data, compose sections, no UI logic |
| Data | `src/lib/` | Supabase queries, pure logic — no JSX, no state |
| Hooks | `src/hooks/` | Client stateful logic — no JSX, no direct DB calls |
| Primitives | `src/components/2026/ui/` | Dumb atoms, DS tokens only |
| Features | `src/components/2026/{sections,layout,blog}/` | Compose primitives + hooks |
| Admin UI | `src/app/admin/_components/` | Admin-scoped, colocated with routes |
| Providers | `src/components/providers/` | Cross-cutting context only |

### `'use client'` rule

Push the boundary to the **leaf**. A component gets `'use client'` only if **it itself** uses `useState`, `useEffect`, event handlers, or browser APIs. Layouts and pages are server components by default.

```tsx
// GOOD — thin client leaf
'use client';
export function GlobeCanvas() { useEffect(...); return <canvas />; }

// BAD — layout forced client just to pass a prop
'use client';
export default function Layout({ children }) { return <div>{children}</div>; }
```

### Sub-page layouts

Every `[locale]/*/layout.tsx` must be an **async server component** that calls `getSidebarCollapsed()` and passes `defaultCollapsed` to `<Sidebar>`. Never `'use client'` on a layout.

### HTML structure

- Pages return a fragment `<>` or a `<section>` — never `<main>`. The layout already provides `<main className="sidebar-main">`.
- No double `<main>` nesting.

### Shared primitives

Before creating a new styled element, check `src/components/2026/ui/`. When a pattern appears in 2+ places, extract to `ui/` before the third use.

## Rendering & Data Fetching

### Decision tree: SSR vs CSR

| Needs | Pattern |
|-------|---------|
| Static data, SEO, no interactivity | Server Component — fetch directly |
| Data that refreshes in-session | Client Component + SWR |
| Server-only logic (secrets, geolocation, hashing) | API Route Handler |
| User interaction (forms, clicks, animations) | Client Component |

### Server Components (SSR)

Pages and layouts are server components by default. Fetch data directly — no SWR, no `useEffect`.

```tsx
// src/app/[locale]/blog/page.tsx
export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;               // params is a Promise in Next.js 15
  const posts = await getPublishedPosts();        // direct DB call via service role
  const t = await getTranslations({ locale, namespace: 'common' }); // server i18n
  const sidebarCollapsed = await getSidebarCollapsed(); // cookie via next/headers

  return <PostList posts={posts} />;             // pass as props to client component
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return { title: t('page_title') };
}
```

**Server-only imports:** `cookies()`, `headers()` from `next/headers` — crash if used in client components.

### Client Components (CSR)

Use `'use client'` only when the component itself needs hooks, events, or browser APIs.

```tsx
// src/components/2026/sections/VisitorsGlobe.tsx
'use client';
export default function VisitorsGlobe() {
  const t = useTranslations('common');           // sync — client i18n
  const { data } = useSWR('/api/visitors/globe', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,                    // standard SWR config for this project
  });
  return <GlobeCanvas points={data?.points ?? []} />;
}
```

**SWR standard config** for non-critical data:
```ts
{ revalidateOnFocus: false, dedupingInterval: 60_000 }
```

### Data flow: server → client

Server fetches, passes as props. Client components never call Supabase directly for public pages.

```
page.tsx (server)
  └─ fetches posts via getPublishedPosts()
  └─ <PostList initialPosts={posts} />  ← props, not fetch
       └─ renders immediately, no loading state needed
```

Client components fetch their own data only when:
- Data must refresh without page reload (SWR)
- Data depends on client state (user interaction, locale switch)

### API Route Handlers

Use when the client needs server-side processing: secrets, external APIs, IP geolocation, hashing.

```ts
// src/app/api/analytics/route.ts
export async function POST(req: NextRequest) {
  // Runs on server — can use SUPABASE_SERVICE_ROLE_KEY, read IPs, call ip-api
}
```

Route handlers have access to `request.headers` (real IP, user agent) — client components do not.

### next-intl quick reference

| Context | Hook | Notes |
|---------|------|-------|
| Server Component / layout / page | `await getTranslations({ locale, namespace })` | `locale` from `params` |
| Client Component | `useTranslations('common')` | No await, sync |
| Server metadata | `await getTranslations({ locale, namespace })` | Same as server component |

## Supabase Patterns

- **Writes / admin reads**: `SUPABASE_SERVICE_ROLE_KEY` — never expose to client
- **Public reads**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` — RLS must restrict what anon can see
- **Avoid full table scans** for aggregates — use `COUNT(DISTINCT ...)` via RPC or a view, not `select('column')` + JS Set (Supabase paginates at 1000 rows by default)
- **RLS required** on every table that holds user data

## API Route Patterns

Order of operations in every POST handler:

```ts
// 1. Early-exit checks (host, rate limit) — before any parsing
if (LOCAL_HOST_RE.test(host)) return ...;

// 2. Parse body with error handling
let body; try { body = await req.json(); } catch { return 400; }

// 3. Validate all inputs (type + length) before any DB call
if (typeof path !== 'string' || path.length > 512) return 400;

// 4. Cap all header values before storing
const referrer = raw && raw.length <= 2048 ? raw : null;
```

- All user-supplied strings must have a length cap before insert
- `req.json()` always wrapped in try/catch
- Input validation before any side effects

## Stitch MCP (Design Reference)

- Tool: `mcp__stitch` (HTTP MCP)
- Design file: **"Unified Portfolio (Timeline V4)"**
- Project ID: `12817670546148158167`
- Main screen ID: `11ad868a865e46cda30966ac38c0b8ad`
- Use: inspect colors, layout, typography, component specs

## Agents

- **Context** (`.claude/agents/context.md`): Orchestrator — delegates, coordinates, queries Stitch
- **Fullstack Dev** (`.claude/agents/fullstack.md`): All implementation (components, pages, API, styling)
- **UI/UX Designer** (`.claude/agents/ui-ux-designer.md`): Design review vs Stitch specs

## Conventions

- User communicates in Spanish. Code, commits, docs in English.
- Keep code simple — no over-engineering.
- Prefer editing existing files over creating new ones.
- Atomic React components — no logic in layout components, no HTML dumps from Stitch.
- Commits use only user's git identity — no `Co-Authored-By` lines.
- No `console.log` in production code.
- No 1px solid borders — use `box-shadow` or background shifts for separation.
- No emojis in UI, code, or docs — use Material Symbols Outlined icons instead.
- Images pending: use `<div>` placeholder with `background: #222a3d` + "Pending" label.
- Never push to `main` directly — always feature branch + PR.

## Pending

- [ ] Real profile photo for Sidebar avatar
- [ ] Hero section images (two overlapping rotated cards)
- [ ] Project thumbnails for bento grid
- [ ] Visual QA pass (compare with Stitch screenshot)

## Known Debt (fix when next touching the file)

- `PostEditor.tsx` (~590 ln) — extract toolbar, ThemeColorPicker, preview pane
- `Hero.tsx` (~409 ln) / `Timeline.tsx` (~437 ln) — move hardcoded data to `src/data/`
- `GamerCardContext.tsx` — lazy-load modal at usage site, not provider mount
- `PostHogProvider.tsx` — guard init against double-call on hydration
- Remaining `'use client'` layouts — audit each against the leaf rule
