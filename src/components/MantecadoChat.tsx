'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from './FlatCat.module.css';

type Phase = 'idle' | 'chat';

interface PupilOffset {
  x: number;
  y: number;
}

const MC = {
  white:       '#fdfdfd',
  orange:      '#e67e22',
  nose:        '#e08e79',
  eyeYellow:   '#f2c94c',
  dark:        '#33292b',
  darkMid:     '#7a4e20',
  orangeLight: '#fce0c0',
  border:      '#e8a040',
  shadow:      '0 8px 40px rgba(120, 60, 0, 0.28), 0 0 0 1.5px rgba(230, 126, 34, 0.5)',
} as const;

const GREETING_COUNT = 5;

const CAT_VARS = {
  '--flat-cat-white': '#fdfdfd',
  '--flat-cat-orange': '#e67e22',
  '--flat-cat-nose': '#e08e79',
  '--flat-cat-eye-bg': '#f2c94c',
  '--flat-cat-eye-pupil': '#33292b',
} as React.CSSProperties;

const MORPH_TRANSITION = [
  'width 0.52s cubic-bezier(0.32, 0.72, 0, 1)',
  'height 0.52s cubic-bezier(0.32, 0.72, 0, 1)',
  'border-radius 0.4s ease',
  'box-shadow 0.35s ease',
].join(', ');

const KEYFRAMES = `
  @keyframes mc-pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50%     { opacity: 0.4; transform: scale(1.6); }
  }
`;


function CatEar({ side }: { side: 'left' | 'right' }) {
  return (
    <motion.div
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22, delay: side === 'right' ? 0.06 : 0 }}
      style={{
        position: 'absolute',
        top: -28,
        ...(side === 'left' ? { left: 36 } : { right: 36 }),
        width: 30,
        height: 32,
        transformOrigin: 'bottom center',
        transform: side === 'left' ? 'rotate(-13deg)' : 'rotate(13deg)',
        zIndex: 2,
      }}
    >
      <div style={{ position: 'absolute', left: '50%', marginLeft: -15, top: 0, width: 0, height: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderBottom: `32px solid ${MC.orange}` }} />
      <div style={{ position: 'absolute', left: '50%', marginLeft: -9, top: 10, width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderBottom: `20px solid ${MC.nose}` }} />
    </motion.div>
  );
}

function ChatEye({ offset }: { offset: PupilOffset }) {
  return (
    <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: MC.eyeYellow, border: `2.5px solid ${MC.dark}`, position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 7, height: 7, borderRadius: '50%', backgroundColor: MC.dark, transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`, transition: 'transform 0.1s ease-out' }} />
    </div>
  );
}

function getPupilOffset(el: HTMLElement | null, mx: number, my: number): PupilOffset {
  if (!el) return { x: 0, y: 0 };
  const r = el.getBoundingClientRect();
  const angle = Math.atan2(my - (r.top + r.height / 2), mx - (r.left + r.width / 2));
  const dist = Math.min(Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2)), 4);
  return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '2px 0' }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: MC.white, display: 'inline-block' }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.14, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.855L.057 23.943l6.272-1.648A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.032-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.86 9.86 0 012.118 12C2.118 6.545 6.545 2.118 12 2.118S21.882 6.545 21.882 12 17.455 21.882 12 21.882z"/>
    </svg>
  );
}

export default function MantecadoChat() {
  const t = useTranslations('common.mantecado');
  const waHref = `https://wa.me/529904147791?text=${encodeURIComponent(t('wa_message'))}`;
  const [phase, setPhase] = useState<Phase>('idle');
  const [greeting, setGreeting] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [pupils, setPupils] = useState<{ left: PupilOffset; right: PupilOffset }>({
    left: { x: 0, y: 0 }, right: { x: 0, y: 0 },
  });

  const idleFaceRef = useRef<HTMLDivElement>(null);
  const leftEyeRef  = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Idle eye tracking
  useEffect(() => {
    if (phase === 'chat') return;
    const move = (e: MouseEvent) => {
      if (!idleFaceRef.current) return;
      const r = idleFaceRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
      const dist = Math.min(Math.hypot(e.clientX - cx, e.clientY - cy), 8);
      idleFaceRef.current.style.setProperty('--pupil-x', `${Math.cos(angle) * dist}px`);
      idleFaceRef.current.style.setProperty('--pupil-y', `${Math.sin(angle) * dist}px`);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [phase]);

  // Chat eye tracking
  useEffect(() => {
    if (phase !== 'chat') return;
    const move = (e: MouseEvent) => setPupils({
      left:  getPupilOffset(leftEyeRef.current,  e.clientX, e.clientY),
      right: getPupilOffset(rightEyeRef.current, e.clientX, e.clientY),
    });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [phase]);

  // Auto-messages when chat opens
  useEffect(() => {
    if (phase !== 'chat') return;
    const t1 = setTimeout(() => setShowTyping(true),  1000);
    const t2 = setTimeout(() => { setShowTyping(false); setShowWA(true); }, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [showTyping, showWA]);

  const handleCatClick = () => {
    if (phase !== 'idle') return;
    const key = `greeting_${Math.floor(Math.random() * GREETING_COUNT)}` as Parameters<typeof t>[0];
    setGreeting(t(key));
    setPhase('chat');
  };

  const handleClose = () => {
    setPhase('idle');
    setShowTyping(false);
    setShowWA(false);
  };

  const isChat = phase === 'chat';

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        style={{
          position: 'fixed',
          bottom: '0.75rem',
          right: '0.75rem',
          zIndex: 9999,
          overflow: 'visible',
          width: isChat ? 320 : 100,
          height: isChat ? 460 : 100,
          transition: MORPH_TRANSITION,
        }}
      >
        <AnimatePresence>
          {isChat && <><CatEar side="left" /><CatEar side="right" /></>}
        </AnimatePresence>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: isChat ? 'hidden' : 'visible',
            borderRadius: isChat ? 18 : 0,
            backgroundColor: isChat ? MC.white : 'transparent',
            boxShadow: isChat ? MC.shadow : 'none',
            transition: 'border-radius 0.4s ease, background-color 0.3s ease, box-shadow 0.35s ease',
          }}
        >
          <AnimatePresence mode="wait">
            {!isChat ? (
              /* ── Idle / FlatCat ── */
              <motion.div
                key="cat"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.15 } }}
                style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', ...CAT_VARS }}
                onClick={handleCatClick}
                title="¡Miau!"
              >
                <div className={styles['flat-cat-anim']}>
                  <div className={styles['flat-cat']}>
                    <div className={styles['cat-tail']} />
                    <div className={styles['cat-body']} />
                    <div className={styles['cat-head']} ref={idleFaceRef}>
                      <div className={`${styles['cat-ear']} ${styles.left}`} />
                      <div className={`${styles['cat-ear']} ${styles.right}`} />
                      <div className={styles['cat-face']}>
                        <div className={styles['cat-eye']} />
                        <div className={styles['cat-nose']} />
                        <div className={styles['cat-eye']} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* ── Chat box ── */
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
                transition={{ duration: 0.2, delay: 0.1 }}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {/* ── Header (shimmer + cat face) ── */}
                <div
                  style={{
                    flexShrink: 0,
                    backgroundColor: MC.white,
                    backgroundImage: `linear-gradient(135deg, ${MC.orange} 38%, transparent 38%)`,
                    backgroundSize: '100% 100%',
                    padding: '12px 14px 10px',
                    position: 'relative',
                  }}
                >
                  {/* Close button → triggers morph-back */}
                  <button
                    onClick={handleClose}
                    style={{
                      position: 'absolute', top: 8, right: 10,
                      background: 'rgba(51,41,43,0.12)', border: 'none', cursor: 'pointer',
                      color: MC.dark, padding: '3px 5px', display: 'flex',
                      alignItems: 'center', borderRadius: '6px', zIndex: 1,
                    }}
                  >
                    <span translate="no" className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
                  </button>

                  {/* Face: whiskers + eyes + nose */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, position: 'relative', marginBottom: 6 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginRight: 10 }}>
                      <div style={{ width: 28, height: 1.5, backgroundColor: 'rgba(51,41,43,0.28)', borderRadius: 2, transform: 'rotate(-6deg)' }} />
                      <div style={{ width: 24, height: 1.5, backgroundColor: 'rgba(51,41,43,0.28)', borderRadius: 2, transform: 'rotate(6deg)' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
                      <div ref={leftEyeRef}><ChatEye offset={pupils.left} /></div>
                      <div style={{ position: 'relative', width: 10, height: 16 }}>
                        <div style={{ position: 'absolute', bottom: 0, left: '50%', marginLeft: -5, width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `7px solid ${MC.nose}` }} />
                      </div>
                      <div ref={rightEyeRef}><ChatEye offset={pupils.right} /></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginLeft: 10 }}>
                      <div style={{ width: 28, height: 1.5, backgroundColor: 'rgba(51,41,43,0.28)', borderRadius: 2, transform: 'rotate(6deg)' }} />
                      <div style={{ width: 24, height: 1.5, backgroundColor: 'rgba(51,41,43,0.28)', borderRadius: 2, transform: 'rotate(-6deg)' }} />
                    </div>
                  </div>

                  {/* Name + pulsing status */}
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 800, fontSize: '0.85rem', color: MC.dark }}>
                      Mantecado
                    </span>
                    <span style={{ marginLeft: 6, fontSize: '0.65rem', color: MC.darkMid, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#56c464', display: 'inline-block', animation: 'mc-pulse-dot 1.4s ease infinite' }} />
                      {t('online')}
                    </span>
                  </div>
                </div>

                {/* ── Messages — paw-print bg ── */}
                <div
                  style={{
                    flex: 1, overflowY: 'auto', padding: '14px 12px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                    backgroundColor: '#fef9f4',
                    backgroundImage: 'radial-gradient(circle, rgba(230,126,34,0.07) 2px, transparent 2px)',
                    backgroundSize: '20px 20px',
                  }}
                >
                  {/* Greeting bubble */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 }}
                    style={{ alignSelf: 'flex-start', maxWidth: '88%', position: 'relative' }}
                  >
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '12px 12px 12px 3px',
                      backgroundColor: MC.orange,
                      color: MC.white,
                      fontSize: '0.82rem',
                      lineHeight: 1.5,
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}>
                      {greeting}
                    </div>
                  </motion.div>

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {showTyping && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.18 }}
                        style={{ alignSelf: 'flex-start', position: 'relative' }}
                      >
                        <div style={{ padding: '10px 14px', borderRadius: '12px 12px 12px 3px', backgroundColor: MC.orange }}>
                          <TypingDots />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* WhatsApp card bubble */}
                  <AnimatePresence>
                    {showWA && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                        style={{ alignSelf: 'flex-start', maxWidth: '92%', position: 'relative' }}
                      >
                        <div style={{
                          borderRadius: '12px 12px 12px 3px',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(120,60,0,0.1)',
                        }}>
                          <div style={{
                            padding: '8px 12px',
                            backgroundColor: MC.orange,
                            color: MC.white,
                            fontSize: '0.82rem',
                            lineHeight: 1.5,
                            fontFamily: 'var(--font-inter), sans-serif',
                          }}>
                            {t('wa_bubble')}
                          </div>
                          <a
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '9px 12px',
                              backgroundColor: '#e8f9ee',
                              borderTop: '1px solid #b8e6c8',
                              textDecoration: 'none',
                              transition: 'background-color 0.15s',
                            }}
                          >
                            <span style={{ color: '#25d366' }}><WhatsAppIcon /></span>
                            <div>
                              <div style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 700, fontSize: '0.78rem', color: '#128c7e' }}>
                                {t('wa_cta')}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#5a9070', fontFamily: 'var(--font-inter), sans-serif' }}>
                                {t('wa_phone')}
                              </div>
                            </div>
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>

                {/* ── Locked input ── */}
                <div
                  style={{
                    padding: '10px 12px',
                    borderTop: `1px solid ${MC.border}`,
                    backgroundColor: MC.orangeLight,
                    flexShrink: 0,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.6)',
                      border: `1px solid ${MC.border}`,
                      borderRadius: 20,
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: MC.darkMid,
                      fontSize: '0.76rem',
                      fontFamily: 'var(--font-inter), sans-serif',
                      userSelect: 'none',
                      cursor: 'default',
                    }}
                  >
                    <span translate="no" className="material-symbols-outlined" style={{ fontSize: 14, opacity: 0.6 }}>lock</span>
                    {t('coming_soon')}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
