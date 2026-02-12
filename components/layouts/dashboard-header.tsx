import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  TypographyH2,
  TypographyLead,
  TypographyMuted,
} from "@/components/typography"

interface DashboardHeaderProps {
  title: string
  subtitle: string
  userEmail?: string
  primaryActionLabel?: string
  primaryActionSlot?: ReactNode
}

export function DashboardHeader(props: DashboardHeaderProps) {
  const { title, subtitle, userEmail, primaryActionLabel, primaryActionSlot } =
    props

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <TypographyH2 className="text-left">{title}</TypographyH2>
        <TypographyLead className="text-left max-w-2xl">
          {subtitle}
        </TypographyLead>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {userEmail ? (
          <TypographyMuted className="md:text-right">
            Signed in as{" "}
            <span className="font-medium text-foreground">{userEmail}</span>
          </TypographyMuted>
        ) : null}

        {primaryActionSlot ??
          (primaryActionLabel ? (
            <Button size="sm" variant="outline" type="button">
              {primaryActionLabel}
            </Button>
          ) : null)}
      </div>
    </header>
  )
}

