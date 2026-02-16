export interface Profile {
  id: string
  updated_at: string | null
  full_name: string | null
  avatar_url: string | null
  email: string | null
}

export interface Household {
  id: string
  name: string
  invite_code: string
  created_at: string | null
  is_personal: boolean
  owner_id: string | null
}


export interface HouseholdMember {
  id: string
  household_id: string
  user_id: string
  role: string
  joined_at: string | null
}


export interface PantryItem {
  id: string
  owner_id: string | null
  household_id: string | null
  name: string
  category: string
  quantity: number | null
  unit: string | null
  expiry_date: string | null
  expiry_visible: boolean | null
  created_at: string | null
  updated_at: string | null
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

