import type { SupabaseClient } from "@supabase/supabase-js"

import {
  HOUSEHOLD_MEMBERS_TABLE,
  HOUSEHOLDS_TABLE,
} from "@/lib/constants/tables"
export interface MembershipError {
  message?: string
  code?: string
  hint?: string
}

export interface HouseholdCreateRequest {
  name: string
  is_personal: boolean
}

/** FastAPI `HouseholdJoinRequest` */
export interface HouseholdJoinRequestBody {
  invite_code: string
}

export interface MembershipRow {
  household_id: string
}

export interface HouseholdDetailsForSettings {
  household_id: string
  name: string | null
  invite_code: string | null
  is_personal: boolean | null
}

/** FastAPI `HouseholdResponse` (UUIDs serialized as strings). */
export interface HouseholdApiResponse {
  id: string
  name: string
  created_at: string
  invite_code: string
  is_personal: boolean
}

/** FastAPI `HouseholdJoinResponse` */
export interface HouseholdJoinSuccessBody {
  household: HouseholdApiResponse
  items_moved: number
}

const HOUSEHOLDS_CREATE_PATH = "/households/create"
const HOUSEHOLDS_JOIN_PATH = "/households/join"
/** FastAPI `leave_household` (response uses legacy field name `items_deleted` for moved count). */
const HOUSEHOLDS_LEAVE_PATH = "/households/leave"
const HOUSEHOLDS_CONVERT_TO_JOINABLE_PATH = "/households/convert-to-joinable"
const PERSONAL_HOUSEHOLD_NAME = "Personal Household"

/** Matches server `INVITE_CODE_LENGTH` (pantry-microservice `core/constants.py`). */
export const EXPECTED_INVITE_CODE_LENGTH = 6

const ALREADY_MEMBER_MESSAGE = "already a member"

function pantryApiUrl(apiBaseUrl: string, path: string): string {
  const base = apiBaseUrl.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  if (base.endsWith("/api")) return `${base}${p}`
  return `${base}/api${p}`
}

/**
 * Normalizes user-entered invite codes before calling the API (trim + uppercase).
 */
export function normalizeInviteCodeForApi(raw: string): string {
  return raw.trim().toUpperCase()
}

function parseRetryAfterSeconds(header: string | null): number | undefined {
  if (!header?.trim()) return undefined
  const n = parseInt(header.trim(), 10)
  if (Number.isFinite(n) && n >= 0) return n
  return undefined
}

function parsePantryApiErrorMessage(body: unknown): string | null {
  if (body == null) return null
  if (typeof body === "string") {
    const t = body.trim()
    return t ? t.slice(0, 500) : null
  }
  if (typeof body !== "object") return null
  const o = body as Record<string, unknown>
  const detail = o.detail
  if (typeof detail === "string") return detail
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as Record<string, unknown>
    const msg = first.msg
    if (typeof msg === "string") return msg
  }
  const errors = o.errors
  if (Array.isArray(errors) && errors.length > 0) {
    const first = errors[0] as Record<string, unknown>
    const msg = first.msg
    if (typeof msg === "string") return msg
  }
  const message = o.message
  if (typeof message === "string") return message
  return null
}

function parseJsonResponse(text: string): unknown {
  if (!text.trim()) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

/**
 * Fetches household membership for a user. Single responsibility: one Supabase query.
 */
export async function getMembershipByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<{ data: MembershipRow | null; error: MembershipError | null }> {
  const { data, error } = await supabase
    .from(HOUSEHOLD_MEMBERS_TABLE)
    .select("household_id")
    .eq("user_id", userId)
    .maybeSingle()

  return {
    data: data as MembershipRow | null,
    error: error
      ? {
          message: error.message,
          code: error.code,
          hint: error.hint,
        }
      : null,
  }
}

/**
 * Membership row plus household share fields (invite code, personal vs joinable).
 */
export async function getHouseholdDetailsByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<{
  data: HouseholdDetailsForSettings | null
  error: MembershipError | null
}> {
  const { data: member, error: memberError } = await supabase
    .from(HOUSEHOLD_MEMBERS_TABLE)
    .select("household_id")
    .eq("user_id", userId)
    .maybeSingle()

  if (memberError) {
    return {
      data: null,
      error: {
        message: memberError.message,
        code: memberError.code,
        hint: memberError.hint,
      },
    }
  }

  if (!member?.household_id) {
    return { data: null, error: null }
  }

  const { data: row, error: householdError } = await supabase
    .from(HOUSEHOLDS_TABLE)
    .select("invite_code, is_personal, name")
    .eq("id", member.household_id)
    .maybeSingle()

  if (householdError) {
    return {
      data: null,
      error: {
        message: householdError.message,
        code: householdError.code,
        hint: householdError.hint,
      },
    }
  }

  if (!row) {
    return { data: null, error: null }
  }

  const r = row as {
    invite_code: string | null
    is_personal: boolean | null
    name: string | null
  }

  return {
    data: {
      household_id: member.household_id,
      name: r.name ?? null,
      invite_code: r.invite_code ?? null,
      is_personal: r.is_personal ?? null,
    },
    error: null,
  }
}

function isHouseholdApiResponse(data: unknown): data is HouseholdApiResponse {
  if (!data || typeof data !== "object") return false
  const o = data as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.created_at === "string" &&
    typeof o.invite_code === "string" &&
    typeof o.is_personal === "boolean"
  )
}

function isHouseholdJoinSuccessBody(
  data: unknown
): data is HouseholdJoinSuccessBody {
  if (!data || typeof data !== "object") return false
  const o = data as Record<string, unknown>
  if (!isHouseholdApiResponse(o.household)) return false
  const moved = o.items_moved
  return typeof moved === "number" && Number.isFinite(moved)
}

export type CreatePersonalHouseholdResult =
  | { ok: true; data: HouseholdApiResponse }
  | {
      ok: false
      status: number
      message: string
      alreadyMember?: boolean
    }

/**
 * Calls the backend to create a household (default: personal). Single responsibility: one API call.
 */
export async function createPersonalHousehold(
  apiBaseUrl: string,
  token: string,
  payload: HouseholdCreateRequest = {
    name: PERSONAL_HOUSEHOLD_NAME,
    is_personal: true,
  }
): Promise<CreatePersonalHouseholdResult> {
  const url = pantryApiUrl(apiBaseUrl, HOUSEHOLDS_CREATE_PATH)
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const text = await res.text()
  const body = parseJsonResponse(text)

  if (res.ok) {
    if (isHouseholdApiResponse(body)) {
      return { ok: true, data: body }
    }
    return {
      ok: false,
      status: res.status,
      message: "Unexpected response from server while creating a household.",
    }
  }

  const parsed =
    parsePantryApiErrorMessage(body) ?? (typeof body === "string" ? body : null)
  const errorText = typeof text === "string" ? text : ""
  const alreadyMember =
    res.status === 400 &&
    (errorText.includes(ALREADY_MEMBER_MESSAGE) ||
      (parsed?.toLowerCase().includes("already") ?? false))

  const fallback =
    res.status === 401 || res.status === 403
      ? "Sign in again to create a household."
      : "Could not create your household. Try again later."

  return {
    ok: false,
    status: res.status,
    message: parsed ?? fallback,
    ...(alreadyMember ? { alreadyMember: true as const } : {}),
  }
}

export type JoinHouseholdCallResult =
  | { ok: true; data: HouseholdJoinSuccessBody }
  | {
      ok: false
      status: number
      message: string
      retryAfterSeconds?: number
    }

const JOIN_RATE_LIMIT_MESSAGE =
  "Too many join attempts in a short time. Please wait before trying again."

/**
 * Joins a household by invite code (normalized: trim + uppercase before send).
 */
export async function joinHousehold(
  apiBaseUrl: string,
  accessToken: string,
  rawInviteCode: string
): Promise<JoinHouseholdCallResult> {
  const invite_code = normalizeInviteCodeForApi(rawInviteCode)
  const url = pantryApiUrl(apiBaseUrl, HOUSEHOLDS_JOIN_PATH)
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ invite_code } satisfies HouseholdJoinRequestBody),
  })

  const retryAfterSeconds = parseRetryAfterSeconds(
    res.headers.get("Retry-After")
  )
  const text = await res.text()
  const body = parseJsonResponse(text)

  if (res.ok) {
    if (isHouseholdJoinSuccessBody(body)) {
      return { ok: true, data: body }
    }
    return {
      ok: false,
      status: res.status,
      message: "Unexpected response from server while joining.",
    }
  }

  const parsed =
    parsePantryApiErrorMessage(body) ?? (typeof body === "string" ? body : null)

  if (res.status === 429) {
    const waitHint =
      retryAfterSeconds != null
        ? ` You can try again in about ${retryAfterSeconds} seconds.`
        : ""
    return {
      ok: false,
      status: res.status,
      message: `${JOIN_RATE_LIMIT_MESSAGE}${waitHint}`,
      retryAfterSeconds,
    }
  }

  const fallback =
    res.status === 401 || res.status === 403
      ? "Sign in again to join a household."
      : res.status === 404 || res.status === 400
        ? "That invite code is invalid or no longer active."
        : "Could not join this household. Try again later."

  return {
    ok: false,
    status: res.status,
    message: parsed ?? fallback,
    retryAfterSeconds,
  }
}

/** FastAPI `HouseholdLeaveResponse` */
export interface LeaveHouseholdSuccessBody {
  message: string
  /** API field name; service moves items — display as “moved” in UI. */
  items_deleted: number
  new_household_id?: string | null
  new_household_name?: string | null
}

export type LeaveHouseholdCallResult =
  | { ok: true; data: LeaveHouseholdSuccessBody }
  | {
      ok: false
      status: number
      message: string
      retryAfterSeconds?: number
    }

function isLeaveHouseholdSuccessBody(
  data: unknown
): data is LeaveHouseholdSuccessBody {
  if (!data || typeof data !== "object") return false
  const o = data as Record<string, unknown>
  const idOk =
    o.new_household_id === undefined ||
    o.new_household_id === null ||
    typeof o.new_household_id === "string"
  const nameOk =
    o.new_household_name === undefined ||
    o.new_household_name === null ||
    typeof o.new_household_name === "string"
  return (
    typeof o.message === "string" &&
    typeof o.items_deleted === "number" &&
    Number.isFinite(o.items_deleted) &&
    idOk &&
    nameOk
  )
}

/**
 * Leaves the current household via FastAPI. Items are moved to a new personal household server-side.
 */
export async function leaveHousehold(
  apiBaseUrl: string,
  accessToken: string
): Promise<LeaveHouseholdCallResult> {
  const url = pantryApiUrl(apiBaseUrl, HOUSEHOLDS_LEAVE_PATH)
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: "{}",
  })

  const retryAfterSeconds = parseRetryAfterSeconds(
    res.headers.get("Retry-After")
  )

  const text = await res.text()
  const body = parseJsonResponse(text)

  if (res.ok) {
    if (isLeaveHouseholdSuccessBody(body)) {
      return { ok: true, data: body }
    }
    return {
      ok: false,
      status: res.status,
      message: "Unexpected response from server while leaving.",
      retryAfterSeconds,
    }
  }

  const parsed =
    parsePantryApiErrorMessage(body) ?? (typeof body === "string" ? body : null)
  const fallback =
    res.status === 429
      ? "Too many attempts. Please wait before trying again."
      : "Could not leave this household. Try again later."
  return {
    ok: false,
    status: res.status,
    message: parsed ?? fallback,
    retryAfterSeconds,
  }
}

export type ConvertHouseholdToJoinableResult =
  | { ok: true; data: HouseholdApiResponse }
  | { ok: false; status: number; message: string; retryAfterSeconds?: number }

/**
 * Converts the current personal household to joinable (FastAPI `convert_to_joinable`).
 */
export async function convertHouseholdToJoinable(
  apiBaseUrl: string,
  accessToken: string,
  body?: { name?: string }
): Promise<ConvertHouseholdToJoinableResult> {
  const url = pantryApiUrl(apiBaseUrl, HOUSEHOLDS_CONVERT_TO_JOINABLE_PATH)
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body?.name != null ? { name: body.name } : {}),
  })

  const retryAfterSeconds = parseRetryAfterSeconds(
    res.headers.get("Retry-After")
  )

  const text = await res.text()
  const parsedBody = parseJsonResponse(text)

  if (res.ok) {
    if (isHouseholdApiResponse(parsedBody)) {
      return { ok: true, data: parsedBody }
    }
    return {
      ok: false,
      status: res.status,
      message: "Unexpected response from server while updating the household.",
      retryAfterSeconds,
    }
  }

  const msg =
    parsePantryApiErrorMessage(parsedBody) ??
    (typeof parsedBody === "string" ? parsedBody : null)
  const fallback =
    res.status === 429
      ? "Too many household updates. Please wait a minute and try again."
      : res.status === 403
        ? "Only the household owner can make it shareable."
        : res.status === 400
          ? "This household is already shareable or cannot be converted."
          : "Could not make the household shareable. Try again later."

  return {
    ok: false,
    status: res.status,
    message: msg ?? fallback,
    retryAfterSeconds,
  }
}

export { PERSONAL_HOUSEHOLD_NAME }
