"use client";

import { atomWithStorage } from "jotai/utils";

import { type ShoppingItem } from "@/lib/types/shoppingtypes";
import { type CategoryEnum, normalizeUnit } from "@/lib/types/pantrytypes";
import { CATEGORY_OPTIONS } from "@/lib/types/shoppingtypes";
import { uuid } from "@/lib/utils/uuid";

const CATEGORY_SLUG_MIGRATION_MAP: Record<string, CategoryEnum> = {
  produce: "Produce",
  dairy: "Dairy",
  "dairy-eggs": "Dairy",
  meat: "Meat & Seafood",
  "meat-seafood": "Meat & Seafood",
  grains: "Grains & Pasta",
  "bread-grains": "Grains & Pasta",
  "grains-pasta": "Grains & Pasta",
  canned: "Canned Goods",
  "canned-dry-goods": "Canned Goods",
  "canned-goods": "Canned Goods",
  frozen: "Frozen",
  "snacks-beverages": "Snacks",
  snacks: "Snacks",
  beverages: "Beverages",
  spices: "Condiments & Oils",
  "condiments-oils": "Condiments & Oils",
  baking: "Baking",
  other: "Other",
};

const VALID_CATEGORIES = new Set<CategoryEnum>(
  CATEGORY_OPTIONS.map((option) => option.value),
);

function migrateShoppingItems(items: unknown): ShoppingItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.flatMap((raw): ShoppingItem[] => {
    if (!raw || typeof raw !== "object") {
      return [];
    }

    const candidate = raw as Partial<ShoppingItem> & { category?: unknown };
    const categoryRaw = candidate.category;

    const migratedCategory =
      typeof categoryRaw === "string"
        ? (CATEGORY_SLUG_MIGRATION_MAP[categoryRaw] ?? categoryRaw)
        : "Other";

    if (!VALID_CATEGORIES.has(migratedCategory as CategoryEnum)) {
      return [];
    }

    const unit = normalizeUnit((raw as Record<string, unknown>).unit);

    const item: ShoppingItem = {
      id: typeof candidate.id === "string" ? candidate.id : uuid(),
      name: typeof candidate.name === "string" ? candidate.name : "",
      category: migratedCategory as CategoryEnum,
      quantity:
        typeof candidate.quantity === "number" && Number.isFinite(candidate.quantity)
          ? candidate.quantity
          : 1,
      unit,
      bought: candidate.bought === true,
    };

    if (!item.name) {
      return [];
    }

    return [item];
  });
}

export const shoppingItemsAtom = atomWithStorage<ShoppingItem[]>(
  "shopping-list-items",
  [],
  {
    getItem: (key, initialValue) => {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        return initialValue;
      }

      try {
        return migrateShoppingItems(JSON.parse(raw));
      } catch {
        return initialValue;
      }
    },
    setItem: (key, value) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (key) => {
      window.localStorage.removeItem(key);
    },
  },
);

