import { SignupForm } from "@/components/pages/signup-form"
import { Utensils } from "lucide-react"

/**
 * Public registration route for the Pantry web app.
 * Mirrors the login page layout but renders the sign-up form instead.
 */
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="w-full max-w-md px-6 py-12">
        <div className="flex w-full max-w-sm flex-col gap-6">
          {/* Shared brand header used across auth routes */}
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Utensils className="size-4" />
            </div>
            Pantry
          </a>

          {/* Sign-up form for creating a new account */}
          <SignupForm />
        </div>
      </main>
    </div>
  )
}
