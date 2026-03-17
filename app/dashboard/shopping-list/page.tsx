"use client";

import * as React from "react";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileSpreadsheet,
  Sparkles,
  Plus,
  Trash2,
  Download,
  Clipboard,
  FileText,
  FileType2,
} from "lucide-react";

export type ShoppingItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  bought: boolean;
};

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "produce", label: "Produce" },
  { value: "dairy-eggs", label: "Dairy & Eggs" },
  { value: "meat-seafood", label: "Meat & Seafood" },
  { value: "bread-grains", label: "Bread & Grains" },
  { value: "canned-dry-goods", label: "Canned & Dry Goods" },
  { value: "frozen", label: "Frozen" },
  { value: "snacks-beverages", label: "Snacks & Beverages" },
  { value: "other", label: "Other" },
];

export const shoppingItemsAtom = atomWithStorage<ShoppingItem[]>(
  "shopping-list-items",
  [],
);

export default function ShoppingListPage() {
  const [itemName, setItemName] = React.useState("");
  const [quantity, setQuantity] = React.useState<string>("1");
  const [category, setCategory] = React.useState<string>("produce");
  const [items, setItems] = useAtom(shoppingItemsAtom);

  const handleAddItem = () => {
    const trimmedName = itemName.trim();
    if (!trimmedName) {
      return;
    }

    const parsedQuantity = Number.parseInt(quantity, 10);
    const safeQuantity =
      Number.isNaN(parsedQuantity) || parsedQuantity < 1 ? 1 : parsedQuantity;

    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: trimmedName,
        category,
        quantity: safeQuantity,
        bought: false,
      },
    ]);

    setItemName("");
    setQuantity("1");
  };

  const handleToggleBought = (id: string, checked: boolean | string) => {
    const isChecked = checked === true;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bought: isChecked } : item,
      ),
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearPurchased = () => {
    setItems((prev) => prev.filter((item) => !item.bought));
  };

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const categorySummaries = useMemo(
    () =>
      CATEGORY_OPTIONS.map((option) => {
        const count = items
          .filter((item) => item.category === option.value)
          .reduce((sum, item) => sum + item.quantity, 0);

        const percentage = totalQuantity
          ? Math.min(100, (count / totalQuantity) * 100)
          : 0;

        return {
          label: option.label,
          count,
          percentage,
        };
      }).filter((entry) => entry.count > 0),
    [items, totalQuantity],
  );

  const buildListText = () => {
    const lines = items.map((item) => {
      const categoryLabel =
        CATEGORY_OPTIONS.find((option) => option.value === item.category)
          ?.label ?? "Other";

      const quantityLabel = item.quantity > 1 ? ` x${item.quantity}` : "";
      const statusLabel = item.bought ? " (Purchased)" : " (To buy)";

      return `- ${item.name}${quantityLabel} [${categoryLabel}]${statusLabel}`;
    });

    if (lines.length === 0) {
      return "Shopping list is currently empty.";
    }

    return `Shopping List\n\n${lines.join("\n")}`;
  };

  const downloadTextFile = (content: string, filename: string) => {
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
  };

  const handleCopyToClipboard = async () => {
    const content = buildListText();

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
  };

  const handleDownloadTxt = () => {
    const content = buildListText();
    downloadTextFile(content, "shopping-list.txt");
  };

  const handleDownloadPdf = () => {
    if (typeof window === "undefined") return;

    const content = buildListText();
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup) return;

    popup.document.write(
      `<!doctype html><html><head><title>Shopping List</title></head><body><pre>${content}</pre></body></html>`,
    );
    popup.document.close();
    popup.focus();
  };

  return (
    <div className="flex flex-1 flex-col @container/main gap-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pt-4 md:pt-10 lg:pt-20">
        <div className="flex flex-col">
          <TypographyH2>Shopping List</TypographyH2>
          <TypographyP className="text-muted-foreground text-sm">
            Manage your upcoming grocery run.
          </TypographyP>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-primary hover:text-primary hover:bg-primary/20 bg-primary/10 border-transparent shadow-none"
          >
            <FileSpreadsheet className="size-4 mr-2" />
            Import CSV
          </Button>
          <Button className="bg-gradient-to-r from-primary to-emerald-500 hover:opacity-90 text-primary-foreground border-transparent border-0 shadow-none transition-opacity">
            <Sparkles className="size-4 mr-2" />
            Generate AI List
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 p-2 border rounded-xl bg-card shadow-sm">
        <div className="relative flex-1 w-full flex items-center">
          <Plus className="absolute left-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Add item manually (e.g. “Avocados”)..."
            className="pl-9 border-none shadow-none focus-visible:ring-0 bg-transparent"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddItem();
              }
            }}
          />
        </div>

        <Separator
          orientation="vertical"
          className="hidden sm:block h-8 opacity-50"
        />

        <div className="flex w-full sm:w-auto items-center gap-2 shrink-0">
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="w-20 border-none shadow-none focus-visible:ring-0 bg-transparent text-sm"
            placeholder="Qty"
          />

          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger className="w-full sm:w-[160px] border-none shadow-none focus:ring-0 bg-transparent text-muted-foreground">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent align="start" position="popper" side="bottom">
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            onClick={handleAddItem}
          >
            Add item
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <TypographyP className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Items
            </TypographyP>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
              onClick={handleClearPurchased}
              disabled={!items.some((item) => item.bought)}
            >
              Clear purchased
            </Button>
          </div>

          {items.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No items yet</EmptyTitle>
                <EmptyDescription>
                  Add items on the left to start building your shopping list.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                Use the name, quantity, and category fields above, then select{" "}
                <span className="font-medium">Add item</span>.
              </EmptyContent>
            </Empty>
          ) : (
            <ScrollArea className="max-h-80 h-full pr-2">
              <div className="flex flex-col gap-2">
                {items.map((item) => {
                  const categoryLabel =
                    CATEGORY_OPTIONS.find(
                      (option) => option.value === item.category,
                    )?.label ?? "Other";

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-lg px-2 py-1"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={item.bought}
                          onCheckedChange={(checked) =>
                            handleToggleBought(item.id, checked)
                          }
                        />
                        <div className="flex flex-col">
                          <span
                            className="text-sm"
                            style={{
                              textDecoration: item.bought
                                ? "line-through"
                                : "none",
                              opacity: item.bought ? 0.6 : 1,
                            }}
                          >
                            {item.name}
                            {item.quantity > 1 ? ` · x${item.quantity}` : null}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Status: {item.bought ? "Purchased" : "To buy"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {categoryLabel}
                        </Badge>
                        {!item.bought && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <TypographyP className="text-sm font-semibold">
                List Summary
              </TypographyP>
              <TypographyP className="text-xs text-muted-foreground">
                Overview of items in this list.
              </TypographyP>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-dashed"
                  disabled={items.length === 0}
                >
                  <Download className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={handleCopyToClipboard}>
                  <Clipboard className="mr-2 size-4" />
                  <span>Copy to clipboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadTxt}>
                  <FileText className="mr-2 size-4" />
                  <span>Download .txt</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadPdf}>
                  <FileType2 className="mr-2 size-4" />
                  <span>Open PDF view</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {items.length === 0 ? (
            <Empty className="border-none p-0">
              <EmptyHeader>
                <EmptyTitle>No summary yet</EmptyTitle>
                <EmptyDescription>
                  Once you add items, you&apos;ll see a breakdown by category
                  here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <div className="rounded-2xl bg-muted px-4 py-3 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Total items
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Across all categories in this list.
                  </span>
                </div>
                <span className="text-2xl font-semibold tabular-nums">
                  {totalQuantity}
                </span>
              </div>

              {categorySummaries.length > 0 && (
                <div className="flex flex-col gap-2">
                  <TypographyP className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Items by category
                  </TypographyP>

                  <ScrollArea className="max-h-80 h-full pr-2">
                    <div className="flex flex-col gap-3">
                      {categorySummaries.map((entry, index) => (
                        <div
                          key={entry.label}
                          className="flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-foreground">
                              {entry.label}
                            </span>
                            <span className="text-muted-foreground">
                              {entry.count} item{entry.count === 1 ? "" : "s"}
                            </span>
                          </div>

                          <div className="h-1.5 w-full rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${entry.percentage}%`,
                                opacity: 0.85 - index * 0.1,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Last updated</span>
                <span>Just now</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
