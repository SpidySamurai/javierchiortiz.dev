# Javier Chi - Professional Portfolio 2025

Private repository for my personal professional portfolio. This project showcases my experience, projects, and skills using a modern, performance-focused stack.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/) (En/Es support)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) (Dark/Light mode)
- **Automation**: [Puppeteer](https://pptr.dev/) for generating project screenshots.

## ✨ Key Features

- **Dynamic Project List**: data-driven project showcase (`src/data/projects.ts`) with category filtering.
- **"Flat Cat" Mascot**: A custom interactive, eye-tracking SVG component (`src/components/FlatCat.tsx`) paying homage to a beloved pet.
- **Confidentiality Awareness**: Built-in logic to handle private/NDA projects while still showcasing selected highlighted work.
- **Automated Screenshots**: Custom script to keep portfolio thumbnails up-to-date programmatically.

## 🛠️ Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it.

## 📸 Scripts

### Capture Screenshots
This project uses Puppeteer to automatically generate thumbnails for the featured projects.
Add new URLs to `scripts/capture-screenshots.js` and run:

```bash
npm run screenshots
```
This will save images to `public/utils/img/`.

## 📂 Project Structure

- `src/app`: App Router pages and global layouts.
- `src/components`: UI components, organized by `sections`, `layout`, etc.
- `src/data`: Static data sources (projects, experiences).
- `src/messages`: JSON translation files (en/es).
- `src/utils`: Helper styles and assets.

## 🔒 License
Private. All rights reserved.
