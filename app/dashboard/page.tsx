import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "./data.json";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getRandomRecipe } from "@/lib/recipe";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
					<div className="grid grid-cols-2 gap-4 px-4 lg:px-6">
						<div className="flex flex-col gap-4">
							<ChartAreaInteractive />
							<Card>
								<div className="absolute inset-0 z-30 aspect-video S" />
								<img
									src="https://avatar.vercel.sh/shadcn1"
									alt="Event cover"
									className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
								/>
								<CardHeader>
									<CardAction>
										<Badge variant="secondary">
											Featured
										</Badge>
									</CardAction>
									<CardTitle>{recipe.strMeal}</CardTitle>
								</CardHeader>
								<CardFooter>
									<Button className="w-full">
										View Event
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
