"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const isSubmitting = status === "sending";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/update-password`,
    });

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Reset your password
          </CardTitle>
          <CardDescription>
            Enter the email associated with your account and we&apos;ll send
            you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? "Sending reset link..." : "Send reset link"}
            </Button>
          </form>

          {status === "sent" && (
            <p className="mt-4 text-sm text-muted-foreground">
              If an account exists for this email, a reset link has been sent.
              You can close this page after updating your password.
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 text-sm text-destructive">
              We couldn&apos;t send the reset email. Check the address and try
              again.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

