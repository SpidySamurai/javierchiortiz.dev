# Freelance Services Section — Design Spec

**Date:** 2026-05-17  
**Branch:** redesign/2026

## Goal

Add a section that communicates freelance availability and services to potential clients who land on the portfolio. The portfolio currently reads well for recruiters; this section closes the gap for freelance/independent clients.

## Sales Funnel Position

Placed after About, before BlogPreview/Footer. Follows the trust-building funnel:

> Hero (hook) → Timeline + Projects + Product (proof) → About (connection) → **Services + CTA (close)** → Footer

## Section Structure

### Header
- Label: `"Servicios"` / `"Services"` — same xs uppercase tracking style as other sections
- Heading: `"Construyamos algo"` / `"Let's build something"` with accent color on last word (`"algo"` / `"something"`)
- Subheading (optional, one line): positions as independent builder, not just contractor

### Services — 2-column grid
Six items. Each: bold large name + short italic descriptor line.

| Key | ES | EN | Descriptor ES | Descriptor EN |
|-----|----|----|---------------|---------------|
| `landing` | Landing Pages | Landing Pages | conversión desde el primer scroll | conversion from the first scroll |
| `webapp` | Web Apps | Web Apps | producto completo, de spec a producción | full product, from spec to production |
| `mvp` | MVPs | MVPs | de idea a validación rápida | from idea to fast validation |
| `cms` | CMS | CMS | contenido que tú controlas | content you control |
| `crm` | CRM | CRM | flujos de cliente a tu medida | client flows tailored to you |
| `ai` | AI Automations | AI Automations | procesos manuales que desaparecen | manual processes that disappear |

### Process — 3 horizontal steps
Thin divider above. Each step: Material Symbol icon + step number + name + short description.

| # | Icon | ES | EN | Desc ES | Desc EN |
|---|------|----|----|---------|---------|
| 1 | `lightbulb` | Idea | Idea | Entendemos el problema y el objetivo | We understand the problem and goal |
| 2 | `build` | Build | Build | Construimos rápido, iteramos contigo | We build fast, iterate with you |
| 3 | `rocket_launch` | Launch | Launch | Entrega, soporte, evolución | Delivery, support, evolution |

### CTA
- Button: `"Hablemos de tu proyecto →"` / `"Let's talk about your project →"`
- href: `/#contact` (scrolls to Footer contact section)
- Style: primary button, same as Hero CTA

## Visual Style

Follows existing 2026 DS tokens:
- Background: `var(--ds-surface)` — same as Timeline
- Section label: `var(--ds-primary)`, Inter, xs uppercase tracking
- Heading: Manrope, black, uppercase, tracking-tighter
- Service names: Manrope, bold, `var(--ds-on-surface)`
- Service descriptors: Inter, sm, italic, `var(--ds-on-surface-variant)`
- Process steps: horizontal flex with gap, centered text, `var(--ds-on-surface-variant)`
- CTA button: `var(--ds-primary)` bg, `var(--ds-on-primary)` text

## i18n

All strings go in `messages/en/common.json` and `messages/es/common.json` under a `services` key.

## Files Changed

1. `src/components/2026/sections/Services.tsx` — new component
2. `src/messages/en/common.json` — add `services` block
3. `src/messages/es/common.json` — add `services` block
4. `src/components/2026/layout/HomeShell.tsx` — import + render after `<About />`

## Out of Scope

- Pricing / packages
- Contact form (existing Footer handles it)
- Testimonials
