import Link from "next/link"
import { SparklesIcon, ChevronRightIcon, BookOpenIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import { DUMMY_RECIPES } from "@/lib/data/dummy-recipes"
import { RecipeGenerator } from "@/components/dash/recipe-generator"
import { getSessionToken } from "@/lib/dal/auth"

export default async function RecipesPage() {
  const session = await getSessionToken()
  const accessToken = session.ok ? session.token : null

  return (
    <div className="flex flex-1 flex-col gap-10 pt-4 md:pt-8">
      {/* AI Recipe Studio Hero Header Section */}
      <div className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-b from-primary/5 via-transparent to-transparent p-6 md:p-10 flex flex-col gap-6 text-center max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-2 items-center">
          <div className="p-2.5 rounded-full bg-primary/10 w-fit text-primary animate-pulse">
            <SparklesIcon className="size-6" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-none">
            AI Recipe Studio
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl md:text-base">
            Prompt Chef ACE to generate tailor-made recipes utilizing your pantry ingredients and culinary preferences.
          </p>
        </div>

        <RecipeGenerator accessToken={accessToken} />
      </div>

      {/* Recipe Catalog Shelf */}
      <div className="flex flex-col gap-6 border-t border-border pt-10">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground tracking-tight">
            <BookOpenIcon className="size-5 text-primary" />
            Recipe Catalog
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore sample curated kitchen recipes or view your custom-made Chef ACE picks.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-2">
          {DUMMY_RECIPES.map((recipe) => (
            <Item
              key={recipe.id}
              className="border-border hover:border-dashed hover:border-border/80 transition-all flex flex-col justify-between"
            >
              <ItemHeader className="flex flex-col gap-2">
                <ItemTitle className="text-base font-bold text-foreground">
                  {recipe.title}
                </ItemTitle>
                <ItemDescription className="text-xs text-muted-foreground/80 line-clamp-2">
                  {recipe.description}
                </ItemDescription>
              </ItemHeader>
              <ItemContent className="pt-2">
                <ItemActions className="mt-2">
                  <Button asChild size="sm" className="w-full gap-1">
                    <Link href={`/dashboard/recipes/${recipe.id}`}>
                      View Recipe
                      <ChevronRightIcon className="size-3.5" />
                    </Link>
                  </Button>
                </ItemActions>
              </ItemContent>
            </Item>
          ))}
        </div>
      </div>
    </div>
  )
}
