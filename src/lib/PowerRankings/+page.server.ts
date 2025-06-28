import { buildPlayerMeta } from '$lib/PowerRankings/sleeper';

// Stubbed functions — replace with your real ones if available
async function fetchLeagueData() {
  return {};
}

async function fetchRosters() {
  return [
    {
      owner_id: '1',
      players: []
    }
  ];
}

async function fetchManagers() {
  return {};
}

async function fetchPlayers() {
  return {};
}

export async function load() {
  const [leagueData, rosterData, leagueTeamManagers, playersInfo] = await Promise.all([
    fetchLeagueData(),
    fetchRosters(),
    fetchManagers(),
    fetchPlayers()
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
