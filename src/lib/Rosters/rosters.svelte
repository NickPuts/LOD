<script>
	import { loadPlayers } from '$lib/utils/helper';
	import RosterSorter from './RosterSorter.svelte';

	export let leagueData;
	export let rosterData;
	export let leagueTeamManagers;
	export let playersInfo;

	let players = playersInfo?.players ?? {};

	const refreshPlayers = async () => {
		const newPlayersInfo = await loadPlayers(null, true);
		players = newPlayersInfo.players;
	};

	if (playersInfo?.stale) {
		refreshPlayers();
	}
</script>

<style>
	.rosters {
		position: relative;
		z-index: 1;
	}
	.error-message {
		text-align: center;
		color: red;
		margin-top: 2em;
	}
</style>

{#if leagueData && rosterData?.rosters && leagueTeamManagers && Object.keys(players).length > 0}
	<div class="rosters">
		<RosterSorter
			rosters={rosterData.rosters}
			{players}
			{leagueTeamManagers}
			startersAndReserve={rosterData.startersAndReserve}
			{leagueData}
		/>
	</div>
{:else}
	<p class="error-message">No rosters to display. Please check your league data or try refreshing.</p>
{/if}
