"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { updatePantryItem } from "@/lib/api/pantry"
import type { CategoryEnum, PantryItem } from "@/lib/types/pantrytypes"
import {
  CATEGORY_OPTIONS,
  getCategoryLabel,
  normalizeCategory,
} from "@/lib/types/shoppingtypes"

function formatExpiryForInput(value: string | null | undefined): string {
  if (value == null || String(value).trim() === "") return ""
  const raw = String(value).trim()
  return raw.includes("T") ? raw.slice(0, 10) : raw
}

export function EditPantryItemDialog({
  item,
  open,
  onOpenChange,
  onItemUpdated,
}: {
  item: PantryItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onItemUpdated?: () => void | Promise<void>
}) {
  const [name, setName] = React.useState(item.name)
  const [category, setCategory] = React.useState<CategoryEnum>(
    normalizeCategory(item.category)
  )
  const [quantity, setQuantity] = React.useState(
    item.quantity != null && item.quantity > 0 ? item.quantity : 1
  )
  const [expiryDate, setExpiryDate] = React.useState(
    formatExpiryForInput(item.expiry_date)
  )
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setName(item.name)
    setCategory(normalizeCategory(item.category))
    setQuantity(item.quantity != null && item.quantity > 0 ? item.quantity : 1)
    setExpiryDate(formatExpiryForInput(item.expiry_date))
  }, [item, open])

  const handleSave = React.useCallback(async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      toast.error("Name is required")
      return
    }

    setSaving(true)
    try {
      const res = await updatePantryItem(item.id, {
        name: trimmedName,
        category,
        quantity,
        expiry_date: expiryDate.trim() || null,
      })

      if (!res.ok) {
        const detail =
          res.data &&
          typeof res.data === "object" &&
          "detail" in res.data &&
          typeof (res.data as { detail: unknown }).detail === "string"
            ? (res.data as { detail: string }).detail
            : null
        toast.error(detail ?? `Could not update item (${res.status})`)
        return
      }

      toast.success(`Updated ${trimmedName}`)
      onOpenChange(false)
      await onItemUpdated?.()
    } catch (error: unknown) {
      const err = error as Error
      toast.error(err.message || "Could not update item")
    } finally {
      setSaving(false)
    }
  }, [category, expiryDate, item.id, name, onItemUpdated, onOpenChange, quantity])

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && saving) return
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit pantry item</DialogTitle>
          <DialogDescription>
            Update name, category, quantity, or expiry for this item.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="edit-pantry-name">Item name</Label>
            <Input
              id="edit-pantry-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={saving}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-pantry-quantity">Quantity</Label>
              <Input
                id="edit-pantry-quantity"
                type="number"
                min={0.1}
                step={0.1}
                value={String(quantity)}
                onChange={(event) => {
                  const next = Number.parseFloat(event.target.value)
                  setQuantity(Number.isFinite(next) && next > 0 ? next : 1)
                }}
                disabled={saving}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-pantry-category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(getCategoryLabel(value) as CategoryEnum)
                }}
                disabled={saving}
              >
                <SelectTrigger id="edit-pantry-category" className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.emoji} {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-pantry-expiry">Expiry date</Label>
            <Input
              id="edit-pantry-expiry"
              type="date"
              value={expiryDate}
              onChange={(event) => setExpiryDate(event.target.value)}
              disabled={saving}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="button" onClick={() => void handleSave()} disabled={saving}>
            {saving ? (
              <>
                <Spinner data-icon="inline-start" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
