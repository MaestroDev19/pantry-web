/** How far back “recent” pantry activity includes (calendar days). */
export const RECENT_ACTIVITY_LOOKBACK_DAYS = 14

/** Max rows shown in the Recent Activity card (after time filter). */
export const RECENT_ACTIVITY_MAX_ITEMS = 8

/** Raw pantry row from API (snake_case and camelCase both appear in the wild). */
export type PantryActivityFields = {
  created_at?: string | null
  updated_at?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface ItemWithActivityTime<T extends PantryActivityFields> {
  item: T
  activityMs: number
}

export function pickActivityIsoString(item: PantryActivityFields): string | null {
  const raw =
    item.updated_at ??
    item.updatedAt ??
    item.created_at ??
    item.createdAt
  if (raw == null) return null
  const s = String(raw).trim()
  return s === "" ? null : s
}

/** Parsed activity time, or `null` if the API omitted / invalid timestamp. */
export function getPantryActivityTimestampMs(item: PantryActivityFields): number | null {
  const raw = pickActivityIsoString(item)
  if (raw == null) return null
  const ms = Date.parse(raw)
  return Number.isFinite(ms) ? ms : null
}

export function selectRecentPantryItems<T extends PantryActivityFields>(
  items: T[],
  options?: { lookbackDays?: number; maxItems?: number }
): T[] {
  const lookbackDays = options?.lookbackDays ?? RECENT_ACTIVITY_LOOKBACK_DAYS
  const maxItems = options?.maxItems ?? RECENT_ACTIVITY_MAX_ITEMS
  const cutoff = Date.now() - lookbackDays * 24 * 60 * 60 * 1000

  const withTime: ItemWithActivityTime<T>[] = []
  for (const item of items) {
    const parsedMs = getPantryActivityTimestampMs(item)
    if (parsedMs != null && parsedMs < cutoff) continue
    const sortMs = parsedMs ?? 0
    withTime.push({ item, activityMs: sortMs })
  }

  withTime.sort((a, b) => b.activityMs - a.activityMs)
  return withTime.slice(0, maxItems).map(({ item }) => item)
}

export function pantryItemWasUpdated(item: PantryActivityFields): boolean {
  const u = item.updated_at ?? item.updatedAt
  return u != null && String(u).trim() !== ""
}

export function formatRelativeActivityTime(iso: string | null | undefined): string {
  if (iso == null || String(iso).trim() === "") return "—"
  const d = new Date(iso)
  const t = d.getTime()
  if (Number.isNaN(t)) return "—"

  const diffMs = Date.now() - t
  const diffSec = Math.floor(diffMs / 1000)
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

  if (diffSec < 45) return "just now"
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return rtf.format(-diffMin, "minute")
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return rtf.format(-diffHour, "hour")
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 30) return rtf.format(-diffDay, "day")
  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return rtf.format(-diffMonth, "month")
  const diffYear = Math.floor(diffDay / 365)
  return rtf.format(-diffYear, "year")
}
