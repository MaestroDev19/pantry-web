import Link from "next/link";
import { redirect } from "next/navigation";

import { getDashboardData } from "@/lib/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function AccountPage() {
  const dashboardData = await getDashboardData();

  if (!dashboardData) {
    redirect("/");
  }

  const {
    userProfile: {
      user: { full_name, email, avatar_url },
    },
  } = dashboardData;

  const displayName = full_name ?? email ?? "Account";
  const initials = (full_name || email || "User")
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-1 flex-col px-4 md:px-6">
      <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your profile, notification preferences, and household
            details.
          </p>
        </div>

        <Card className="max-w-3xl w-full mx-auto">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-base font-semibold">
              Profile &amp; Security
            </CardTitle>
            <CardDescription>
              Update your personal information and account security details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-6 py-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Avatar className="h-16 w-16 rounded-full border">
                <AvatarImage src={avatar_url ?? undefined} alt={displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-semibold">{displayName}</p>
                <p className="text-xs text-muted-foreground">
                  Household Admin • Premium Plan
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={email ?? ""}
                  className="bg-muted/40"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  defaultValue={displayName}
                  className="bg-muted/40"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-3 max-w-sm">
              <div className="space-y-1">
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-muted-foreground">
                  Keep your account secure by using a strong, unique password.
                </p>
              </div>
              <Link href="/auth/reset-password">
                <Button type="button" variant="outline" className="w-fit">
                  Change Password
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
