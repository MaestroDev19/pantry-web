"use client"

import { Share, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useAtomValue } from "jotai"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { shoppingItemsAtom } from "@/lib/state/shopping-list"

export function ShoppingListCard() {
  const items = useAtomValue(shoppingItemsAtom)

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart aria-hidden="true" className="h-5 w-5 text-foreground" />
            <CardTitle className="text-lg font-semibold">
              Shopping List
            </CardTitle>
          </div>
          <Link
            href="/dashboard/shopping-list"
            className="text-sm font-medium text-primary hover:underline"
          >
            View Full List
          </Link>
        </div>
        <CardDescription>Manage your shopping list</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="space-y-3">
          {items.length === 0 ? (
            <Empty className="border-none p-0">
              <EmptyHeader>
                <EmptyTitle>Your shopping list is empty</EmptyTitle>
                <EmptyDescription>Add items to get started.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                Head to{" "}
                <Link
                  href="/dashboard/shopping-list"
                  className="font-medium text-primary hover:underline"
                >
                  Shopping List
                </Link>{" "}
                to add your first item.
              </EmptyContent>
            </Empty>
          ) : (
            <ScrollArea className="h-32 pr-2">
              <div className="space-y-3">
                {items.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Checkbox
                        id={item.id}
                        checked={item.bought}
                        aria-label={`Mark ${item.name} as ${item.bought ? "to buy" : "purchased"}`}
                        disabled
                      />
                      <span
                        className={
                          item.bought
                            ? "min-w-0 truncate text-sm font-medium text-muted-foreground line-through"
                            : "min-w-0 truncate text-sm font-medium text-foreground"
                        }
                        title={item.name}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs text-muted-foreground">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          size="lg"
          disabled={items.length === 0}
        >
          <Share aria-hidden="true" className="mr-2 h-4 w-4" />
          Share List
        </Button>
      </CardFooter>
    </Card>
  )
}
