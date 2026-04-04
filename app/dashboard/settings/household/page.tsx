import { redirect } from "next/navigation"

import { HouseholdSettingsPage } from "@/components/dash/household-settings-page"
import { getHouseholdDetailsByUserId } from "@/lib/actions/household"
import { getDashboardData } from "@/lib/utils/dashboard"
import { createClient } from "@/lib/supabase/server"

export default async function HouseholdSettingsRoute() {
  const data = await getDashboardData()
  if (!data) {
    redirect("/")
  }

  const supabase = await createClient()
  const { data: household } = await getHouseholdDetailsByUserId(
    supabase,
    data.userProfile.user.id
  )

  const isPersonal = household?.is_personal !== false

  return (
    <HouseholdSettingsPage
      user={data.userProfile.user}
      householdId={household?.household_id ?? null}
      initialHouseholdName={household?.name ?? undefined}
      householdIsPersonal={isPersonal}
      initialInviteCode={household?.invite_code ?? null}
    />
  )
}
