import { normalizeBaseUrl } from "@/lib/utils/config"

const FALLBACK_PANTRY_API_ORIGIN = "https://pantry-backend-livid.vercel.app"

/**
 * Server-only origin for the FastAPI pantry backend (BFF proxy target).
 * Mirrors client `getApiBaseUrl` resolution so dev/prod stay aligned.
 */
export function getPantryUpstreamOrigin(): string {
  const explicit = process.env.PANTRY_UPSTREAM_URL?.trim()
  if (explicit) return normalizeBaseUrl(explicit)

  if (process.env.NODE_ENV === "development") {
    const dev = process.env.NEXT_PUBLIC_DEV_API_URL?.trim()
    if (dev) return normalizeBaseUrl(dev)
  }

  for (const key of ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_PANTRY_API_URL"] as const) {
    const url = process.env[key]?.trim()
    if (url) return normalizeBaseUrl(url)
  }

  return normalizeBaseUrl(FALLBACK_PANTRY_API_ORIGIN)
}
