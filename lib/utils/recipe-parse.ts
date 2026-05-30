import type { MealDbRandomRecipe } from "@/lib/types/recipetypes"

export function parseMealDbRandomRecipe(data: unknown): MealDbRandomRecipe {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid random recipe response")
  }

  const recipe = data as Record<string, unknown>
  const { ingredients, instructions, tags } = recipe

  if (
    typeof recipe.id !== "string" ||
    typeof recipe.title !== "string" ||
    !Array.isArray(ingredients) ||
    !ingredients.every((item) => typeof item === "string") ||
    !Array.isArray(instructions) ||
    !instructions.every((item) => typeof item === "string") ||
    typeof recipe.provider_recipe_id !== "string" ||
    !Array.isArray(tags) ||
    !tags.every((item) => typeof item === "string") ||
    typeof recipe.category !== "string"
  ) {
    throw new Error("Invalid random recipe response")
  }

  return {
    id: recipe.id,
    title: recipe.title,
    ingredients,
    instructions,
    provider_recipe_id: recipe.provider_recipe_id,
    tags,
    category: recipe.category,
  }
}
