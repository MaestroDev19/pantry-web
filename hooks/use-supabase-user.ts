"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

function isRefreshTokenNotFound(error: unknown): boolean {
  const code =
    error && typeof error === "object" && "code" in error
      ? (error as { code?: string }).code
      : undefined
  return code === "refresh_token_not_found"
}

interface UseSupabaseUserResult {
  user: User | null
  isLoading: boolean
}

export function useSupabaseUser(): UseSupabaseUserResult {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data, error }) => {
      if (error && isRefreshTokenNotFound(error)) {
        setUser(null)
      } else {
        setUser(data.user ?? null)
      }
      setIsLoading(false)
    }).catch((err) => {
      if (isRefreshTokenNotFound(err)) {
        setUser(null)
      }
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    isLoading,
  }
}

