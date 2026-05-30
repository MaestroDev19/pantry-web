"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useMyPantryItems } from "@/lib/hooks/use-my-pantry-items"
import { buildRequiredActions } from "@/lib/utils/actions-required"

export type ActionItem = {
  id: string
  title: string
  description: string
}

export function ActionsRequiredCard({
  actions: actionsOverride,
  className,
}: {
  actions?: ActionItem[]
  className?: string
}) {
  const { items, isLoading } = useMyPantryItems()

  const actions = React.useMemo(() => {
    if (actionsOverride != null) return actionsOverride
    return buildRequiredActions(items)
  }, [actionsOverride, items])

  return (
    <Card
      className={cn(
        "flex h-full min-h-[360px] min-w-0 flex-col border-dashed border-border",
        className,
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Actions Required</CardTitle>
        <CardDescription className="text-xs">
          Items that need your attention
        </CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col pb-4">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : actions.length === 0 ? (
          <Empty className="my-auto py-4">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CheckCircleIcon />
              </EmptyMedia>
              <EmptyTitle className="text-sm">All caught up!</EmptyTitle>
              <EmptyDescription className="text-xs">
                No items require your immediate attention.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ScrollArea className="min-h-0 flex-1 pr-2">
            <div className="flex flex-col gap-2">
              {actions.map((action) => (
                <Item
                  key={action.id}
                  className="flex-col items-stretch gap-2 border-border border-dashed p-3"
                >
                  <ItemContent className="gap-1">
                    <ItemTitle className="line-clamp-1 text-sm">
                      {action.title}
                    </ItemTitle>
                    <ItemDescription className="line-clamp-2 text-xs leading-relaxed">
                      {action.description}
                    </ItemDescription>
                  </ItemContent>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/dashboard/pantry">View</Link>
                  </Button>
                </Item>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
