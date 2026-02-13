"use server";

const CACHE_DURATION = 1000 * 60 * 60 * 24; // 1 day
const cache = new Map<string, { data: unknown; expiresAt: number }>();

async function apiRecipeFetch(
	url: string,
	options: RequestInit = { method: "GET", cache: "force-cache" },
) {
	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
}

export async function getRandomRecipe(url: string) {
	const response = await apiRecipeFetch(url);
	return response.meals[0];
}
