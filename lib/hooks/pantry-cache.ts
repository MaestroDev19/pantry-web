import type { SWRConfiguration } from "swr"
import { mutate } from "swr"

import { HOUSEHOLD_PANTRY_ITEMS_SWR_KEY } from "@/lib/hooks/use-household-pantry-items"
import { MY_PANTRY_ITEMS_SWR_KEY } from "@/lib/hooks/use-my-pantry-items"

/**
 * Pantry list data is cached in SWR for the dashboard session.
 * Revalidate only via `revalidatePantryItems()` after create/update/delete.
 */
export const PANTRY_SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateIfStale: false,
  dedupingInterval: 60_000,
  keepPreviousData: true,
  errorRetryCount: 2,
}

/** Refetch my + household pantry lists (call after pantry mutations). */
export async function revalidatePantryItems(): Promise<void> {
  await Promise.all([
    mutate(MY_PANTRY_ITEMS_SWR_KEY),
    mutate(HOUSEHOLD_PANTRY_ITEMS_SWR_KEY),
  ])
}
