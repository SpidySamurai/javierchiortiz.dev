# Web Portfolio — Javier

## Project Overview
Personal web portfolio with multi-version routing:
- `/` — New design (2026, in progress)
- `/2025` — Current design (migrated as legacy)
- `/v2025/` — Old 2025 version (untouched)

## Tech Stack
- **Framework**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + PostCSS
- **i18n**: next-intl
- **UI**: Headless UI, React Icons
- **Data fetching**: SWR
- **Theming**: next-themes (dark mode)
- **Dev tools**: ESLint 9, Prettier, Puppeteer (screenshots)

## Commands
- `npm run dev` — Start dev server (Turbopack)
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npm run format` — Format with Prettier

## Architecture
- Next.js App Router (`src/app/`)
- Components in `src/components/`
- Public assets in `public/`

## Agent Roles
- **Context** (`.claude/agents/context.md`): Orchestrator. Manages project state, delegates tasks, coordinates between agents.
- **Fullstack Dev** (`.claude/agents/fullstack.md`): Senior developer. Handles all implementation — components, pages, API, styling.
- **Stitch MCP**: Google Design tool (HTTP MCP). Design file: **"Unified Portfolio (Timeline V3)"**. Used to inspect and extract design specs (colors, typography, layout, components).

### Workflow
1. Context agent receives task from user
2. Context queries Stitch MCP for design specs when needed
3. Context delegates implementation to Fullstack Dev with specs + context
4. Fullstack Dev implements and validates (build + lint)
5. Context reviews and updates project state

## Conventions
- Language: The user communicates in Spanish. Code, commits, and technical docs stay in English.
- Keep code simple and avoid over-engineering.
- Prefer editing existing files over creating new ones.
