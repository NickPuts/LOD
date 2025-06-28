import { get } from 'svelte/store';
import { players } from '$lib/stores';
import { browser } from '$app/environment';

export const loadPlayers = async (servFetch, refresh = false) => {
	if (get(players)[1426]) {
		return {
			players: get(players),
			stale: false
		};
	}

	const now = Math.floor(Date.now() / 1000);
	let playersInfo = null;
	let expiration = null;

	if (browser) {
		playersInfo = JSON.parse(localStorage.getItem('playersInfo'));
		expiration = parseInt(localStorage.getItem('expiration'));
	}

	if (playersInfo && playersInfo[1426] && expiration && now < expiration && !refresh) {
		players.update(() => playersInfo);
		return {
			players: playersInfo,
			stale: false
		};
	}

	const url = browser
		? '/api/fetch_players_info' // relative for client
		: 'https://lod-rho.vercel.app/api/fetch_players_info'; // absolute for server

	const res = await (servFetch ?? fetch)(refresh ? `${url}?forceRefresh=true` : url);

	if (!res.ok) {
		throw new Error('Failed to fetch player data');
	}

	const data = await res.json();

	if (browser) {
		localStorage.setItem('playersInfo', JSON.stringify(data));
		localStorage.setItem('expiration', now + 24 * 60 * 60); // 24 hrs
	}

	players.update(() => data);
	return {
		players: data,
		stale: refresh
	};
};
