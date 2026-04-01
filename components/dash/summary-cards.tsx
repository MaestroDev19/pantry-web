"use client"

import { ShoppingBag, TrendingUp, Package, CheckCircle2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CategorySummary {
  name: string
  count: number
  total: number
  color: string
}

const categories: CategorySummary[] = [
  { name: "Dairy", count: 4, total: 12, color: "bg-primary" },
  { name: "Beverages", count: 2, total: 12, color: "bg-emerald-500" },
  { name: "Produce", count: 3, total: 12, color: "bg-cyan-500" },
  { name: "Bakery", count: 3, total: 12, color: "bg-amber-500" },
]

export function ShoppingSummaryCard() {
  const totalItems = 12
  const checkedItems = 5
  const progress = (checkedItems / totalItems) * 100

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-foreground" />
          <CardTitle className="text-lg font-semibold">Shopping Summary</CardTitle>
        </div>
        <CardDescription>Overview of your shopping trip</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {checkedItems} of {totalItems} items
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span className="text-xs">Total Items</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {totalItems}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs">Checked</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {checkedItems}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">By Category</span>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${category.color}`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {category.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
