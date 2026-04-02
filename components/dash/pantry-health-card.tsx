"use client"

import * as React from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
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
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { getPantryExpiryKind } from "@/lib/utils/pantry-expiry"
import { useMyPantryItems } from "@/lib/hooks/use-my-pantry-items"

type PantryHealthRow = {
  name: string
  fresh: number
  warning: number
  expired: number
}

type PantryHealthStats = {
  freshItems: number
  warningItems: number
  expiredItems: number
}

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
} satisfies ChartConfig

type PantryHealthCardProps = {
  chartData?: PantryHealthRow[]
  stats?: PantryHealthStats
}

export function PantryHealthCard({ chartData, stats }: PantryHealthCardProps) {
  const { items } = useMyPantryItems()

  const computed = React.useMemo(() => {
    let fresh = 0
    let warning = 0
    let expired = 0

    for (const item of items) {
      const kind = getPantryExpiryKind(item.expiry_date)
      if (kind === "expired") expired += 1
      else if (kind === "soon") warning += 1
      else fresh += 1
    }

    const total = fresh + warning + expired
    const freshPct = total > 0 ? Math.round((fresh / total) * 100) : 0
    const warningPct = total > 0 ? Math.round((warning / total) * 100) : 0
    const expiredPct = total > 0 ? Math.round((expired / total) * 100) : 0

    const drift = total > 0 ? 100 - (freshPct + warningPct + expiredPct) : 0
    const adjustedFreshPct = freshPct + drift

    return {
      chartData: [
        {
          name: "My Pantry",
          fresh: adjustedFreshPct,
          warning: warningPct,
          expired: expiredPct,
        },
      ] as PantryHealthRow[],
      stats: {
        freshItems: fresh,
        warningItems: warning,
        expiredItems: expired,
      } satisfies PantryHealthStats,
    }
  }, [items])

  const safeChartData = chartData ?? computed.chartData ?? []
  const hasChartData =
    safeChartData.length > 0 &&
    safeChartData.some(
      (row) => row.fresh > 0 || row.warning > 0 || row.expired > 0
    )

  const safeStats = stats ?? computed.stats ?? null
  const hasStats =
    safeStats !== null &&
    (safeStats.freshItems > 0 ||
      safeStats.warningItems > 0 ||
      safeStats.expiredItems > 0)

  return (
    <Card className="border-dashed border-border">
      <CardHeader>
        <CardTitle>Pantry Health</CardTitle>
        <CardDescription>
          Here&apos;s a quick overview of your pantry
        </CardDescription>
      </CardHeader>
      {hasChartData ? (
        <>
          <CardContent className="flex w-full flex-col gap-6 pt-4 pb-0">
            <ChartContainer config={chartConfig} className="mb-2 h-10 w-full">
              <BarChart
                accessibilityLayer
                data={safeChartData}
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

          {hasStats && safeStats !== null && (
            <CardFooter className="w-full">
              <div className="grid w-full grid-cols-1 gap-2 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-background/50 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs sm:grid-cols-3 dark:*:data-[slot=card]:bg-card">
                <Card data-slot="card" className="border-primary/20">
                  <CardHeader>
                    <CardDescription>Fresh Items</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
                      {safeStats.freshItems}
                    </CardTitle>
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="outline"
                        className="border-primary/20 bg-primary/10 text-primary"
                      >
                        <IconTrendingUp
                          aria-hidden="true"
                          className="mr-1 size-3.5"
                        />
                        Fresh
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>

                <Card data-slot="card" className="border-warning/20">
                  <CardHeader>
                    <CardDescription>Warning</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
                      {safeStats.warningItems}
                    </CardTitle>
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="outline"
                        className="border-warning/20 bg-warning/10 text-warning"
                      >
                        <IconTrendingDown
                          aria-hidden="true"
                          className="mr-1 size-3.5"
                        />
                        Warning
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>

                <Card data-slot="card" className="border-destructive/20">
                  <CardHeader>
                    <CardDescription>Expired</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums sm:text-3xl">
                      {safeStats.expiredItems}
                    </CardTitle>
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="outline"
                        className="border-destructive/20 bg-destructive/10 text-destructive"
                      >
                        <IconTrendingDown
                          aria-hidden="true"
                          className="mr-1 size-3.5"
                        />
                        Expired
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </CardFooter>
          )}
        </>
      ) : (
        <CardContent className="pt-4">
          <Empty className="max-w-none border-none p-0">
            <EmptyHeader>
              <EmptyTitle>No pantry data yet</EmptyTitle>
              <EmptyDescription>
                Add pantry items to see freshness, warnings, and expired counts.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      )}
    </Card>
  )
}
