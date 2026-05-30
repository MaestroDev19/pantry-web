import type { RecipeDetailView } from "@/lib/types/recipetypes"

function storeKey(userId: string, recipeId: string): string {
  return `${userId}:${recipeId}`
}

const recipesByKey = new Map<string, RecipeDetailView>()

/** In-process store for MealDB picks and RAG results until a backend recipe API exists. */
export function rememberUserRecipe(
  userId: string,
  recipe: RecipeDetailView,
): void {
  recipesByKey.set(storeKey(userId, recipe.id), recipe)
}

export function getRememberedUserRecipe(
  userId: string,
  recipeId: string,
): RecipeDetailView | null {
  return recipesByKey.get(storeKey(userId, recipeId)) ?? null
}

export function forgetUserRecipe(userId: string, recipeId: string): void {
  recipesByKey.delete(storeKey(userId, recipeId))
}
