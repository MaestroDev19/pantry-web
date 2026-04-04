import { HouseholdStatusBanner } from "@/components/dash/household-status-banner"
import { NavBar } from "@/components/nav"
import { getDashboardData } from "@/lib/utils/dashboard"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await getDashboardData()

  if (!data) {
    redirect("/")
  }

  return (
    <div className="flex min-h-svh flex-col">
      <HouseholdStatusBanner check={data.householdCheck} />
      <div className="bg-site-background sticky top-0 z-50 h-12 border-b border-dashed border-border backdrop-blur-md">
        <div className="w-full border-dashed border-border px-4 py-2 md:px-10 lg:px-20 xl:border-x">
          <NavBar data={data} />
        </div>
      </div>
      <div className="mx-auto flex w-full flex-1 flex-col px-4 py-8 md:px-6 lg:px-10">
        {children}
      </div>
    </div>
  )
}
