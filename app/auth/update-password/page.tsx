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

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "saving" | "done" | "error"
  >("idle");

  const isSubmitting = status === "saving";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("done");
    router.push("/dashboard/account");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Choose a new password
          </CardTitle>
          <CardDescription>
            Enter a strong, unique password to secure your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || password.length < 8}
            >
              {isSubmitting ? "Updating password..." : "Update password"}
            </Button>
          </form>

          {status === "error" && (
            <p className="mt-4 text-sm text-destructive">
              We couldn&apos;t update your password. Refresh this page and try
              again.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

