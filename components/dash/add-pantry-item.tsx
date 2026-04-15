"use client"

import * as React from "react"
import { useSWRConfig } from "swr"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { Plus, Trash2, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { addItemSchema } from "@/lib/validations/pantry"
import type {
  CategoryEnum,
  PantryItemInsert,
} from "@/lib/types/pantrytypes"
import { CATEGORY_OPTIONS } from "@/lib/types/shoppingtypes"
import { addBulkPantryItems, addPantryItem } from "@/lib/api/pantry"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { useRouter } from "next/navigation"
import { MY_PANTRY_ITEMS_SWR_KEY } from "@/lib/hooks/use-my-pantry-items"
import { BulkAddPantryItemsForm } from "@/components/dash/bulk-add-pantry-items"

type MobileWizardStep = "choose" | "single" | "bulk_import" | "bulk_review"

type BulkRow = {
  id: string
  name: string
  category: CategoryEnum
  quantity: number
  expiry_date: string
}

type RowError = Partial<Record<keyof Omit<BulkRow, "id">, string>>

const DEFAULT_BULK_CATEGORY = "Produce" as CategoryEnum
const DEFAULT_BULK_QUANTITY = 1

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

function newBulkRow(partial?: Partial<BulkRow>): BulkRow {
  return {
    id: crypto.randomUUID(),
    name: "",
    category: DEFAULT_BULK_CATEGORY,
    quantity: DEFAULT_BULK_QUANTITY,
    expiry_date: "",
    ...partial,
  }
}

function parsePasteLines(text: string): BulkRow[] {
  const lines = text
    .split(/\r?\n/g)
    .map((l) => l.trim())
    .filter(Boolean)

  const out: BulkRow[] = []
  for (const line of lines) {
    const parts = line
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)

    const name = parts[0] ?? ""
    const qtyRaw = parts[1]
    const categoryRaw = parts[2]

    const quantity = qtyRaw ? Number.parseFloat(qtyRaw) : DEFAULT_BULK_QUANTITY
    const category = categoryRaw
      ? parseCategoryToken(categoryRaw) ?? DEFAULT_BULK_CATEGORY
      : DEFAULT_BULK_CATEGORY

    out.push(
      newBulkRow({
        name,
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : DEFAULT_BULK_QUANTITY,
        category,
      }),
    )
  }

  return out
}

function validateRows(rows: BulkRow[]): {
  rowErrors: Record<string, RowError>
  firstInvalidRowId?: string
} {
  const errors: Record<string, RowError> = {}

  for (const row of rows) {
    const rowError: RowError = {}
    const name = row.name.trim()
    if (!name) rowError.name = "Name is required"
    if (!row.category) rowError.category = "Category is required"
    if (!Number.isFinite(row.quantity) || row.quantity <= 0) rowError.quantity = "Quantity must be > 0"
    if (Object.keys(rowError).length > 0) errors[row.id] = rowError
  }

  return {
    rowErrors: errors,
    firstInvalidRowId: Object.keys(errors)[0],
  }
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

function buildInsertPayload(values: {
  name: string
  category: CategoryEnum
  quantity: number
  expiry_date: string | undefined
  expiry_visible: boolean
}): PantryItemInsert {
  const trimmedName = values.name.trim()
  const expiry =
    values.expiry_date && values.expiry_date.trim()
      ? values.expiry_date.trim()
      : null

  const payload: PantryItemInsert = {
    name: trimmedName,
    category: values.category,
    quantity: values.quantity,
    expiry_visible: values.expiry_visible,
  }
  if (expiry) payload.expiry_date = expiry

  return payload
}

function useAddPantryItemMobileWizard(opts: {
  defaultTab: "single" | "bulk"
  onItemAdded?: () => void
  onClose: () => void
}) {
  const router = useRouter()
  const { mutate } = useSWRConfig()

  const [step, setStep] = React.useState<MobileWizardStep>(() =>
    opts.defaultTab === "bulk" ? "bulk_import" : "choose",
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [paste, setPaste] = React.useState("")
  const [rows, setRows] = React.useState<BulkRow[]>(() => [newBulkRow()])
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null)
  const [rowErrors, setRowErrors] = React.useState<Record<string, RowError>>({})

  const rowRefs = React.useRef<Record<string, HTMLDivElement | null>>({})

  const close = React.useCallback(() => {
    opts.onClose()
  }, [opts])

  const resetBulk = React.useCallback(() => {
    setPaste("")
    setRows([newBulkRow()])
    setExpandedRowId(null)
    setRowErrors({})
  }, [])

  const importToRows = React.useCallback(() => {
    const imported = parsePasteLines(paste)
    if (imported.length === 0) {
      toast.error("Paste at least one line to import.")
      return
    }

    resetBulk()
    setRows(imported)
    setExpandedRowId(imported[0]?.id ?? null)
    setStep("bulk_review")
    toast.success(`Created ${imported.length} item${imported.length === 1 ? "" : "s"}`)
  }, [paste, resetBulk])

  const addRow = React.useCallback(() => {
    setRows((prev) => [...prev, newBulkRow()])
  }, [])

  const removeRow = React.useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
    setRowErrors((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setExpandedRowId((prev) => (prev === id ? null : prev))
  }, [])

  const updateRow = React.useCallback((id: string, patch: Partial<Omit<BulkRow, "id">>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    setRowErrors((prev) => {
      if (!prev[id]) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const submitBulk = React.useCallback(async () => {
    const { rowErrors: nextErrors, firstInvalidRowId } = validateRows(rows)
    setRowErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const targetId = firstInvalidRowId ?? null
      setExpandedRowId(targetId)
      if (targetId) {
        queueMicrotask(() => {
          rowRefs.current[targetId]?.scrollIntoView({ block: "start", behavior: "smooth" })
        })
      }
      toast.error("Fix the highlighted items before submitting.")
      return
    }

    try {
      setIsSubmitting(true)
      const res = await addBulkPantryItems(rowsToApi(rows))
      if (!res.ok) {
        toast.error(
          typeof res.data === "object" && res.data && "detail" in res.data
            ? String((res.data as { detail?: unknown }).detail)
            : "Failed to add items",
        )
        return
      }

      toast.success(`Added ${rows.length} item${rows.length === 1 ? "" : "s"} to pantry`)
      opts.onItemAdded?.()
      close()
      void mutate(MY_PANTRY_ITEMS_SWR_KEY)
      router.refresh()
    } catch (error: unknown) {
      const err = error as Error
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }, [close, mutate, opts, router, rows])

  const footer = (() => {
    if (step === "choose") return null

    if (step === "single") {
      return (
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep("choose")}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button type="button" variant="ghost" onClick={close} disabled={isSubmitting}>
            Close
          </Button>
        </div>
      )
    }

    if (step === "bulk_import") {
      return (
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep("choose")}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button type="button" onClick={importToRows} disabled={isSubmitting}>
            <Wand2 data-icon="inline-start" />
            Create items
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep("bulk_import")}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button type="button" onClick={submitBulk} disabled={isSubmitting}>
          {isSubmitting && <Spinner data-icon="inline-start" />}
          Add {rows.length} item{rows.length === 1 ? "" : "s"}
        </Button>
      </div>
    )
  })()

  const body = (() => {
    if (step === "choose") {
      return (
        <div className="flex flex-col gap-3">
          <div className="text-sm text-muted-foreground">
            Choose how you want to add items.
          </div>
          <div className="grid gap-2">
            <Button
              type="button"
              className="h-auto justify-start py-3"
              variant="secondary"
              onClick={() => setStep("single")}
            >
              <span className="flex flex-col items-start">
                <span className="font-medium">Single item</span>
                <span className="text-xs text-muted-foreground">Quick add with full details.</span>
              </span>
            </Button>
            <Button
              type="button"
              className="h-auto justify-start py-3"
              onClick={() => setStep("bulk_import")}
            >
              <span className="flex flex-col items-start">
                <span className="font-medium">Bulk add</span>
                <span className="text-xs text-muted-foreground">Paste a list, then review.</span>
              </span>
            </Button>
          </div>
        </div>
      )
    }

    if (step === "single") {
      return (
        <div className="flex flex-col gap-3">
          <AddPantryItemForm onSuccess={close} onItemAdded={opts.onItemAdded} />
        </div>
      )
    }

    if (step === "bulk_import") {
      return (
        <div className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Paste items</FieldLabel>
              <Textarea
                value={paste}
                onChange={(e) => setPaste(e.target.value)}
                placeholder={[
                  "Examples:",
                  "Milk",
                  "Orange juice, 2",
                  "Bread, 1, grains",
                ].join("\n")}
                disabled={isSubmitting}
              />
              <FieldDescription>
                One item per line. Optional CSV:{" "}
                <span className="font-medium">name, quantity, category</span>.
              </FieldDescription>
            </Field>
          </FieldGroup>
          <Separator />
          <div className="flex flex-col gap-2">
            <Button type="button" variant="secondary" onClick={importToRows} disabled={isSubmitting}>
              <Wand2 data-icon="inline-start" />
              Create items
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                resetBulk()
                setStep("bulk_review")
              }}
              disabled={isSubmitting}
            >
              Continue without paste
            </Button>
          </div>
        </div>
      )
    }

    const invalidCount = Object.keys(rowErrors).length

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium">Review items</div>
          <Button type="button" variant="ghost" onClick={addRow} disabled={isSubmitting}>
            <Plus data-icon="inline-start" />
            Add row
          </Button>
        </div>

        {invalidCount > 0 ? (
          <div className="text-sm text-destructive">
            {invalidCount} item{invalidCount === 1 ? "" : "s"} need attention.
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          {rows.map((row, index) => {
            const err = rowErrors[row.id]
            const isExpanded = expandedRowId === row.id
            const hasError = Boolean(err && Object.keys(err).length > 0)

            const summaryName = row.name.trim() || "Untitled item"
            const summaryQty = Number.isFinite(row.quantity) ? row.quantity : DEFAULT_BULK_QUANTITY
            const summaryCategory = row.category

            return (
              <div
                key={row.id}
                ref={(el) => {
                  rowRefs.current[row.id] = el
                }}
                className="rounded-lg border border-border bg-card"
                data-invalid={hasError}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
                  onClick={() => setExpandedRowId((prev) => (prev === row.id ? null : row.id))}
                  disabled={isSubmitting}
                >
                  <div className="flex min-w-0 flex-col">
                    <div className="truncate text-sm font-medium">{summaryName}</div>
                    <div className="text-xs text-muted-foreground">
                      Qty {summaryQty} • {summaryCategory} • Row {index + 1}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{isExpanded ? "Hide" : "Edit"}</div>
                </button>

                {isExpanded ? (
                  <div className="border-t border-border px-3 pb-3 pt-2">
                    <div className="grid grid-cols-1 gap-2">
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

                      <div className="grid grid-cols-2 gap-2">
                        <Field data-invalid={Boolean(err?.quantity)}>
                          <FieldLabel>Qty</FieldLabel>
                          <Input
                            type="number"
                            min={0.1}
                            step={0.1}
                            value={
                              Number.isFinite(row.quantity)
                                ? String(row.quantity)
                                : String(DEFAULT_BULK_QUANTITY)
                            }
                            onChange={(e) => {
                              const next = Number.parseFloat(e.target.value)
                              updateRow(row.id, {
                                quantity: Number.isFinite(next) && next > 0 ? next : DEFAULT_BULK_QUANTITY,
                              })
                            }}
                            disabled={isSubmitting}
                            aria-invalid={Boolean(err?.quantity)}
                          />
                          {err?.quantity ? (
                            <div className="mt-1 text-xs text-destructive">{err.quantity}</div>
                          ) : null}
                        </Field>

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
                                  <SelectItem key={o.value} value={o.value}>
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

                      <Field>
                        <FieldLabel>Expiry</FieldLabel>
                        <Input
                          type="date"
                          value={row.expiry_date}
                          onChange={(e) => updateRow(row.id, { expiry_date: e.target.value })}
                          disabled={isSubmitting}
                        />
                      </Field>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeRow(row.id)}
                        disabled={isSubmitting || rows.length === 1}
                        className="justify-start"
                      >
                        <Trash2 data-icon="inline-start" />
                        Remove row
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    )
  })()

  return { body, footer } as const
}

function AddPantryItemForm({
  onSuccess,
  onItemAdded,
}: {
  onSuccess: () => void
  onItemAdded?: () => void
}) {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm({
    defaultValues: {
      name: "",
      category: "Produce" as CategoryEnum,
      quantity: 1,
      expiry_date: "",
      expiry_visible: false,
    },
    validators: {
      onSubmit: addItemSchema,
    },
    onSubmit: async ({ value }) => {
      const trimmedName = value.name.trim()
      if (!trimmedName) {
        toast.error("Name is required")
        return
      }

      try {
        setIsSubmitting(true)
        const payload = buildInsertPayload({
          name: trimmedName,
          category: value.category,
          quantity: value.quantity,
          expiry_date:
            typeof value.expiry_date === "string" ? value.expiry_date : undefined,
          expiry_visible: value.expiry_visible,
        })

        const res = await addPantryItem(payload)
        if (!res.ok) {
          toast.error(
            typeof res.data === "object" && res.data && "detail" in res.data
              ? String((res.data as { detail?: unknown }).detail)
              : "Failed to add item"
          )
          return
        }

        toast.success("Item added to pantry")
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
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Item name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder='e.g. "Orange juice"'
                  autoComplete="off"
                  aria-invalid={isInvalid}
                  disabled={isSubmitting}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="quantity">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Quantity</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={Number.isFinite(field.state.value) ? String(field.state.value) : "1"}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const next = Number.parseFloat(e.target.value)
                    field.handleChange(Number.isFinite(next) && next > 0 ? next : 1)
                  }}
                  aria-invalid={isInvalid}
                  disabled={isSubmitting}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="category">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value as CategoryEnum)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent align="start" position="popper" side="bottom">
                    <SelectGroup>
                      {CATEGORY_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.emoji} {o.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="expiry_date">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Expiry date</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={String(field.state.value ?? "")}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  disabled={isSubmitting}
                />
                <FieldDescription>Optional. Helps Pantry Health track freshness.</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner data-icon="inline-start" />}
            Add item
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export function AddPantryItem({
  triggerLabel = "Add item",
  onItemAdded,
  defaultTab = "single",
}: {
  triggerLabel?: string
  onItemAdded?: () => void
  defaultTab?: "single" | "bulk"
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const [open, setOpen] = React.useState(false)

  const onSuccess = React.useCallback(() => {
    setOpen(false)
  }, [])

  const wizard = useAddPantryItemMobileWizard({
    defaultTab,
    onItemAdded,
    onClose: onSuccess,
  })

  const trigger = (
    <Button>
      <Plus data-icon="inline-start" />
      {triggerLabel}
    </Button>
  )

  const content = (
    <Tabs defaultValue={defaultTab} className="gap-4">
      <TabsList>
        <TabsTrigger value="single">Single item</TabsTrigger>
        <TabsTrigger value="bulk">Bulk add</TabsTrigger>
      </TabsList>
      <TabsContent value="single" className="mt-2">
        <AddPantryItemForm onSuccess={onSuccess} onItemAdded={onItemAdded} />
      </TabsContent>
      <TabsContent value="bulk" className="mt-2">
        <BulkAddPantryItemsForm onSuccess={onSuccess} onItemAdded={onItemAdded} />
      </TabsContent>
    </Tabs>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add pantry item</DialogTitle>
            <DialogDescription>
              Add an inventory item to your household pantry.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-2">
            {content}
          </ScrollArea>
          <DialogFooter />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add pantry item</DrawerTitle>
          <DrawerDescription>
            Add an inventory item to your household pantry.
          </DrawerDescription>
        </DrawerHeader>
        <>
          <ScrollArea className="min-h-0 flex-1 px-4 pb-2">
            {wizard.body}
          </ScrollArea>
          <DrawerFooter className="border-t border-border bg-background/80 supports-backdrop-filter:bg-background/60 supports-backdrop-filter:backdrop-blur">
            {wizard.footer}
          </DrawerFooter>
        </>
      </DrawerContent>
    </Drawer>
  )
}

