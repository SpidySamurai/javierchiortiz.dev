'use client';

import { useTranslations } from 'next-intl';

function CategoryPill({ label }: { label: string }) {
  return (
    <span
      className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
      style={{
        backgroundColor: 'rgba(62,60,143,0.8)',
        color: '#afadff',
        backdropFilter: 'blur(8px)',
      }}
    >
      {label}
    </span>
  );
}

function SmallChip({ label }: { label: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-[9px] uppercase border"
      style={{
        color: '#908fa0',
        borderColor: 'rgba(70,69,84,0.3)',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
    >
      {label}
    </span>
  );
}

export default function Projects() {
  const t = useTranslations('common');

  const walletApp = t.raw('project_items.wallet-app') as { title: string; description: string };
  const scandiaProject = t.raw('project_items.scandia-ecommerce') as { title: string; description: string };
  const lab2next = t.raw('project_items.lab2next') as { title: string; description: string };

  return (
    <section
      id="projects"
      className="py-28 px-8"
      style={{ backgroundColor: '#0b1326' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-20 space-y-4">
          <h3
            className="text-3xl font-bold tracking-tight"
            style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            Gallery of Work
          </h3>
          <div className="h-1 w-24 rounded-full" style={{ backgroundColor: '#c0c1ff' }} />
        </div>

        {/* Bento grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
          style={{ gridAutoRows: '300px' }}
        >
          {/* Project 1: Wallet App — col-span-8 row-span-2 (large featured) */}
          <div
            className="md:col-span-8 md:row-span-2 group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-[0.98]"
            style={{ backgroundColor: '#171f33' }}
          >
            {/* Image placeholder */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: '#222a3d' }}
            >
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: '#908fa0', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Image Pending
              </span>
            </div>

            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, #0b1326 0%, rgba(11,19,38,0.2) 50%, transparent 100%)',
              }}
            />

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-10 space-y-4 w-full">
              <div className="flex gap-3 flex-wrap">
                <CategoryPill label="Fintech" />
                <CategoryPill label="React" />
              </div>
              <h4
                className="text-4xl font-bold"
                style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
              >
                {walletApp.title}
              </h4>
              <p
                className="max-w-md text-sm leading-relaxed"
                style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {walletApp.description}
              </p>
              <a
                href="#"
                className="inline-block text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: '#c0c1ff' }}
              >
                View Study →
              </a>
            </div>
          </div>

          {/* Project 2: Scandia — col-span-4 row-span-3 (tall vertical) */}
          <div
            className="md:col-span-4 md:row-span-3 group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-[0.98]"
            style={{ backgroundColor: '#222a3d' }}
          >
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, #0b1326 0%, transparent 60%)',
              }}
            />

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 space-y-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest block"
                style={{ color: '#c0c1ff' }}
              >
                E-commerce
              </span>
              <h4
                className="text-2xl font-bold"
                style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
              >
                {scandiaProject.title}
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {scandiaProject.description}
              </p>
            </div>
          </div>

          {/* Project 3: Lab2Next — col-span-4 row-span-2 (no image, content card) */}
          <div
            className="md:col-span-4 md:row-span-2 group relative overflow-hidden rounded-xl transition-all duration-500 hover:scale-[0.98]"
            style={{ backgroundColor: '#171f33' }}
          >
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(192,193,255,0.1)' }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#c0c1ff' }}>
                    code
                  </span>
                </div>
                <h4
                  className="text-xl font-bold"
                  style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
                >
                  {lab2next.title}
                </h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {lab2next.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <SmallChip label="React" />
                <SmallChip label="TypeScript" />
                <SmallChip label="Next.js" />
              </div>
            </div>
          </div>

          {/* Project 4: More Projects — col-span-4 row-span-1 (infill) */}
          <div
            className="md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-xl flex items-center justify-center p-8 cursor-pointer transition-all duration-500 hover:scale-[0.98]"
            style={{ backgroundColor: '#131b2e' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = '#222a3d')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.backgroundColor = '#131b2e')}
          >
            <div className="text-center">
              <span
                className="material-symbols-outlined text-3xl block mb-2"
                style={{ color: '#c0c1ff' }}
              >
                folder_open
              </span>
              <h4
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
              >
                More Projects
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
