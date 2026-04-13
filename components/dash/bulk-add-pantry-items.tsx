"use client"

import * as React from "react"
import { toast } from "sonner"
import { useSWRConfig } from "swr"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import type { CategoryEnum, PantryItemInsert } from "@/lib/types/pantrytypes"
import { CATEGORY_OPTIONS } from "@/lib/types/shoppingtypes"
import { addBulkPantryItems } from "@/lib/api/pantry"
import { MY_PANTRY_ITEMS_SWR_KEY } from "@/lib/hooks/use-my-pantry-items"

type BulkRow = {
  id: string
  name: string
  category: CategoryEnum
  quantity: number
  expiry_date: string
}

type RowError = Partial<Record<keyof Omit<BulkRow, "id">, string>>

const DEFAULT_CATEGORY = "Produce" as CategoryEnum
const DEFAULT_QUANTITY = 1

const CATEGORY_BY_SLUG: Record<string, CategoryEnum> = {
  dairy: "Dairy",
  produce: "Produce",
  meat: "Meat & Seafood",
  grains: "Grains & Pasta",
  canned: "Canned Goods",
  frozen: "Frozen",
  snacks: "Snacks",
  beverages: "Beverages",
  spices: "Condiments & Oils",
  baking: "Baking",
  other: "Other",
}

function normalizeToken(value: string): string {
  return value.trim().toLowerCase()
}

function parseCategoryToken(value: string): CategoryEnum | null {
  const token = normalizeToken(value)
  if (!token) return null
  const bySlug = CATEGORY_BY_SLUG[token]
  if (bySlug) return bySlug

  const byLabel = CATEGORY_OPTIONS.find((o) => normalizeToken(o.label) === token)?.label
  if (byLabel) return byLabel as CategoryEnum

  const byValue = CATEGORY_OPTIONS.find((o) => normalizeToken(o.value) === token)?.label
  if (byValue) return byValue as CategoryEnum

  return null
}

function newRow(partial?: Partial<BulkRow>): BulkRow {
  return {
    id: crypto.randomUUID(),
    name: "",
    category: DEFAULT_CATEGORY,
    quantity: DEFAULT_QUANTITY,
    expiry_date: "",
    ...partial,
  }
}

function validateRows(rows: BulkRow[]): {
  rowErrors: Record<string, RowError>
  globalError?: string
} {
  if (rows.length === 0) return { rowErrors: {}, globalError: "Add at least one item." }

  const errors: Record<string, RowError> = {}
  for (const row of rows) {
    const rowError: RowError = {}
    const name = row.name.trim()
    if (!name) rowError.name = "Name is required"
    if (!row.category) rowError.category = "Category is required"
    if (!Number.isFinite(row.quantity) || row.quantity <= 0) rowError.quantity = "Quantity must be > 0"
    if (Object.keys(rowError).length > 0) errors[row.id] = rowError
  }

  return { rowErrors: errors }
}

function rowsToApi(rows: BulkRow[]): PantryItemInsert[] {
  return rows.map((row) => {
    const payload: PantryItemInsert = {
      name: row.name.trim(),
      category: row.category,
      quantity: row.quantity,
    }
    const expiry = row.expiry_date.trim()
    if (expiry) payload.expiry_date = expiry
    return payload
  })
}

function parsePasteLines(text: string): BulkRow[] {
  const lines = text
    .split(/\r?\n/g)
    .map((l) => l.trim())
    .filter(Boolean)

  const out: BulkRow[] = []
  for (const line of lines) {
    const parts = line.split(",").map((p) => p.trim()).filter(Boolean)
    const name = parts[0] ?? ""
    const qtyRaw = parts[1]
    const categoryRaw = parts[2]

    const quantity = qtyRaw ? Number.parseFloat(qtyRaw) : DEFAULT_QUANTITY
    const category = categoryRaw ? parseCategoryToken(categoryRaw) ?? DEFAULT_CATEGORY : DEFAULT_CATEGORY

    out.push(
      newRow({
        name,
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : DEFAULT_QUANTITY,
        category,
      })
    )
  }

  return out
}

export function BulkAddPantryItemsForm({
  onSuccess,
  onItemAdded,
}: {
  onSuccess: () => void
  onItemAdded?: () => void
}) {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [rows, setRows] = React.useState<BulkRow[]>(() => [newRow()])
  const [paste, setPaste] = React.useState("")
  const [rowErrors, setRowErrors] = React.useState<Record<string, RowError>>({})
  const [globalError, setGlobalError] = React.useState<string | null>(null)

  const addRow = React.useCallback(() => {
    setRows((prev) => [...prev, newRow()])
  }, [])

  const removeRow = React.useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
    setRowErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const updateRow = React.useCallback(
    (id: string, patch: Partial<Omit<BulkRow, "id">>) => {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
      setRowErrors((prev) => {
        if (!prev[id]) return prev
        const next = { ...prev }
        delete next[id]
        return next
      })
      setGlobalError(null)
    },
    []
  )

  const importPaste = React.useCallback(() => {
    const imported = parsePasteLines(paste)
    if (imported.length === 0) {
      toast.error("Paste at least one line to import.")
      return
    }
    setRows((prev) => {
      const base = prev.length === 1 && !prev[0].name.trim() ? [] : prev
      return [...base, ...imported]
    })
    setPaste("")
    setRowErrors({})
    setGlobalError(null)
    toast.success(`Imported ${imported.length} item${imported.length === 1 ? "" : "s"}`)
  }, [paste])

  const applyCategoryToAll = React.useCallback((category: CategoryEnum) => {
    setRows((prev) => prev.map((r) => ({ ...r, category })))
    setRowErrors({})
    setGlobalError(null)
  }, [])

  const applyQuantityToAll = React.useCallback((quantity: number) => {
    setRows((prev) => prev.map((r) => ({ ...r, quantity })))
    setRowErrors({})
    setGlobalError(null)
  }, [])

  const submit = React.useCallback(async () => {
    const { rowErrors: nextRowErrors, globalError: nextGlobalError } = validateRows(rows)
    setRowErrors(nextRowErrors)
    setGlobalError(nextGlobalError ?? null)

    if (nextGlobalError || Object.keys(nextRowErrors).length > 0) {
      toast.error("Fix the highlighted rows before submitting.")
      return
    }

    try {
      setIsSubmitting(true)
      const res = await addBulkPantryItems(rowsToApi(rows))
      if (!res.ok) {
        toast.error(
          typeof res.data === "object" && res.data && "detail" in res.data
            ? String((res.data as { detail?: unknown }).detail)
            : "Failed to add items"
        )
        return
      }

      toast.success(`Added ${rows.length} item${rows.length === 1 ? "" : "s"} to pantry`)
      onItemAdded?.()
      onSuccess()
      void mutate(MY_PANTRY_ITEMS_SWR_KEY)
      router.refresh()
    } catch (error: unknown) {
      const err = error as Error
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }, [mutate, onItemAdded, onSuccess, router, rows])

  return (
    <div className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Paste/import</FieldLabel>
          <Textarea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder={[
              'Examples:',
              'Milk',
              'Orange juice, 2',
              'Bread, 1, grains',
            ].join("\n")}
            disabled={isSubmitting}
          />
          <FieldDescription>
            One item per line. Optional CSV: <span className="font-medium">name, quantity, category</span>.
          </FieldDescription>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button type="button" variant="secondary" onClick={importPaste} disabled={isSubmitting}>
              <Wand2 data-icon="inline-start" />
              Import to rows
            </Button>
            <Button type="button" variant="ghost" onClick={addRow} disabled={isSubmitting}>
              <Plus data-icon="inline-start" />
              Add row
            </Button>
          </div>
        </Field>
      </FieldGroup>

      <Separator />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-medium">Items</div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={rows[0]?.category ?? DEFAULT_CATEGORY}
              onValueChange={(value) => applyCategoryToAll(value as CategoryEnum)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-9 w-[220px]">
                <SelectValue placeholder="Apply category to all" />
              </SelectTrigger>
              <SelectContent align="end" position="popper" side="bottom">
                <SelectGroup>
                  {CATEGORY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.label}>
                      {o.emoji} {o.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input
              className="h-9 w-[120px]"
              type="number"
              min={0.1}
              step={0.1}
              defaultValue={DEFAULT_QUANTITY}
              disabled={isSubmitting}
              onChange={(e) => {
                const next = Number.parseFloat(e.target.value)
                if (!Number.isFinite(next) || next <= 0) return
                applyQuantityToAll(next)
              }}
            />
          </div>
        </div>

        {globalError ? (
          <div className="text-sm text-destructive">{globalError}</div>
        ) : null}

        <div className="flex flex-col gap-2">
          {rows.map((row, index) => {
            const err = rowErrors[row.id]
            const hasError = Boolean(err && Object.keys(err).length > 0)
            return (
              <div
                key={row.id}
                className="rounded-lg border border-border bg-card p-3"
                data-invalid={hasError}
              >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-end">
                  <div className="sm:col-span-5">
                    <Field data-invalid={Boolean(err?.name)}>
                      <FieldLabel>Item name</FieldLabel>
                      <Input
                        value={row.name}
                        onChange={(e) => updateRow(row.id, { name: e.target.value })}
                        placeholder='e.g. "Orange juice"'
                        disabled={isSubmitting}
                        aria-invalid={Boolean(err?.name)}
                      />
                      {err?.name ? (
                        <div className="mt-1 text-xs text-destructive">{err.name}</div>
                      ) : null}
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Field data-invalid={Boolean(err?.quantity)}>
                      <FieldLabel>Qty</FieldLabel>
                      <Input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={Number.isFinite(row.quantity) ? String(row.quantity) : String(DEFAULT_QUANTITY)}
                        onChange={(e) => {
                          const next = Number.parseFloat(e.target.value)
                          updateRow(row.id, {
                            quantity: Number.isFinite(next) && next > 0 ? next : DEFAULT_QUANTITY,
                          })
                        }}
                        disabled={isSubmitting}
                        aria-invalid={Boolean(err?.quantity)}
                      />
                      {err?.quantity ? (
                        <div className="mt-1 text-xs text-destructive">{err.quantity}</div>
                      ) : null}
                    </Field>
                  </div>

                  <div className="sm:col-span-3">
                    <Field data-invalid={Boolean(err?.category)}>
                      <FieldLabel>Category</FieldLabel>
                      <Select
                        value={row.category}
                        onValueChange={(value) => updateRow(row.id, { category: value as CategoryEnum })}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="w-full" aria-invalid={Boolean(err?.category)}>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent align="start" position="popper" side="bottom">
                          <SelectGroup>
                            {CATEGORY_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.label}>
                                {o.emoji} {o.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {err?.category ? (
                        <div className="mt-1 text-xs text-destructive">{err.category}</div>
                      ) : null}
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Field>
                      <FieldLabel>Expiry</FieldLabel>
                      <Input
                        type="date"
                        value={row.expiry_date}
                        onChange={(e) => updateRow(row.id, { expiry_date: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </Field>
                  </div>

                  <div className="sm:col-span-12 flex items-center justify-between gap-2 pt-2">
                    <div className="text-xs text-muted-foreground">Row {index + 1}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeRow(row.id)}
                      disabled={isSubmitting || rows.length === 1}
                    >
                      <Trash2 data-icon="inline-start" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" onClick={submit} disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          Add {rows.length} item{rows.length === 1 ? "" : "s"}
        </Button>
      </div>
    </div>
  )
}

