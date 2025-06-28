<script>
  import { Row, Cell } from '@smui/data-table';

  export let player;
  export let keeperInfo;

  const playerSLotClass = player.slot.replace('/', '').replace('SUPER_', 'S-').replace('REC_', 'R-');
  const playerSlot = player.slot.replace('SUPER_', 'S ').replace('REC_', 'R ');
</script>

<Row>
  <Cell class="slot playerCell">
    <span class="pos {playerSLotClass}">{playerSlot}</span>
  </Cell>

  {#if player.avatar}
    <Cell class="avatar playerCell">
      <div class="playerAvatar" style="{player.avatar}">
        {#if player.team && player.poss !== "DEF"}
          <img
            src="https://sleepercdn.com/images/team_logos/nfl/{player.team.toLowerCase()}.png"
            class="teamLogo"
            alt="team logo"
          />
        {/if}
      </div>
    </Cell>
  {/if}

  <Cell class="playerCell nameCell" colspan={player.name !== "Empty" ? 1 : 3}>
    <div class="info">
      {@html player.name}
      {#if player.poss !== "DEF"}
        <div class="additionalInfo">
          <span class="text-{player.poss}">{@html player.poss}</span>
          {#if player.team}
            &nbsp;-&nbsp;{player.team}
          {/if}
        </div>
      {/if}
    </div>
    {#if player.nickname}
      <span class="nickname">"{player.nickname}"</span>
    {/if}

    <!-- Keeper Info -->
    {#if keeperInfo}
      <div class="additionalInfo keeper">
        Keeper: {keeperInfo.eligible ? keeperInfo.round : 'X'}
        &nbsp;|&nbsp;
        YOS: {keeperInfo.years}
      </div>
    {/if}
  </Cell>
</Row>

<style>
  /* (keep your existing styles unchanged) */

  .keeper {
    margin-top: 3px;
    font-size: 0.75em;
    color: #888;
  }
</style>
