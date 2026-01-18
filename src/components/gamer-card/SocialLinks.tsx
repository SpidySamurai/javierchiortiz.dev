import React from 'react';

export const SocialLinks = () => {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-1 gap-2">
      {['GitHub', 'Twitch', 'Xbox', 'Spotify'].map((n) => (
        <div
          key={n}
          className="flex items-center gap-2.5 md:gap-3 bg-white/5 p-2.5 md:p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
        >
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
          <svg
            className="ml-auto w-2.5 h-2.5 md:w-3 md:h-3 text-gray-700 group-hover:text-indigo-500 hidden md:block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};
