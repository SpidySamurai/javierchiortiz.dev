import React from 'react';
import { LuMonitor, LuSmartphone, LuGlobe } from 'react-icons/lu';

type UserProfileProps = {
  discordUser: any;
  statusInfo: { color: string; shadow: string; label: string };
  avatarDecoration?: string | null;
  customStatus?: string;
  activeOn?: {
    desktop: boolean;
    mobile: boolean;
    web: boolean;
  };
};

export const UserProfile = ({
  discordUser,
  statusInfo,
  avatarDecoration,
  customStatus,
  activeOn,
}: UserProfileProps) => {
  const avatarUrl = discordUser?.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`
    : null;

  return (
    <header className="flex flex-col items-center">
      {/* Avatar Section */}
      <figure className="relative mb-4 md:mb-6 scale-90 md:scale-100">
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-[6px] border-[#12131a] bg-[#12131a] shadow-2xl relative z-10 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-4xl md:text-5xl">
              <span role="img" aria-label="Spider-Man">
                🕷️
              </span>
            </div>
          )}
        </div>
        {/* Status Bubble */}
        <div
          className={`absolute bottom-2 right-2 w-6 h-6 md:w-8 md:h-8 ${statusInfo.color} ${statusInfo.shadow} border-[4px] md:border-[6px] border-[#12131a] rounded-full z-20`}
        ></div>
        {/* Decoration Asset */}
        {avatarDecoration && (
          <img
            src={avatarDecoration}
            className="absolute -top-[18%] -left-[18%] w-[136%] h-[136%] pointer-events-none z-30"
            alt="Decoration"
          />
        )}
      </figure>

      {/* Identity */}
      <div className="text-center mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white mb-0.5 md:mb-1 tracking-tight flex items-center justify-center gap-2">
          {discordUser?.display_name || 'SpidySamurai'}
          {discordUser?.primary_guild?.tag && (
            <span className="text-xs md:text-sm bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-mono">
              [{discordUser.primary_guild.tag}]
            </span>
          )}
        </h1>
        <div className="flex items-center justify-center gap-2.5 mb-2 text-indigo-400">
          <p className="font-medium text-xs md:text-sm tracking-wide">
            @{discordUser?.username || 'spidynomore'}
          </p>
          {/* Device Icons */}
          <div className="flex items-center gap-1.5 opacity-80" aria-label="Active Devices">
            {activeOn?.desktop && (
              <LuMonitor size={14} className="text-indigo-400" title="Online via Desktop" />
            )}
            {activeOn?.mobile && (
              <LuSmartphone size={14} className="text-indigo-400" title="Online via Mobile" />
            )}
            {activeOn?.web && (
              <LuGlobe size={14} className="text-indigo-400" title="Online via Web" />
            )}
          </div>
        </div>

        {/* Custom Status */}
        {customStatus && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-2 max-w-full">
            <span className="text-gray-300 text-xs md:text-sm italic truncate">
              "{customStatus}"
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
