"use client"

import { useCallback } from "react"

import { createClient } from "@/lib/supabase/client"

/** Returns the current Supabase access token for Pantry API calls from client components. */
export function usePantryAccessToken(): () => Promise<string | null> {
  return useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getSession()
    if (error) return null
    return data.session?.access_token ?? null
  }, [])
}
