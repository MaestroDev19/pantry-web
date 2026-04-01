"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { PantryItem } from "@/lib/types/pantrytypes"
import { getCategoryDisplay, getCategoryLabel } from "@/lib/types/shoppingtypes"
import { getPantryExpiryKind } from "@/lib/utils/pantry-expiry"
import { cn } from "@/lib/utils"

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

export const pantryColumns: ColumnDef<PantryItem>[] = [
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
      const q = row.quantity
      const u = row.unit
      if (q == null && (u == null || u === "")) return ""
      return `${q ?? "—"} ${u ?? ""}`.trim()
    },
    header: "Quantity",
    cell: ({ row }) => {
      const q = row.original.quantity
      const u = row.original.unit
      return (
        <span className="text-muted-foreground tabular-nums">
          {q != null ? String(q) : "—"}
          {u ? ` ${String(u)}` : ""}
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
      return (
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
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const ownerNameColumn: ColumnDef<PantryItem> = {
  id: "owner_name",
  accessorFn: (row) => (row.owner_name ?? "").trim(),
  header: "Owner",
  cell: ({ row }) => (
    <span className="text-muted-foreground max-w-[140px] truncate">
      {row.original.owner_name?.trim() ? row.original.owner_name.trim() : "—"}
    </span>
  ),
}

/** Household tab: includes owner display name from API. */
export const pantryHouseholdColumns: ColumnDef<PantryItem>[] = [
  ...pantryColumns.slice(0, 2),
  ownerNameColumn,
  ...pantryColumns.slice(2),
]
