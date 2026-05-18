# GamerCard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the full-screen GamerCard modal with a compact popover anchored to the sidebar button, using the 2026 design system tokens.

**Architecture:** GamerCard.tsx is rewritten as a fixed-position popover that appears at `left: calc(var(--sidebar-w) + 8px), bottom: 3.5rem`. GamerCardContext keeps state management but stops rendering the card globally — Sidebar.tsx renders it instead. Old sub-components in `src/components/gamer-card/` remain as legacy and are not imported by the new card.

**Tech Stack:** React 19, framer-motion (AnimatePresence), useLanyard hook, useMarvelRivals hook, design tokens via CSS vars (`var(--ds-*)`)

---

### Task 1: Rewrite GamerCard.tsx as compact popover

**Files:**
- Modify: `src/components/GamerCard.tsx`

Layout from top to bottom:
```
┌────────────────────────────┐
│ [avatar+dot] Name  [badges]│  header
│ custom status text         │
├────────────────────────────┤
│ SPOTIFY  Song — Artist     │
│          ▓▓▓▓▓░░░          │  progress bar
├────────────────────────────┤
│ ACTIVITY  App name  2h 15m │
├────────────────────────────┤
│ MARVEL RIVALS   Gold III   │
└────────────────────────────┘
```

Design tokens used: `var(--ds-surface)`, `var(--ds-surface-high)` (`#222a3d`), `var(--ds-surface-bright)` (`#31394d`), `var(--ds-on-surface)` (`#dae2fd`), `var(--ds-on-surface-variant)` (`#c7c4d7`), `var(--ds-outline)` (`#908fa0`), `var(--ds-primary)` (`#c0c1ff`).

Note: `--ds-surface-high` and `--ds-surface-bright` are not CSS vars in globals.css — use hex values `#222a3d` and `#31394d` directly for borders/dividers.

- [ ] **Step 1: Replace GamerCard.tsx with compact popover**

```tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
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

type GamerCardProps = { isOpen: boolean; onClose: () => void };

export default function GamerCard({ isOpen, onClose }: GamerCardProps) {
  const { data } = useLanyard({ userId: DISCORD_ID });
  const marvel = useMarvelRivals(MARVEL_UID);
  const [currentTime, setCurrentTime] = useState(Date.now());

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
    ? Math.min(100, ((currentTime - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start)) * 100)
    : 0;

  const elapsedTime = (() => {
    if (!activity?.timestamps?.start) return null;
    const diff = currentTime - activity.timestamps.start;
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  })();

  const surface = 'var(--ds-surface)';
  const divider: React.CSSProperties = { height: 1, background: '#222a3d', margin: '0 14px' };
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            className="fixed z-50"
            style={{ left: 'calc(var(--sidebar-w, 16rem) + 8px)', bottom: '3.5rem' }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div
              style={{
                width: 260,
                background: surface,
                borderRadius: 14,
                border: '1px solid #31394d',
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
                      style={{ borderRadius: '50%', border: '2px solid #222a3d', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#222a3d' }} />
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
                  <>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={value}>{spotify.song}</span>
                      <span style={muted}>{spotify.artist}</span>
                    </div>
                    <div style={{ height: 2, background: '#222a3d', borderRadius: 1, marginTop: 6 }}>
                      <div style={{ height: 2, borderRadius: 1, background: 'var(--ds-primary)', width: `${spotifyProgress}%`, transition: 'width 1s linear' }} />
                    </div>
                  </>
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
```

- [ ] **Step 2: Verify file saved correctly — check imports compile**

Run: `pnpm build 2>&1 | grep -E "error|GamerCard" | head -20`

Expected: No TypeScript errors related to GamerCard.tsx. (Other errors unrelated to this file are fine to ignore for now.)

---

### Task 2: Remove GamerCard from GamerCardContext

**Files:**
- Modify: `src/components/providers/GamerCardContext.tsx`

The context currently renders `<GamerCard>` globally in the provider. GamerCard will now be rendered in Sidebar, so remove it here. The context API (`isOpen`, `isUnlocked`, `openCard`, `closeCard`, `unlockCard`) stays identical.

- [ ] **Step 1: Remove GamerCard render from provider**

Replace the full file content:

```tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface GamerCardContextType {
  isOpen: boolean;
  isUnlocked: boolean;
  openCard: () => void;
  closeCard: () => void;
  unlockCard: () => void;
}

const GamerCardContext = createContext<GamerCardContextType | undefined>(undefined);

export function GamerCardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const unlocked = localStorage.getItem('gamer-card-unlocked') === 'true';
    setIsUnlocked(unlocked);
  }, []);

  const openCard = () => setIsOpen(true);
  const closeCard = () => setIsOpen(false);

  const unlockCard = () => {
    setIsUnlocked(true);
    localStorage.setItem('gamer-card-unlocked', 'true');
    setIsOpen(true);
  };

  return (
    <GamerCardContext.Provider value={{ isOpen, isUnlocked, openCard, closeCard, unlockCard }}>
      {children}
    </GamerCardContext.Provider>
  );
}

export function useGamerCard() {
  const context = useContext(GamerCardContext);
  if (context === undefined) {
    throw new Error('useGamerCard must be used within a GamerCardProvider');
  }
  return context;
}
```

- [ ] **Step 2: Verify no TS errors**

Run: `pnpm build 2>&1 | grep "error" | head -10`

---

### Task 3: Add GamerCard popover to Sidebar

**Files:**
- Modify: `src/components/2026/layout/Sidebar.tsx`

The Sidebar renders the GamerCard button (`isUnlocked && <motion.button ... onClick={openCard}>`) in the bottom section. Add the `<GamerCard>` component rendered at the bottom of the Sidebar's JSX (after the `<button>` toggle), using the context's `isOpen` and `closeCard`.

- [ ] **Step 1: Import GamerCard and add render to Sidebar**

Add import at top of Sidebar.tsx:
```tsx
import GamerCard from '@/components/GamerCard';
```

In the return statement of Sidebar, the current structure ends with:
```tsx
    </>  // closes the Fragment wrapping <aside> and the toggle <button>
  );
```

Change it to render GamerCard inside the fragment:
```tsx
      {/* GamerCard popover — rendered here so it's only on xl where sidebar exists */}
      <GamerCard isOpen={isOpen} onClose={closeCard} />
    </>
  );
```

The `isOpen` and `closeCard` come from `useGamerCard()` which is already imported. Destructure them:

Find the existing destructure line:
```tsx
const { isUnlocked, openCard } = useGamerCard();
```

Replace with:
```tsx
const { isUnlocked, openCard, isOpen, closeCard } = useGamerCard();
```

- [ ] **Step 2: Verify popover renders correctly in dev server**

Run: `pnpm dev` (if not already running)

Open `http://localhost:3000/es` → Find the FlatCat (bottom of sidebar on xl screen) → click it 5 times to unlock → GamerCard should appear as compact popover anchored to the right of the sidebar.

Check:
- Popover appears at correct position (right of sidebar edge)
- Avatar, status dot, badges visible
- Spotify row shows current song or "Not listening"
- Activity row shows app name + elapsed time
- Marvel Rivals row shows rank
- Click outside closes the popover
- Escape key closes the popover
- Collapsing sidebar moves popover left with it (uses `var(--sidebar-w)`)

- [ ] **Step 3: Commit**

```bash
git add src/components/GamerCard.tsx src/components/providers/GamerCardContext.tsx src/components/2026/layout/Sidebar.tsx
git commit -m "feat(gamercard): redesign as compact sidebar popover

Replace full-screen modal with compact fixed popover anchored to
sidebar edge. Uses 2026 design tokens, framer-motion enter/exit,
and respects sidebar collapsed state via --sidebar-w CSS var."
```

---

### Task 4: Cleanup — remove `mounted` guard from layout.tsx if it existed

**Files:**
- Check: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Verify layout.tsx doesn't have leftover GamerCard logic**

Run:
```bash
grep -n "GamerCard\|mounted" src/app/\[locale\]/layout.tsx
```

If `GamerCard` is imported and rendered in layout.tsx (separate from the context provider), remove it. GamerCardProvider renders nothing globally now — only the context.

If output is empty or only shows `GamerCardProvider`, no action needed.

- [ ] **Step 2: Verify full app builds**

Run: `pnpm build 2>&1 | tail -20`

Expected: Build completes. Note any new errors and fix them.
