# Javier Chi Ortíz — Portfolio 2025/2026

Personal portfolio built with Next.js 15. Features a 2026 redesign at `/` and a legacy 2025 version at `/2025`.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + PostCSS (no config file, uses CSS `@theme`)
- **i18n**: next-intl — EN/ES locale routing at `src/app/[locale]/`
- **Theming**: next-themes (dark/light mode via `data-theme`)
- **Database**: Supabase (blog posts, analytics, visitor tracking)
- **Fonts**: Manrope (headlines) + Inter (body) via next/font
- **Icons**: Material Symbols Outlined (Google Fonts)
- **Data fetching**: SWR
- **Package manager**: pnpm

## Routes

| Route     | Content                  |
| --------- | ------------------------ |
| `/`       | 2026 redesign (Timeline) |
| `/2025`   | Legacy 2025 design       |
| `/v2025/` | Original version         |
| `/blog`   | Blog                     |
| `/admin`  | CMS (authenticated)      |

## Features

- EN/ES internationalization
- Dark/light mode
- Blog with Supabase-backed CMS and admin panel
- Visitor tracking: last visitor chip (header) + session visitor counter (footer)
- Page view analytics
- Marvel Rivals live stats widget
- Lanyard Discord presence integration
- Automated project screenshots via Puppeteer

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MARVEL_RIVALS_API_KEY=
```

## Commands

```bash
pnpm dev        # Start dev server (Turbopack)
pnpm build      # Production build
pnpm lint       # ESLint
pnpm format     # Prettier
```

## License

MIT
