"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TypographyH3, TypographyMuted } from "../typography";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// Zod schema that defines the login form shape and validation rules.
// This keeps the form contract centralized and type-safe.
const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Your password should be at least 8 characters long" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

/**
 * LoginForm is a client component that renders the email/password login UI.
 * It uses react-hook-form + Zod for validation and exposes a simple div-style API.
 */
export function LoginForm(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  // Initialize react-hook-form with the Zod resolver to keep validation logic
  // on the client in sync with our schema.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleLoginSubmit(values: LoginFormValues) {
    // This is where the server action / Supabase sign-in flow will be wired in.
    console.log("login submit", values);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...rest}>
      <Card>
        <CardHeader>
          <div className="text-center">
            <CardTitle>
              <TypographyH3>Welcome back</TypographyH3>
            </CardTitle>
            <CardDescription>
              <TypographyMuted>
                Please enter your email to sign in to your account.
              </TypographyMuted>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLoginSubmit)} noValidate>
            <FieldGroup>
              {/* Email field */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <FieldDescription className="text-sm text-destructive">
                    {errors.email.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Password field with a simple "forgot" link placeholder */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && (
                  <FieldDescription className="text-sm text-destructive">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Primary submit button and link to the registration screen */}
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/register">Create an account</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
