"use client"

import * as React from "react"
import Form from "next/form"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  TypographyH3,
  TypographyMuted,
  TypographySmall,
} from "../typography"
import {
  type AuthActionResult,
  INITIAL_AUTH_ACTION_RESULT,
} from "@/app/(auth)/auth-types"
import { signUpFormAction } from "@/app/(auth)/actions"

/**
 * SignupForm renders the registration fields shown on the `/register` route.
 * It uses a server action to submit email + password directly to Supabase.
 */
export function SignupForm(props: React.ComponentProps<"div">) {
  const { className, ...rest } = props
  const router = useRouter()

  const [formState, formAction, pending] = React.useActionState<
    AuthActionResult,
    FormData
  >(signUpFormAction, INITIAL_AUTH_ACTION_RESULT)

  React.useEffect(() => {
    if (formState.ok) router.push("/dashboard")
  }, [formState.ok, router])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...rest}>
      <Card>
        <CardHeader className="text-center">
          <div className="text-center">
            <CardTitle>
              <TypographyH3>Create your account</TypographyH3>
            </CardTitle>
            <CardDescription>
              <TypographyMuted>
                Enter your email below to create your account
              </TypographyMuted>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form action={formAction}>
            <FieldGroup>
              {/* Basic profile information (not sent to Supabase yet) */}
              <Field>
                <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                  disabled={pending}
                />
              </Field>

              {/* Account credentials */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                  disabled={pending}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={pending}
                />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={pending}
                />
                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              </Field>

              {formState.message ? (
                <Field>
                  <FieldDescription className="text-sm text-destructive">
                    {formState.message}
                  </FieldDescription>
                </Field>
              ) : null}

              {formState.ok ? (
                <Field>
                  <FieldDescription className="text-sm text-emerald-600 dark:text-emerald-400">
                    <TypographySmall>
                      Account created successfully. You can now log in.
                    </TypographySmall>
                  </FieldDescription>
                </Field>
              ) : null}

              {/* Submit action and link back to login */}
              <FieldGroup>
                <Field>
                  <Button type="submit" disabled={pending}>
                    {pending ? "Creating account..." : "Create Account"}
                  </Button>
                  <FieldDescription className="px-6 text-center">
                    Already have an account? <Link href="/">Login</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
