"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartUpIcon, ChartDownIcon } from "@hugeicons/core-free-icons";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Good Status</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            42
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="border-primary bg-primary/10 text-primary"
            >
              <HugeiconsIcon icon={ChartUpIcon} strokeWidth={2} />
              Safe to eat
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Items currently safe to consume{" "}
            <HugeiconsIcon
              icon={ChartUpIcon}
              strokeWidth={2}
              className="size-4"
            />
          </div>
          <div className="text-muted-foreground">
            Updated based on expiry dates
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Expiring Soon</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            3
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 text-amber-700"
            >
              <HugeiconsIcon icon={ChartUpIcon} strokeWidth={2} />
              Use within 3 days
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Items nearing their expiry{" "}
            <HugeiconsIcon
              icon={ChartUpIcon}
              strokeWidth={2}
              className="size-4"
            />
          </div>
          <div className="text-muted-foreground">Plan to use these soon</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Expired</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="border-destructive bg-destructive/10 text-destructive"
            >
              <HugeiconsIcon icon={ChartDownIcon} strokeWidth={2} />
              Discard immediately
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Items past their expiry{" "}
            <HugeiconsIcon
              icon={ChartDownIcon}
              strokeWidth={2}
              className="size-4"
            />
          </div>
          <div className="text-muted-foreground">Remove from pantry list</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Items</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            46
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <HugeiconsIcon icon={ChartUpIcon} strokeWidth={2} />
              Pantry overview
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            All tracked pantry items{" "}
            <HugeiconsIcon
              icon={ChartUpIcon}
              strokeWidth={2}
              className="size-4"
            />
          </div>
          <div className="text-muted-foreground">Last updated 2h ago</div>
        </CardFooter>
      </Card>
    </div>
  );
}
