'use client';

import { useTranslations } from 'next-intl';
import { useLanyard } from '@/hooks/useLanyard';

type GamerCardProps = {
    isOpen: boolean;
    onClose: () => void;
};

// Hardcoded ID for now (User provided theirs)
const DISCORD_ID = '363896212874723331';

export default function GamerCard({ isOpen, onClose }: GamerCardProps) {
    const t = useTranslations('common');
    const { data: lanyardData, isLoading } = useLanyard({ userId: DISCORD_ID });

    if (!isOpen) return null;

    // Derived Status Color
    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'idle': return 'bg-yellow-500';
            case 'dnd': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    // Derived Activity
    const getActivity = () => {
        if (!lanyardData) return { type: 'Main', value: 'Spider-Man' };

        if (lanyardData.listening_to_spotify && lanyardData.spotify) {
            return { type: 'Listening', value: lanyardData.spotify.song, icon: '🎵' };
        }

        const game = lanyardData.activities.find(a => a.type === 0);
        if (game) {
            return { type: 'Playing', value: game.name, icon: '🎮' };
        }

        const vscode = lanyardData.activities.find(a => a.name.includes('Code'));
        if (vscode) {
            return { type: 'Coding', value: 'VS Code', icon: '👨‍💻' };
        }

        return { type: 'Main', value: 'Spider-Man', icon: '🕷️' };
    };

    const activity = getActivity();
    const statusColor = getStatusColor(lanyardData?.discord_status);
    const avatarUrl = lanyardData?.discord_user.avatar
        ? `https://cdn.discordapp.com/avatars/${lanyardData.discord_user.id}/${lanyardData.discord_user.avatar}.png`
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            {/* Card Container - Marvel Rivals Style (Dark Glass + Glow) */}
            <div
                className="relative w-full max-w-md bg-[#1a1b26]/90 border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.3)] overflow-hidden transform transition-all animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header / Banner */}
                <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-900 relative">
                    <div className="absolute inset-0 bg-[url('/utils/img/grid-pattern.svg')] opacity-20"></div>
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
                        aria-label="Close"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Profile Content */}
                <div className="px-6 pb-6 -mt-12 relative">
                    {/* Avatar Ring */}
                    <div className="w-24 h-24 rounded-full border-4 border-[#1a1b26] shadow-lg bg-black overflow-hidden relative group">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-3xl select-none">
                                🕷️
                            </div>
                        )}
                        {/* Status Indicator */}
                        <div className={`absolute bottom-1 right-1 w-4 h-4 ${statusColor} border-2 border-[#1a1b26] rounded-full`}></div>
                    </div>

                    {/* Identity Info */}
                    <div className="mt-3">
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                            {lanyardData?.discord_user.display_name || lanyardData?.discord_user.username || 'SpidySamurai'}
                            <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded border border-violet-500/30">Lvl 28</span>
                        </h2>
                        <p className="text-gray-400 text-sm font-medium">Full Stack Developer • He/Him</p>
                        <p className="text-gray-500 text-xs mt-1 italic">
                            {lanyardData?.activities.find(a => a.type === 4)?.state || '"Great power, comes with great strength..."'}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-violet-500/30 transition-colors">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Commits</p>
                            <p className="text-lg font-bold text-white">2,742</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-violet-500/30 transition-colors">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Coffee</p>
                            <p className="text-lg font-bold text-white">∞ Cups</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-violet-500/30 transition-colors">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Highest Rank</p>
                            <p className="text-lg font-bold text-violet-400">Platinum 💎</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/5 hover:border-violet-500/30 transition-colors">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{activity.type}</p>
                            <p className="text-lg font-bold text-orange-400 truncate" title={activity.value}>
                                {activity.value}
                            </p>
                        </div>
                    </div>

                    {/* Secret Action */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex gap-2">
                                {/* Social Mini Icons */}
                                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                                </div>
                            </div>

                            <button
                                className="flex-1 bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white text-sm font-medium py-2 px-4 rounded transition-all cursor-not-allowed flex items-center justify-center gap-2 group"
                                disabled
                                title="Coming Soon"
                            >
                                <span>🔒 Secret Logs</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">soon</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
