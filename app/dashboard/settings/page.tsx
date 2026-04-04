import { redirect } from "next/navigation";

import { SettingsIndexPage } from "@/components/dash/settings-index-page";
import { getDashboardData } from "@/lib/utils/dashboard";

export default async function SettingsPage() {
  const data = await getDashboardData();
  if (!data) {
    redirect("/");
  }

  return <SettingsIndexPage />;
}
