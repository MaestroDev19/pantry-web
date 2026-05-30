/** Shared list limits (`shared/contracts.py`). */
export const MAX_LIST_ITEMS = 200 as const;
export const MAX_ITEM_LENGTH = 200 as const;

/** POST `/recipes/generate-recipe` — `RecipeWorkflowInput`. */
export interface RecipeWorkflowInput {
  /** 1–200 items; each stripped, max 200 chars (server-side). */
  pantry_items: string[];
  /** Optional; default `[]`, max 200 items (server-side). */
  dietary_preferences?: string[];
}

/** AI workflow recipe body — `RecipeWorkflowOutput`. */
export interface RecipeWorkflowOutput {
  title: string;
  ingredients: string[];
  instructions: string[];
}

/** POST `/recipes/generate-recipe` — `RecipeGenerationResult`. */
export interface RecipeGenerationResult {
  recipe: RecipeWorkflowOutput;
  /** RAG snippets from pantry context; default `[]`. */
  retrieved_context?: string[];
}

export type RecipeSource = "dummy" | "mealdb" | "generated";

/** Normalized recipe for list + detail UI across dummy, MealDB, and RAG sources. */
export interface RecipeDetailView {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  source: RecipeSource;
  subtitle: string;
  description?: string;
  category?: string;
  tags?: string[];
  retrieved_context?: string[];
}

/** GET `/recipes/` placeholder list response. */
export interface RecipesListResponse {
  recipes: RecipeWorkflowOutput[];
}

/**
 * Normalized random recipe from TheMealDB (`meal_to_recipe_components`).
 * GET `/recipes/get-random-recipe` returns a loose object; this is the typed shape.
 */
export interface MealDbRandomRecipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  provider_recipe_id: string;
  tags: string[];
  category: string;
}

/**
 * Loose Gemini JSON before `_normalize_recipe` (title, ingredients/ing, instructions/steps).
 */
export interface GeminiRecipeJson {
  title?: string;
  ingredients?: string[];
  ing?: string[];
  instructions?: string[];
  steps?: string[];
}

/** FastAPI `recipes` router paths (relative to API base). */
export const RECIPES_LIST_PATH = "/api/recipes/" as const;
export const RECIPES_GENERATE_PATH = "/api/recipes/generate-recipe" as const;
export const RECIPES_RANDOM_PATH = "/api/recipes/get-random-recipe" as const;
