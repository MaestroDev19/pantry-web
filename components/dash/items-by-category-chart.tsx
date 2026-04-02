"use client"

import * as React from "react"
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
import { ShoppingBag } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import { useMyPantryItems } from "@/lib/hooks/use-my-pantry-items"
import {
  CATEGORY_OPTIONS,
  getCategoryDisplay,
  getCategoryLabel,
} from "@/lib/types/shoppingtypes"
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
  value: {
    label: "Items",
    color: "var(--primary)",
  },
} satisfies ChartConfig

type CategoryChartRow = {
  key: CategoryChartKey
  name: string
  value: number
  fill: string
}

export function ItemsByCategoryCard() {
  const { items, isLoading, error } = useMyPantryItems()
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
      const normalizedCategory = getCategoryLabel(item.category) as CategoryEnum
      const key = CATEGORY_ENUM_TO_KEY[normalizedCategory]
      const qty =
        typeof item.quantity === "number" && Number.isFinite(item.quantity)
          ? item.quantity
          : 1
      totals[key] += qty > 0 ? qty : 1
    }

    return totals
  }, [items])

  const grandTotal = React.useMemo(() => {
    return Object.values(totalsByKey).reduce((sum, value) => {
      return sum + (Number.isFinite(value) ? value : 0)
    }, 0)
  }, [totalsByKey])

  const hasAny = grandTotal > 0

  const allRows = React.useMemo((): CategoryChartRow[] => {
    return CATEGORY_OPTIONS.map((category, i) => {
      const key = CATEGORY_ENUM_TO_KEY[category.value]
      return {
        key,
        name: getCategoryDisplay(category.value),
        value: totalsByKey[key],
        fill: chartColors[i] ?? "var(--primary)",
      }
    }).filter((row) => row.value > 0)
  }, [totalsByKey])

  const visibleRows = React.useMemo((): CategoryChartRow[] => {
    if (!hasAny) return []
    if (selected === "all") return allRows

    const key = CATEGORY_ENUM_TO_KEY[selected]
    const row = allRows.find((r) => r.key === key)
    return row ? [row] : []
  }, [allRows, hasAny, selected])

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          Items by Category
        </CardTitle>
        <CardDescription>Breakdown of your pantry by category</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Select
          value={selected}
          onValueChange={(v) => setSelected(v as CategoryEnum | "all")}
        >
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
        ) : error ? (
          <Empty className="max-w-none border-none p-0">
            <EmptyHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
              </div>
              <EmptyTitle>Unable to load pantry</EmptyTitle>
              <EmptyDescription>{error.message}</EmptyDescription>
            </EmptyHeader>
          </Empty>
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
          <ChartContainer config={categoryChartConfig} className="h-56 w-full">
            <BarChart
              accessibilityLayer
              data={visibleRows}
              layout="vertical"
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis type="number" hide domain={[0, "dataMax"]} />
              <YAxis dataKey="name" type="category" width={140} />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
                cursor={false}
              />

              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {visibleRows.map((row) => (
                  <Cell key={row.key} fill={row.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
