import { buildPlayerMeta } from '$lib/PowerRankings/sleeper';

// Use your actual working functions here:
import {
  getLeagueData,
  getRosters,
  getManagers,
  getAllPlayers
} from '$lib/PowerRankings/sleeper'; // Replace with correct path

export async function load() {
  const [leagueData, rosterData, leagueTeamManagers, playersInfo] = await Promise.all([
    getLeagueData(),
    getRosters(),
    getManagers(),
    getAllPlayers()
  ]);

  const playerMeta = await buildPlayerMeta();

  for (const roster of rosterData) {
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
    rostersInfo: Promise.resolve([
      leagueData,
      rosterData,
      leagueTeamManagers,
      playersInfo
    ])
  };
}
