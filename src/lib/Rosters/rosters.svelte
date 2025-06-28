<script>
  import RosterSorter from './RosterSorter.svelte';
  import { loadPlayers } from '$lib/utils/helper';

  export let leagueData;
  export let rosterData;
  export let leagueTeamManagers;
  export let playersInfo;

  let players = playersInfo.players;

  const refreshPlayers = async () => {
    const newPlayersInfo = await loadPlayers(null, true);
    players = newPlayersInfo.players;
  };

  if (playersInfo.stale) {
    refreshPlayers();
  }
</script>

{#if !rosterData?.rosters || Object.keys(rosterData.rosters).length === 0}
  <p style="text-align: center;">🚨 No rosters to display.</p>
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
