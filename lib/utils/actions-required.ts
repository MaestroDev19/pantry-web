import type { PantryItem } from "@/lib/types/pantrytypes"
import { getPantryExpiryKind, type PantryExpiryKind } from "@/lib/utils/pantry-expiry"

export interface RequiredActionItem {
  id: string
  title: string
  description: string
  kind: Extract<PantryExpiryKind, "expired" | "soon">
}

function actionPriority(kind: RequiredActionItem["kind"]): number {
  return kind === "expired" ? 0 : 1
}

function formatExpiryLabel(expiryDate: string | null | undefined): string {
  const raw = expiryDate == null ? "" : String(expiryDate).trim()
  return raw || "unknown date"
}

export function buildRequiredActions(items: PantryItem[]): RequiredActionItem[] {
  const actions: RequiredActionItem[] = []

  for (const item of items) {
    const kind = getPantryExpiryKind(item.expiry_date)
    if (kind !== "expired" && kind !== "soon") continue

    const dateLabel = formatExpiryLabel(item.expiry_date)
    actions.push({
      id: item.id,
      title: item.name,
      kind,
      description:
        kind === "expired"
          ? `Expired on ${dateLabel} — review or remove this item.`
          : `Expires on ${dateLabel} — use soon or update the date.`,
    })
  }

  return actions.sort((a, b) => {
    const byPriority = actionPriority(a.kind) - actionPriority(b.kind)
    if (byPriority !== 0) return byPriority
    return a.title.localeCompare(b.title)
  })
}
