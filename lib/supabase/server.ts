import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function getRequiredPublicEnv(value: string | undefined, nameForError: string): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${nameForError}. ` +
        "Your Supabase project's URL and publishable key are required to create a Supabase client."
    )
  }
  return value
}

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = getRequiredPublicEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    "NEXT_PUBLIC_SUPABASE_URL"
  )
  const supabasePublishableKey = getRequiredPublicEnv(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  )

  return createServerClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
