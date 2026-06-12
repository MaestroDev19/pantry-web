import { REMEMBERED_RECIPES_TABLE } from "@/lib/constants/tables"
import { createClient } from "@/lib/supabase/server"
import type { RecipeDetailView } from "@/lib/types/recipetypes"

// Ephemeral in-process fallback cache for local dev / non-migrated DBs
const fallbackCache = new Map<string, RecipeDetailView>()

function fallbackKey(userId: string, recipeId: string): string {
  return `${userId}:${recipeId}`
}

/**
 * Stores a recipe pick/generation results for a user.
 * Attempts to persist to the Supabase database table `remembered_recipes`,
 * degrading gracefully to in-memory caching if the table does not exist.
 */
export async function rememberUserRecipe(
  userId: string,
  recipe: RecipeDetailView,
): Promise<void> {
  // Always update in-memory cache as fallback
  fallbackCache.set(fallbackKey(userId, recipe.id), recipe)

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from(REMEMBERED_RECIPES_TABLE)
      .upsert(
        {
          user_id: userId,
          recipe_id: recipe.id,
          recipe_data: recipe,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,recipe_id" }
      )

    if (error) {
      console.warn(
        `[recipe-store] Supabase persist failed: ${error.message}. Falling back to in-memory cache.`
      )
    }
  } catch (err) {
    console.warn(
      `[recipe-store] Failed to connect to Supabase: ${err}. Falling back to in-memory cache.`
    )
  }
}

/**
 * Retrieves a previously remembered recipe by user and recipe ID.
 * Resolves from Supabase if available, falling back to the in-memory cache.
 */
export async function getRememberedUserRecipe(
  userId: string,
  recipeId: string,
): Promise<RecipeDetailView | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(REMEMBERED_RECIPES_TABLE)
      .select("recipe_data")
      .eq("user_id", userId)
      .eq("recipe_id", recipeId)
      .maybeSingle()

    if (error) {
      console.warn(
        `[recipe-store] Supabase fetch failed: ${error.message}. Checking in-memory cache.`
      )
      return fallbackCache.get(fallbackKey(userId, recipeId)) ?? null
    }

    if (data) {
      return data.recipe_data as RecipeDetailView
    }
  } catch (err) {
    console.warn(
      `[recipe-store] Failed to fetch from Supabase: ${err}. Checking in-memory cache.`
    )
  }

  return fallbackCache.get(fallbackKey(userId, recipeId)) ?? null
}

/**
 * Removes a remembered recipe from the store.
 */
export async function forgetUserRecipe(
  userId: string,
  recipeId: string,
): Promise<void> {
  fallbackCache.delete(fallbackKey(userId, recipeId))

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from(REMEMBERED_RECIPES_TABLE)
      .delete()
      .eq("user_id", userId)
      .eq("recipe_id", recipeId)

    if (error) {
      console.warn(`[recipe-store] Supabase delete failed: ${error.message}`)
    }
  } catch (err) {
    console.warn(`[recipe-store] Failed to delete from Supabase: ${err}`)
  }
}
