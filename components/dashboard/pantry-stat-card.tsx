import { Card, CardHeader } from "@/components/ui/card"
import { TypographyH3, TypographySmall } from "@/components/typography"

type PantryStatTone = "good" | "warning" | "danger" | "neutral"

export interface PantryStatCardProps {
  label: string
  value: string
  helper: string
  tone?: PantryStatTone
}

export function PantryStatCard(props: PantryStatCardProps) {
  const { label, value, helper, tone = "neutral" } = props

  const toneClasses: Record<
    PantryStatTone,
    { container: string; helper: string; iconBg: string; iconText: string; iconGlyph: string }
  > = {
    good: {
      container: "border-emerald-100 bg-white",
      helper: "text-emerald-600",
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
      iconGlyph: "✓",
    },
    warning: {
      container: "border-amber-100 bg-white",
      helper: "text-amber-600",
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
      iconGlyph: "⧗",
    },
    danger: {
      container: "border-red-100 bg-white",
      helper: "text-red-600",
      iconBg: "bg-red-50",
      iconText: "text-red-600",
      iconGlyph: "!",
    },
    neutral: {
      container: "border-slate-100 bg-white",
      helper: "text-slate-500",
      iconBg: "bg-slate-100",
      iconText: "text-slate-600",
      iconGlyph: "□",
    },
  }

  const styles = toneClasses[tone]

  return (
    <Card className={`flex items-center justify-between border shadow-sm ${styles.container}`}>
      <CardHeader className="gap-2 p-5">
        <TypographySmall className="text-muted-foreground">{label}</TypographySmall>
        <TypographyH3 className="text-3xl font-bold tracking-tight">{value}</TypographyH3>
        <TypographySmall className={styles.helper}>{helper}</TypographySmall>
      </CardHeader>
      <div
        className={`mr-5 flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}
        aria-hidden="true"
      >
        <span className={`text-lg font-semibold ${styles.iconText}`}>{styles.iconGlyph}</span>
      </div>
    </Card>
  )
}

