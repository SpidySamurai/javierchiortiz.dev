import React from 'react';

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

  return (
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
            <h4 className="text-white font-black text-2xl md:text-3xl mb-1 truncate drop-shadow-lg">
              {activity?.name || 'No Activity'}
            </h4>
            <p className="text-gray-300 text-sm md:text-base italic line-clamp-1 drop-shadow-md">
              {activity?.state ||
                activity?.details ||
                (activity?.type === 0 ? 'Playing' : 'Resting...')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
