# Copilot Instructions

- Stack: Next.js app router (15.x) with React 19, TypeScript, Tailwind CSS 4 utilities. Entry shell lives in src/app/layout.tsx and src/app/page.tsx.
- Layout: Header is sticky; Hero stays fixed on the left for lg screens while MainContent scrolls on the right. Section ids must stay in sync with Navbar SECTIONS (about/experience/projects) for IntersectionObserver highlighting.
- Theming: ThemeProvider in src/context/ThemeProvider.tsx persists preference to localStorage + cookies (portfolio:theme, portfolio:theme-applied) and sets html[data-theme]. layout.tsx injects an anti-FOUC script that applies theme/lang before hydration; keep those cookie names intact.
- Language: i18n is configured in src/lib/i18n.ts with the common namespace and langs en/es. LanguageProvider syncs document.lang, localStorage, and the portfolio:lang cookie. Use useTranslation('common'); add keys in src/locales/en/common.json and src/locales/es/common.json.
- Translated data: experiences.ts and projects.ts use ids that map to translation namespaces experience_items.{id} and project_items.{id}; components fall back to defaultValue from the data files. Keep ids stable and unique when adding entries.
- Tech stack: TechStack component maps string ids to display via techIcons in src/data/techStack.ts; register label/color/icon there whenever introducing a new tech string to avoid blank pills.
- Projects UI: ProjectItem uses native <img> for a hover pan effect; CSS expects project-image-wrapper/project-image classes and sets --pan-amount via JS. Avoid swapping to next/image unless preserving this contract.
- Styling: globals.css defines theme tokens under html[data-theme] and semantic utility classes (.bg-primary, .text-muted, etc.). Prefer those variables over hard-coded colors; sections rely on scroll-margin-top to avoid the sticky header overlap.
- Navigation: Navbar (components/layout/Navbar.tsx) uses IntersectionObserver for active link state and a mobile drawer that locks body scroll. Update SECTIONS and matching section ids together; keep aria labels intact.
- Hero: components/layout/Hero.tsx holds social links and text; strings should stay translatable via hero_* keys in the common namespace.
- Projects search: components/sections/Projects.tsx builds a localized project list with useMemo and filters against title/description/stack/projectUrl. Preserve this flow when extending search.
- Data types: src/types/index.ts defines DataProject/DataExperience shapes used by data files. Align new entries with these types and the translation keys.
- Code quality: sigue principios SOLID y mantiene tipados estrictos de TypeScript (evita any/unknown innecesarios, aprovecha tipos derivados de datos y props claras).
- Commands: npm run dev (uses turbopack), npm run build, npm run start, npm run lint, npm run format. No automated tests; validate pages manually at http://localhost:3000.
- Assets: Images referenced from public/utils/img with leading /utils/img paths. Keep aria-labels on external links/buttons for accessibility.
- Client components: Many UI pieces are client-side (use client). Keep that directive when adding hooks or browser-only logic.
