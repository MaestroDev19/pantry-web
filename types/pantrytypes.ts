export interface PantryItem {
  id: string;
  owner_id: string | null;
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

export type ExpiryStatus = "good" | "expiring_soon" | "expired" | "no_date";
