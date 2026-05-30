import { notFound } from "next/navigation"

import { RecipeDetail } from "@/components/dash/recipe-detail"
import { getUserClaims } from "@/lib/dal/auth"
import { resolveRecipeById } from "@/lib/server/recipe-resolver"

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const recipeId = slug?.[0]?.trim()

  if (!recipeId) {
    notFound()
  }

  const claims = await getUserClaims()
  const userId = claims?.user.id
  if (!userId) {
    notFound()
  }

  const recipe = await resolveRecipeById(userId, recipeId)
  if (!recipe) {
    notFound()
  }

  return <RecipeDetail recipe={recipe} />
}
