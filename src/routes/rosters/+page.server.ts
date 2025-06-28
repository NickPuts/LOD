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
    // Load core league and roster data
    const [leagueData, rosterData, leagueTeamManagers, playersInfo] = await Promise.all([
      getLeagueData(),
      getLeagueRosters(),
      getLeagueTeamManagers(),
      loadPlayers()
    ]);

    // Enrich players with keeper metadata
    const playerMeta = await buildPlayerMeta();

    for (const roster of rosterData) {
      for (const playerID of roster.players || []) {
        const meta = playerMeta[playerID] ?? {};
        roster.playersMeta = roster.playersMeta || {};
        roster.playersMeta[playerID] = {
          eligibleKeeper: meta.eligibleKeeper ?? false,
          keeperRoundNextYear: meta.keeperRoundNextYear ?? 'X',
          yearsOnSameRoster: meta.yearsOnSameRoster ?? 1
        };
      }

      for (const playerID of roster.reserve || []) {
        const meta = playerMeta[playerID] ?? {};
        roster.playersMeta = roster.playersMeta || {};
        roster.playersMeta[playerID] = {
          eligibleKeeper: meta.eligibleKeeper ?? false,
          keeperRoundNextYear: meta.keeperRoundNextYear ?? 'X',
          yearsOnSameRoster: meta.yearsOnSameRoster ?? 1
        };
      }
    }

    return {
      rostersInfo: {
        leagueData,
        rosterData: { rosters: rosterData, startersAndReserve: leagueData.roster_positions },
        leagueTeamManagers,
        playersInfo
      }
    };

  } catch (err) {
    console.error('❌ Error in /rosters/+page.server.ts:', err);
    throw error(500, `Failed to load rosters: ${err.message}`);
  }
}
