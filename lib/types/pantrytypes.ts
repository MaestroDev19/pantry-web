export interface PantryItem {
  id: string;
  owner_id: string | null;
  /** Household pantry list: from profiles when owner is in household_members */
  owner_name?: string | null;
  household_id: string | null;
  name: string;
  category: CategoryEnum;
  quantity: number | null;
  unit: UnitEnum | null | string;
  expiry_date: string | null;
  expiry_visible: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface PantryItemInsert {
  id?: string;
  owner_id?: string | null;
  household_id?: string | null;
  name: string;
  category: CategoryEnum;
  quantity?: number | null;
  unit?: UnitEnum | null | string;
  expiry_date?: string | null;
  expiry_visible?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PantryItemUpdate {
  owner_id?: string | null;
  household_id?: string | null;
  name?: string;
  category?: CategoryEnum;
  quantity?: number | null;
  unit?: UnitEnum | null | string;
  expiry_date?: string | null;
  expiry_visible?: boolean | null;
  updated_at?: string | null;
}

export type CategoryEnum =
  | "Dairy"
  | "Produce"
  | "Meat & Seafood"
  | "Grains & Pasta"
  | "Canned Goods"
  | "Frozen"
  | "Snacks"
  | "Beverages"
  | "Condiments & Oils"
  | "Baking"
  | "Other";

export type UnitEnum =
  | "kg"
  | "g"
  | "mg"
  | "lb"
  | "oz"
  | "L"
  | "mL"
  | "gal"
  | "cup"
  | "tbsp"
  | "tsp"
  | "pieces"
  | "items"
  | "can"
  | "bottle"
  | "box"
  | "bag"
  | "pack";

export const UNIT_OPTIONS: { value: UnitEnum; label: string; group: string }[] = [
  // Weight
  { value: "mg", label: "mg (milligrams)", group: "Weight" },
  { value: "g", label: "g (grams)", group: "Weight" },
  { value: "kg", label: "kg (kilograms)", group: "Weight" },
  { value: "oz", label: "oz (ounces)", group: "Weight" },
  { value: "lb", label: "lb (pounds)", group: "Weight" },
  // Volume
  { value: "mL", label: "mL (millilitres)", group: "Volume" },
  { value: "L", label: "L (litres)", group: "Volume" },
  { value: "gal", label: "gal (gallons)", group: "Volume" },
  { value: "cup", label: "cup", group: "Volume" },
  { value: "tbsp", label: "tbsp", group: "Volume" },
  { value: "tsp", label: "tsp", group: "Volume" },
  // Count / packaging
  { value: "pieces", label: "pieces", group: "Count" },
  { value: "items", label: "items", group: "Count" },
  { value: "can", label: "can", group: "Count" },
  { value: "bottle", label: "bottle", group: "Count" },
  { value: "box", label: "box", group: "Count" },
  { value: "bag", label: "bag", group: "Count" },
  { value: "pack", label: "pack", group: "Count" },
];

export function normalizeUnit(value: unknown): UnitEnum | undefined {
  if (typeof value !== "string") return undefined;
  return UNIT_OPTIONS.find((unit) => unit.value === value)?.value;
}

export type ExpiryStatus = "good" | "expiring_soon" | "expired" | "no_date";
