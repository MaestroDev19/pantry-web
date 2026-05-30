import Link from "next/link"
import {
  ArrowLeftIcon,
  ChefHatIcon,
  ClockIcon,
  SparklesIcon,
  UtensilsIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TypographyH2, TypographyP } from "@/components/ui/typography"
import type { RecipeDetailView } from "@/lib/types/recipetypes"
import {
  formatCategoryLabel,
  sourceBadgeLabel,
} from "@/lib/utils/recipe-detail"

type RecipeDetailProps = {
  recipe: RecipeDetailView
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const tags = recipe.tags ?? []

  return (
    <div className="flex flex-1 flex-col gap-6 pt-4 md:pt-10 lg:pt-20">
      <div className="flex flex-col gap-3">
        <Button variant="ghost" size="sm" className="w-fit px-0" asChild>
          <Link href="/dashboard/recipes">
            <ArrowLeftIcon data-icon="inline-start" />
            All recipes
          </Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <TypographyH2>{recipe.title}</TypographyH2>
            <TypographyP className="text-muted-foreground text-sm">
              {recipe.subtitle}
            </TypographyP>
            {recipe.description ? (
              <TypographyP className="text-sm leading-relaxed">
                {recipe.description}
              </TypographyP>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1.5">
              {recipe.source === "generated" ? (
                <SparklesIcon className="size-3.5" />
              ) : (
                <ChefHatIcon className="size-3.5" />
              )}
              {sourceBadgeLabel(recipe.source)}
            </Badge>
            {recipe.category ? (
              <Badge variant="outline" className="capitalize">
                {formatCategoryLabel(recipe.category)}
              </Badge>
            ) : null}
          </div>
        </div>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs font-normal capitalize"
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <UtensilsIcon className="size-3.5" />
            {recipe.ingredients.length} ingredients
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="size-3.5" />
            {recipe.instructions.length} steps
          </span>
        </div>
      </div>

      {recipe.retrieved_context && recipe.retrieved_context.length > 0 ? (
        <Card className="border-dashed border-border">
          <CardHeader>
            <CardTitle className="text-base">Pantry context used</CardTitle>
            <CardDescription>
              Snippets Chef ACE used when generating this recipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {recipe.retrieved_context.map((snippet) => (
                <li key={snippet} className="border-l-2 border-primary/30 pl-3">
                  {snippet}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-dashed border-border">
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
            <CardDescription>What you&apos;ll need</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-dashed border-border">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>Step by step</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 text-sm leading-relaxed">
              {recipe.instructions.map((step, index) => (
                <li key={`${index}-${step.slice(0, 24)}`} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
