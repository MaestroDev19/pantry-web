"use server"

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