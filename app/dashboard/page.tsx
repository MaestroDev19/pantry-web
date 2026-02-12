import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  TypographyH3,
  TypographyMuted,
  TypographySmall,
} from "@/components/typography";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { PantryStatCard } from "@/components/dashboard/pantry-stat-card";
import { PANTRY_DASHBOARD_COPY } from "@/lib/copy/pantry-dashboard";
import { Button } from "@/components/ui/button";
export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="bg-background text-foreground flex min-h-[calc(100svh-4rem)] flex-col gap-6 px-4 py-6 md:gap-8 md:px-8 md:py-8">
      <DashboardHeader
        title={PANTRY_DASHBOARD_COPY.title}
        subtitle={PANTRY_DASHBOARD_COPY.subtitle}
        userEmail={user.email ?? undefined}
        primaryActionLabel="Add item"
      />

      <section
        aria-label="Pantry stats"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        <PantryStatCard
          label={PANTRY_DASHBOARD_COPY.stats.totalItems}
          value="42"
        />
        <PantryStatCard
          label={PANTRY_DASHBOARD_COPY.stats.runningLow}
          value="7"
          tone="warning"
        />
        <PantryStatCard
          label={PANTRY_DASHBOARD_COPY.stats.expiringSoon}
          value="3"
          tone="danger"
        />
        <PantryStatCard
          label={PANTRY_DASHBOARD_COPY.stats.outOfStock}
          value="5"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="space-y-1">
              <TypographyH3 className="text-lg font-semibold">
                {PANTRY_DASHBOARD_COPY.sections.expiringSoon}
              </TypographyH3>
              <TypographyMuted>
                Items that will expire in the next 7 days.
              </TypographyMuted>
            </div>
            <CardAction>
              <Button size="sm" variant="ghost">
                View all
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <div className="divide-border flex flex-col divide-y">
              <div className="flex items-center justify-between px-6 py-3">
                <div className="space-y-0.5">
                  <TypographySmall>Bread</TypographySmall>
                  <TypographyMuted>Expires in 2 days</TypographyMuted>
                </div>
                <span className="text-muted-foreground text-sm">1 loaf</span>
              </div>
              <div className="flex items-center justify-between px-6 py-3">
                <div className="space-y-0.5">
                  <TypographySmall>Milk</TypographySmall>
                  <TypographyMuted>Expires tomorrow</TypographyMuted>
                </div>
                <span className="text-muted-foreground text-sm">1 L</span>
              </div>
              <div className="flex items-center justify-between px-6 py-3">
                <div className="space-y-0.5">
                  <TypographySmall>Spinach</TypographySmall>
                  <TypographyMuted>Expires in 3 days</TypographyMuted>
                </div>
                <span className="text-muted-foreground text-sm">1 bag</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <TypographyH3 className="text-lg font-semibold">
              {PANTRY_DASHBOARD_COPY.sections.recentActivity}
            </TypographyH3>
            <CardDescription>
              The latest changes you have made to your pantry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <TypographySmall>Added 6 cans of beans</TypographySmall>
                <TypographyMuted>Just now</TypographyMuted>
              </div>
              <Separator />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <TypographySmall>Marked milk as used</TypographySmall>
                <TypographyMuted>1 hour ago</TypographyMuted>
              </div>
              <Separator />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <TypographySmall>Updated rice quantity</TypographySmall>
                <TypographyMuted>Yesterday</TypographyMuted>
              </div>
              <Separator />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
