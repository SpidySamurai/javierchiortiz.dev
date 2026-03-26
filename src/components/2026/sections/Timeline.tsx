'use client';

import { useTranslations } from 'next-intl';

type ExperienceKey = 'enti' | 'softtek' | 'scandia' | 'iotam' | 'brightcoders';

interface TimelineEntry {
  key: ExperienceKey;
  tier: string;
  yearDisplay: string[];
  tech: string[];
}

const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    key: 'enti',
    tier: 'Lead Role',
    yearDisplay: ['2023', 'PRESENT'],
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    key: 'softtek',
    tier: 'Engineering Tier',
    yearDisplay: ['2021', '2022'],
    tech: ['React', 'Node.js', 'SQL', 'REST APIs'],
  },
  {
    key: 'scandia',
    tier: 'Engineering Tier',
    yearDisplay: ['2021', '2022'],
    tech: ['Shopify', 'Liquid', 'JavaScript', 'CSS'],
  },
  {
    key: 'iotam',
    tier: 'Foundational Tier',
    yearDisplay: ['2021', '2022'],
    tech: ['React', 'TypeScript', 'REST APIs'],
  },
  {
    key: 'brightcoders',
    tier: 'Foundational Tier',
    yearDisplay: ['2021'],
    tech: ['React', 'CSS', 'JavaScript'],
  },
];

function TechChip({ label }: { label: string }) {
  return (
    <span
      className="px-3 py-0.5 rounded text-[9px] font-medium uppercase border"
      style={{
        color: 'rgba(199,196,215,0.7)',
        borderColor: 'rgba(70,69,84,0.3)',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
    >
      {label}
    </span>
  );
}

function TierBadge({ label, isLead }: { label: string; isLead?: boolean }) {
  return (
    <div
      className="inline-block px-4 py-1 mb-4 rounded-full text-[10px] font-bold uppercase tracking-widest border"
      style={{
        color: isLead ? '#c0c1ff' : '#908fa0',
        backgroundColor: isLead ? 'rgba(192,193,255,0.1)' : 'rgba(144,143,160,0.08)',
        borderColor: isLead ? 'rgba(192,193,255,0.2)' : 'rgba(144,143,160,0.15)',
      }}
    >
      {label}
    </div>
  );
}

function YearDisplay({ years, align = 'left' }: { years: string[]; align?: 'left' | 'right' }) {
  return (
    <span
      className="font-black leading-none block"
      style={{
        color: 'rgba(49,57,77,0.3)',
        fontFamily: 'var(--font-manrope), sans-serif',
        textAlign: align,
      }}
    >
      <span className="text-6xl md:text-8xl">{years[0]}</span>
      {years[1] && (
        <>
          <br />
          <span className="text-3xl md:text-5xl" style={{ color: 'rgba(49,57,77,0.2)' }}>
            {years[1]}
          </span>
        </>
      )}
    </span>
  );
}

export default function Timeline() {
  const t = useTranslations('common');

  return (
    <section
      id="experience"
      className="px-8 lg:px-20 py-32 overflow-hidden"
      style={{ backgroundColor: '#131b2e', scrollMarginTop: '5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-4">
          <div className="space-y-2">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold block"
              style={{ color: '#c0c1ff', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Chronology
            </span>
            <h3
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
              style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              Professional{' '}
              <span style={{ color: '#c0c1ff', fontStyle: 'italic' }}>Stance</span>
            </h3>
          </div>
          <span
            className="text-sm uppercase tracking-widest pb-2"
            style={{ color: '#908fa0', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            V4 Editorial Timeline • 2018—Present
          </span>
        </div>

        {/* Timeline items */}
        <div className="relative">
          {/* Center vertical line */}
          <div
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{
              background: 'linear-gradient(to bottom, #c0c1ff, rgba(128,131,255,0.15), transparent)',
              transform: 'translateX(-50%)',
            }}
          />

          <div className="space-y-32">
            {TIMELINE_ENTRIES.map((entry, i) => {
              const item = t.raw(`experience_items.${entry.key}`) as {
                title: string;
                date: string;
                description: string;
              };
              const isOdd = i % 2 === 0;
              const isLead = entry.key === 'enti';

              if (isOdd) {
                // ODD: text left, year right
                return (
                  <div key={entry.key} className="relative grid md:grid-cols-2 gap-12 items-center">
                    {/* Text on LEFT */}
                    <div className="md:text-right md:pr-16 order-2 md:order-1">
                      <TierBadge label={entry.tier} isLead={isLead} />
                      <h4
                        className="text-4xl md:text-5xl font-black leading-none mb-4 tracking-tighter"
                        style={{
                          color: '#dae2fd',
                          fontFamily: 'var(--font-manrope), sans-serif',
                        }}
                      >
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap md:justify-end gap-2 mb-6">
                        {entry.tech.map((tech) => (
                          <TechChip key={tech} label={tech} />
                        ))}
                      </div>
                      <p
                        className="text-lg leading-relaxed"
                        style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Year on RIGHT */}
                    <div className="relative order-1 md:order-2">
                      {/* Center dot */}
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10 hidden md:block"
                        style={{
                          backgroundColor: '#c0c1ff',
                          boxShadow: '0 0 20px rgba(192,193,255,0.6)',
                        }}
                      />
                      <div className="pl-0 md:pl-16">
                        <YearDisplay years={entry.yearDisplay} />
                      </div>
                    </div>
                  </div>
                );
              }

              // EVEN: year left, text right
              return (
                <div key={entry.key} className="relative grid md:grid-cols-2 gap-12 items-center">
                  {/* Year on LEFT */}
                  <div className="md:text-right md:pr-16 order-1">
                    <YearDisplay years={entry.yearDisplay} align="right" />
                  </div>

                  {/* Text on RIGHT */}
                  <div className="order-2 relative">
                    {/* Center dot */}
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10 hidden md:block"
                      style={{
                        backgroundColor: '#8083ff',
                        boxShadow: '0 0 16px rgba(128,131,255,0.4)',
                      }}
                    />
                    <div className="pl-0 md:pl-16">
                      <TierBadge label={entry.tier} />
                      <h4
                        className="text-4xl md:text-5xl font-black leading-none mb-4 tracking-tighter"
                        style={{
                          color: '#dae2fd',
                          fontFamily: 'var(--font-manrope), sans-serif',
                        }}
                      >
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {entry.tech.map((tech) => (
                          <TechChip key={tech} label={tech} />
                        ))}
                      </div>
                      <p
                        className="text-lg leading-relaxed"
                        style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
