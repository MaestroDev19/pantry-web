"use client"

import useSWR from "swr"

import { fetchHouseholdPantryItemsForSwr } from "@/lib/api/pantry"
import type { PantryItem } from "@/lib/types/pantrytypes"

export const HOUSEHOLD_PANTRY_ITEMS_SWR_KEY = "household-pantry-items" as const

export function useHouseholdPantryItems() {
  const swr = useSWR<PantryItem[]>(
    HOUSEHOLD_PANTRY_ITEMS_SWR_KEY,
    fetchHouseholdPantryItemsForSwr,
  )

  return {
    items: swr.data ?? [],
    isLoading: swr.data === undefined && swr.error === undefined,
    error: swr.error,
    isValidating: swr.isValidating,
  }
}
