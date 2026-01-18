'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLanyard } from '@/hooks/useLanyard';

type GamerCardProps = {
    isOpen: boolean;
    onClose: () => void;
};

const DISCORD_ID = '363896212874723331';

export default function GamerCard({ isOpen, onClose }: GamerCardProps) {
    const t = useTranslations('common');
    const { data: lanyardData, isLoading } = useLanyard({ userId: DISCORD_ID });

    // Live Timer
    const [currentTime, setCurrentTime] = React.useState(Date.now());

    React.useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Lock body scroll when modal is open
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
            case 'online': return { color: 'bg-green-500', shadow: 'shadow-[0_0_10px_#22c55e]', label: 'Online' };
            case 'idle': return { color: 'bg-yellow-500', shadow: 'shadow-[0_0_10px_#eab308]', label: 'Idle' };
            case 'dnd': return { color: 'bg-red-500', shadow: 'shadow-[0_0_10px_#ef4444]', label: 'Do Not Disturb' };
            default: return { color: 'bg-gray-500', shadow: 'shadow-[0_0_10px_#6b7280]', label: 'Offline' };
        }
    };

    const statusInfo = getStatusInfo(lanyardData?.discord_status);

    // Badge Logic (Decoding public_flags)
    const getBadges = (user: any) => {
        const flags = user?.public_flags || 0;
        const badges = [];

        // HypeSquad (House 1, 2, 3)
        if (flags & (1 << 6)) badges.push({ icon: '🏠', name: 'HypeSquad Bravery', color: 'text-purple-400' });
        if (flags & (1 << 7)) badges.push({ icon: '🌟', name: 'HypeSquad Brilliance', color: 'text-red-400' });
        if (flags & (1 << 8)) badges.push({ icon: '🛡️', name: 'HypeSquad Balance', color: 'text-green-400' });

        // Active Developer
        if (flags & (1 << 22)) badges.push({ icon: '🛠️', name: 'Active Developer', color: 'text-blue-400' });

        // Static visual additions for style (Nitro, Subscriber)
        if (user?.id === DISCORD_ID) {
            badges.push({ icon: '⚡', name: 'Nitro', color: 'text-pink-400' });
            badges.push({ icon: '💠', name: 'Subscriber', color: 'text-blue-300' });
        }

        return badges;
    };

    const badges = getBadges(lanyardData?.discord_user);

    // Rich Activity Details
    const activity = lanyardData?.activities.find(a => a.type === 0) || // Game
        lanyardData?.activities.find(a => a.type === 4); // Custom Status

    const spotify = lanyardData?.listening_to_spotify ? lanyardData.spotify : null;

    const avatarUrl = lanyardData?.discord_user.avatar
        ? `https://cdn.discordapp.com/avatars/${lanyardData.discord_user.id}/${lanyardData.discord_user.avatar}.png?size=256`
        : null;

    const avatarDecoration = lanyardData?.discord_user.avatar_decoration_data?.asset
        ? `https://cdn.discordapp.com/avatar-decoration-presets/${lanyardData.discord_user.avatar_decoration_data.asset}.png`
        : null;

    // Helper to format elapsed time
    const getElapsedTime = (start: number) => {
        const diff = currentTime - start;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        return `${minutes}m ${seconds}s`;
    };

    // Widget Logic:
    // Large Widget -> Spotify (if playing) OR Hero Banner (if not)
    // Bottom Right -> Main Activity (Game/Code)
    // Bottom Left -> Custom Status / Mood

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

                    {/* Close Button Mobile (Common to both panels now if needed, but keeping it visible) */}
                    <button onClick={onClose} className="absolute top-4 right-4 z-50 text-white/50 p-2 md:hidden">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>

                    <div className="pt-12 md:pt-20 pb-8 px-6 md:px-8 relative z-10 w-full flex flex-col items-center">
                        {/* Avatar Section */}
                        <div className="relative mb-4 md:mb-6 scale-90 md:scale-100">
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-[6px] border-[#12131a] bg-[#12131a] shadow-2xl relative z-10 overflow-hidden">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-4xl md:text-5xl">🕷️</div>
                                )}
                            </div>
                            {/* Status Bubble */}
                            <div className={`absolute bottom-2 right-2 w-6 h-6 md:w-8 md:h-8 ${statusInfo.color} ${statusInfo.shadow} border-[4px] md:border-[6px] border-[#12131a] rounded-full z-20`}></div>
                            {/* Decoration Asset */}
                            {avatarDecoration && (
                                <img src={avatarDecoration} className="absolute -top-[18%] -left-[18%] w-[136%] h-[136%] pointer-events-none z-30" alt="Decoration" />
                            )}
                        </div>

                        {/* Identity */}
                        <div className="text-center mb-4 md:mb-6">
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-0.5 md:mb-1 tracking-tight flex items-center justify-center gap-2">
                                {lanyardData?.discord_user.display_name || 'SpidySamurai'}
                                {lanyardData?.discord_user.primary_guild?.tag && (
                                    <span className="text-xs md:text-sm bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 font-mono">
                                        [{lanyardData.discord_user.primary_guild.tag}]
                                    </span>
                                )}
                            </h2>
                            <p className="text-indigo-400 font-medium text-xs md:text-sm tracking-wide flex items-center justify-center gap-1.5 mb-2">
                                @{lanyardData?.discord_user.username || 'spidynomore'}
                                {lanyardData?.active_on_discord_desktop && <span title="Online via Desktop">🖥️</span>}
                                {lanyardData?.active_on_discord_mobile && <span title="Online via Mobile">📱</span>}
                                {lanyardData?.active_on_discord_web && <span title="Online via Web">🌐</span>}
                            </p>

                            {/* Custom Status (Moved from Vibe Check) */}
                            {lanyardData?.activities.find(a => a.type === 4)?.state && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-2 max-w-full">
                                    <span className="text-gray-300 text-xs md:text-sm italic truncate">
                                        "{lanyardData.activities.find(a => a.type === 4)?.state}"
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Badges Carousel-style Row */}
                        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-6 md:mb-8">
                            {badges.map((b, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-white/10 group cursor-default hover:bg-white/10 transition-colors">
                                    <span className="text-base md:text-lg">{b.icon}</span>
                                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${b.color} opacity-0 group-hover:opacity-100 transition-opacity w-0 group-hover:w-auto overflow-hidden`}>{b.name.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>

                        {/* Removed Static Stats (Rank/Level) as per request for no hardcoding */}

                        {/* Connections - Grid on mobile for space */}
                        <div className="w-full grid grid-cols-2 md:grid-cols-1 gap-2">
                            {['GitHub', 'Twitch', 'Xbox', 'Spotify'].map(n => (
                                <div key={n} className="flex items-center gap-2.5 md:gap-3 bg-white/5 p-2.5 md:p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                    <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                                        <img
                                            src={`/utils/img/icons/${n.toLowerCase()}.svg`}
                                            alt={n}
                                            className="w-3.5 h-3.5 md:w-4 md:h-4"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = `https://cdn.simpleicons.org/${n.toLowerCase()}/white`;
                                            }}
                                        />
                                    </div>
                                    <span className="text-[10px] md:text-xs text-gray-400 group-hover:text-white font-semibold truncate">
                                        {n === 'GitHub' ? 'SpidySamurai' : n}
                                    </span>
                                    <svg className="ml-auto w-2.5 h-2.5 md:w-3 md:h-3 text-gray-700 group-hover:text-indigo-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT PANEL: DYNAMIC WIDGET DASHBOARD --- */}
                <div className="flex-1 bg-[#0c0d12] p-5 md:p-12 relative">
                    {/* Mobile Header (New) */}
                    <div className="flex md:hidden justify-between items-center mb-6">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Live Activity</p>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${statusInfo.color} animate-pulse`}></div>
                            <p className="text-white text-xs font-bold uppercase">{statusInfo.label}</p>
                        </div>
                    </div>

                    {/* Desktop Header Stats */}
                    <div className="hidden md:flex justify-between items-center mb-12">
                        <div className="flex gap-8">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Current Activity</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${statusInfo.color} animate-pulse`}></div>
                                    <p className="text-white font-bold">
                                        {activity ? (activity.type === 0 ? `Playing ${activity.name}` : activity.name) : statusInfo.label}
                                    </p>
                                </div>
                            </div>
                            <div>
                                {/* Removed static Kills/Wins */}
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* --- LARGE WIDGET: SPOTIFY OR HERO --- */}
                    <div className="w-full bg-[#12131a] rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden relative group mb-6 md:mb-8 shadow-2xl min-h-[250px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('/utils/img/grid-pattern.svg')] opacity-5 z-0"></div>

                        {spotify ? (
                            <div className="p-6 md:p-10 relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center w-full">
                                <div className="flex-1 text-center md:text-left min-w-0">
                                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-black tracking-tighter uppercase mb-3 md:mb-4 border border-green-500/20">
                                        <span className="animate-pulse">●</span> Now Listening
                                    </span>
                                    <h3 className="text-3xl md:text-5xl font-black text-white mb-2 italic tracking-tight uppercase leading-none line-clamp-2 md:line-clamp-1">{spotify.song}</h3>
                                    <p className="text-gray-400 text-lg md:text-2xl font-medium mb-6">{spotify.artist}</p>

                                    {/* Spotify Progress Bar */}
                                    <div className="w-full max-w-md h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full relative"
                                            style={{
                                                width: `${Math.min(100, ((currentTime - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start)) * 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between max-w-md mt-1 text-[9px] text-gray-500 font-mono">
                                        <span>{new Date(currentTime - spotify.timestamps.start).toISOString().substr(14, 5)}</span>
                                        <span>{new Date(spotify.timestamps.end - spotify.timestamps.start).toISOString().substr(14, 5)}</span>
                                    </div>
                                </div>

                                {/* Album Art */}
                                <div className="w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full md:rounded-[2rem] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 shrink-0 animate-[spin_10s_linear_infinite] md:animate-none">
                                    <img
                                        src={spotify.album_art_url}
                                        className="w-full h-full object-cover"
                                        alt={spotify.album}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                                </div>
                            </div>
                        ) : (
                            /* HERO / IDLE STATE (Fallback when no music) */
                            <div className="p-8 relative z-10 text-center">
                                <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                                    <span className="text-5xl">🕸️</span>
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Ready for Action</h3>
                                <p className="text-gray-400 max-w-md mx-auto">"With great power comes great responsibility."<br />Waiting for the next mission.</p>
                            </div>
                        )}
                    </div>

                    {/* --- ACTIVITY WIDGET (Full Width now) --- */}
                    <div className="w-full">
                        {/* BOTTOM RIGHT: MAIN ACTIVITY (Game/Code) - DESIGNATED SPOT */}
                        <div className="bg-[#12131a] p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-white/5 relative overflow-hidden group min-h-[180px] flex flex-col justify-center">
                            {/* Background Image (Dynamic or Fallback) */}
                            <div className="absolute inset-0 z-0">
                                {activity?.assets?.large_image ? (
                                    <img
                                        src={
                                            activity.assets.large_image.startsWith('mp:')
                                                ? `https://media.discordapp.net/${activity.assets.large_image.replace('mp:', '')}`
                                                : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
                                        }
                                        className="w-full h-full object-cover opacity-40 grayscale-0"
                                        alt=""
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    // Fallback Gradient if no asset image available
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-transparent opacity-50"></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#12131a] via-[#12131a]/90 to-transparent"></div>
                            </div>

                            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-indigo-500/10 blur-[80px] z-10"></div>

                            <div className="relative z-20 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-xl md:text-2xl shadow-lg">
                                        {activity?.type === 0 ? '🎮' : '👨‍💻'}
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
                                <div className="mt-2">
                                    <h4 className="text-white font-black text-2xl md:text-3xl mb-1 truncate drop-shadow-lg">{activity?.name || 'No Activity'}</h4>
                                    <p className="text-gray-300 text-sm md:text-base italic line-clamp-1 drop-shadow-md">
                                        {activity?.state || activity?.details || (activity?.type === 0 ? 'Playing' : 'Resting...')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes music-bar {
                    0%, 100% { height: 4px; }
                    50% { height: 12px; }
                }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                .animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            `}</style>
        </div>
    );
}
