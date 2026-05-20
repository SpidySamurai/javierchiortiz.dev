'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLanyard } from '@/hooks/useLanyard';
import { useMarvelRivals } from '@/hooks/useMarvelRivals';
import { LuFlame, LuStar, LuShield, LuCodeXml, LuGem, LuZap } from 'react-icons/lu';
import type { LanyardUser } from '@/types/lanyard';

const DISCORD_ID = '363896212874723331';
const MARVEL_UID = '1774670402';

const STATUS_COLOR: Record<string, string> = {
  online: '#22c55e',
  idle: '#eab308',
  dnd: '#ef4444',
  offline: '#6b7280',
};

function InlineBadges({ user }: { user?: LanyardUser }) {
  if (!user) return null;
  const flags = user.public_flags ?? 0;
  const badges: { icon: React.ReactNode; color: string; title: string }[] = [];

  if (flags & (1 << 6)) badges.push({ icon: <LuFlame size={10} />, color: '#a855f7', title: 'HypeSquad Bravery' });
  if (flags & (1 << 7)) badges.push({ icon: <LuStar size={10} />, color: '#ef4444', title: 'HypeSquad Brilliance' });
  if (flags & (1 << 8)) badges.push({ icon: <LuShield size={10} />, color: '#22c55e', title: 'HypeSquad Balance' });
  if (flags & (1 << 22)) badges.push({ icon: <LuCodeXml size={10} />, color: '#22c55e', title: 'Active Developer' });
  if (flags & (1 << 2)) badges.push({ icon: <LuGem size={10} />, color: '#c0c1ff', title: 'Discord Staff' });
  if (flags & (1 << 17)) badges.push({ icon: <LuZap size={10} />, color: '#f59e0b', title: 'Early Supporter' });

  if (badges.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
      {badges.slice(0, 4).map((b, i) => (
        <span key={i} title={b.title} style={{ color: b.color, display: 'flex', alignItems: 'center' }}>
          {b.icon}
        </span>
      ))}
    </div>
  );
}

type GamerCardProps = { isOpen: boolean; onClose: () => void; anchorY?: number | null };

export default function GamerCard({ isOpen, onClose, anchorY }: GamerCardProps) {
  const { data } = useLanyard({ userId: DISCORD_ID });
  const marvel = useMarvelRivals(MARVEL_UID);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMd, setIsMd] = useState(false);
  const [isXl, setIsXl] = useState(false);

  useEffect(() => {
    const mdQ = window.matchMedia('(min-width: 768px)');
    const xlQ = window.matchMedia('(min-width: 1280px)');
    setIsMd(mdQ.matches);
    setIsXl(xlQ.matches);
    const onMd = (e: MediaQueryListEvent) => setIsMd(e.matches);
    const onXl = (e: MediaQueryListEvent) => setIsXl(e.matches);
    mdQ.addEventListener('change', onMd);
    xlQ.addEventListener('change', onXl);
    return () => { mdQ.removeEventListener('change', onMd); xlQ.removeEventListener('change', onXl); };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const id = setInterval(() => setCurrentTime(Date.now()), 1000);
    setCurrentTime(Date.now());
    return () => clearInterval(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const status = data?.discord_status ?? 'offline';
  const user = data?.discord_user;
  const spotify = data?.listening_to_spotify ? data.spotify : null;
  const activity = data?.activities?.find((a) => a.type === 0);
  const customStatus = data?.activities?.find((a) => a.type === 4)?.state;

  const avatarUrl = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
    : null;

  const spotifyProgress = spotify
    ? Math.max(0, Math.min(100, ((currentTime - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start)) * 100))
    : 0;

  const elapsedTime = (() => {
    if (!activity?.timestamps?.start) return null;
    const diff = currentTime - activity.timestamps.start;
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  })();

  const surface = 'var(--ds-surface)';
  const divider: React.CSSProperties = { height: 1, background: 'var(--ds-surface-high)', margin: '0 14px' };
  const rowPad: React.CSSProperties = { padding: '9px 14px' };
  const label: React.CSSProperties = {
    color: 'var(--ds-outline)',
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 3,
    fontFamily: 'var(--font-inter), sans-serif',
  };
  const value: React.CSSProperties = {
    color: 'var(--ds-on-surface)',
    fontWeight: 700,
    fontSize: 11,
    fontFamily: 'var(--font-inter), sans-serif',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  const muted: React.CSSProperties = {
    color: 'var(--ds-outline)',
    fontSize: 10,
    fontFamily: 'var(--font-inter), sans-serif',
    flexShrink: 0,
    marginLeft: 8,
  };

  // Tablet: right of drawer (w-64=256px + 16px gap), Y aligned to button that opened it (clamped)
  const tabletTop = anchorY != null
    ? Math.min(anchorY + 64, (isMd ? window.innerHeight : 800) - 340)
    : 80;

  const cardPos: React.CSSProperties = isXl
    ? { left: 'calc(var(--sidebar-w, 16rem) + 8px)', bottom: '3.5rem' }
    : isMd
    ? { left: '272px', top: tabletTop }
    : { top: 'calc(50vh - 160px)', left: 'calc(50vw - 130px)' };

  // On tablet the drawer is z-9999; card must be above it; backdrop below drawer so drawer stays interactive
  const backdropZ = isXl ? 40 : 9997;
  const cardZ = isXl ? 50 : 10000;

  const animProps = !isXl && !isMd
    ? { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } }
    : { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -8 } };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0" style={{ zIndex: backdropZ }} onClick={onClose} />
          <motion.div
            className="fixed ds-2026"
            style={{ ...cardPos, zIndex: cardZ }}
            {...animProps}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div
              style={{
                width: 260,
                background: surface,
                borderRadius: 14,
                border: '1px solid var(--ds-surface-bright)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{ padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      width={36}
                      height={36}
                      alt=""
                      style={{ borderRadius: '50%', border: '2px solid var(--ds-surface-high)', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ds-surface-high)' }} />
                  )}
                  <div
                    style={{
                      position: 'absolute', bottom: -1, right: -1,
                      width: 10, height: 10, borderRadius: '50%',
                      background: STATUS_COLOR[status] ?? '#6b7280',
                      border: `2px solid ${surface}`,
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...value, fontSize: 12 }}>
                    {user?.global_name ?? user?.username ?? 'Javier'}
                  </div>
                  {customStatus && (
                    <div style={{ color: 'var(--ds-outline)', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1, fontFamily: 'var(--font-inter), sans-serif' }}>
                      {customStatus}
                    </div>
                  )}
                </div>
                <InlineBadges user={user} />
              </div>

              <div style={divider} />

              {/* Spotify */}
              <div style={rowPad}>
                <div style={label}>Spotify</div>
                {spotify ? (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 2 }}>
                    {/* Spinning disc */}
                    <div style={{ position: 'relative', flexShrink: 0, width: 42, height: 42 }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: 42, height: 42, borderRadius: '50%',
                          backgroundImage: `url(${spotify.album_art_url})`,
                          backgroundSize: 'cover',
                          border: '2px solid var(--ds-surface-bright)',
                        }}
                      />
                      <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 9, height: 9, borderRadius: '50%',
                        background: 'var(--ds-surface)',
                        border: '1.5px solid var(--ds-surface-high)',
                      }} />
                    </div>
                    {/* Text + progress */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...value, fontSize: 10 }}>{spotify.song}</div>
                      <div style={{ ...muted, marginLeft: 0, marginTop: 1 }}>{spotify.artist}</div>
                      <div style={{ height: 2, background: 'var(--ds-surface-high)', borderRadius: 1, marginTop: 5 }}>
                        <div style={{ height: 2, borderRadius: 1, background: 'var(--ds-primary)', width: `${spotifyProgress}%`, transition: 'width 1s linear' }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <span style={{ ...muted, marginLeft: 0 }}>Not listening</span>
                )}
              </div>

              <div style={divider} />

              {/* Activity */}
              <div style={{ ...rowPad, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={label}>Activity</div>
                  <div style={value}>{activity?.name ?? 'Idle'}</div>
                </div>
                {elapsedTime && <span style={muted}>{elapsedTime}</span>}
              </div>

              <div style={divider} />

              {/* Marvel Rivals */}
              <div style={{ ...rowPad, paddingBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={label}>Marvel Rivals</div>
                <span style={{ ...value, color: marvel.isLoading ? 'var(--ds-outline)' : (marvel.rankColor || 'var(--ds-on-surface)') }}>
                  {marvel.isLoading ? '...' : marvel.rank}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
