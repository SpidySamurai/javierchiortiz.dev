import React from 'react';
import { LuGamepad2, LuCode, LuSwords, LuCoffee, LuClock, LuZap } from 'react-icons/lu';

type ActivityWidgetProps = {
  activity: any;
  currentTime: number;
};

export const ActivityWidget = ({ activity, currentTime }: ActivityWidgetProps) => {
  // Helper to format elapsed time
  const getElapsedTime = (start: number) => {
    const diff = currentTime - start;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  // Helper: Generic State Mapper (Works for any game)
  const getDetailedState = (act: any) => {
    if (!act)
      return {
        label: '"With great power comes great responsibility."',
        icon: null,
        color: 'text-gray-400',
      };
    if (act.type !== 0)
      return {
        label: act.state || 'Coding / Working',
        icon: <LuCode size={16} />,
        color: 'text-indigo-400',
      };

    const raw = (act.state + ' ' + act.details).toLowerCase();

    // 1. Combat / Action
    if (
      raw.includes('combate') ||
      raw.includes('match') ||
      raw.includes('fighting') ||
      raw.includes('game')
    ) {
      return {
        label: act.state || 'In Match',
        icon: <LuSwords size={16} />,
        color: 'text-red-400',
      };
    }

    // 2. Lobby / Menu
    if (
      raw.includes('lobby') ||
      raw.includes('menu') ||
      raw.includes('waiting') ||
      raw.includes('idle')
    ) {
      return {
        label: act.state || 'In Lobby',
        icon: <LuCoffee size={16} />,
        color: 'text-green-400',
      };
    }

    // 3. Queue / Loading
    if (raw.includes('queue') || raw.includes('finding') || raw.includes('loading')) {
      return {
        label: act.state || 'In Queue',
        icon: <LuClock size={16} />,
        color: 'text-yellow-400',
      };
    }

    // Default Fallback
    return {
      label: act.state || act.details || 'Playing',
      icon: <LuZap size={16} />,
      color: 'text-indigo-300',
    };
  };

  const detailedState = getDetailedState(activity);

  return (
    <div className="w-full mb-4">
      {/* BOTTOM RIGHT: MAIN ACTIVITY (Game/Code) - DESIGNATED SPOT */}
      <div className="bg-[#12131a] p-6 md:p-8 rounded-2xl  border border-white/5 relative overflow-hidden group min-h-[180px] flex flex-col justify-center shadow-2xl">
        {/* Subtle Background Gradient (No Image) */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] z-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 blur-[50px] z-10"></div>

        <div className="relative z-20 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-xl md:text-2xl shadow-lg text-white/90">
              {activity?.type === 0 ? <LuGamepad2 size={24} /> : <LuCode size={24} />}
            </div>
            {activity && (
              <div className="flex flex-col items-end">
                <span className="text-[9px] md:text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Active
                </span>
                {activity.timestamps?.start && (
                  <span className="text-[10px] text-gray-300 font-mono mt-0.5 bg-black/50 px-1.5 py-0.5 rounded">
                    {getElapsedTime(activity.timestamps.start)}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center gap-4">
            {/* Visual Game Art Block (Dynamic or Default Spiderman) */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
              {activity?.assets?.large_image ? (
                <img
                  src={
                    activity.assets.large_image.startsWith('mp:')
                      ? `https://media.discordapp.net/${activity.assets.large_image.replace(
                          'mp:',
                          ''
                        )}`
                      : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
                  }
                  className="w-full h-full object-cover rounded-xl shadow-lg border border-white/10"
                  alt={activity.name}
                />
              ) : (
                <div className="w-full h-full bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                  <span className="text-3xl">🕸️</span>
                </div>
              )}

              {activity?.assets?.small_image && (
                <img
                  src={
                    activity.assets.small_image.startsWith('mp:')
                      ? `https://media.discordapp.net/${activity.assets.small_image.replace(
                          'mp:',
                          ''
                        )}`
                      : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`
                  }
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-[#12131a] z-10"
                  alt=""
                  title={activity.assets.small_text}
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-white font-black text-lg md:text-3xl mb-0.5 md:mb-1 leading-snug line-clamp-2 drop-shadow-lg">
                {activity?.name || 'Fighting crime in Merida City 🕷️'}
              </h4>

              {/* Dynamic State Row with Icon */}
              <div
                className={`flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1 ${detailedState.color} drop-shadow-md`}
              >
                {detailedState.icon}
                <p className="text-xs md:text-base italic line-clamp-1 font-medium">
                  {detailedState.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
