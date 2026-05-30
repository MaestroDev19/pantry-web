import Link from "next/link"

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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import { DUMMY_RECIPES } from "@/lib/data/dummy-recipes"

export default function RecipesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 pt-4 md:pt-10 lg:pt-20">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {DUMMY_RECIPES.map((recipe) => (
          <Item
            key={recipe.id}
            className="border-border hover:border-dashed hover:border-border"
          >
            <ItemHeader className="flex flex-col gap-2">
              <ItemTitle>{recipe.title}</ItemTitle>
              <ItemDescription>{recipe.description}</ItemDescription>
            </ItemHeader>
            <ItemContent>
              <ItemActions>
                <Button asChild>
                  <Link href={`/dashboard/recipes/${recipe.id}`}>View</Link>
                </Button>
              </ItemActions>
            </ItemContent>
          </Item>
        ))}
      </div>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Recipes</CardTitle>
          <CardDescription>
            Sample recipes plus Chef ACE picks from your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Open today&apos;s daily pick from the dashboard Chef ACE card, or browse
          the sample recipes above.
        </CardContent>
        <CardFooter>
          <Button asChild variant="secondary">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
