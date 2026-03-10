"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { ClockIcon } from "lucide-react";

export function RecentActivityCard() {
  return (
    <Card className="border-border border-dashed flex flex-col">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest changes to your pantry</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1">
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
      </CardContent>
    </Card>
  );
}
