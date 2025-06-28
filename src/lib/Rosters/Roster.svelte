<script lang="ts">
  export let leagueData;
  export let rosterData;
  export let leagueTeamManagers;
  export let playersInfo;
</script>

{#each rosterData as roster}
  <section style="margin-bottom: 2rem;">
    <h2>
      Team: {leagueTeamManagers[roster.owner_id]?.manager || 'Unknown'}
    </h2>

    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Keeper Round</th>
          <th>Eligible</th>
          <th>Years on Roster</th>
        </tr>
      </thead>
      <tbody>
        {#each roster.players as player}
          <tr>
            <td>{player.full_name ?? player.name}</td>
            <td>{player.keeperRoundNextYear ?? 'X'}</td>
            <td>{player.eligibleKeeper ? '✅' : '❌'}</td>
            <td>{player.yearsOnSameRoster ?? 1}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
{/each}
