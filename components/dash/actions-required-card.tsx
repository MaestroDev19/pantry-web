"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Item, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { CheckCircleIcon } from "lucide-react";

export interface ActionItem {
  id: string | number;
  title: string;
  description: string;
}

const MOCK_ACTIONS: ActionItem[] = [
 
];

export function ActionsRequiredCard({
  actions = MOCK_ACTIONS,
}: {
  actions?: ActionItem[];
}) {
  return (
    <Card className="border-border border-dashed lg:col-span-2">
      <CardHeader>
        <CardTitle>Actions Required</CardTitle>
        <CardDescription>Items that need your attention</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {actions.length === 0 ? (
          <Empty className="py-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CheckCircleIcon />
              </EmptyMedia>
              <EmptyTitle>All caught up!</EmptyTitle>
              <EmptyDescription>
                No items require your immediate attention.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          actions.map((action) => (
            <Item key={action.id} className="border-border border-dashed">
              <ItemContent>
                <ItemTitle>{action.title}</ItemTitle>
                <ItemDescription>{action.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="outline">Edit</Button>
              </ItemActions>
            </Item>
          ))
        )}
      </CardContent>
    </Card>
  );
}
