import { unstable_cache } from "next/cache"

import { getSessionToken } from "@/lib/dal/auth"
import { RECIPES_RANDOM_PATH, type MealDbRandomRecipe } from "@/lib/types/recipetypes"
import { parseMealDbRandomRecipe } from "@/lib/utils/recipe-parse"
import { resolvePantryRequestUrl } from "@/lib/utils/config"

/** Aligns with Chef ACE “daily pick” — one random recipe per user per day. */
export const DAILY_RECIPE_REVALIDATE_SECONDS = 24 * 60 * 60

async function fetchRandomRecipe(accessToken: string): Promise<MealDbRandomRecipe> {
  const url = resolvePantryRequestUrl(RECIPES_RANDOM_PATH)
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  const text = await res.text()
  const data = text ? (JSON.parse(text) as unknown) : null

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("Rate limit exceeded. Try again in a minute.")
    }
    throw new Error(`Failed to load random recipe (${res.status})`)
  }

  return parseMealDbRandomRecipe(data)
}

export function recipeMatchesId(
  recipe: MealDbRandomRecipe,
  recipeId: string,
): boolean {
  return recipe.id === recipeId || recipe.provider_recipe_id === recipeId
}

/**
 * Cached random recipe for the signed-in user (24h revalidate).
 * Backend also caches TheMealDB globally; this layer avoids repeat dashboard fetches.
 */
export async function getCachedDailyRandomRecipe(
  userId: string,
): Promise<MealDbRandomRecipe> {
  const session = await getSessionToken()
  if (!session.ok) {
    throw new Error(session.message)
  }

  const accessToken = session.token

  return unstable_cache(
    async () => fetchRandomRecipe(accessToken),
    ["chef-ace-daily-recipe", userId],
    {
      revalidate: DAILY_RECIPE_REVALIDATE_SECONDS,
      tags: [`chef-ace-recipe-${userId}`],
    },
  )()
}
