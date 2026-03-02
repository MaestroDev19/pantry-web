import { SectionCards } from "@/components/dashboard/section-cards";
import { ExpirationTable } from "@/components/dashboard/expiration-table";
import { getDashboardData } from "@/lib/dashboard";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/dashboard/data-table";
import data from "@/app/dashboard/data.json";
export default async function Dashboard() {
  const dashboardData = await getDashboardData();
  if (!dashboardData) redirect("/");

  const { full_name, email, avatar_url } = dashboardData.userProfile.user;
  return (
    <div className="flex flex-1 flex-col px-4 md:px-6">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col py-4 gap-4 md:gap-6 md:py-6">
          <h1 className="text-2xl font-bold">
            Welcome, {full_name ?? email ?? "there"}!
          </h1>
          <SectionCards />
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
