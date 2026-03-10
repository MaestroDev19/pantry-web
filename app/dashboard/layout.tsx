import { NavBar } from "@/components/nav";
import { getDashboardData } from "@/lib/utils/dashboard";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getDashboardData();

  if (!data) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-svh select-none">
      <div className="border-b border-border border-dashed sticky top-0 bg-site-background backdrop-blur-md z-50 h-12">
        <div className="md:px-10 lg:px-20 px-4 py-2  w-full  border-border border-dashed xl:border-x">
          <NavBar data={data} />
        </div>
      </div>
      <div className="flex flex-1 flex-col py-8 md:px-10 lg:px-20 px-4 w-full mx-auto">
        {children}
      </div>
    </div>
  );
}
