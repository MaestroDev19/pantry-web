import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "./data.json";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getRandomRecipe } from "@/lib/data/recipe";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TypographyH3 } from "@/components/typography";

/**
 * Dashboard home page.
 * Renders overview cards, interactive chart, and data table.
 */
export default async function Page() {
	const recipe = await getRandomRecipe(
		"https://www.themealdb.com/api/json/v1/1/random.php",
	);
	console.log(recipe);
	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<SectionCards />
					{/* Responsive grid: 1 column on small, 2 columns on md+ */}
					<div className="grid grid-cols-1 gap-4 px-2 sm:px-4 md:grid-cols-2 md:px-6">
						<div className="flex flex-col gap-4">
							<ChartAreaInteractive />
							<Card>
								<CardHeader>
									<CardTitle>
										Chef&apos;s daily choice
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex flex-col gap-2">
										<TypographyH3 className="font-bold">
											{recipe.strMeal}
										</TypographyH3>
										<CardDescription>
											<div className="flex flex-wrap gap-2">
												<Badge variant="outline">
													{recipe.strCategory}
												</Badge>
												<Badge variant="outline">
													{recipe.strArea}
												</Badge>
												<Badge variant="outline">
													{recipe.strIngredient1}
												</Badge>
												<Badge variant="outline">
													{recipe.strIngredient2}
												</Badge>
												<Badge variant="outline">
													{recipe.strIngredient3}
												</Badge>
											</div>
										</CardDescription>
									</div>
								</CardContent>
								<CardFooter>
									<Button className="w-full">
										View Recipe
									</Button>
								</CardFooter>
							</Card>
						</div>
						<Card>
							<CardHeader>Hi</CardHeader>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
