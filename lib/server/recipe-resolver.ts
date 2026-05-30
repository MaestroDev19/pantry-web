import { getDummyRecipeById } from "@/lib/data/dummy-recipes"
import type { RecipeDetailView, RecipeGenerationResult } from "@/lib/types/recipetypes"
import {
  getCachedDailyRandomRecipe,
  recipeMatchesId,
} from "@/lib/server/daily-recipe"
import {
  getRememberedUserRecipe,
  rememberUserRecipe,
} from "@/lib/server/recipe-store"
import {
  toRecipeDetailFromDummy,
  toRecipeDetailFromGenerated,
  toRecipeDetailFromMealDb,
} from "@/lib/utils/recipe-detail"

/** Store a RAG / generate-recipe result and return the normalized detail view. */
export function rememberGeneratedRecipe(
  userId: string,
  result: RecipeGenerationResult,
  recipeId?: string,
): RecipeDetailView {
  const id = recipeId ?? `gen-${crypto.randomUUID()}`
  const recipe = toRecipeDetailFromGenerated(id, result)
  rememberUserRecipe(userId, recipe)
  return recipe
}

/**
 * Resolves a recipe for `/dashboard/recipes/[id]` from dummy catalog,
 * remembered MealDB/RAG picks, or today's cached random MealDB recipe.
 */
export async function resolveRecipeById(
  userId: string,
  recipeId: string,
): Promise<RecipeDetailView | null> {
  const dummy = getDummyRecipeById(recipeId)
  if (dummy) {
    return toRecipeDetailFromDummy(dummy)
  }

  const remembered = getRememberedUserRecipe(userId, recipeId)
  if (remembered) {
    return remembered
  }

  try {
    const daily = await getCachedDailyRandomRecipe(userId)
    const view = toRecipeDetailFromMealDb(daily)
    rememberUserRecipe(userId, view)

    if (recipeMatchesId(daily, recipeId)) {
      return view
    }
  } catch {
    // Fall through to not found.
  }

  return null
}
