"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { AuthActionResult } from "./auth-types";

const signUpSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email(),
  password: z.string().min(8),
});

const emailPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface AuthActionArgs {
  formData: FormData;
}

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

export async function signUpWithEmailPasswordAction(
  args: AuthActionArgs,
): Promise<AuthActionResult> {
  const { formData } = args;

  const rawFullName = formData.get("full_name");
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const parsed = signUpSchema.safeParse({
    full_name: typeof rawFullName === "string" ? rawFullName.trim() : "",
    email: typeof rawEmail === "string" ? rawEmail : "",
    password: typeof rawPassword === "string" ? rawPassword : "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message:
        "Please enter your name, a valid email, and a password (8+ characters).",
    };
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

export async function signUpFormAction(
  _prevState: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  return signUpWithEmailPasswordAction({ formData });
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    // Optionally log or capture the error; UI does not depend on this return.
    console.error("Error signing out:", error.message);
  }
}
