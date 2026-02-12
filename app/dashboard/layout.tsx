import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { PANTRY_DASHBOARD_COPY } from "@/lib/copy/pantry-dashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout(props: DashboardLayoutProps) {
  const { children } = props;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
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
  );
}
