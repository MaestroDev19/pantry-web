"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { deletePantryItem } from "@/lib/api/pantry"
import { EditPantryItemDialog } from "@/components/dash/edit-pantry-item-dialog"
import type { PantryItem } from "@/lib/types/pantrytypes"
import { getCategoryDisplay, getCategoryLabel } from "@/lib/types/shoppingtypes"
import { getPantryExpiryKind } from "@/lib/utils/pantry-expiry"
import { cn } from "@/lib/utils"

export interface PantryColumnsOptions {
  /** Called after a successful delete or update so lists can refresh. */
  onItemDeleted?: () => void | Promise<void>
  onItemUpdated?: () => void | Promise<void>
  /** When set, delete is only offered for rows owned by this user. */
  currentUserId?: string | null
}

function ExpiryBadge({ date }: { date: string | null }) {
  if (date == null || String(date).trim() === "") {
    return <span className="text-muted-foreground tabular-nums">—</span>
  }
  const kind = getPantryExpiryKind(date)
  const label = String(date)
  if (kind === "expired") {
    return (
      <Badge variant="destructive" className="tabular-nums">
        {label}
      </Badge>
    )
  }
  if (kind === "soon") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "border-warning/40 bg-warning/15 text-foreground tabular-nums"
        )}
      >
        {label}
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className="tabular-nums">
      {label}
    </Badge>
  )
}

function PantryItemActionsCell({
  item,
  canMutate,
  onItemDeleted,
  onItemUpdated,
}: {
  item: PantryItem
  canMutate: boolean
  onItemDeleted?: () => void | Promise<void>
  onItemUpdated?: () => void | Promise<void>
}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const handleDelete = React.useCallback(async () => {
    setDeleting(true)
    try {
      const res = await deletePantryItem(item.id)
      if (!res.ok) {
        const detail =
          res.data &&
          typeof res.data === "object" &&
          "detail" in res.data &&
          typeof (res.data as { detail: unknown }).detail === "string"
            ? (res.data as { detail: string }).detail
            : null
        toast.error(detail ?? `Could not remove item (${res.status})`)
        return
      }
      toast.success(`Removed ${item.name}`)
      setConfirmOpen(false)
      await onItemDeleted?.()
    } catch (error: unknown) {
      const err = error as Error
      toast.error(err.message || "Could not remove item")
    } finally {
      setDeleting(false)
    }
  }, [item.id, item.name, onItemDeleted])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="h-8 w-8">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              void navigator.clipboard.writeText(item.name)
              toast.success("Copied item name")
            }}
          >
            Copy name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              void navigator.clipboard.writeText(item.id)
              toast.success("Copied item id")
            }}
          >
            Copy id
          </DropdownMenuItem>
          {canMutate ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault()
                  setEditOpen(true)
                }}
              >
                <Pencil data-icon="inline-start" />
                Edit item
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(event) => {
                  event.preventDefault()
                  setConfirmOpen(true)
                }}
              >
                <Trash2 data-icon="inline-start" />
                Remove item
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {canMutate ? (
        <>
          <EditPantryItemDialog
            item={item}
            open={editOpen}
            onOpenChange={setEditOpen}
            onItemUpdated={onItemUpdated ?? onItemDeleted}
          />
          <AlertDialog
          open={confirmOpen}
          onOpenChange={(next) => {
            if (!next && deleting) return
            setConfirmOpen(next)
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove pantry item?</AlertDialogTitle>
              <AlertDialogDescription>
                <span className="font-medium text-foreground">{item.name}</span>{" "}
                will be removed from your pantry. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={deleting}
                onClick={(event) => {
                  event.preventDefault()
                  void handleDelete()
                }}
              >
                {deleting ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Removing…
                  </>
                ) : (
                  "Remove"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </>
      ) : null}
    </>
  )
}

function createBasePantryColumns(
  options: PantryColumnsOptions = {}
): ColumnDef<PantryItem>[] {
  const { onItemDeleted, onItemUpdated, currentUserId } = options

  return [
    {
      accessorKey: "name",
      filterFn: (row, _id, value) => {
        const q = String(value ?? "")
          .toLowerCase()
          .trim()
        if (!q) return true
        const name = String(row.original.name ?? "").toLowerCase()
        const cat = getCategoryLabel(row.original.category).toLowerCase()
        return name.includes(q) || cat.includes(q)
      },
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ms-2 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[220px] truncate font-medium">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ms-2 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {getCategoryDisplay(row.original.category)}
        </span>
      ),
    },
    {
      id: "amount",
      accessorFn: (row) => {
        return row.quantity ?? null
      },
      header: "Quantity",
      cell: ({ row }) => {
        const q = row.original.quantity
        return (
          <span className="text-muted-foreground tabular-nums">
            {q != null ? String(q) : "—"}
          </span>
        )
      },
    },
    {
      id: "expiry_sort",
      accessorFn: (row) => {
        const s = row.expiry_date
        if (s == null || String(s).trim() === "") return null
        const t = Date.parse(
          String(s).includes("T") ? String(s) : `${s}T12:00:00`
        )
        return Number.isFinite(t) ? t : null
      },
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ms-2 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expiry
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      ),
      cell: ({ row }) => <ExpiryBadge date={row.original.expiry_date} />,
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as number | null
        const b = rowB.getValue(columnId) as number | null
        if (a == null && b == null) return 0
        if (a == null) return 1
        if (b == null) return -1
        return a - b
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original
        const canMutate =
          (onItemDeleted != null || onItemUpdated != null) &&
          (currentUserId == null || item.owner_id === currentUserId)

        return (
          <PantryItemActionsCell
            item={item}
            canMutate={canMutate}
            onItemDeleted={onItemDeleted}
            onItemUpdated={onItemUpdated}
          />
        )
      },
    },
  ]
}

export function createPantryColumns(
  options: PantryColumnsOptions = {}
): ColumnDef<PantryItem>[] {
  return createBasePantryColumns(options)
}

export const pantryColumns: ColumnDef<PantryItem>[] = createBasePantryColumns()

const ownerNameColumn: ColumnDef<PantryItem> = {
  id: "owner_name",
  accessorFn: (row) => (row.owner_name ?? "").trim(),
  header: "Owner",
  cell: ({ row }) => (
    <div className="max-w-[min(100%,16rem)] whitespace-normal wrap-break-word text-muted-foreground">
      {row.original.owner_name?.trim() ? row.original.owner_name.trim() : "—"}
    </div>
  ),
}

/** Household tab: includes owner display name from API. */
export function createPantryHouseholdColumns(
  options: PantryColumnsOptions = {}
): ColumnDef<PantryItem>[] {
  const base = createBasePantryColumns(options)
  return [...base.slice(0, 2), ownerNameColumn, ...base.slice(2)]
}

export const pantryHouseholdColumns: ColumnDef<PantryItem>[] =
  createPantryHouseholdColumns()
