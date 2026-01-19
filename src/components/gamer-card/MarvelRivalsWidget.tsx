'use client';

import React from 'react';
import { useMarvelRivals } from '@/hooks/useMarvelRivals';

// UID could be moved to a config or passed as prop, but keeping it here for self-containment as requested.
const MARVEL_UID = '1774670402';

export const MarvelRivalsWidget = () => {
  const marvelData = useMarvelRivals(MARVEL_UID);

  return (
    <div className="w-full bg-[#171821] p-3 rounded-xl border border-white/5 mb-4 flex flex-col gap-2.5 group hover:bg-[#1c1d26] transition-colors cursor-default ">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          Marvel Rivals
        </span>
        <span className="text-[10px] text-gray-600 font-mono">Lv. {marvelData.level}</span>
      </div>

      {/* Current Rank Row */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">Current Rank</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            {marvelData.rankIcon ? (
              <img
                src={marvelData.rankIcon}
                alt="Rank"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<span class="text-xs">🏆</span>';
                }}
              />
            ) : (
              <span className="text-xs">🏆</span>
            )}
          </div>
          <span className="text-sm font-bold" style={{ color: marvelData.rankColor }}>
            {marvelData.rank}
          </span>
        </div>
      </div>

      {/* Peak Rank Row */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium">Max Rank</span>
        <div className="flex items-center gap-2 opacity-80">
          <div className="w-4 h-4 flex items-center justify-center">
            {marvelData.peakRankIcon ? (
              <img
                src={marvelData.peakRankIcon}
                alt="Max Rank"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML =
                    '<span class="text-xs text-gray-500">🏆</span>';
                }}
              />
            ) : (
              <span className="text-xs text-gray-500">🏆</span>
            )}
          </div>
          <span
            className="text-sm font-bold"
            style={{ color: marvelData.peakRankColor || '#9ca3af' }}
          >
            {marvelData.peakRank || 'Unranked'}
          </span>
        </div>
      </div>

      {marvelData.lastUpdated && (
        <div className="text-right pt-1">
          <span className="text-[8px] text-gray-700 font-mono">
            Updated {marvelData.lastUpdated.split(',')[0]}
          </span>
        </div>
      )}
    </div>
  );
};
