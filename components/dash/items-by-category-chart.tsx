"use client"

import * as React from "react"
import { ShoppingBasketIcon } from "lucide-react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { type PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CategoryData {
  category: string;
  label: string;
  items: number;
  fill: string;
}

const categoryData: CategoryData[] = [  

]

const chartConfig = {
  items: {
    label: "Items",
  },
  produce: {
    label: "Produce",
    color: "var(--chart-1)",
  },
  "dairy-eggs": {
    label: "Dairy & Eggs",
    color: "var(--chart-2)",
  },
  "meat-seafood": {
    label: "Meat & Seafood",
    color: "var(--chart-3)",
  },
  "bread-grains": {
    label: "Bread & Grains",
    color: "var(--chart-4)",
  },
  pantry: {
    label: "Pantry",
    color: "var(--chart-5)",
  },
  frozen: {
    label: "Frozen",
    color: "var(--chart-6)",
  },
  "snacks-beverages": {
    label: "Snacks & Beverages",
    color: "var(--chart-7)",
  },
  other: {
    label: "Other",
    color: "var(--chart-8)",
  },
} satisfies ChartConfig

export function ItemsByCategoryChart({
  data = categoryData,
}: {
  data?: typeof categoryData;
}) {
  const id = "pie-category"
  const totalItems = React.useMemo(
    () => data.reduce((sum, item) => sum + item.items, 0),
    [data]
  )
  const [activeCategory, setActiveCategory] = React.useState(data[0]?.category)

  const activeIndex = React.useMemo(
    () => data.findIndex((item) => item.category === activeCategory),
    [data, activeCategory]
  )

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Items by Category</CardTitle>
          <CardDescription>Breakdown of your pantry by category</CardDescription>
        </div>
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger
            className="ml-auto h-7 w-[175px] rounded-lg pl-2.5"
            aria-label="Select a category"
          >
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {data.map(({ category }) => {
              const config = chartConfig[category as keyof typeof chartConfig]
              if (!config) return null

              return (
                <SelectItem
                  key={category}
                  value={category}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex size-3 shrink-0 rounded-xs"
                      style={{ backgroundColor: `var(--color-${category})` }}
                    />
                    {config.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        {totalItems === 0 ? (
          <div className="flex w-full items-center justify-center p-6 pb-12">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShoppingBasketIcon />
                </EmptyMedia>
                <EmptyTitle>No items found</EmptyTitle>
                <EmptyDescription>
                  Your pantry is empty. Add items to see the breakdown.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="items"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const active = data[activeIndex]
                      if (!active) return null
                      
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {active.items.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-xs"
                          >
                            of {totalItems} items
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
