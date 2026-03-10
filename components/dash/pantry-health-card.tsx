"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";

// Mock data for the single stacked bar
const chartData = [
  { 
    name: "Pantry", 
    fresh: 85.7, 
    warning: 10.2, 
    expired: 4.1 
  }
];

const chartConfig = {
  fresh: {
    label: "Fresh",
    color: "var(--primary)",
  },
  warning: {
    label: "Warning",
    color: "var(--warning)",
  },
  expired: {
    label: "Expired",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;

export function PantryHealthCard() {
  return (
    <Card className="border-border border-dashed">
      <CardHeader>
        <CardTitle>Pantry Health</CardTitle>
        <CardDescription>Here&apos;s a quick overview of your pantry</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 w-full pb-0 pt-4">
        {/* Progress Bar with Recharts Tooltip */}
        <ChartContainer config={chartConfig} className="h-10 w-full mb-2">
          <BarChart 
            accessibilityLayer 
            data={chartData} 
            layout="vertical"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis dataKey="name" type="category" hide />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={false}
            />
            <Bar
              dataKey="fresh"
              stackId="a"
              fill="var(--color-fresh)"
              radius={[4, 0, 0, 4]}
            />
            <Bar
              dataKey="warning"
              stackId="a"
              fill="var(--color-warning)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="expired"
              stackId="a"
              fill="var(--color-expired)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="w-full">
        <div className="grid grid-cols-1 gap-2 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-background/50 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-3 dark:*:data-[slot=card]:bg-card w-full">
          <Card data-slot="card" className="border-primary/20">
            <CardHeader>
              <CardDescription>Fresh Items</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
                42
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10 hover:bg-primary/20">
                  <IconTrendingUp className="size-3.5 mr-1" />
                  +12.5%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Trending up this month <IconTrendingUp className="size-4 text-primary" />
              </div>
              <div className="text-muted-foreground">
                Waste reduced by 5%
              </div>
            </CardFooter>
          </Card>
          
          <Card data-slot="card" className="border-warning/20">
            <CardHeader>
              <CardDescription>Warning</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
                5
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="text-warning border-warning/20 bg-warning/10 hover:bg-warning/20">
                  <IconTrendingDown className="size-3.5 mr-1" />
                  -20%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Down 20% this period <IconTrendingDown className="size-4 text-warning" />
              </div>
              <div className="text-muted-foreground">
                Approaching expiration dates
              </div>
            </CardFooter>
          </Card>
          
          <Card data-slot="card" className="border-destructive/20">
            <CardHeader>
              <CardDescription>Expired</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
                2
              </CardTitle>
              <div className="absolute right-4 top-4">
                <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/10 hover:bg-destructive/20">
                  <IconTrendingDown className="size-3.5 mr-1" />
                  -50%
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Significant improvement <IconTrendingDown className="size-4 text-destructive" />
              </div>
              <div className="text-muted-foreground">
                Losses kept to a minimum
              </div>
            </CardFooter>
          </Card>
        </div>
      </CardFooter>
    </Card>
  );
}
