"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { UsersIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useHouseholdPantryItems } from "@/lib/hooks/use-household-pantry-items"
import {
  buildPantryAdditionsChartData,
  pantryAdditionsHasData,
  type PantryAdditionsTimeRange,
} from "@/lib/utils/pantry-additions-chart"

const chartConfig = {
  additions: {
    label: "Items added",
  },
  you: {
    label: "You",
    color: "var(--chart-1)",
  },
  housemate: {
    label: "Housemate",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type PantryAdditionsChartCardProps = {
  currentUserId: string
  className?: string
}

export function PantryAdditionsChartCard({
  currentUserId,
  className,
}: PantryAdditionsChartCardProps) {
  const { items, isLoading, error } = useHouseholdPantryItems()
  const [timeRange, setTimeRange] =
    React.useState<PantryAdditionsTimeRange>("90d")

  const chartData = React.useMemo(
    () => buildPantryAdditionsChartData(items, currentUserId, timeRange),
    [items, currentUserId, timeRange],
  )

  const hasData = pantryAdditionsHasData(chartData)

  const rangeLabel =
    timeRange === "7d"
      ? "Last 7 days"
      : timeRange === "30d"
        ? "Last 30 days"
        : "Last 3 months"

  return (
    <Card className={cn("flex h-full min-h-[360px] flex-col border-dashed border-border pt-0", className)}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Pantry additions</CardTitle>
          <CardDescription>
            Items added by you and your housemate — {rangeLabel.toLowerCase()}
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(value) =>
            setTimeRange(value as PantryAdditionsTimeRange)
          }
        >
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col px-2 pt-4 pb-6 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Skeleton className="aspect-auto h-[250px] w-full rounded-lg" />
        ) : error ? (
          <Empty className="max-w-none border-none p-0 py-8">
            <EmptyHeader>
              <EmptyTitle>Unable to load pantry activity</EmptyTitle>
              <EmptyDescription>{error.message}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : !hasData ? (
          <Empty className="my-auto max-w-none border-none p-0 py-4">
            <EmptyHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <UsersIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <EmptyTitle>No additions in this period</EmptyTitle>
              <EmptyDescription>
                Add pantry items to see how you and your housemate contribute
                over time.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillYou" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-you)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-you)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillHousemate" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-housemate)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-housemate)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(`${value}T12:00:00`)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(`${value}T12:00:00`).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="housemate"
                type="natural"
                fill="url(#fillHousemate)"
                stroke="var(--color-housemate)"
                stackId="a"
              />
              <Area
                dataKey="you"
                type="natural"
                fill="url(#fillYou)"
                stroke="var(--color-you)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
