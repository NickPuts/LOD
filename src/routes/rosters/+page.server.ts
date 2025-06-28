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

  for (const roster of Object.values(rosterData.rosters)) {
    for (const player of roster.players) {
      const meta = playerMeta[player.id];
      if (meta) {
        player.eligibleKeeper = meta.eligibleKeeper;
        player.keeperRoundNextYear = meta.keeperRoundNextYear;
        player.yearsOnSameRoster = meta.yearsOnSameRoster;
      } else {
        player.eligibleKeeper = false;
        player.keeperRoundNextYear = 'X';
        player.yearsOnSameRoster = 1;
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
