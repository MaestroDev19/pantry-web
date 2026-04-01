import {
  type ShoppingItem,
  getCategoryDisplay,
  CATEGORY_OPTIONS,
} from "@/lib/types/shoppingtypes";

const QTY_COLUMN_WIDTH = 6;

function formatQuantity(item: ShoppingItem): string {
  if (!item.unit) {
    return `${item.quantity}`;
  }

  const COUNT_UNITS = new Set(["pieces", "items", "can", "bottle", "box", "bag", "pack"]);
  const unitLabel =
    COUNT_UNITS.has(item.unit) && item.quantity !== 1
      ? item.unit
      : item.unit === "pieces" && item.quantity === 1
        ? "piece"
        : item.unit === "items" && item.quantity === 1
          ? "item"
          : item.unit;

  return `${item.quantity} ${unitLabel}`;
}

export function buildListText(
  items: ShoppingItem[],
  options?: { showCategory?: boolean },
) {
  if (items.length === 0) {
    return "Shopping list is currently empty.";
  }

  const lines = items.map((item) => {
    const qty = formatQuantity(item);
    const categoryLabel = options?.showCategory
      ? ` [${getCategoryDisplay(item.category)}]`
      : "";

    const statusLabel = item.bought ? " (Purchased)" : " (To buy)";

    return `- ${item.name}  ${qty}${categoryLabel}${statusLabel}`;
  });

  return lines.join("\n");
}

/**
 * Builds a text representation of the shopping list grouped by aisle (category).
 * Only includes items that have not been purchased yet.
 */
export function buildAisleGroupedText(items: ShoppingItem[]) {
  if (items.length === 0) {
    return "Shopping list is currently empty.";
  }

  // Only show items that haven't been bought yet for a shopping list
  const activeItems = items.filter((item) => !item.bought);

  if (activeItems.length === 0) {
    return "All items have been purchased.";
  }

  let text = "";

  for (const option of CATEGORY_OPTIONS) {
    const categoryItems = activeItems.filter((item) => item.category === option.value);

    if (categoryItems.length > 0) {
      // Category Header: Emoji + Uppercase Label
      text += `\n${option.emoji} ${option.label.toUpperCase()}\n`;

      for (const item of categoryItems) {
        const qty = formatQuantity(item);
        const checkbox = "[ ]";
        const qtyPadded = qty.padEnd(QTY_COLUMN_WIDTH, " ");
        text += `${checkbox} ${qtyPadded} ${item.name}\n`;
      }
    }
  }

  return text.trim();
}
