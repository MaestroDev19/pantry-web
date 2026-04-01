import { CategoryEnum, UnitEnum } from "./pantrytypes";
export type ShoppingItem = {
  id: string;
  name: string;
  category: CategoryEnum;
  quantity: number;
  unit?: UnitEnum;

  bought: boolean;
};

const CATEGORY_SLUG_TO_ENUM: Record<string, CategoryEnum> = {
  dairy: "Dairy",
  "dairy-eggs": "Dairy",
  produce: "Produce",
  "meat-seafood": "Meat & Seafood",
  "bread-grains": "Grains & Pasta",
  "grains-pasta": "Grains & Pasta",
  "canned-dry-goods": "Canned Goods",
  "canned-goods": "Canned Goods",
  frozen: "Frozen",
  snacks: "Snacks",
  "snacks-beverages": "Snacks",
  beverages: "Beverages",
  "condiments-oils": "Condiments & Oils",
  baking: "Baking",
  other: "Other",
};

function normalizeCategory(value: unknown): CategoryEnum {
  if (typeof value !== "string") {
    return "Other";
  }

  if (value in CATEGORY_SLUG_TO_ENUM) {
    return CATEGORY_SLUG_TO_ENUM[value];
  }

  const option = CATEGORY_OPTIONS.find(
    (category) => category.value.toLowerCase() === value.toLowerCase(),
  );

  return option?.value ?? "Other";
}

export const CATEGORY_OPTIONS: {
  value: CategoryEnum;
  label: CategoryEnum;
  emoji: string;
}[] = [
  { value: "Dairy", label: "Dairy", emoji: "🥛" },
  { value: "Produce", label: "Produce", emoji: "🥦" },
  { value: "Meat & Seafood", label: "Meat & Seafood", emoji: "🥩" },
  { value: "Grains & Pasta", label: "Grains & Pasta", emoji: "🍝" },
  { value: "Canned Goods", label: "Canned Goods", emoji: "🥫" },
  { value: "Frozen", label: "Frozen", emoji: "❄️" },
  { value: "Snacks", label: "Snacks", emoji: "🍪" },
  { value: "Beverages", label: "Beverages", emoji: "🥤" },
  { value: "Condiments & Oils", label: "Condiments & Oils", emoji: "🧂" },
  { value: "Baking", label: "Baking", emoji: "🧁" },
  { value: "Other", label: "Other", emoji: "📦" },
];

export function getCategoryLabel(value: CategoryEnum | string): string {
  const normalized = normalizeCategory(value);
  const category = CATEGORY_OPTIONS.find((option) => option.value === normalized);
  return category ? category.label : "Other";
}

export function getCategoryEmoji(value: CategoryEnum | string): string {
  const normalized = normalizeCategory(value);
  return (
    CATEGORY_OPTIONS.find((option) => option.value === normalized)?.emoji ?? "📦"
  );
}

export function getCategoryDisplay(value: CategoryEnum | string): string {
  const normalized = normalizeCategory(value);
  const option = CATEGORY_OPTIONS.find((category) => category.value === normalized);
  return option ? `${option.emoji} ${option.label}` : "📦 Other";
}
