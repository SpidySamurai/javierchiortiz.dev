import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface MarvelPlayerValues {
  rank: string;
  rankIcon: string;
  rankColor: string;
  level: string;
  lastUpdated: string;
  isLoading: boolean;
  isError: boolean;
}

export function useMarvelRivals(uid: string) {
  // Potentially parameterize season later, for now we can default or fetch latest.
  // The proxy handles ?season=X parameter forwarding.
  // We'll target the recently active season (e.g. 5) or let the API decide (omitting season).
  // Based on our analysis, specific season fetching is safer. Let's start with season=5 as hardcoded latest for now,
  // or we could make it a prop.
  // Fetch all available data (omit season param to get full history if supported, or rely on the known structure)
  // The user provided 'marvel_all_seasons.json' which has a root 'seasons' object.
  // We fetch two endpoints:
  // 1. Default (Current Season)
  // 2. Season 1 (Known Peak Season) - Ideally we'd validly iterate all, but for now this covers the requirement.
  const {
    data: currentData,
    error: currentError,
    isLoading: currentLoading,
  } = useSWR(uid ? `/api/marvel/player?uid=${uid}` : null, fetcher);

  const {
    data: s1Data,
    error: s1Error,
    isLoading: s1Loading,
  } = useSWR(uid ? `/api/marvel/player?uid=${uid}&season=1` : null, fetcher);

  const isLoading = currentLoading || s1Loading;
  const error = currentError || s1Error;

  // Helper to normalize data to a list of seasons
  const getSeasonList = () => {
    const list: any[] = [];
    if (currentData) {
      // If it has 'seasons' wrapper, use it
      if (currentData.seasons) {
        Object.values(currentData.seasons).forEach((s) => list.push(s));
      } else if (currentData.player) {
        // Single season response
        list.push(currentData);
      }
    }
    if (s1Data) {
      if (s1Data.seasons) {
        Object.values(s1Data.seasons).forEach((s) => list.push(s));
      } else if (s1Data.player) {
        list.push(s1Data);
      }
    }
    return list;
  };

  const allSeasons = getSeasonList();

  // 1. Identify Current Season Data (from currentData)
  // We trust currentData is the latest state.
  const player = currentData?.player || currentData?.seasons?.season_5?.player; // Fallback attempts
  const updates = currentData?.updates || currentData?.seasons?.season_5?.updates;

  // 2. Calculate Peak Rank across ALL fetched seasons
  const rankWeights: { [key: string]: number } = {
    Bronze: 1,
    Silver: 2,
    Gold: 3,
    Platinum: 4,
    Diamond: 5,
    Grandmaster: 6,
    Eternity: 7,
    'One Above All': 8,
  };

  let peakRank = { rank: 'Unranked', id: 0, image: '', color: '#ffffff' };

  allSeasons.forEach((s) => {
    const rName = s?.player?.rank?.rank;
    if (rName) {
      const tier = rName.split(' ')[0];
      const weight = rankWeights[tier] || 0;

      // Basic Max Logic
      if (weight > peakRank.id) {
        peakRank = {
          rank: rName,
          id: weight,
          image: s.player.rank.image,
          color: s.player.rank.color,
        };
      } else if (weight === peakRank.id) {
        // Compare divisions if needed (III vs I), but skipping for now.
      }
    }
  });

  // Fallback: If Peak is still Unranked/0 but we have current, use current
  if (peakRank.id === 0 && player?.rank?.rank) {
    peakRank = {
      rank: player.rank.rank,
      id: rankWeights[player.rank.rank.split(' ')[0]] || 0,
      image: player.rank.image,
      color: player.rank.color,
    };
  }

  return {
    rank: player?.rank?.rank || 'Unranked', // Current Rank
    rankIcon: player?.rank?.image || '',
    rankColor: player?.rank?.color || '#ffffff',

    peakRank: peakRank.rank,
    peakRankIcon: peakRank.image,
    peakRankColor: peakRank.color,

    level: player?.level || '0',
    lastUpdated: updates?.last_history_update || '',
    // optimizing UX: If we have current rank, stop loading spinner even if historical data is fetching
    isLoading: currentLoading && !player,
    isError: !!error,
  };
}
