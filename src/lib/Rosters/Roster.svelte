<script>
  import { gotoManager } from '$lib/utils/helper';
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
  import { Icon } from '@smui/icon-button';
  import RosterRow from './RosterRow.svelte';

  export let roster;
  export let leagueTeamManagers;
  export let startersAndReserve;
  export let players;
  export let rosterPositions;
  export let division;
  export let expanded;

  $: team = leagueTeamManagers.teamManagersMap[leagueTeamManagers.currentSeason][roster.roster_id].team;

  let i = 0;

  const digestData = (passedPlayers, rawPlayers, startingPlayers = false, reserve = false) => {
    let digestedRoster = [];

    for (const singlePlayer of rawPlayers) {
      if (!startingPlayers && !reserve && startersAndReserve.includes
