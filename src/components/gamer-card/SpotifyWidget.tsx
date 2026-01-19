import React from 'react';
import type { LanyardSpotify } from '@/types/lanyard';

type SpotifyWidgetProps = {
  spotify: LanyardSpotify | null;
  currentTime: number;
};

export const SpotifyWidget = ({ spotify, currentTime }: SpotifyWidgetProps) => {
  return (
    <article className="w-full bg-[#12131a] rounded-[1.5rem]  border border-white/5 overflow-hidden relative group mb-6 md:mb-8 shadow-2xl min-h-[250px] flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/utils/img/grid-pattern.svg')] opacity-5 z-0 pointer-events-none"></div>

      {spotify ? (
        <div className="p-6 md:p-6 lg:p-10 relative z-10 flex flex-col md:flex-col lg:flex-row gap-6 md:gap-6 lg:gap-8 items-center w-full">
          <div className="flex-1 text-center md:text-center lg:text-left min-w-0">
            <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-black tracking-tighter uppercase mb-3 md:mb-3 lg:mb-4 border border-green-500/20">
              <span className="animate-pulse">●</span> Now Listening
            </span>
            <h3 className="text-xl md:text-2xl lg:text-2xl font-black text-white mb-2 italic tracking-tight uppercase leading-none line-clamp-2 md:line-clamp-2 lg:line-clamp-1">
              {spotify.song}
            </h3>
            <p className="text-gray-400 text-lg md:text-lg lg:text-2xl font-medium mb-6">
              {spotify.artist}
            </p>

            {/* Spotify Progress Bar */}
            <div
              className="w-full max-w-md h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto lg:mx-0"
              role="progressbar"
              aria-valuenow={
                ((currentTime - spotify.timestamps.start) /
                  (spotify.timestamps.end - spotify.timestamps.start)) *
                100
              }
              aria-valuemin={0}
              aria-valuemax={100}
            >
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
            <div className="flex justify-between max-w-md mt-1 text-[9px] text-gray-500 font-mono mx-auto lg:mx-0">
              <time dateTime={new Date(currentTime - spotify.timestamps.start).toISOString()}>
                {new Date(currentTime - spotify.timestamps.start).toISOString().substr(14, 5)}
              </time>
              <time
                dateTime={new Date(spotify.timestamps.end - spotify.timestamps.start).toISOString()}
              >
                {new Date(spotify.timestamps.end - spotify.timestamps.start)
                  .toISOString()
                  .substr(14, 5)}
              </time>
            </div>
          </div>

          {/* Album Art */}
          <figure className="w-[180px] h-[180px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] rounded-full md:rounded-full lg:rounded-[2rem] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 shrink-0 animate-[spin_10s_linear_infinite] md:animate-[spin_10s_linear_infinite] lg:animate-none">
            <img
              src={spotify.album_art_url}
              className="w-full h-full object-cover"
              alt={spotify.album}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none"></div>
          </figure>
        </div>
      ) : (
        /* IDLE STATE (No Music) */
        <section className="p-8 relative z-10 text-center opacity-60">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <span className="text-3xl grayscale" role="img" aria-label="Music Note">
              🎵
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1 tracking-tight">Vibe Check</h3>
          <p className="text-gray-400 text-sm">Not listening to anything right now.</p>
        </section>
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
    </article>
  );
};
