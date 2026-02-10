import { LoginForm } from "@/components/pages/login-form"
import { Utensils } from "lucide-react"

/**
 * Public login route for the Pantry web app.
 * Renders a centered auth card with brand icon and the email/password form.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="w-full max-w-md px-6 py-12">
        <div className="flex w-full max-w-sm flex-col gap-6">
          {/* Simple brand mark used on all auth screens */}
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Utensils className="size-4" />
            </div>
            Pantry
          </a>

          {/* Email/password login form with validation */}
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
