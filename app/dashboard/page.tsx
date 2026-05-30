import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { getDashboardData } from "@/lib/utils/dashboard";
import { redirect } from "next/navigation";
import { ActionsRequiredCard } from "@/components/dash/actions-required-card";
import { PantryAdditionsChartCard } from "@/components/dash/pantry-additions-chart";
import { ItemsByCategoryCard } from "@/components/dash/items-by-category-chart";
import { ShoppingListCard } from "@/components/dash/shopping-list-card";
import { ChefAceCard } from "@/components/dash/chef-ace-card";
import { PantryHealthCard } from "@/components/dash/pantry-health-card";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 flex-col @container/main gap-2">
      <div className="flex flex-col pt-4 md:pt-10 lg:pt-20 pb-4 ">
        <TypographyH2>Welcome {data.userProfile.user.full_name}</TypographyH2>
        <TypographyP className="text-muted-foreground text-sm">
          Here&apos;s a quick overview of your pantry
        </TypographyP>
      </div>
      <PantryHealthCard />
      <div className="grid grid-cols-1 items-stretch gap-2 md:grid-cols-3">
        <PantryAdditionsChartCard
          currentUserId={data.userProfile.user.id}
          className="min-w-0 md:col-span-2"
        />
        <ActionsRequiredCard className="min-w-0" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <ItemsByCategoryCard />
        <ShoppingListCard />
        <ChefAceCard />
      </div>
    </div>
  );
}
