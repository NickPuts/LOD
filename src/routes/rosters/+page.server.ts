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
    const [leagueData, rosterResponse, leagueTeamManagers, playersInfo] = await Promise.all([
      getLeagueData(),
      getLeagueRosters(),
      getLeagueTeamManagers(),
      loadPlayers()
    ]);

    const rosters = rosterResponse.rosters;
    const startersAndReserve = rosterResponse.startersAndReserve;

    const playerMeta = await buildPlayerMeta();

    for (const roster of rosters) {
      const allPlayers = [...(roster.players ?? []), ...(roster.reserve ?? [])];

      for (const playerID of allPlayers) {
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
        rosterData: { rosters, startersAndReserve },
        leagueTeamManagers,
        playersInfo
      }
    };

  } catch (err) {
    console.error('❌ Error in /rosters/+page.server.ts:', err);
    throw error(500, `Failed to load rosters: ${err.message}`);
  }
}
