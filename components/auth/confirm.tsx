"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ConfirmForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Confirm your email</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="space-y-4 text-center">
              <p>
                Check your inbox — we&apos;ve sent you a confirmation link.
                Click it to verify your email and activate your account.
              </p>
              <p>
                Can&apos;t find it? Check your spam folder. Once you&apos;ve
                confirmed, you can close this tab and sign in.
              </p>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
