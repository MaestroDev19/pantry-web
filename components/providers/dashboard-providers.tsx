"use client"

import { SWRConfig } from "swr"

import { PANTRY_SWR_CONFIG } from "@/lib/hooks/pantry-cache"
import { useHouseholdPantryItems } from "@/lib/hooks/use-household-pantry-items"
import { useMyPantryItems } from "@/lib/hooks/use-my-pantry-items"

function PrefetchPantryData() {
  useMyPantryItems()
  useHouseholdPantryItems()
  return null
}

export function DashboardProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SWRConfig value={PANTRY_SWR_CONFIG}>
      <PrefetchPantryData />
      {children}
    </SWRConfig>
  )
}
