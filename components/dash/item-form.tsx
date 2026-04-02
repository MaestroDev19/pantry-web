"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORY_OPTIONS } from "@/lib/types/shoppingtypes"
import { type CategoryEnum } from "@/lib/types/pantrytypes"

type Props = {
  quantity: number
  category: CategoryEnum
  name: string
  onQuantityChange: (v: number) => void
  onCategoryChange: (v: CategoryEnum) => void
  onNameChange: (v: string) => void
  onSubmit?: () => void
}

export function ItemForm({
  quantity,
  category,
  name,
  onQuantityChange,
  onCategoryChange,
  onNameChange,
  onSubmit,
}: Props) {
  return (
    <div className="grid w-full grid-cols-2 items-end gap-2">
      <div className="col-span-2 flex flex-col gap-1">
        <Label
          className="text-xs text-muted-foreground"
          htmlFor="shopping-item-name"
        >
          Item name
        </Label>
        <Input
          id="shopping-item-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder='e.g. "Orange juice"'
          className="h-9"
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSubmit) {
              e.preventDefault()
              onSubmit()
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label
          className="text-xs text-muted-foreground"
          htmlFor="shopping-item-quantity"
        >
          Quantity
        </Label>
        <Input
          id="shopping-item-quantity"
          type="number"
          min={0.1}
          step={0.1}
          value={Number.isFinite(quantity) ? String(quantity) : "1"}
          onChange={(e) => {
            const next = Number.parseFloat(e.target.value)
            onQuantityChange(Number.isFinite(next) && next > 0 ? next : 1)
          }}
          className="h-9"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label
          className="text-xs text-muted-foreground"
          htmlFor="shopping-item-category"
        >
          Category
        </Label>
        <Select
          value={category}
          onValueChange={(value) => {
            const next = CATEGORY_OPTIONS.find((o) => o.value === value)?.value
            onCategoryChange(next ?? "Other")
          }}
        >
          <SelectTrigger id="shopping-item-category" className="h-9 w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent align="start" position="popper" side="bottom">
            {CATEGORY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.emoji} {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
