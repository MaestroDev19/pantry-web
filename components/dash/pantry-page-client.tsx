"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from "@/components/ui/empty"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TypographyH2, TypographyP } from "@/components/ui/typography"
import { AddPantryItem } from "@/components/dash/add-pantry-item"
import { PantryDataTable } from "@/components/dash/pantry-data-table"
import {
  createPantryColumns,
  createPantryHouseholdColumns,
} from "@/components/dash/pantry-columns"
import { useHouseholdPantryItems } from "@/lib/hooks/use-household-pantry-items"
import { useMyPantryItems } from "@/lib/hooks/use-my-pantry-items"
import { revalidatePantryItems } from "@/lib/hooks/pantry-cache"
import { createClient } from "@/lib/supabase/client"
import type { PantryItem } from "@/lib/types/pantrytypes"

function PantryTableSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-4">
        <Skeleton className="h-9 w-full max-w-sm" />
        <div className="overflow-hidden rounded-md border border-border">
          <div className="flex flex-col gap-0">
            <div className="flex gap-2 border-b border-border bg-muted/30 p-3">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-2 border-b border-border p-3 last:border-0"
              >
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}

interface PantryItemsPanelProps {
  columns: ColumnDef<PantryItem>[]
  items: PantryItem[]
  emptyTitle: string
  emptyDescription: string
  addTriggerLabel: string
  onItemAdded: () => void
}

function PantryItemsPanel({
  columns,
  items,
  emptyTitle,
  emptyDescription,
  addTriggerLabel,
  onItemAdded,
}: PantryItemsPanelProps) {
  if (items.length > 0) {
    return <PantryDataTable columns={columns} data={items} />
  }
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" />
        <EmptyTitle>{emptyTitle}</EmptyTitle>
        <EmptyDescription>{emptyDescription}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <AddPantryItem
          triggerLabel={addTriggerLabel}
          defaultTab="bulk"
          onItemAdded={onItemAdded}
        />
      </EmptyContent>
    </Empty>
  )
}

export function PantryPageClient() {
  const { items: myItems, isLoading: myLoading } = useMyPantryItems()
  const { items: householdItems, isLoading: householdLoading } =
    useHouseholdPantryItems()
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null)

  const isInitialLoad = myLoading && householdLoading

  React.useEffect(() => {
    const supabase = createClient()
    void supabase.auth.getUser().then(({ data, error }) => {
      if (error) return
      setCurrentUserId(data.user?.id ?? null)
    })
  }, [])

  const handlePantryChanged = React.useCallback(() => {
    void revalidatePantryItems()
  }, [])

  const myPantryColumns = React.useMemo(
    () =>
      createPantryColumns({
        currentUserId,
        onItemDeleted: handlePantryChanged,
        onItemUpdated: handlePantryChanged,
      }),
    [currentUserId, handlePantryChanged],
  )

  const householdPantryColumns = React.useMemo(
    () =>
      createPantryHouseholdColumns({
        currentUserId,
        onItemDeleted: handlePantryChanged,
        onItemUpdated: handlePantryChanged,
      }),
    [currentUserId, handlePantryChanged],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <TypographyH2>Pantry</TypographyH2>
          <TypographyP className="text-muted-foreground">
            Switch between items you own and the full household inventory.
          </TypographyP>
        </div>
        <AddPantryItem onItemAdded={handlePantryChanged} />
      </div>

      {isInitialLoad ? (
        <PantryTableSkeleton />
      ) : (
        <Tabs defaultValue="household" className="gap-4">
          <TabsList>
            <TabsTrigger value="my">My pantry</TabsTrigger>
            <TabsTrigger value="household">Household pantry</TabsTrigger>
          </TabsList>
          <TabsContent value="my" className="mt-4">
            <PantryItemsPanel
              columns={myPantryColumns}
              items={myItems}
              emptyTitle="No items in your pantry"
              emptyDescription={
                householdItems.length > 0
                  ? "You have no items attributed to your account in this household."
                  : "Add pantry items to see freshness, warnings, and category breakdowns."
              }
              addTriggerLabel={
                householdItems.length > 0
                  ? "Add an item"
                  : "Add your first item"
              }
              onItemAdded={handlePantryChanged}
            />
          </TabsContent>
          <TabsContent value="household" className="mt-4">
            <PantryItemsPanel
              columns={householdPantryColumns}
              items={householdItems}
              emptyTitle="No pantry items yet"
              emptyDescription="Add pantry items to see freshness, warnings, and category breakdowns."
              addTriggerLabel="Add your first item"
              onItemAdded={handlePantryChanged}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
