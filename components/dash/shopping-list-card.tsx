"use client";

import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import {
  ShoppingCartIcon,
  PlusIcon,
  ShareIcon,
  ShoppingBasketIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Clipboard, FileText, FileType2 } from "lucide-react";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemActions,
  ItemGroup,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import {
  shoppingItemsAtom,
  type ShoppingItem,
} from "@/app/dashboard/shopping-list/page";

function ShoppingListRow({
  item,
  onToggle,
}: {
  item: ShoppingItem;
  onToggle: (id: string, checked: boolean) => void;
}) {
  return (
    <Item className={cn(item.bought && "opacity-50")}>
      <ItemMedia>
        <input
          type="checkbox"
          id={`item-${item.id}`}
          checked={item.bought}
          onChange={(event) => onToggle(item.id, event.target.checked)}
          className="size-4 rounded border-border accent-primary cursor-pointer"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle
          className={cn(
            "cursor-pointer select-none",
            item.bought && "line-through text-muted-foreground",
          )}
        >
          <label htmlFor={`item-${item.id}`}>{item.name}</label>
        </ItemTitle>
      </ItemContent>

      {item.quantity && (
        <ItemActions>
          <Badge variant="outline" className="shrink-0 text-xs">
            x{item.quantity}
          </Badge>
        </ItemActions>
      )}
    </Item>
  );
}

function buildListText(items: ShoppingItem[]) {
  if (items.length === 0) {
    return "Shopping list is currently empty.";
  }

  const lines = items.map((item) => {
    const quantityLabel = item.quantity > 1 ? ` x${item.quantity}` : "";
    const statusLabel = item.bought ? " (Purchased)" : " (To buy)";

    return `- ${item.name}${quantityLabel}${statusLabel}`;
  });

  return `Shopping List\n\n${lines.join("\n")}`;
}

function downloadTextFile(content: string, filename: string) {
  if (typeof window === "undefined") return;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function copyToClipboard(content: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(content);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function openPdfView(content: string) {
  if (typeof window === "undefined") return;

  const popup = window.open("", "_blank", "noopener,noreferrer");
  if (!popup) return;

  popup.document.write(
    `<!doctype html><html><head><title>Shopping List</title></head><body><pre>${content}</pre></body></html>`,
  );
  popup.document.close();
  popup.focus();
}

export function ShoppingListCard() {
  const [items, setItems] = useAtom(shoppingItemsAtom);
  const router = useRouter();

  const handleToggleBought = (id: string, checked: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bought: checked } : item,
      ),
    );
  };

  const handleShareCopy = () => {
    const content = buildListText(items);
    void copyToClipboard(content);
  };

  const handleShareTxt = () => {
    const content = buildListText(items);
    downloadTextFile(content, "shopping-list.txt");
  };

  const handleSharePdf = () => {
    const content = buildListText(items);
    openPdfView(content);
  };

  return (
    <Card className="border-border border-dashed flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingCartIcon className="size-4 " />
            Shopping List
          </CardTitle>
          <CardDescription>Manage your shopping list</CardDescription>
        </div>
        <Button
          variant="link"
          size="sm"
          className="text-primary h-auto p-0 text-sm font-medium"
          onClick={() => router.push("/dashboard/shopping-list")}
        >
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
              <ShoppingListRow
                key={item.id}
                item={item}
                onToggle={handleToggleBought}
              />
            ))}
          </ItemGroup>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          variant="default"
          className="w-full"
          onClick={() => router.push("/dashboard/shopping-list")}
        >
          <PlusIcon className="size-4 mr-2" />
          Add Item
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full"
              disabled={items.length === 0}
            >
              <ShareIcon className="size-4 mr-2" />
              Share List
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleShareCopy}>
              <Clipboard className="mr-2 size-4" />
              <span>Copy to clipboard</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareTxt}>
              <FileText className="mr-2 size-4" />
              <span>Download .txt</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSharePdf}>
              <FileType2 className="mr-2 size-4" />
              <span>Open PDF view</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
