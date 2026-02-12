import {
  Card,
  CardHeader,
} from "@/components/ui/card"
import { TypographyH3, TypographySmall } from "@/components/typography"

type PantryStatTone = "default" | "warning" | "danger"

export interface PantryStatCardProps {
  label: string
  value: string
  tone?: PantryStatTone
}

export function PantryStatCard(props: PantryStatCardProps) {
  const { label, value, tone = "default" } = props

  const toneClasses =
    tone === "warning"
      ? "border-amber-400/60 bg-amber-50/60 dark:border-amber-500/60 dark:bg-amber-950/20"
      : tone === "danger"
        ? "border-red-400/60 bg-red-50/60 dark:border-red-500/60 dark:bg-red-950/20"
        : ""

  return (
    <Card className={toneClasses}>
      <CardHeader className="gap-1 px-4 pb-3">
        <TypographySmall className="text-muted-foreground">
          {label}
        </TypographySmall>
        <TypographyH3 className="text-2xl font-semibold tracking-tight">
          {value}
        </TypographyH3>
      </CardHeader>
    </Card>
  )
}

