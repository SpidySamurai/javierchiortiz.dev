'use client';

import React from 'react';
// import { useTranslations } from 'next-intl'; // removed unused
import { useLanyard } from '@/hooks/useLanyard';

// Atomic Components
import { UserProfile } from './gamer-card/UserProfile';
import { BadgeList } from './gamer-card/BadgeList';
import { MarvelRivalsWidget } from './gamer-card/MarvelRivalsWidget';
import { SocialLinks } from './gamer-card/SocialLinks';
import { SpotifyWidget } from './gamer-card/SpotifyWidget';
import { ActivityWidget } from './gamer-card/ActivityWidget';

type GamerCardProps = {
  isOpen: boolean;
  onClose: () => void;
};

const DISCORD_ID = '363896212874723331';

export default function GamerCard({ isOpen, onClose }: GamerCardProps) {
  // const t = useTranslations('common'); // removed unused
  const { data: lanyardData } = useLanyard({ userId: DISCORD_ID });

  // Live Timer for progress bars
  const [currentTime, setCurrentTime] = React.useState(Date.now());

  React.useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    setCurrentTime(Date.now()); // Update immediately on open
    return () => clearInterval(interval);
  }, [isOpen]);

  // Lock body scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Derived Status Color & Label
  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'online':
        return { color: 'bg-green-500', shadow: 'shadow-[0_0_10px_#22c55e]', label: 'Online' };
      case 'idle':
        return { color: 'bg-yellow-500', shadow: 'shadow-[0_0_10px_#eab308]', label: 'Idle' };
      case 'dnd':
        return {
          color: 'bg-red-500',
          shadow: 'shadow-[0_0_10px_#ef4444]',
          label: 'Do Not Disturb',
        };
      default:
        return { color: 'bg-gray-500', shadow: 'shadow-[0_0_10px_#6b7280]', label: 'Offline' };
    }
  };

  const statusInfo = getStatusInfo(lanyardData?.discord_status);

  const mainActivity = lanyardData?.activities.find((a) => a.type === 0);

  const spotify = lanyardData?.listening_to_spotify ? lanyardData.spotify : null;

  const customStatus = lanyardData?.activities.find((a) => a.type === 4)?.state;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 md:p-8 overflow-y-auto transition-all duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div
        className="relative w-full max-w-5xl my-auto bg-[#0c0d12] rounded-3xl md:rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col md:flex-row border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- LEFT PANEL: PROFILE OVERVIEW --- */}
        <aside className="w-full md:w-[340px] bg-[#12131a] flex flex-col items-center relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-white/5">
          {/* Top Decorative Banner */}
          <div className="absolute top-0 w-full h-32 md:h-40 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 w-full h-32 md:h-40 bg-[url('/utils/img/grid-pattern.svg')] opacity-10 pointer-events-none"></div>

          {/* Close Button Mobile */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white/50 p-2 md:hidden"
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="pt-12 md:pt-20 pb-8 px-6 md:px-8 relative z-10 w-full flex flex-col items-center">
            {lanyardData && (
              <UserProfile
                discordUser={lanyardData.discord_user}
                statusInfo={statusInfo}
                avatarDecoration={
                  lanyardData.discord_user.avatar_decoration_data?.asset &&
                  `https://cdn.discordapp.com/avatar-decoration-presets/${lanyardData.discord_user.avatar_decoration_data.asset}.png`
                }
                customStatus={customStatus}
                activeOn={{
                  desktop: lanyardData.active_on_discord_desktop,
                  mobile: lanyardData.active_on_discord_mobile,
                  web: lanyardData.active_on_discord_web,
                }}
              />
            )}

            <BadgeList user={lanyardData?.discord_user} userId={DISCORD_ID} />

            <MarvelRivalsWidget />

            <SocialLinks />
          </div>
        </aside>

        {/* --- RIGHT PANEL: DYNAMIC WIDGET DASHBOARD --- */}
        <section className="flex-1 bg-[#0c0d12] p-5 md:p-6 lg:p-12 relative flex flex-col min-w-0">
          {/* Mobile Header */}
          <header className="flex md:hidden justify-between items-center mb-6">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
              Live Activity
            </p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusInfo.color} animate-pulse`}></div>
              <p className="text-white text-xs font-bold uppercase">{statusInfo.label}</p>
            </div>
          </header>

          {/* Desktop Header Stats */}
          <header className="hidden md:flex justify-between items-center mb-12">
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">
                  Current Activity
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusInfo.color} animate-pulse`}></div>
                  <p className="text-white font-bold">
                    {mainActivity ? `Playing ${mainActivity.name}` : statusInfo.label}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all"
              aria-label="Close"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </header>
          {/* --- ACTIVITY WIDGET --- */}
          <ActivityWidget activity={mainActivity} currentTime={currentTime} />

          {/* --- LARGE WIDGET: SPOTIFY OR HERO --- */}
          <SpotifyWidget spotify={spotify} currentTime={currentTime} />
        </section>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
