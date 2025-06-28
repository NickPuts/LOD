<script>
  import { loadPlayers } from '$lib/utils/helper';
  import RosterSorter from './RosterSorter.svelte';

  export let leagueData;
  export let rosterData;
  export let leagueTeamManagers;
  export let playersInfo;

  let players = playersInfo.players;

  // ✅ Add logging
  console.log('🏈 leagueData:', leagueData);
  console.log('🏈 rosterData:', rosterData);
  console.log('🏈 leagueTeamManagers:', leagueTeamManagers);
  console.log('🏈 playersInfo:', playersInfo);

  const refreshPlayers = async () => {
    const newPlayersInfo = await loadPlayers(null, true);
    players = newPlayersInfo.players;
  };

  if (playersInfo.stale) {
    refreshPlayers();
  }
</script>

{#if !leagueData || !rosterData || !leagueTeamManagers || !players}
  <p>No rosters to display</p>
{:else}
  <div class="rosters">
    <RosterSorter
      rosters={rosterData.rosters}
      {players}
      {leagueTeamManagers}
      startersAndReserve={rosterData.startersAndReserve}
      {leagueData}
    />
  </div>
{/if}

<style>
  .rosters {
    position: relative;
    z-index: 1;
  }
</style>
