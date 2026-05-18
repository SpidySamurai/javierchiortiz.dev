'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';

const SERVICE_KEYS = ['landing', 'webapp', 'mvp', 'cms', 'crm', 'ai'] as const;
const STATION_KEYS = ['idea', 'build', 'launch'] as const;
const STATION_ICONS = ['lightbulb', 'terminal', 'rocket_launch'] as const;
const ITEM_DELAYS = ['0s', '-2s', '-4s', '-6s', '-8s'] as const;
const WA_PHONE = '529904147791';

const BELT_STYLES = `
@keyframes conv-track-flow { to { background-position: 16px 0; } }

@keyframes conv-item-pos {
  0%   { transform: translateY(-50%) translateX(-80px) scale(0.95); opacity: 0; background: rgba(19,27,46,0.4); outline: 1px dashed rgba(192,193,255,0.15); box-shadow: none; }
  4%   { opacity: 1; background: rgba(19,27,46,0.5); outline: 1px dashed rgba(192,193,255,0.2); }
  20%  { transform: translateY(-50%) translateX(170px) scale(0.95); background: rgba(19,27,46,0.5); outline: 1px dashed rgba(192,193,255,0.2); box-shadow: none; }
  22%  { transform: translateY(-50%) translateX(170px) scale(1.06); background: rgba(70,50,140,0.65); outline: 1px solid rgba(140,120,240,0.8); box-shadow: 0 0 18px rgba(100,80,200,0.45), inset 0 0 12px rgba(140,120,240,0.12); }
  29%  { transform: translateY(-50%) translateX(170px) scale(1.06); background: rgba(70,50,140,0.65); outline: 1px solid rgba(140,120,240,0.8); box-shadow: 0 0 18px rgba(100,80,200,0.45), inset 0 0 12px rgba(140,120,240,0.12); }
  31%  { transform: translateY(-50%) translateX(170px) scale(1); background: rgba(70,50,140,0.55); outline: 1px solid rgba(130,110,220,0.6); box-shadow: none; }
  44%  { transform: translateY(-50%) translateX(375px) scale(1); background: rgba(70,50,140,0.55); outline: 1px solid rgba(130,110,220,0.6); box-shadow: none; }
  46%  { transform: translateY(-50%) translateX(375px) scale(1.08); background: rgba(50,60,180,0.7); outline: 1px solid rgba(130,140,255,0.9); box-shadow: 0 0 22px rgba(100,110,255,0.5), inset 0 0 14px rgba(130,140,255,0.1); }
  53%  { transform: translateY(-50%) translateX(375px) scale(1.08); background: rgba(50,60,180,0.7); outline: 1px solid rgba(130,140,255,0.9); box-shadow: 0 0 22px rgba(100,110,255,0.5), inset 0 0 14px rgba(130,140,255,0.1); }
  55%  { transform: translateY(-50%) translateX(375px) scale(1); background: rgba(50,60,180,0.6); outline: 1px solid rgba(120,130,240,0.7); box-shadow: none; }
  66%  { transform: translateY(-50%) translateX(572px) scale(1); background: rgba(50,60,180,0.6); outline: 1px solid rgba(120,130,240,0.7); box-shadow: none; }
  68%  { transform: translateY(-50%) translateX(572px) scale(1.1); background: rgba(192,193,255,0.18); outline: 1.5px solid rgba(192,193,255,1); box-shadow: 0 0 28px rgba(192,193,255,0.7), 0 0 60px rgba(192,193,255,0.2), inset 0 0 18px rgba(192,193,255,0.1); }
  75%  { transform: translateY(-50%) translateX(572px) scale(1.1); background: rgba(192,193,255,0.18); outline: 1.5px solid rgba(192,193,255,1); box-shadow: 0 0 28px rgba(192,193,255,0.7), 0 0 60px rgba(192,193,255,0.2), inset 0 0 18px rgba(192,193,255,0.1); }
  77%  { transform: translateY(-50%) translateX(572px) scale(1); background: rgba(192,193,255,0.12); outline: 1px solid rgba(192,193,255,0.7); box-shadow: 0 0 10px rgba(192,193,255,0.3); }
  90%  { transform: translateY(-50%) translateX(1080px) scale(1); opacity: 1; }
  100% { transform: translateY(-50%) translateX(1080px) scale(1); opacity: 0; }
}

@keyframes conv-s-raw {
  0%  { opacity: 1; } 21% { opacity: 1; } 22% { opacity: 0; }
  31% { opacity: 1; } 44% { opacity: 1; } 46% { opacity: 0; }
  55% { opacity: 1; } 66% { opacity: 1; } 68% { opacity: 0; }
  100% { opacity: 0; }
}
@keyframes conv-s-idea {
  0%  { opacity: 0; } 22% { opacity: 0; } 23% { opacity: 1; }
  44% { opacity: 1; } 46% { opacity: 0; } 100% { opacity: 0; }
}
@keyframes conv-s-build {
  0%  { opacity: 0; } 46% { opacity: 0; } 47% { opacity: 1; }
  66% { opacity: 1; } 68% { opacity: 0; } 100% { opacity: 0; }
}
@keyframes conv-s-launch {
  0%  { opacity: 0; } 68% { opacity: 0; } 69% { opacity: 1; } 100% { opacity: 1; }
}
@keyframes conv-pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes conv-fill {
  0%, 45% { width: 0%; } 46% { width: 0%; } 53% { width: 100%; } 100% { width: 100%; }
}

.conv-track-outer {
  position: relative; border-radius: 10px; padding: 2px;
  background: linear-gradient(to right, transparent, rgba(192,193,255,0.06) 15%, rgba(192,193,255,0.08) 50%, rgba(192,193,255,0.06) 85%, transparent);
}
.conv-track-wrap {
  position: relative; height: 92px; overflow: hidden; border-radius: 8px;
  background: linear-gradient(180deg, #0d1525 0%, #0b1220 100%);
}
.conv-zone {
  position: absolute; top: 0; bottom: 0; width: 100px; transform: translateX(-50%); pointer-events: none;
}
.conv-zone-1 { left: 25%; background: radial-gradient(ellipse 50px 46px at 50% 50%, rgba(80,60,160,0.18) 0%, transparent 100%); }
.conv-zone-2 { left: 50%; background: radial-gradient(ellipse 50px 46px at 50% 50%, rgba(60,80,200,0.18) 0%, transparent 100%); }
.conv-zone-3 { left: 75%; background: radial-gradient(ellipse 50px 46px at 50% 50%, rgba(192,193,255,0.1) 0%, transparent 100%); }
.conv-tick {
  position: absolute; top: 0; bottom: 0; width: 1px; pointer-events: none;
  background: linear-gradient(to bottom, transparent 5%, rgba(192,193,255,0.08) 25%, rgba(192,193,255,0.12) 50%, rgba(192,193,255,0.08) 75%, transparent 95%);
}
.conv-tick-1 { left: 25%; } .conv-tick-2 { left: 50%; } .conv-tick-3 { left: 75%; }
.conv-dashes {
  position: absolute; top: 50%; left: 0; right: 0; height: 1px; transform: translateY(-50%);
  background-image: repeating-linear-gradient(to right, rgba(192,193,255,0.15) 0px, rgba(192,193,255,0.15) 5px, transparent 5px, transparent 16px);
  background-size: 16px 1px;
  animation: conv-track-flow 1s linear infinite;
}
.conv-item {
  position: absolute; top: 50%; left: 0; width: 68px; height: 58px; border-radius: 8px; overflow: hidden;
  animation: conv-item-pos 10s linear infinite;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
}
.conv-state {
  position: absolute; inset: 0; opacity: 0; display: flex; flex-direction: column; padding: 7px 8px; gap: 3px;
}
.conv-state-raw { animation: conv-s-raw 10s linear infinite; justify-content: center; gap: 4px; }
.conv-sk { height: 2px; border-radius: 1px; background: rgba(192,193,255,0.14); }
.conv-sk:nth-child(1) { width: 50%; }
.conv-sk:nth-child(2) { width: 85%; }
.conv-sk:nth-child(3) { width: 35%; }
.conv-sk:nth-child(4) { width: 65%; }
.conv-state-idea { animation: conv-s-idea 10s linear infinite; flex-direction: row; align-items: center; gap: 6px; padding: 8px; }
.conv-idea-icon { color: rgba(180,160,255,0.9); flex-shrink: 0; }
.conv-idea-lines { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.conv-il { height: 2px; border-radius: 1px; background: rgba(180,160,255,0.5); }
.conv-il:nth-child(1) { width: 80%; }
.conv-il:nth-child(2) { width: 100%; }
.conv-il:nth-child(3) { width: 55%; }
.conv-state-build { animation: conv-s-build 10s linear infinite; justify-content: center; }
.conv-build-top { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
.conv-build-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(130,140,255,0.9); animation: conv-pulse-dot 1s ease-in-out infinite; }
.conv-build-label { font-size: 7px; font-weight: 700; letter-spacing: 0.08em; color: rgba(160,170,255,0.9); text-transform: uppercase; }
.conv-build-bars { display: flex; flex-direction: column; gap: 3px; }
.conv-bb { height: 2px; border-radius: 1px; background: rgba(130,140,255,0.4); }
.conv-bb:nth-child(1) { width: 90%; }
.conv-bb:nth-child(2) { width: 60%; }
.conv-bb:nth-child(3) { width: 75%; }
.conv-build-progress { height: 3px; border-radius: 2px; background: rgba(255,255,255,0.06); margin-top: 4px; overflow: hidden; }
.conv-build-fill { height: 100%; border-radius: 2px; background: rgba(130,140,255,0.7); animation: conv-fill 10s linear infinite; }
.conv-state-launch { animation: conv-s-launch 10s linear infinite; align-items: center; justify-content: center; gap: 3px; }
.conv-launch-check { color: #c0c1ff; }
.conv-launch-tag { font-size: 6.5px; font-weight: 700; letter-spacing: 0.12em; color: #c0c1ff; text-transform: uppercase; opacity: 0.9; }
`;

function BeltItem({ delay }: { delay: string }) {
  return (
    <div className="conv-item" style={{ animationDelay: delay }}>
      <div className="conv-state conv-state-raw" style={{ animationDelay: delay }}>
        <div className="conv-sk" />
        <div className="conv-sk" />
        <div className="conv-sk" />
        <div className="conv-sk" />
      </div>
      <div className="conv-state conv-state-idea" style={{ animationDelay: delay }}>
        <div className="conv-idea-icon">
          <span translate="no" className="material-symbols-outlined" style={{ fontSize: 22 }}>lightbulb</span>
        </div>
        <div className="conv-idea-lines">
          <div className="conv-il" />
          <div className="conv-il" />
          <div className="conv-il" />
        </div>
      </div>
      <div className="conv-state conv-state-build" style={{ animationDelay: delay }}>
        <div className="conv-build-top">
          <div className="conv-build-dot" style={{ animationDelay: delay }} />
          <span className="conv-build-label">building</span>
        </div>
        <div className="conv-build-bars">
          <div className="conv-bb" />
          <div className="conv-bb" />
          <div className="conv-bb" />
        </div>
        <div className="conv-build-progress">
          <div className="conv-build-fill" style={{ animationDelay: delay }} />
        </div>
      </div>
      <div className="conv-state conv-state-launch" style={{ animationDelay: delay }}>
        <div className="conv-launch-check">
          <span
            translate="no"
            className="material-symbols-outlined"
            style={{
              fontSize: 26,
              fontVariationSettings: "'FILL' 1, 'wght' 400",
              filter: 'drop-shadow(0 0 6px rgba(192,193,255,0.8))',
            }}
          >
            check_circle
          </span>
        </div>
        <span className="conv-launch-tag">deployed</span>
      </div>
    </div>
  );
}

export default function Services() {
  const t = useTranslations('common');
  const locale = useLocale();
  const waMessage =
    locale === 'es'
      ? 'Hola Javier, vi tu portfolio y quiero contactarte'
      : 'Hi Javier, I saw your portfolio and want to get in touch';
  const waHref = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waMessage)}`;

  return (
    <section
      id="services"
      data-track-section="services"
      className="px-8 lg:px-20 py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--ds-surface)', scrollMarginTop: '5rem' }}
    >
      <style dangerouslySetInnerHTML={{ __html: BELT_STYLES }} />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <span
            className="text-xs uppercase tracking-[0.3em] font-bold block mb-3"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('services_label')}
          </span>
          <h3
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            {t('services_title')}{' '}
            <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
              {t('services_title_accent')}
            </span>
          </h3>
        </motion.div>

        {/* Services grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
          }}
        >
          {SERVICE_KEYS.map((key) => {
            const item = t.raw(`services_items.${key}`) as { name: string; desc: string };
            return (
              <motion.div
                key={key}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                }}
              >
                <p
                  className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-1"
                  style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
                >
                  {item.name}
                </p>
                <p
                  className="text-sm italic"
                  style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Separator */}
        <div
          className="h-px mb-12"
          style={{
            background:
              'linear-gradient(to right, transparent, color-mix(in srgb, var(--ds-outline-variant) 30%, transparent), transparent)',
          }}
        />

        {/* Conveyor Belt */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
        >
          <div style={{ maxWidth: 820, margin: '0 auto' }}>

            {/* Stations */}
            <div className="grid grid-cols-3">
              {STATION_KEYS.map((key, i) => {
                const step = t.raw(`services_process.${key}`) as { name: string; desc: string };
                return (
                  <div key={key} className="flex flex-col items-center gap-1 pb-4">
                    <div
                      className="w-[38px] h-[38px] rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(192,193,255,0.07)',
                        boxShadow: 'inset 0 0 0 1px rgba(192,193,255,0.12)',
                      }}
                    >
                      <span
                        translate="no"
                        className="material-symbols-outlined"
                        style={{ fontSize: 18, color: 'var(--ds-primary)' }}
                      >
                        {STATION_ICONS[i]}
                      </span>
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="text-[13px] font-black uppercase tracking-wide"
                      style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
                    >
                      {step.name}
                    </span>
                    <p
                      className="text-[10.5px] text-center leading-relaxed"
                      style={{
                        color: '#5a5870',
                        fontFamily: 'var(--font-inter), sans-serif',
                        maxWidth: 140,
                      }}
                    >
                      {step.desc}
                    </p>
                    <div
                      style={{
                        width: 1,
                        height: 18,
                        background: 'linear-gradient(to bottom, rgba(192,193,255,0.18), transparent)',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Track */}
            <div className="conv-track-outer">
              <div className="conv-track-wrap">
                <div className="conv-zone conv-zone-1" />
                <div className="conv-zone conv-zone-2" />
                <div className="conv-zone conv-zone-3" />
                <div className="conv-tick conv-tick-1" />
                <div className="conv-tick conv-tick-2" />
                <div className="conv-tick conv-tick-3" />
                <div className="conv-dashes" />
                {ITEM_DELAYS.map((delay, i) => (
                  <BeltItem key={i} delay={delay} />
                ))}
              </div>
            </div>

          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.15 }}
        >
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'var(--ds-primary)',
              color: 'var(--ds-on-primary)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {t('services_cta')}
          </a>
        </motion.div>

      </div>
    </section>
  );
}
