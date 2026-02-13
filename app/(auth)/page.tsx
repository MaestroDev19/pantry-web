import { LoginForm } from "@/components/pages/login-form";
import { Link, Utensils } from "lucide-react";

/**
 * Public login route for the Pantry web app.
 * Renders a centered auth card with brand icon and the email/password form.
 */
export default function LoginPage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<main className="w-full max-w-md px-6 py-12">
				<div className="flex w-full max-w-sm flex-col gap-6">
					<Link
						href="/"
						className="flex items-center gap-2 self-center font-medium"
						aria-label="Pantry home"
					>
						<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
							<Utensils className="size-4" aria-hidden />
						</div>
						Pantry
					</Link>
					<LoginForm />
				</div>
			</main>
		</div>
	);
}
