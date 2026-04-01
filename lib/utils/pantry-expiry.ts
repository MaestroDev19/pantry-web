/** Parse `YYYY-MM-DD` as local calendar date (no UTC shift). */
function parseLocalDate(isoDate: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim())
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null
  return new Date(y, mo - 1, d)
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export type PantryExpiryKind = "none" | "ok" | "soon" | "expired"

const SOON_DAYS = 7

export function getPantryExpiryKind(
  expiryDate: string | null | undefined
): PantryExpiryKind {
  if (expiryDate == null || String(expiryDate).trim() === "") return "none"
  const exp = parseLocalDate(String(expiryDate))
  if (!exp) return "none"
  const today = startOfLocalDay(new Date())
  const expDay = startOfLocalDay(exp)
  const diffMs = expDay.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000))
  if (diffDays < 0) return "expired"
  if (diffDays <= SOON_DAYS) return "soon"
  return "ok"
}
