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

  // Inject keeper metadata into each player in each roster
  for (const roster of rosterData.rosters) {
    for (const section of ['starters', 'players', 'reserve']) {
      const players = roster[section];
      if (!players) continue;

      roster.playersMeta = roster.playersMeta || {};

      for (const playerId of players) {
        const meta = playerMeta[playerId];
        roster.playersMeta[playerId] = {
          eligibleKeeper: meta?.eligibleKeeper ?? false,
          keeperRoundNextYear: meta?.keeperRoundNextYear ?? 'X',
          yearsOnSameRoster: meta?.yearsOnSameRoster ?? 1
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
