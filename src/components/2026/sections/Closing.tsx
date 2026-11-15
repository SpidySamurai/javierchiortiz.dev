import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/2026/ui/Reveal';
import { ScrollFillText } from '@/components/2026/ui/ScrollFillText';
import EmailCopyBand from '@/components/2026/ui/EmailCopyBand';
import { whatsappUrl } from '@/lib/contact';

export default function Closing() {
  const t = useTranslations('common');
  const heading = t('contact_heading');
  const cut = heading.lastIndexOf(' ');
  const lead = heading.slice(0, cut);
  const accent = heading.slice(cut + 1);

  return (
    <section
      id="contact"
      data-track-section="contact"
      className="py-28 px-8 lg:px-20"
      style={{ backgroundColor: 'var(--ds-about-bg)', scrollMarginTop: '5rem' }}
    >
      <Reveal y={24} className="max-w-7xl mx-auto">
        <div
          className="rounded-3xl p-8 md:p-16 flex flex-col gap-10"
          style={{ backgroundColor: 'var(--ds-surface-container)' }}
        >
          <div className="flex flex-col items-start gap-6">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('contact_label')}
            </span>
            <h2
              className="text-4xl md:text-6xl font-black tracking-tighter"
              style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              <ScrollFillText>
                {lead} <em style={{ color: 'var(--ds-primary)' }}>{accent}</em>
              </ScrollFillText>
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('closing_line')}
            </p>
            <a
              href={whatsappUrl(t('contact_wa_message'))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ds-primary)]"
              style={{
                backgroundColor: 'var(--ds-primary-container)',
                color: 'var(--ds-on-primary)',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
            >
              {t('closing_wa_label')}
              <span translate="no" aria-hidden className="material-symbols-outlined text-base">
                arrow_outward
              </span>
            </a>
          </div>
          <EmailCopyBand />
        </div>
      </Reveal>
    </section>
  );
}
