import { DashboardHeader } from "@/components/layouts/dashboard-header"
import { PANTRY_DASHBOARD_COPY } from "@/lib/copy/pantry-dashboard"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_PANTRY_API_URL ?? "http://127.0.0.1:8000"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout(props: DashboardLayoutProps) {
  const { children } = props
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? null
  const email = user.email ?? null

  await supabase
    .from("profiles")
    .upsert(
      { id: user.id, full_name: fullName, email, updated_at: new Date().toISOString() },
      { onConflict: "id" },
    )

  const { data: membership } = await supabase
    .from("household_members")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  if (!membership) {
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData?.session?.access_token
    if (token) {
      await fetch(`${API_BASE}/households/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: "Personal", is_personal: true }),
      })
    }
  }

  return (
    <main className="bg-background text-foreground flex min-h-[calc(100svh-4rem)] flex-col gap-6 px-4 py-6 md:gap-8 md:px-8 md:py-8">
      <DashboardHeader
        title={PANTRY_DASHBOARD_COPY.title}
        subtitle={PANTRY_DASHBOARD_COPY.subtitle}
        userEmail={user.email ?? undefined}
        primaryActionLabel="Add item"
      />
      {children}
    </main>
  )
}
