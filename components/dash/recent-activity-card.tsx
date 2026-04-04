"use client"

import * as React from "react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldAlertIcon,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

import { useMyPantryItems } from "@/lib/hooks/use-my-pantry-items"
import { getCategoryDisplay } from "@/lib/types/shoppingtypes"
import { getPantryExpiryKind } from "@/lib/utils/pantry-expiry"
import {
  RECENT_ACTIVITY_LOOKBACK_DAYS,
  RECENT_ACTIVITY_MAX_ITEMS,
  formatRelativeActivityTime,
  pantryItemWasUpdated,
  pickActivityIsoString,
  selectRecentPantryItems,
} from "@/lib/utils/recent-activity"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

export function RecentActivityCard() {
  const { items, isLoading } = useMyPantryItems()

  const recentItems = React.useMemo(
    () =>
      selectRecentPantryItems(items, {
        lookbackDays: RECENT_ACTIVITY_LOOKBACK_DAYS,
        maxItems: RECENT_ACTIVITY_MAX_ITEMS,
      }),
    [items]
  )

  const hasAnyItems = items.length > 0

  const ExpiryBadge = React.useCallback(({ date }: { date: string | null }) => {
    const kind = getPantryExpiryKind(date)
    if (kind === "expired") return <Badge variant="destructive">Expired</Badge>
    if (kind === "soon") {
      return (
        <Badge
          variant="outline"
          className="border-warning/40 bg-warning/15 text-foreground"
        >
          Warning
        </Badge>
      )
    }
    return <Badge variant="secondary">Fresh</Badge>
  }, [])

  const ActivityIcon = React.useCallback(
    ({ date }: { date: string | null }) => {
      const kind = getPantryExpiryKind(date)
      const iconClass = "size-4 text-muted-foreground"
      if (kind === "expired")
        return <ShieldAlertIcon aria-hidden="true" className={iconClass} />
      if (kind === "soon")
        return <AlertTriangleIcon aria-hidden="true" className={iconClass} />
      return <CheckCircleIcon aria-hidden="true" className={iconClass} />
    },
    []
  )

  return (
    <Card className="flex flex-col border-dashed border-border">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Items with changes in the last {RECENT_ACTIVITY_LOOKBACK_DAYS} days (up to{" "}
          {RECENT_ACTIVITY_MAX_ITEMS} shown)
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1">
        {isLoading ? (
          <div className="w-full space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : recentItems.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClockIcon />
              </EmptyMedia>
              <EmptyTitle>
                {hasAnyItems ? "No recent activity" : "No activity yet"}
              </EmptyTitle>
              <EmptyDescription>
                {hasAnyItems
                  ? `Nothing has changed in the last ${RECENT_ACTIVITY_LOOKBACK_DAYS} days. Older items are hidden from this list.`
                  : "Add items to your pantry to see updates here."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ScrollArea className="h-48 w-full pr-2">
            <ItemGroup className="w-full max-w-full gap-0">
              {recentItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Item
                    variant="outline"
                    size="sm"
                    className="border-none px-0"
                  >
                    <ItemMedia variant="icon">
                      <ActivityIcon date={item.expiry_date} />
                    </ItemMedia>
                    <ItemContent className="min-w-0">
                      <ItemTitle className="truncate">{item.name}</ItemTitle>
                      <ItemDescription className="truncate">
                        {getCategoryDisplay(item.category)}
                      </ItemDescription>
                    </ItemContent>

                    <ItemActions className="flex flex-col items-end gap-1">
                      <ExpiryBadge date={item.expiry_date} />
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {(() => {
                          const ts = pickActivityIsoString(item)
                          const label = pantryItemWasUpdated(item)
                            ? "Updated"
                            : "Added"
                          const rel = formatRelativeActivityTime(ts)
                          return rel === "—" ? label : `${label} · ${rel}`
                        })()}
                      </span>
                    </ItemActions>
                  </Item>

                  {index < recentItems.length - 1 ? <ItemSeparator /> : null}
                </React.Fragment>
              ))}
            </ItemGroup>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
