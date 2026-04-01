import {
  BookmarkIcon,
  ChefHatIcon,
  ClockIcon,
  FlameIcon,
  RefreshCwIcon,
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
// Demo data
// ---------------------------------------------------------------------------

const DEMO_RECIPE: RecipeSuggestion = {
  name: "Lemon Herb Chickpea Bowl",
  description:
    "A vibrant, nourishing bowl layered with roasted chickpeas, wilted kale, and a zesty lemon-tahini drizzle. Light yet satisfying.",
  cookTime: "20 mins",
  difficulty: "Easy",
  totalIngredients: 8,
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
  recipe = DEMO_RECIPE,
}: {
  recipe?: RecipeSuggestion
}) {
  return (
    <Card className="flex flex-col border-dashed border-border">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="flex items-center gap-2 text-base">
              <ChefHatIcon className="size-4 text-primary" />
              Chef ACE
            </CardTitle>
            <CardDescription>Your AI Culinary Expert</CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0 gap-1 text-xs">
            <SparklesIcon className="size-3" />
            Daily Pick
          </Badge>
        </div>

        {/* Persona row */}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* ── Recipe hero ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base leading-tight font-semibold">
            {recipe.name}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>

          {/* Meta badges */}
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

      {/* ── Footer ────────────────────────────────────────────────────── */}
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
    </Card>
  )
}
