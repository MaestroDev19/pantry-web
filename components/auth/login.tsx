"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { signInWithEmail } from "@/lib/actions/authenticaton";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/lib/validations/auth";
import { useState } from "react";
import { AuthActionResult } from "@/lib/types/authtypes";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        let result: AuthActionResult | undefined;
        await new Promise(async (resolve) => {
          setTimeout(async () => {
            result = await signInWithEmail(value);
            resolve(result as AuthActionResult);
          }, 1000);
        });

        if (result && result.ok === false) {
          toast.error(result.message);
          return;
        }

        toast.success("Signed in successfully");
        router.push("/dashboard");
      } catch (error: unknown) {
        const err = error as Error;
        toast.error(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold">Welcome back</h1>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </FieldDescription>
          </div>
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="m@example.com"
                    autoComplete="email"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-muted-foreground hover:text-foreground ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="current-password"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <Field>
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting && (
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span>Signing in...</span>
                </div>
              )}
              {!isSubmitting && <span>Sign in</span>}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
