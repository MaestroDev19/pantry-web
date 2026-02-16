"use server"

import { 
  PantryItemUpsert, 
  PantryItemBulkCreate 
} from "./types"

import { createClient } from "@/lib/supabase/server"
import { getSafeSessionToken } from "@/lib/auth/utils"

export async function fetchData(endpoint: string, options?: RequestInit) {
    const supabase = await createClient()
    const token = await getSafeSessionToken(supabase)
try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_PANTRY_API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options?.headers,
            Authorization: `Bearer ${token}`,
        },
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`)
    }

    return res.json()
} catch (error) {
    console.error('Failed to fetch data:', error)
    throw error
  }
}

// Household Actions

export async function createHousehold(name: string, isPersonal: boolean = false) {
  return fetchData('/households/create', {
    method: 'POST',
    body: JSON.stringify({ name, is_personal: isPersonal }),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function joinHousehold(inviteCode: string) {
  return fetchData('/households/join', {
    method: 'POST',
    body: JSON.stringify({ invite_code: inviteCode }),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function leaveHousehold() {
  return fetchData('/households/leave', {
    method: 'POST',
  })
}

export async function convertToJoinable(name?: string) {
  return fetchData('/households/convert-to-joinable', {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: { 'Content-Type': 'application/json' },
  })
}

// Pantry Actions

export async function addPantryItem(item: PantryItemUpsert) {
  return fetchData('/pantry/add_item', {
    method: 'POST',
    body: JSON.stringify(item),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function bulkAddPantryItems(items: PantryItemBulkCreate[]) {
    return fetchData('/pantry/bulk_add', {
      method: 'POST',
        body: JSON.stringify({ items }),
        headers: { 'Content-Type': 'application/json' },
    })
}

export async function getHouseholdPantryItems() {
  return fetchData('/pantry/get_household_items')
}

export async function getMyPantryItems() {
  return fetchData('/pantry/get_my_items')
}

export async function updatePantryItem(item: PantryItemUpsert) {
  return fetchData('/pantry/update_item', {
    method: 'PUT',
    body: JSON.stringify(item),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function deletePantryItem(itemId: string) {
  return fetchData(`/pantry/delete_item?item_id=${itemId}`, {
    method: 'DELETE',
  })
}