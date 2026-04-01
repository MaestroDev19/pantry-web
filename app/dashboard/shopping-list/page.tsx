"use client";

import * as React from "react";
import { useMemo } from "react";
import { useAtom } from "jotai";

import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { ItemForm } from "@/components/dash/item-form";
import { CATEGORY_OPTIONS } from "@/lib/types/shoppingtypes";
import { type CategoryEnum, type UnitEnum } from "@/lib/types/pantrytypes";
import { shoppingItemsAtom } from "@/lib/state/shopping-list";
import { buildAisleGroupedText } from "@/lib/utils/shopping-list";
import { downloadTextFile, copyToClipboard } from "@/lib/utils/browser";
import { uuid } from "@/lib/utils/uuid";
import { cn } from "@/lib/utils";

const CATEGORY_BAR_BASE_OPACITY = 0.85;
const CATEGORY_BAR_OPACITY_STEP = 0.1;
const CATEGORY_BAR_MIN_OPACITY = 0.25;

export default function ShoppingListPage() {
  const [itemName, setItemName] = React.useState("");
  const [quantity, setQuantity] = React.useState<number>(1);
  const [unit, setUnit] = React.useState<UnitEnum | undefined>(undefined);
  const [category, setCategory] = React.useState<CategoryEnum>("Produce");
  const [items, setItems] = useAtom(shoppingItemsAtom);
  const [lastUpdatedAt, setLastUpdatedAt] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    setLastUpdatedAt(
      new Date().toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    );
  }, [items, mounted]);

  const handleAddItem = () => {
    const trimmedName = itemName.trim();
    if (!trimmedName) {
      return;
    }

    const safeQuantity =
      Number.isFinite(quantity) && quantity > 0 ? quantity : 1;

    setItems((prev) => [
      ...prev,
      {
        id: uuid(),
        name: trimmedName,
        category,
        quantity: safeQuantity,
        unit,
        bought: false,
      },
    ]);

    setItemName("");
    setQuantity(1);
    setUnit(undefined);
  };

  const handleToggleBought = (
    id: string,
    checked: boolean | "indeterminate",
  ) => {
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

  const handleCopyToClipboard = async () => {
    const content = buildAisleGroupedText(items);
    await copyToClipboard(content);
  };

  const handleDownloadTxt = () => {
    const content = buildAisleGroupedText(items);
    downloadTextFile(content, "shopping-list.txt");
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

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled
            title="Coming soon"
            aria-label="Import CSV (coming soon)"
            className="text-primary hover:text-primary hover:bg-primary/20 bg-primary/10 border-transparent shadow-none"
          >
            <FileSpreadsheet aria-hidden="true" className="size-4 mr-2" />
            Import CSV
          </Button>
          <Button
            type="button"
            disabled
            title="Coming soon"
            aria-label="Generate AI list (coming soon)"
            className="bg-primary hover:opacity-90 text-primary-foreground border-transparent border-0 shadow-none transition-opacity"
          >
            <Sparkles aria-hidden="true" className="size-4 mr-2" />
            Generate AI List
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3 border rounded-xl bg-card shadow-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Plus aria-hidden="true" className="size-4" />
          <span>Add item</span>
        </div>
        <ItemForm
          name={itemName}
          quantity={quantity}
          unit={unit}
          category={category}
          onNameChange={setItemName}
          onQuantityChange={setQuantity}
          onUnitChange={setUnit}
          onCategoryChange={setCategory}
          onSubmit={handleAddItem}
        />
        <div className="flex justify-end">
          <Button
            className="w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            onClick={handleAddItem}
            disabled={!itemName.trim()}
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
              type="button"
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
                      <div className="flex min-w-0 items-center gap-2">
                        <Checkbox
                          checked={item.bought}
                          aria-label={`Mark ${item.name} as ${item.bought ? "to buy" : "purchased"}`}
                          onCheckedChange={(checked) =>
                            handleToggleBought(item.id, checked)
                          }
                        />
                        <div className="flex min-w-0 flex-col">
                          <span
                            className={cn(
                              "text-sm wrap-break-word",
                              item.bought && "line-through opacity-60",
                            )}
                          >
                            {item.name}
                            {item.unit ? (
                              <span className="text-muted-foreground ml-1">
                                · {item.quantity} {item.unit}
                              </span>
                            ) : item.quantity > 1 ? (
                              <span className="text-muted-foreground ml-1">
                                · {item.quantity}
                              </span>
                            ) : null}
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
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 aria-hidden="true" className="size-4" />
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
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-dashed"
                  disabled={items.length === 0}
                  aria-label="Download options"
                >
                  <Download aria-hidden="true" className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={handleCopyToClipboard}>
                  <Clipboard aria-hidden="true" className="mr-2 size-4" />
                  <span>Copy to clipboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadTxt}>
                  <FileText aria-hidden="true" className="mr-2 size-4" />
                  <span>Download .txt</span>
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
                                opacity:
                                Math.max(
                                  CATEGORY_BAR_MIN_OPACITY,
                                  CATEGORY_BAR_BASE_OPACITY -
                                    index * CATEGORY_BAR_OPACITY_STEP,
                                ),
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
                <span suppressHydrationWarning>
                  {mounted ? lastUpdatedAt : "—"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
