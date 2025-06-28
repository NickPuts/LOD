const BASE = 'https://api.sleeper.app/v1';
const LEAGUE_ID = '1240710661336485888';

const DRAFTS = {
  2023: '982458388263079936',
  2024: '1124193941345206273'
};

type PlayerMeta = {
  yearsOnSameRoster: number;
  eligibleKeeper: boolean;
  keeperRoundNextYear: number | 'X';
};

type RosterSnapshot = Record<string, number>; // player_id → roster_id

async function fetchDraftPicks(draftId: string) {
  const res = await fetch(`${BASE}/draft/${draftId}/picks`);
  return await res.json();
}

async function fetchTransactions(week: number) {
  const res = await fetch(`${BASE}/league/${LEAGUE_ID}/transactions/${week}`);
  return await res.json();
}

async function fetchFinalRosters(): Promise<Record<number, string[]>> {
  const res = await fetch(`${BASE}/league/${LEAGUE_ID}/rosters`);
  const data = await res.json();
  const result: Record<number, string[]> = {};
  for (const r of data) {
    result[r.roster_id] = r.players ?? [];
  }
  return result;
}

function getPlayerRosterMap(finalRosters: Record<number, string[]>): RosterSnapshot {
  const map: RosterSnapshot = {};
  for (const [rosterIdStr, playerList] of Object.entries(finalRosters)) {
    const rosterId = parseInt(rosterIdStr);
    for (const pid of playerList) {
      map[pid] = rosterId;
    }
  }
  return map;
}

async function getFreeAgentsAfterWeek12(): Promise<Set<string>> {
  const fa = new Set<string>();
  for (let week = 13; week <= 18; week++) {
    const txns = await fetchTransactions(week);
    for (const txn of txns) {
      for (const pid of Object.keys(txn?.adds ?? {})) {
        if (txn.type === 'free_agent') fa.add(pid);
      }
    }
  }
  return fa;
}

export async function buildPlayerMeta(): Promise<Record<string, PlayerMeta>> {
  const [draft2023, draft2024, rosters2023, rosters2024, fa2023] = await Promise.all([
    fetchDraftPicks(DRAFTS[2023]),
    fetchDraftPicks(DRAFTS[2024]),
    fetchFinalRosters(), // 2024
    fetchFinalRosters(), // 2023
    getFreeAgentsAfterWeek12()
  ]);

  const playerMeta: Record<string, PlayerMeta> = {};
  const final2023 = getPlayerRosterMap(rosters2023);
  const final2024 = getPlayerRosterMap(rosters2024);

  const keeperMap: Record<string, number> = {}; // player_id → keeper round this year

  for (const pick of draft2024) {
    keeperMap[pick.player_id] = pick.round;
  }

  // Determine keeper eligibility and round for 2025
  for (const [playerId, rosterId] of Object.entries(final2024)) {
    const wasFreeAgent = fa2023.has(playerId);
    const eligibleKeeper = !wasFreeAgent;

    // Determine keeper round next year
    const currentRound = keeperMap[playerId];
    let keeperRoundNextYear: number | 'X' = 'X';
    if (eligibleKeeper) {
      if (currentRound) {
        keeperRoundNextYear = Math.max(currentRound - 1, 1);
      } else {
        keeperRoundNextYear = 9;
      }
    }

    const stayedOnSameRoster = final2023[playerId] === rosterId;
    const yearsOnSameRoster = stayedOnSameRoster ? 2 : 1;

    playerMeta[playerId] = {
      eligibleKeeper,
      keeperRoundNextYear,
      yearsOnSameRoster
    };
  }

  return playerMeta;
}
