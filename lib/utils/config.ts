const API_URL_KEYS = [
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_PANTRY_API_URL",
] as const

/** Used when no env is set at build time (e.g. preview deploy missing env in the dashboard). */
const FALLBACK_PANTRY_API_ORIGIN = "https://pantry-backend-livid.vercel.app"

export function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "")
}

/** When true, pantry client calls same-origin `/api/pantry-items/*` (BFF + LRU); backend URL stays server-only. */
export function isPantryBffEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PANTRY_BFF === "1"
}

export function resolvePantryRequestUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (isPantryBffEnabled()) {
    return normalized
  }
  return `${normalizeBaseUrl(getApiBaseUrl())}${normalized}`
}

export function getApiBaseUrl(): string {
  if (process.env.NODE_ENV === "development") {
    const dev = process.env.NEXT_PUBLIC_DEV_API_URL
    if (typeof dev === "string") {
      const trimmed = dev.trim()
      if (trimmed) return trimmed
    }
  }
  for (const key of API_URL_KEYS) {
    const url = process.env[key]
    if (!url || typeof url !== "string") continue
    const trimmed = url.trim()
    if (trimmed) return trimmed
  }
  return FALLBACK_PANTRY_API_ORIGIN
}
