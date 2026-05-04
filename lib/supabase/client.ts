import { createBrowserClient } from "@supabase/ssr"

function getRequiredPublicEnv(value: string | undefined, nameForError: string): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${nameForError}. ` +
        "Your Supabase project's URL and publishable key are required to create a Supabase client."
    )
  }
  return value
}

export function createClient() {
  // NOTE: NEXT_PUBLIC_* env vars must be referenced statically for Next.js to inline them into the client bundle.
  const supabaseUrl = getRequiredPublicEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    "NEXT_PUBLIC_SUPABASE_URL"
  )
  const supabasePublishableKey = getRequiredPublicEnv(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  )

  return createBrowserClient(
    supabaseUrl,
    supabasePublishableKey
  )
}
