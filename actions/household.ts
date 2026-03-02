import type { SupabaseClient } from "@supabase/supabase-js";

import { HOUSEHOLD_MEMBERS_TABLE } from "@/constants/tables";
import type { HouseholdCreateRequest } from "@/constants/types";

const HOUSEHOLDS_CREATE_PATH = "/households/create";
const PERSONAL_HOUSEHOLD_NAME = "Personal Household";
const ALREADY_MEMBER_MESSAGE = "already a member";

export interface MembershipRow {
  household_id: string;
}

export interface MembershipError {
  message?: string;
  code?: string;
  hint?: string;
}

/**
 * Fetches household membership for a user. Single responsibility: one Supabase query.
 */
export async function getMembershipByUserId(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ data: MembershipRow | null; error: MembershipError | null }> {
  const { data, error } = await supabase
    .from(HOUSEHOLD_MEMBERS_TABLE)
    .select("household_id")
    .eq("user_id", userId)
    .maybeSingle();

  return {
    data: data as MembershipRow | null,
    error: error
      ? { message: error.message, code: error.code, hint: error.hint }
      : null,
  };
}

/**
 * Calls the backend to create a personal household. Single responsibility: one API call.
 */
export async function createPersonalHousehold(
  apiBaseUrl: string,
  token: string,
  payload: HouseholdCreateRequest = {
    name: PERSONAL_HOUSEHOLD_NAME,
    is_personal: true,
  },
): Promise<{ ok: boolean; alreadyMember?: boolean }> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const url = `${base}${HOUSEHOLDS_CREATE_PATH}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.ok) return { ok: true };

  const errorText = await res.text();
  const alreadyMember =
    res.status === 400 && errorText.includes(ALREADY_MEMBER_MESSAGE);

  return { ok: false, alreadyMember };
}

export { PERSONAL_HOUSEHOLD_NAME };
