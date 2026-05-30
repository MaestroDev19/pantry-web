import {
  BookmarkIcon,
  ChefHatIcon,
  ClockIcon,
  FlameIcon,
  SparklesIcon,
  UtensilsIcon,
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { getUserClaims } from "@/lib/dal/auth"
import { getCachedDailyRandomRecipe } from "@/lib/server/daily-recipe"
import type { MealDbRandomRecipe } from "@/lib/types/recipetypes"

export type RecipeDifficulty = "Easy" | "Medium" | "Hard"

export interface RecipeSuggestion extends MealDbRandomRecipe {
  difficulty: RecipeDifficulty
  totalIngredients: number
  stepCount: number
}

function deriveDifficulty(ingredientCount: number): RecipeDifficulty {
  if (ingredientCount <= 8) return "Easy"
  if (ingredientCount <= 14) return "Medium"
  return "Hard"
}

function toRecipeSuggestion(recipe: MealDbRandomRecipe): RecipeSuggestion {
  return {
    ...recipe,
    totalIngredients: recipe.ingredients.length,
    stepCount: recipe.instructions.length,
    difficulty: deriveDifficulty(recipe.ingredients.length),
  }
}

function instructionPreview(instructions: string[], maxSteps = 2): string {
  const preview = instructions
    .slice(0, maxSteps)
    .map((step) => step.trim())
    .filter(Boolean)
    .join(" ")

  return preview || "Open the recipe for full instructions."
}

function formatCategoryLabel(category: string): string {
  if (!category) return "Recipe"
  return category.charAt(0).toUpperCase() + category.slice(1)
}

async function loadDailyRecipeSuggestion(): Promise<{
  recipe: RecipeSuggestion | null
  error: string | null
}> {
  const claims = await getUserClaims()
  const userId = claims?.user.id
  if (!userId) {
    return { recipe: null, error: null }
  }

  try {
    const raw = await getCachedDailyRandomRecipe(userId)
    return { recipe: toRecipeSuggestion(raw), error: null }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not load today's recipe pick."
    return { recipe: null, error: message }
  }
}

function DifficultyIcon({ level }: { level: RecipeDifficulty }) {
  const count = level === "Easy" ? 1 : level === "Medium" ? 2 : 3
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <FlameIcon
          key={i}
          className={`size-3 ${i < count ? "opacity-100" : "opacity-20"}`}
        />
      ))}
    </span>
  )
}

export async function ChefAceCard() {
  const { recipe, error } = await loadDailyRecipeSuggestion()
  const hasRecipe = recipe != null

  return (
    <Card className="flex flex-col border-dashed border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="flex items-center gap-2 text-base">
              <ChefHatIcon className="size-4 text-primary" />
              Chef ACE
            </CardTitle>
            <CardDescription>Your AI Culinary Expert</CardDescription>
          </div>
          {hasRecipe ? (
            <Badge variant="secondary" className="shrink-0 gap-1 text-xs">
              <SparklesIcon className="size-3" />
              Daily Pick
            </Badge>
          ) : (
            <Badge variant="outline" className="shrink-0 text-xs">
              {error ? "Unavailable" : "Sign in required"}
            </Badge>
          )}
        </div>
      </CardHeader>

      {hasRecipe ? (
        <>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-base leading-tight font-semibold">
                {recipe.title}
              </h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {instructionPreview(recipe.instructions)}
              </p>

              {recipe.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {recipe.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] font-normal capitalize"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}

              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1.5 text-xs capitalize">
                  {formatCategoryLabel(recipe.category)}
                </Badge>
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <DifficultyIcon level={recipe.difficulty} />
                  {recipe.difficulty}
                </Badge>
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <UtensilsIcon className="size-3" />
                  {recipe.totalIngredients} ingredients
                </Badge>
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <ClockIcon className="size-3" />
                  {recipe.stepCount} steps
                </Badge>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" variant="default" asChild>
              <Link href={`/dashboard/recipes/${recipe.id}`}>
                <UtensilsIcon data-icon="inline-start" />
                Cook This
              </Link>
            </Button>
            <Button className="w-full" variant="outline" disabled>
              <BookmarkIcon data-icon="inline-start" />
              Save Recipe
            </Button>
          </CardFooter>
        </>
      ) : (
        <CardContent className="flex flex-1 flex-col pt-0">
          <Empty className="max-w-none flex-1 border-none py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ChefHatIcon className="size-4 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>
                {error ? "Could not load daily pick" : "No recipe yet"}
              </EmptyTitle>
              <EmptyDescription>
                {error ??
                  "Sign in to see a new random recipe inspiration each day, refreshed every 24 hours."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      )}
    </Card>
  )
}
