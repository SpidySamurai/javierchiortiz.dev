'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('common');
  const { data: lanyardData, isLoading } = useLanyard({ userId: DISCORD_ID });

  // Live Timer for progress bars
  const [currentTime, setCurrentTime] = React.useState(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  if (!isOpen) return null;

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

  // Rich Activity Details
  const activity =
    lanyardData?.activities.find((a) => a.type === 0) || // Game
    lanyardData?.activities.find((a) => a.type === 4 && a.name !== 'Custom Status'); // Standard Activity (e.g. Visual Studio Code w/o Rich Presence type 0?) - usually type 0 is game.
  // Actually original logic was simpler:
  // lanyardData?.activities.find(a => a.type === 0) || lanyardData?.activities.find(a => a.type === 4) is wrong if type 4 is Custom Status.
  // Let's stick to original logic but filter out 'Custom Status' text if it appears as name?
  // Original: lanyardData?.activities.find(a => a.type === 0) || lanyardData?.activities.find(a => a.type === 4);

  // Correct logic: Type 4 is "Custom Status". Type 0 is "Playing".
  // We want the Game/App in the bottom right using ActivityWidget.
  // Custom Status (Type 4) is displayed in UserProfile.
  // So for ActivityWidget we prefer Type 0.
  const mainActivity = lanyardData?.activities.find((a) => a.type === 0);

  const spotify = lanyardData?.listening_to_spotify ? lanyardData.spotify : null;

  const customStatus = lanyardData?.activities.find((a) => a.type === 4)?.state;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-2 md:p-8 overflow-y-auto">
      <div
        className="relative w-full max-w-5xl my-auto bg-[#0c0d12] rounded-3xl md:rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col md:flex-row border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- LEFT PANEL: PROFILE OVERVIEW --- */}
        <div className="w-full md:w-[340px] bg-[#12131a] flex flex-col items-center relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-white/5">
          {/* Top Decorative Banner */}
          <div className="absolute top-0 w-full h-32 md:h-40 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-transparent"></div>
          <div className="absolute top-0 w-full h-32 md:h-40 bg-[url('/utils/img/grid-pattern.svg')] opacity-10"></div>

          {/* Close Button Mobile */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white/50 p-2 md:hidden"
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
        </div>

        {/* --- RIGHT PANEL: DYNAMIC WIDGET DASHBOARD --- */}
        <div className="flex-1 bg-[#0c0d12] p-5 md:p-12 relative">
          {/* Mobile Header */}
          <div className="flex md:hidden justify-between items-center mb-6">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
              Live Activity
            </p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusInfo.color} animate-pulse`}></div>
              <p className="text-white text-xs font-bold uppercase">{statusInfo.label}</p>
            </div>
          </div>

          {/* Desktop Header Stats */}
          <div className="hidden md:flex justify-between items-center mb-12">
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
          </div>

          {/* --- LARGE WIDGET: SPOTIFY OR HERO --- */}
          <SpotifyWidget spotify={spotify} currentTime={currentTime} />

          {/* --- ACTIVITY WIDGET --- */}
          <ActivityWidget activity={mainActivity} currentTime={currentTime} />
        </div>
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
