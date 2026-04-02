"use client";

import * as React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";
import { ClockIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useMyPantryItems } from "@/lib/hooks/use-my-pantry-items";
import { getCategoryDisplay } from "@/lib/types/shoppingtypes";
import { getPantryExpiryKind } from "@/lib/utils/pantry-expiry";

export function RecentActivityCard() {
  const { items, isLoading } = useMyPantryItems();

  const recentItems = React.useMemo(() => {
    const withTime = items
      .map((item) => {
        const timestamp = item.updated_at ?? item.created_at;
        const t = timestamp ? Date.parse(timestamp) : NaN;
        return { item, t: Number.isFinite(t) ? t : -1 };
      })
      .sort((a, b) => b.t - a.t)
      .map(({ item }) => item);

    return withTime.slice(0, 6);
  }, [items]);

  const formatDate = React.useCallback((value: string | null | undefined) => {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  }, []);

  const ExpiryBadge = React.useCallback(
    ({ date }: { date: string | null }) => {
      const kind = getPantryExpiryKind(date);
      if (kind === "expired") {
        return <Badge variant="destructive">Expired</Badge>;
      }

      if (kind === "soon") {
        return (
          <Badge
            variant="outline"
            className="border-warning/40 bg-warning/15 text-foreground"
          >
            Warning
          </Badge>
        );
      }

      return <Badge variant="secondary">Fresh</Badge>;
    },
    [],
  );

  return (
    <Card className="border-border border-dashed flex flex-col">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest changes to your pantry</CardDescription>
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
              <EmptyTitle>No activity yet</EmptyTitle>
              <EmptyDescription>
                Changes to your pantry will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ScrollArea className="h-48 pr-2">
            <div className="space-y-2">
              {recentItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="flex items-start justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {getCategoryDisplay(item.category)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <ExpiryBadge date={item.expiry_date} />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.updated_at ?? item.created_at)}
                      </span>
                    </div>
                  </div>
                  {index < recentItems.length - 1 ? (
                    <Separator />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
