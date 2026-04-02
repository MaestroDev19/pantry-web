"use client"

import useSWR from "swr"

import { getMyPantryItems } from "@/lib/api/pantry"
import type { PantryItem } from "@/lib/types/pantrytypes"

export const MY_PANTRY_ITEMS_SWR_KEY = "my-pantry-items" as const

async function fetchMyPantryItems(): Promise<PantryItem[]> {
  const res = await getMyPantryItems()
  if (!res.ok) {
    const status = typeof res.status === "number" ? res.status : 500
    throw new Error(`Failed to load my pantry items (${status})`)
  }

  if (Array.isArray(res.data)) return res.data
  if (
    res.data &&
    typeof res.data === "object" &&
    "items" in res.data &&
    Array.isArray((res.data as { items?: unknown }).items)
  ) {
    return (res.data as { items: PantryItem[] }).items
  }
  return []
}

export function useMyPantryItems() {
  const swr = useSWR<PantryItem[]>(
    MY_PANTRY_ITEMS_SWR_KEY,
    fetchMyPantryItems,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  return {
    items: swr.data ?? [],
    isLoading: swr.data == null && swr.error == null,
    error: swr.error,
    isValidating: swr.isValidating,
  }
}
