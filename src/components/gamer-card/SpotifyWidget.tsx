import React from 'react';

type SpotifyWidgetProps = {
  spotify: any;
  currentTime: number;
};

export const SpotifyWidget = ({ spotify, currentTime }: SpotifyWidgetProps) => {
  return (
    <div className="w-full bg-[#12131a] rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden relative group mb-6 md:mb-8 shadow-2xl min-h-[250px] flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/utils/img/grid-pattern.svg')] opacity-5 z-0"></div>

      {spotify ? (
        <div className="p-6 md:p-10 relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center w-full">
          <div className="flex-1 text-center md:text-left min-w-0">
            <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-black tracking-tighter uppercase mb-3 md:mb-4 border border-green-500/20">
              <span className="animate-pulse">●</span> Now Listening
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-2 italic tracking-tight uppercase leading-none line-clamp-2 md:line-clamp-1">
              {spotify.song}
            </h3>
            <p className="text-gray-400 text-lg md:text-2xl font-medium mb-6">{spotify.artist}</p>

            {/* Spotify Progress Bar */}
            <div className="w-full max-w-md h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full relative"
                style={{
                  width: `${Math.min(
                    100,
                    ((currentTime - spotify.timestamps.start) /
                      (spotify.timestamps.end - spotify.timestamps.start)) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between max-w-md mt-1 text-[9px] text-gray-500 font-mono">
              <span>
                {new Date(currentTime - spotify.timestamps.start).toISOString().substr(14, 5)}
              </span>
              <span>
                {new Date(spotify.timestamps.end - spotify.timestamps.start)
                  .toISOString()
                  .substr(14, 5)}
              </span>
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
        /* HERO / IDLE STATE */
        <div className="p-8 relative z-10 text-center">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
            <span className="text-5xl">🕸️</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Ready for Action</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            "With great power comes great responsibility."
            <br />
            Waiting for the next mission.
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes music-bar {
          0%,
          100% {
            height: 4px;
          }
          50% {
            height: 12px;
          }
        }
      `}</style>
    </div>
  );
};
