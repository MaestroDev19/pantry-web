import { createBrowserClient } from "@supabase/ssr"

function getRequiredPublicEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        "Your Supabase project's URL and publishable key are required to create a Supabase client."
    )
  }
  return value
}

export function createClient() {
  return createBrowserClient(
    getRequiredPublicEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredPublicEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
  )
}
