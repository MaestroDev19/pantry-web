export default async function RecipesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <div>
      <h1>Recipes</h1>
      <p>Recipe: {slug}</p>
    </div>
  )
}
