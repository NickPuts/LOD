<script>
  import LinearProgress from '@smui/linear-progress';
  import Rosters from '$lib/Rosters/Rosters.svelte';

  export let data;
  const rostersInfo = data.rostersInfo;

  console.log('ROSTERS INFO:', rostersInfo); // 👈 Add this
</script>

{#if !rostersInfo}
  <LinearProgress indeterminate />
{:else}
  {#if rostersInfo.rosterData?.rosters && Object.keys(rostersInfo.rosterData.rosters).length > 0}
    <Rosters
      leagueData={rostersInfo.leagueData}
      rosterData={rostersInfo.rosterData}
      leagueTeamManagers={rostersInfo.leagueTeamManagers}
      playersInfo={rostersInfo.playersInfo}
    />
  {:else}
    <p style="text-align: center;">🚨 No rosters to display.</p>
  {/if}
{/if}
