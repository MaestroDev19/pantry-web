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

export default function RecipesPage() {
  const dummyRecipes = [
    {
      id: "101",
      title: "Garlic Butter Pasta",
      description: "Quick pantry pasta with garlic, butter, and herbs.",
    },
    {
      id: "102",
      title: "Sheet-Pan Chicken & Veg",
      description: "One-pan dinner with a simple lemon-pepper finish.",
    },
    {
      id: "103",
      title: "Tomato Lentil Soup",
      description: "Cozy soup with lentils, tomatoes, and warm spices.",
    },
    {
      id: "104",
      title: "Tuna Rice Bowl",
      description: "Fast bowl with tuna, rice, and a tangy soy-lime drizzle.",
    },
    {
      id: "105",
      title: "Crispy Chickpea Salad",
      description: "Crunchy chickpeas over greens with a simple vinaigrette.",
    },
    {
      id: "106",
      title: "Peanut Noodles",
      description: "Creamy peanut sauce noodles with a hint of heat.",
    },
  ] as const

  return (
    <div className="flex flex-1 flex-col gap-6 pt-4 md:pt-10 lg:pt-20">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {dummyRecipes.map((recipe) => (
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
            Recipe suggestions from your pantry are not available yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This area will connect to Chef ACE and your inventory when the backend
          integration is ready.
          <Link href="/dashboard/recipes/123">Recipe 123</Link>
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
