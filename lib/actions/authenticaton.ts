"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  AuthActionResult,
  LoginFormData,
  SignupFormData,
} from "@/lib/types/authtypes";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signInWithEmail(
  data: LoginFormData,
): Promise<AuthActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error || !user) {
    return {
      ok: false,
      message: error?.message ?? "Invalid credentials.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpWithEmail(
  data: SignupFormData,
): Promise<AuthActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.name,
      },
    },
  });

  if (error) {
    return {
      ok: false,
      message: error?.message ?? "Sign up failed.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/confirm");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
