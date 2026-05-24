# Changelog

All notable changes to this project are documented here.

---

## [Unreleased] — main

### Added
- `/visitors` page with globe visualization and visitor stats
- `VisitorsGlobe` component (cobe-powered 3D globe)
- Visitor stats API endpoints (`/api/visitors/stats`, `/api/visitors/globe`)
- Geolocation capture (lat/lng) on new visitor tracking

### Changed
- Admin CMS redesigned with portfolio design system
- Sidebar collapsed state driven by cookie (SSR-consistent, no hydration flash)
- SOLID architecture conventions, `Chip` primitive extracted

### Fixed
- Security hardening: input validation, RLS-safe keys, redirect hardening
- Build fixes for Vercel (barrel optimizer, pnpm lockfile)

---

## [v2026.1] — 2025-03 · commit `8640fb8`

First stable 2026 design. Both 2025 and 2026 component trees isolated and coexisting.

### Added
- Collapsible sidebar with stagger animation and no-flash state restore
- Blog section with theming system (SongHero, special post components)
- Services section with animated conveyor belt
- Lab2Next SaaS showcase between timeline and projects
- Custom cursor, favicon, back-to-top button, scroll progress bar
- OG image, Nietzsche quote easter egg

### Changed
- 2025/2026 component trees fully isolated (`src/components/2026/`)
- Projects gallery with UX polish pass
- Timeline: Description component, fixed Softtek year display
- Hero: positioning subtitle + CTA with remote availability badge

---

## [v2025] — 2024 · commit `612b26a`

Original 2025 portfolio. Single-page design with particles hero, project cards, and experience timeline.

### Stack
- Next.js 14, React 18, Tailwind CSS 3
- tsparticles hero animation
- Static project data, no CMS
- Mobile drawer menu
- Light/dark theme toggle
