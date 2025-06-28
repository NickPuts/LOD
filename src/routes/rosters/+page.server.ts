import { error } from '@sveltejs/kit';
import { buildPlayerMeta } from '$lib/PowerRankings/sleeper';
import {
  getLeagueData,
  getLeagueRosters,
  getLeagueTeamManagers,
  loadPlayers
} from '$lib/utils/helper';

export async function load() {
  try {
    const [leagueData, rosterData, leagueTeamManagers, playersInfo] = await Promise.all([
      getLeagueData(),
      getLeagueRosters(),
      getLeagueTeamManagers(),
      loadPlayers()
    ]);

    if (!rosterData || typeof rosterData.rosters !== 'object') {
      throw new Error('Invalid rosterData format');
    }

    const playerMeta = await buildPlayerMeta();

    for (const roster of Object.values(rosterData.rosters)) {
      const playerIDs = roster.players ?? [];
      roster.playersMeta = {};

      for (const playerId of playerIDs) {
        const meta = playerMeta[playerId] ?? {};
        roster.playersMeta[playerId] = {
          eligibleKeeper: meta.eligibleKeeper ?? false,
          keeperRoundNextYear: meta.keeperRoundNextYear ?? 'X',
          yearsOnSameRoster: meta.yearsOnSameRoster ?? 1
        };
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
  } catch (err) {
    console.error('Failed to load rosters:', err);
    throw error(500, err.message);
  }
}
