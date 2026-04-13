"use client"

import * as React from "react"
import { useSWRConfig } from "swr"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { Plus } from "lucide-react"

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
import { addPantryItem } from "@/lib/api/pantry"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { useRouter } from "next/navigation"
import { MY_PANTRY_ITEMS_SWR_KEY } from "@/lib/hooks/use-my-pantry-items"
import { BulkAddPantryItemsForm } from "@/components/dash/bulk-add-pantry-items"

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
        <ScrollArea className="flex-1 px-4 pb-2">
          {content}
        </ScrollArea>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  )
}

