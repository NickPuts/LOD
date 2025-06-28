import { leagueID } from '$lib/utils/leagueInfo';
import { get } from 'svelte/store';
import { rostersStore } from '$lib/stores';

export const getLeagueRosters = async (queryLeagueID = leagueID) => {
	const storedRoster = get(rostersStore)[queryLeagueID];

	if (
		storedRoster &&
		storedRoster.rosters &&
		Object.keys(storedRoster.rosters).length > 0
	) {
		console.log('[getLeagueRosters] ✅ Returning stored roster:', storedRoster);
		return storedRoster;
	}

	console.log(`[getLeagueRosters] 📡 Fetching rosters from Sleeper API for leagueID: ${queryLeagueID}`);

	let res, data;
	try {
		res = await fetch(`https://api.sleeper.app/v1/league/${queryLeagueID}/rosters`, { compress: true });
		data = await res.json();
	} catch (err) {
		console.error('[getLeagueRosters] ❌ Fetch failed:', err);
		throw new Error('Failed to fetch league rosters from Sleeper');
	}

	if (!res.ok) {
		console.error('[getLeagueRosters] ❌ API error response:', data);
		throw new Error('Sleeper API error fetching rosters');
	}

	const processedRosters = processRosters(data);
	console.log('[getLeagueRosters] ✅ Processed roster data:', processedRosters);

	rostersStore.update(r => {
		r[queryLeagueID] = processedRosters;
		return r;
	});

	return processedRosters;
};

const processRosters = (rosters) => {
	const startersAndReserve = [];
	const rosterMap = {}
