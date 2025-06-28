<script>
  import LinearProgress from '@smui/linear-progress';
  import Rosters from '$lib/Rosters/rosters.svelte'; // Ensure filename is lowercase

  export let data;
  const rostersInfo = data.rostersInfo;
</script>

{#if !rostersInfo}
  <LinearProgress indeterminate />
{:else}
  <Rosters
    leagueData={rostersInfo.leagueData}
    rosterData={rostersInfo.rosterData}
    leagueTeamManagers={rostersInfo.leagueTeamManagers}
    playersInfo={rostersInfo.playersInfo}
  />
{/if}
