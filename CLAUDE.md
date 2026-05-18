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
- **Data fetching**: SWR
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
      ui/               # LanguageSwitcher.tsx
    ui/ThemeToggle.tsx  # Existing — reuse as-is
    providers/          # GamerCardContext.tsx, ThemeProvider.tsx
  messages/
    en/common.json      # English translations
    es/common.json      # Spanish translations
```

## Design System (2026)

Colors (hex — no Tailwind config, use inline `style={{}}` or CSS vars):

- Background: `#0b1326` | Surface: `#131b2e` | Container: `#171f33`
- Surface high: `#222a3d` | Surface highest: `#2d3449` | Surface bright: `#31394d`
- On-surface: `#dae2fd` | On-surface-variant: `#c7c4d7`
- Primary: `#c0c1ff` | Primary container: `#8083ff` | On-primary: `#1000a9`
- Secondary container: `#3e3c8f` | On-secondary: `#afadff`
- Outline: `#908fa0` | Outline-variant: `#464554`

Font usage:

```tsx
style={{ fontFamily: 'var(--font-manrope), sans-serif' }}  // headlines
style={{ fontFamily: 'var(--font-inter), sans-serif' }}    // body/labels
```

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
- No 1px solid borders — use background shifts for section separation.
- No emojis in UI, code, or docs — use Material Symbols Outlined icons instead.
- Images pending: use `<div>` placeholder with `background: #222a3d` + "Pending" label.

## Pending

- [ ] Real profile photo for Sidebar avatar
- [ ] Hero section images (two overlapping rotated cards)
- [ ] Project thumbnails for bento grid
- [ ] Visual QA pass (compare with Stitch screenshot)
