"use client"

import * as React from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ShoppingBag } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { useMyPantryItems } from "@/lib/hooks/use-my-pantry-items"
import { CATEGORY_OPTIONS, getCategoryDisplay } from "@/lib/types/shoppingtypes"
import type { CategoryEnum } from "@/lib/types/pantrytypes"

type CategoryChartKey =
  | "dairy"
  | "produce"
  | "meat_seafood"
  | "grains_pasta"
  | "canned_goods"
  | "frozen"
  | "snacks"
  | "beverages"
  | "condiments_oils"
  | "baking"
  | "other"

const CATEGORY_ENUM_TO_KEY: Record<CategoryEnum, CategoryChartKey> = {
  Dairy: "dairy",
  Produce: "produce",
  "Meat & Seafood": "meat_seafood",
  "Grains & Pasta": "grains_pasta",
  "Canned Goods": "canned_goods",
  Frozen: "frozen",
  Snacks: "snacks",
  Beverages: "beverages",
  "Condiments & Oils": "condiments_oils",
  Baking: "baking",
  Other: "other",
}

const CATEGORY_KEYS_IN_ORDER: CategoryChartKey[] = [
  "dairy",
  "produce",
  "meat_seafood",
  "grains_pasta",
  "canned_goods",
  "frozen",
  "snacks",
  "beverages",
  "condiments_oils",
  "baking",
  "other",
]

const chartColors: string[] = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--primary)",
  "var(--warning)",
  "var(--destructive)",
]

const categoryChartConfig = {
  dairy: { label: getCategoryDisplay("Dairy"), color: chartColors[0] },
  produce: { label: getCategoryDisplay("Produce"), color: chartColors[1] },
  meat_seafood: {
    label: getCategoryDisplay("Meat & Seafood"),
    color: chartColors[2],
  },
  grains_pasta: {
    label: getCategoryDisplay("Grains & Pasta"),
    color: chartColors[3],
  },
  canned_goods: {
    label: getCategoryDisplay("Canned Goods"),
    color: chartColors[4],
  },
  frozen: { label: getCategoryDisplay("Frozen"), color: chartColors[5] },
  snacks: { label: getCategoryDisplay("Snacks"), color: chartColors[6] },
  beverages: { label: getCategoryDisplay("Beverages"), color: chartColors[7] },
  condiments_oils: {
    label: getCategoryDisplay("Condiments & Oils"),
    color: chartColors[8],
  },
  baking: { label: getCategoryDisplay("Baking"), color: chartColors[9] },
  other: { label: getCategoryDisplay("Other"), color: chartColors[10] },
} satisfies ChartConfig

export function ItemsByCategoryCard() {
  const { items, isLoading } = useMyPantryItems()
  const [selected, setSelected] = React.useState<"all" | CategoryEnum>("all")

  const totalsByKey = React.useMemo(() => {
    const totals: Record<CategoryChartKey, number> = {
      dairy: 0,
      produce: 0,
      meat_seafood: 0,
      grains_pasta: 0,
      canned_goods: 0,
      frozen: 0,
      snacks: 0,
      beverages: 0,
      condiments_oils: 0,
      baking: 0,
      other: 0,
    }

    for (const item of items) {
      const key = CATEGORY_ENUM_TO_KEY[item.category]
      const qty =
        typeof item.quantity === "number" && Number.isFinite(item.quantity)
          ? item.quantity
          : 1
      totals[key] += qty > 0 ? qty : 1
    }

    return totals
  }, [items])

  const grandTotal = React.useMemo(() => {
    return CATEGORY_KEYS_IN_ORDER.reduce((sum, key) => sum + totalsByKey[key], 0)
  }, [totalsByKey])

  const hasAny = grandTotal > 0

  const chartData = React.useMemo(() => {
    if (!hasAny) return []

    if (selected === "all") {
      return [
        {
          name: "My Pantry",
          ...Object.fromEntries(
            CATEGORY_KEYS_IN_ORDER.map((key) => [key, totalsByKey[key]]),
          ),
        },
      ]
    }

    const key = CATEGORY_ENUM_TO_KEY[selected]
    return [
      {
        name: getCategoryDisplay(selected),
        [key]: totalsByKey[key],
      },
    ]
  }, [hasAny, selected, totalsByKey])

  const selectedKey = selected === "all" ? null : CATEGORY_ENUM_TO_KEY[selected]

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Items by Category</CardTitle>
        <CardDescription>Breakdown of your pantry by category</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Select value={selected} onValueChange={(v) => setSelected(v as CategoryEnum | "all")}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORY_OPTIONS.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.emoji} {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !hasAny ? (
          <Empty className="max-w-none border-none p-0">
            <EmptyHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
              </div>
              <EmptyTitle>No items found</EmptyTitle>
              <EmptyDescription>
                Your pantry is empty. Add items to see the breakdown.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ChartContainer config={categoryChartConfig} className="h-32 w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis type="number" hide domain={[0, "dataMax"]} />
              <YAxis dataKey="name" type="category" hide />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
                cursor={false}
              />

              {selectedKey ? (
                <Bar
                  dataKey={selectedKey}
                  stackId="a"
                  fill={`var(--color-${selectedKey})`}
                  radius={[4, 0, 0, 4]}
                />
              ) : (
                CATEGORY_KEYS_IN_ORDER.map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={`var(--color-${key})`}
                    radius={[4, 0, 0, 4]}
                  />
                ))
              )}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
