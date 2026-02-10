import type React from "react"

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
import { TypographyH3, TypographyMuted } from "../typography"
import Link from "next/link"

/**
 * SignupForm renders the registration fields shown on the `/register` route.
 * Validation will be handled by the surrounding server action once Supabase auth is wired in.
 */
export function SignupForm(props: React.ComponentProps<"div">) {
  const { className, ...rest } = props

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
          <form>
            <FieldGroup>
              {/* Basic profile information */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" type="text" placeholder="John Doe" required />
              </Field>

              {/* Account credentials */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" required />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input id="confirm-password" type="password" required />
                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              </Field>

              {/* Submit action and link back to login */}
              <FieldGroup>
                <Field>
                  <Button type="submit">Create Account</Button>
                  <FieldDescription className="px-6 text-center">
                    Already have an account? <Link href="/">Login</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
