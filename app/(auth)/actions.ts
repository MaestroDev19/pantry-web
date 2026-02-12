"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const emailPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

interface AuthActionArgs {
  formData: FormData
}

export interface AuthActionResult {
  ok: boolean
  message?: string
}

export const INITIAL_AUTH_ACTION_RESULT: AuthActionResult = {
  ok: false,
}

export async function signInWithEmailPasswordAction(
  args: AuthActionArgs,
): Promise<AuthActionResult> {
  const { formData } = args

  const rawEmail = formData.get("email")
  const rawPassword = formData.get("password")

  const parsed = emailPasswordSchema.safeParse({
    email: typeof rawEmail === "string" ? rawEmail : "",
    password: typeof rawPassword === "string" ? rawPassword : "",
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please enter a valid email and password to continue.",
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return {
      ok: false,
      message: "Unable to login with these credentials. Please try again.",
    }
  }

  return {
    ok: true,
  }
}

export async function signUpWithEmailPasswordAction(
  args: AuthActionArgs,
): Promise<AuthActionResult> {
  const { formData } = args

  const rawEmail = formData.get("email")
  const rawPassword = formData.get("password")

  const parsed = emailPasswordSchema.safeParse({
    email: typeof rawEmail === "string" ? rawEmail : "",
    password: typeof rawPassword === "string" ? rawPassword : "",
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please enter a valid email and password to continue.",
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return {
      ok: false,
      message:
        "Unable to create an account with these details. Please try again.",
    }
  }

  return {
    ok: true,
  }
}

export async function signUpFormAction(
  _prevState: AuthActionResult,
  formData: FormData,
): Promise<AuthActionResult> {
  return signUpWithEmailPasswordAction({ formData })
}
