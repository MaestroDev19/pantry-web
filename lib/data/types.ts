export interface Profile {
  id: string
  updated_at: string | null
  full_name: string | null
  avatar_url: string | null
  email: string | null
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
  | "Other"

export type UnitEnum =
  | "kg" | "g" | "mg" | "lb" | "oz"
  | "L" | "mL" | "gal" | "cup" | "tbsp" | "tsp"
  | "pieces" | "items"
  | "can" | "bottle" | "box" | "bag" | "pack"

export type ExpiryStatus = "good" | "expiring_soon" | "expired" | "no_date"

export interface Household {
  id: string
  name: string
  invite_code: string
  created_at: string
  is_personal: boolean
}

export interface HouseholdMember {
  id: string
  user_id: string
  household_id: string
  joined_at: string
  user_email?: string | null
}

export interface PantryItem {
  id: string
  owner_id: string
  household_id: string
  name: string
  category: CategoryEnum
  quantity: number
  unit: UnitEnum | null
  expiry_date: string | null
  expiry_visible: boolean
  created_at: string
  updated_at: string
  expiry_status?: ExpiryStatus | null
  days_until_expiry?: number | null
  is_mine?: boolean
}

export interface HouseholdCreateRequest {
  name: string
  is_personal?: boolean
}

export interface HouseholdJoinRequest {
  invite_code: string
}

export interface HouseholdConvertToJoinableRequest {
  name?: string
}

export interface HouseholdResponse extends Household {}

export interface HouseholdJoinResponse {
  household: HouseholdResponse
  items_moved: number
}

export interface HouseholdLeaveResponse {
  message: string
  items_deleted: number
  new_household_id?: string | null
  new_household_name?: string | null
}

export interface PantryItemUpsert {
  id?: string
  name: string
  category: CategoryEnum
  quantity: number
  unit?: UnitEnum | null
  expiry_date?: string | null
  expiry_visible?: boolean
}

export interface PantryItemUpsertResponse {
  id: string
  is_new: boolean
  old_quantity: number
  new_quantity: number
  message: string
  embedding_generated: boolean
}

export interface PantryItemBulkCreate {
  name: string
  category: CategoryEnum
  quantity: number
  unit?: UnitEnum | null
  expiry_date?: string | null
  expiry_visible?: boolean
}

export interface PantryItemsBulkCreateRequest {
  items: PantryItemBulkCreate[]
}

export interface BulkUpsertResult {
  name: string
  success: boolean
  is_new: boolean
  item_id?: string | null
  old_quantity?: number | null
  new_quantity?: number | null
  error?: string | null
}

export interface PantryItemsBulkCreateResponse {
  total_requested: number
  successful: number
  failed: number
  new_items: number
  updated_items: number
  results: BulkUpsertResult[]
  embeddings_queued: number
}


export interface UserPreferences {
  id: string
  user_id: string | null
  expiry_alerts_enabled: boolean | null
  pantry_check_enabled: boolean | null
  pantry_check_frequency_days: number | null
  shopping_list_reminder_enabled: boolean | null
  shopping_list_reminder_days: number | null
  created_at: string | null
  updated_at: string | null
}

