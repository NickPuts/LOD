import { buildPlayerMeta } from '$lib/PowerRankings/sleeper';
import {
  getLeagueData,
  getLeagueRosters,
  getLeagueTeamManagers,
  loadPlayers
} from '$lib/utils/helper';

export async function load() {
  // Load all relevant data
  const [leagueData, rosterResponse, leagueTeamManagers, playersInfo] = await Promise.all([
    getLeagueData(),
    getLeagueRosters(),
    getLeagueTeamManagers(),
    loadPlayers()
  ]);

  const rosterData = rosterResponse?.rosters || []; // ✅ Ensure it's iterable

  if (!Array.isArray(rosterData)) {
    throw new Error('Failed to load rosters: rosterData is not an array');
  }

  const playerMeta = await buildPlayerMeta();

  // Attach keeper metadata to each player
  for (const roster of rosterData) {
    if (!roster.players) continue;

    for (const playerId of roster.players) {
      const meta = playerMeta[playerId];
      if (meta) {
        if (!roster.playersMeta) roster.playersMeta = {};
        roster.playersMeta[playerId] = {
          eligibleKeeper: meta.eligibleKeeper,
          keeperRoundNextYear: meta.keeperRoundNextYear,
          yearsOnSameRoster: meta.yearsOnSameRoster
        };
      }
    }
  }

  return {
    rostersInfo: {
      leagueData,
      rosterData,
      leagueTeamManagers,
      playersInfo
    }
  };
}
