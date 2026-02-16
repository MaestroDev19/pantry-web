"use server";

const CACHE_DURATION = 1000 * 60 * 60 * 24; // 1 day
const cache = new Map<string, { data: unknown; expiresAt: number }>();

async function apiRecipeFetch(
	url: string,
	options: RequestInit = { method: "GET" },
) {
	const now = Date.now();
	const cached = cache.get(url);

	if (cached && cached.expiresAt > now) {
		return cached.data;
	}

	const response = await fetch(url, options);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const data = await response.json();
	cache.set(url, { data, expiresAt: now + CACHE_DURATION });

	return data;
}

export async function getRandomRecipe(url: string) {
	const response = await apiRecipeFetch(url);
	return response.meals[0];
}
