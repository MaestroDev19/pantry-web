"use server";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  createPersonalHousehold,
  getMembershipByUserId,
} from "@/actions/household";
import { isRefreshTokenNotFound } from "@/lib/auth-errors";
import { getApiBaseUrl } from "@/lib/config";
import { getSafeSessionToken } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const MEMBERSHIP_NOT_FOUND_KEY = "NEXT_PUBLIC_MEMBERSHIP_NOT_FOUND_CODE";

function isIgnorableMembershipError(code: string | undefined): boolean {
  const expectedCode = process.env[MEMBERSHIP_NOT_FOUND_KEY];
  return typeof expectedCode === "string" && code === expectedCode;
}

function logMembershipError(
  context: string,
  err: { message?: string; code?: string; hint?: string },
): void {
  if (err.message ?? err.code ?? err.hint) {
    console.error(context, err);
  }
}

/**
 * Ensures the user has a household membership; creates a personal household via API if none.
 * Accepts optional Supabase client for dependency injection (one client per request).
 */
export async function checkForHouseholdMembership(
  userId: string,
  supabaseInstance?: SupabaseClient,
): Promise<void> {
  const apiBase = getApiBaseUrl();
  if (!apiBase) {
    console.error("API base URL not configured; skipping household check.");
    return;
  }

  const supabase = supabaseInstance ?? (await createClient());

  const { data: membership, error: membershipError } =
    await getMembershipByUserId(supabase, userId);

  if (membershipError) {
    if (isIgnorableMembershipError(membershipError.code)) {
      return;
    }
    logMembershipError("Error checking membership:", membershipError);
    return;
  }

  if (membership) return;

  try {
    const token = await getSafeSessionToken();
    if (!token) return;

    const result = await createPersonalHousehold(apiBase, token);

    if (!result.ok && !result.alreadyMember) {
      console.error("Failed to create household.");
    }
  } catch (err) {
    if (isRefreshTokenNotFound(err)) {
      redirect("/");
    }
    console.error("Failed to create household membership:", err);
  }
}
