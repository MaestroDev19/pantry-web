import type { PantryItem } from "@/lib/types/pantrytypes"

export type PantryAdditionsTimeRange = "7d" | "30d" | "90d"

export type PantryAdditionsChartRow = {
  date: string
  you: number
  housemate: number
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function timeRangeToDays(range: PantryAdditionsTimeRange): number {
  if (range === "7d") return 7
  if (range === "30d") return 30
  return 90
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function toLocalDateKey(value: string | null | undefined): string | null {
  if (value == null || String(value).trim() === "") return null
  const parsed = new Date(String(value))
  if (Number.isNaN(parsed.getTime())) return null
  const day = startOfLocalDay(parsed)
  const y = day.getFullYear()
  const m = String(day.getMonth() + 1).padStart(2, "0")
  const d = String(day.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function buildDateKeysInRange(
  endDate: Date,
  days: number,
): string[] {
  const end = startOfLocalDay(endDate)
  const keys: string[] = []
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const day = new Date(end.getTime() - offset * MS_PER_DAY)
    keys.push(formatDateKey(day))
  }
  return keys
}

export function buildPantryAdditionsChartData(
  items: PantryItem[],
  currentUserId: string,
  range: PantryAdditionsTimeRange,
  referenceDate: Date = new Date(),
): PantryAdditionsChartRow[] {
  const days = timeRangeToDays(range)
  const dateKeys = buildDateKeysInRange(referenceDate, days)
  const startKey = dateKeys[0]
  const counts = new Map<string, { you: number; housemate: number }>()

  for (const key of dateKeys) {
    counts.set(key, { you: 0, housemate: 0 })
  }

  for (const item of items) {
    const key = toLocalDateKey(item.created_at)
    if (!key || !startKey || key < startKey) continue

    const bucket = counts.get(key)
    if (!bucket) continue

    if (item.owner_id === currentUserId) {
      bucket.you += 1
    } else {
      bucket.housemate += 1
    }
  }

  return dateKeys.map((date) => {
    const bucket = counts.get(date) ?? { you: 0, housemate: 0 }
    return { date, you: bucket.you, housemate: bucket.housemate }
  })
}

export function pantryAdditionsHasData(rows: PantryAdditionsChartRow[]): boolean {
  return rows.some((row) => row.you > 0 || row.housemate > 0)
}
