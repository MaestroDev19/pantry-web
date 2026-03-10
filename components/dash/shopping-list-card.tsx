import { ShoppingCartIcon, PlusIcon, ShareIcon, ShoppingBasketIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemActions,
  ItemGroup,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

interface ShoppingListItem {
  id: string;
  name: string;
  amount?: string;
  unit?: string;
  checked?: boolean;
}

const DEMO_ITEMS: ShoppingListItem[] = [

];

function ShoppingListRow({ item }: { item: ShoppingListItem }) {
  return (
    <Item className={cn(item.checked && "opacity-50")}>
      <ItemMedia>
        <input
          type="checkbox"
          id={`item-${item.id}`}
          defaultChecked={item.checked}
          className="size-4 rounded border-border accent-primary cursor-pointer"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle
          className={cn(
            "cursor-pointer select-none",
            item.checked && "line-through text-muted-foreground"
          )}
        >
          <label htmlFor={`item-${item.id}`}>{item.name}</label>
        </ItemTitle>
      </ItemContent>

      {item.amount && (
        <ItemActions>
          <Badge variant="outline" className="shrink-0 text-xs">
            {item.amount} {item.unit}
          </Badge>
        </ItemActions>
      )}
    </Item>
  );
}

export function ShoppingListCard({
  items = DEMO_ITEMS,
}: {
  items?: ShoppingListItem[];
}) {
  return (
    <Card className="border-border border-dashed flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col">
          <CardTitle className="flex items-center gap-2 text-base">
          <ShoppingCartIcon className="size-4 " />
          Shopping List
        </CardTitle>
        <CardDescription>
           Manage your shopping list
        </CardDescription>
        </div>
        <Button variant="link" size="sm" className="text-primary h-auto p-0 text-sm font-medium">
          View Full List
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 pt-0 pb-2">
        {items.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingBasketIcon />
              </EmptyMedia>
              <EmptyTitle>Your list is empty</EmptyTitle>
              <EmptyDescription>
                Add items to start building your shopping list.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup>
            {items.map((item) => (
              <ShoppingListRow key={item.id} item={item} />
            ))}
          </ItemGroup>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button variant="default" className="w-full">
          <PlusIcon className="size-4 mr-2" />
          Add Item
        </Button>
        <Button variant="outline" className="w-full">
          <ShareIcon className="size-4 mr-2" />
          Share List
        </Button>
      </CardFooter> 
    </Card>
  );
}
