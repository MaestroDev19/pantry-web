import {
  BookmarkIcon,
  ChefHatIcon,
  ClockIcon,
  FlameIcon,
  SparklesIcon,
  UtensilsIcon,
} from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RecipeSuggestion {
  name: string
  description: string
  cookTime: string
  difficulty: "Easy" | "Medium" | "Hard"
  totalIngredients: number
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const difficultyColor: Record<RecipeSuggestion["difficulty"], string> = {
  Easy: "text-primary",
  Medium: "text-warning",
  Hard: "text-destructive",
}

function DifficultyIcon({ level }: { level: RecipeSuggestion["difficulty"] }) {
  const count = level === "Easy" ? 1 : level === "Medium" ? 2 : 3
  return (
    <span className={`flex items-center gap-0.5 ${difficultyColor[level]}`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <FlameIcon
          key={i}
          className={`size-3 ${i < count ? "opacity-100" : "opacity-20"}`}
        />
      ))}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Main card
// ---------------------------------------------------------------------------

export function ChefAceCard({
  recipe,
}: {
  recipe?: RecipeSuggestion | null
}) {
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
              Coming soon
            </Badge>
          )}
        </div>
      </CardHeader>

      {hasRecipe ? (
        <>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base leading-tight font-semibold">
                {recipe.name}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {recipe.description}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <ClockIcon className="size-3" />
                  {recipe.cookTime}
                </Badge>
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <DifficultyIcon level={recipe.difficulty} />
                  {recipe.difficulty}
                </Badge>
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <UtensilsIcon className="size-3" />
                  {recipe.totalIngredients} ingredients
                </Badge>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" variant="default">
              <UtensilsIcon data-icon="inline-start" />
              Cook This
            </Button>
            <Button className="w-full" variant="outline">
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
              <EmptyTitle>Not available in this build</EmptyTitle>
              <EmptyDescription>
                Chef ACE will be available in the next build—daily recipe picks
                tailored to your pantry.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      )}
    </Card>
  )
}
