"use server";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  createPersonalHousehold,
  getMembershipByUserId,
  type MembershipError,
} from "@/lib/actions/household";
import { getApiBaseUrl } from "@/lib/utils/config";
import { getSafeSessionToken } from "@/lib/utils/session";
import { createClient } from "@/lib/supabase/server";

function logMembershipError(context: string, err: MembershipError): void {
  if (err.message ?? err.code ?? err.hint) {
    console.error(context, err);
  }
}

export type HouseholdCheckResult =
  | { ok: true }
  | {
      ok: false;
      code: "MEMBERSHIP_QUERY_FAILED";
      message?: string;
    }
  | { ok: false; code: "NO_SESSION_FOR_CREATE" }
  | { ok: false; code: "HOUSEHOLD_CREATE_FAILED" };

/**
 * Ensures the user has a household membership; creates a personal household via API if none.
 * Accepts optional Supabase client for dependency injection (one client per request).
 */
export async function checkForHouseholdMembership(
  userId: string,
  supabaseInstance?: SupabaseClient,
): Promise<HouseholdCheckResult> {
  const apiBase = getApiBaseUrl();

  const supabase = supabaseInstance ?? (await createClient());

  const { data: membership, error: membershipError } =
    await getMembershipByUserId(supabase, userId);

  if (membershipError) {
    logMembershipError("Error checking membership:", membershipError);
    return {
      ok: false,
      code: "MEMBERSHIP_QUERY_FAILED",
      message: membershipError.message,
    };
  }

  if (membership) return { ok: true };

  try {
    const token = await getSafeSessionToken();
    if (!token) {
      return { ok: false, code: "NO_SESSION_FOR_CREATE" };
    }

    const result = await createPersonalHousehold(apiBase, token);

    if (result.ok || result.alreadyMember) {
      return { ok: true };
    }

    console.error("Failed to create household.");
    return { ok: false, code: "HOUSEHOLD_CREATE_FAILED" };
  } catch (err) {
    console.error("Failed to create household membership:", err);
    return { ok: false, code: "HOUSEHOLD_CREATE_FAILED" };
  }
}
