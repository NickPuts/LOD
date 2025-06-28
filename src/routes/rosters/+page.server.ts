import { buildPlayerMeta } from '$lib/PowerRankings/sleeper';
import {
  getLeagueData,
  getLeagueRosters,
  getLeagueTeamManagers,
  loadPlayers
} from '$lib/utils/helper';

export async function load() {
  const [leagueData, rosterData, leagueTeamManagers, playersInfo] = await Promise.all([
    getLeagueData(),
    getLeagueRosters(),
    getLeagueTeamManagers(),
    loadPlayers()
  ]);

  const playerMeta = await buildPlayerMeta();

  // 🔁 Annotate players inside each roster with keeper metadata
  for (const roster of Object.values(rosterData.rosters)) {
    roster.playersMeta = {};
    for (const playerId of roster.players) {
      const meta = playerMeta[playerId];
      roster.playersMeta[playerId] = {
        eligibleKeeper: meta?.eligibleKeeper ?? false,
        keeperRoundNextYear: meta?.keeperRoundNextYear ?? 'X',
        yearsOnSameRoster: meta?.yearsOnSameRoster ?? 1
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
}
