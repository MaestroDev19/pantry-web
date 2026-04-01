"use client"

import { ShoppingBag } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categories = [
  { value: "fruits", label: "Fruits" },
  { value: "vegetables", label: "Vegetables" },
  { value: "dairy", label: "Dairy" },
  { value: "meat", label: "Meat" },
  { value: "beverages", label: "Beverages" },
]

export function ItemsByCategoryCard() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          Items by Category
        </CardTitle>
        <CardDescription>Breakdown of your pantry by category</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No items found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your pantry is empty. Add items to see the breakdown.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
