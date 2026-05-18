'use client';

import { useTranslations } from 'next-intl';

export default function LeaveMemory() {
  const t = useTranslations('common');

  return (
    <section
      className="py-20 px-8 md:px-16 border-t"
      style={{
        backgroundColor: 'var(--ds-surface)',
        borderColor: 'color-mix(in srgb, var(--ds-outline-variant) 10%, transparent)',
      }}
    >
      <div className="max-w-2xl mx-auto relative">
        <h2
          className="text-2xl font-extrabold mb-2"
          style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          {t('leave_memory_title')}
        </h2>
        <p
          className="mb-6"
          style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {t('leave_memory_subtitle')}
        </p>
        <textarea
          disabled
          placeholder={t('leave_memory_placeholder')}
          rows={4}
          className="w-full rounded-lg p-4 resize-none mb-4"
          style={{
            backgroundColor: 'var(--ds-container)',
            color: 'var(--ds-on-surface)',
            border: 'none',
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          disabled
          className="px-6 py-2 rounded-lg font-bold text-sm"
          style={{
            backgroundColor: 'var(--ds-primary-container)',
            color: 'var(--ds-on-primary)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          {t('leave_memory_submit')}
        </button>

        {/* Coming-soon overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg"
          style={{
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(11, 19, 38, 0.6)',
          }}
        >
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              backgroundColor: 'rgba(128, 131, 255, 0.13)',
              border: '1px solid rgba(128, 131, 255, 0.27)',
              color: 'var(--ds-primary)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {t('leave_memory_soon')}
          </span>
        </div>
      </div>
    </section>
  );
}
