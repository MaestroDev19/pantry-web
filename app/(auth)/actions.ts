"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { AuthActionResult } from "./auth-types";

const signUpSchema = z
	.object({
		full_name: z.string().min(1, "Please enter your full name."),
		email: z.string().trim().pipe(z.email()),
		password: z.string().min(8, "Password must be at least 8 characters."),
		confirm_password: z.string().min(1, "Please confirm your password."),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords do not match.",
		path: ["confirm_password"],
	});

const emailPasswordSchema = z.object({
	email: z.string().trim().pipe(z.email()),
	password: z.string().min(8),
});

interface AuthActionArgs {
	formData: FormData;
}

/**
 * Signs in the user with email and password.
 * @param args - Object containing form data with email and password.
 * @returns Result with ok and optional message for errors.
 */
export async function signInWithEmailPasswordAction(
	args: AuthActionArgs,
): Promise<AuthActionResult> {
	const { formData } = args;

	const rawEmail = formData.get("email");
	const rawPassword = formData.get("password");

	const parsed = emailPasswordSchema.safeParse({
		email: typeof rawEmail === "string" ? rawEmail : "",
		password: typeof rawPassword === "string" ? rawPassword : "",
	});

	if (!parsed.success) {
		return {
			ok: false,
			message: "Please enter a valid email and password to continue.",
		};
	}

	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email: parsed.data.email,
		password: parsed.data.password,
	});

	if (error) {
		return {
			ok: false,
			message:
				error.message ||
				"Unable to login with these credentials. Please try again.",
		};
	}

	return {
		ok: true,
	};
}

/**
 * Creates a new user account with email, password, and full name.
 * @param args - Object containing form data.
 * @returns Result with ok and optional message for errors.
 */
export async function signUpWithEmailPasswordAction(
	args: AuthActionArgs,
): Promise<AuthActionResult> {
	const { formData } = args;

	const rawFullName = formData.get("full_name");
	const rawEmail = formData.get("email");
	const rawPassword = formData.get("password");
	const rawConfirmPassword = formData.get("confirm_password");

	const parsed = signUpSchema.safeParse({
		full_name: typeof rawFullName === "string" ? rawFullName.trim() : "",
		email: typeof rawEmail === "string" ? rawEmail : "",
		password: typeof rawPassword === "string" ? rawPassword : "",
		confirm_password:
			typeof rawConfirmPassword === "string" ? rawConfirmPassword : "",
	});

	if (!parsed.success) {
		const { fieldErrors } = z.flattenError(parsed.error);
		const message =
			fieldErrors.confirm_password?.[0] ??
			fieldErrors.password?.[0] ??
			fieldErrors.email?.[0] ??
			fieldErrors.full_name?.[0] ??
			"Please enter your name, a valid email, and matching passwords (8+ chars).";
		return { ok: false, message };
	}

	const supabase = await createClient();

	const { error } = await supabase.auth.signUp({
		email: parsed.data.email,
		password: parsed.data.password,
		options: {
			data: { full_name: parsed.data.full_name },
		},
	});

	if (error) {
		return {
			ok: false,
			message: error.message,
		};
	}

	return {
		ok: true,
	};
}

/**
 * Server action for the sign-up form (useActionState).
 * @param _prevState - Previous action state (unused).
 * @param formData - Form data from the sign-up form.
 * @returns Result with ok and optional message for errors.
 */
export async function signUpFormAction(
	_prevState: AuthActionResult,
	formData: FormData,
): Promise<AuthActionResult> {
	return signUpWithEmailPasswordAction({ formData });
}

/**
 * Signs out the current user.
 * Errors are logged; UI does not depend on the return value.
 */
export async function signOutAction(): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		console.error("Error signing out:", error.message);
		throw new Error(error.message);
	}
}
