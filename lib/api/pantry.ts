"use client"

import { createClient } from "@/lib/supabase/client"
import { resolvePantryRequestUrl } from "@/lib/utils/config"
import type {
  CategoryEnum,
  PantryItem,
  PantryItemInsert,
  UnitEnum,
} from "@/lib/types/pantrytypes"

/**
 * Maps dashboard labels to API category strings.
 * Each UI category needs a distinct code so GET responses round-trip via
 * `CATEGORY_SLUG_TO_ENUM` in `shoppingtypes.ts` (e.g. Snacks must not all map to `other`).
 */
const UI_TO_API_CATEGORY: Record<CategoryEnum, string> = {
  Dairy: "dairy",
  Produce: "produce",
  "Meat & Seafood": "meat",
  "Grains & Pasta": "grains",
  "Canned Goods": "canned",
  Frozen: "frozen",
  Snacks: "snacks",
  Beverages: "beverages",
  "Condiments & Oils": "spices",
  Baking: "baking",
  Other: "other",
}

/** Maps UI units to FastAPI `UnitEnum` string values. */
const UI_TO_API_UNIT: Record<UnitEnum, string> = {
  kg: "kilogram",
  g: "gram",
  mg: "gram",
  lb: "kilogram",
  oz: "gram",
  L: "liter",
  mL: "milliliter",
  gal: "liter",
  cup: "cup",
  tbsp: "tablespoon",
  tsp: "teaspoon",
  pieces: "piece",
  items: "piece",
  can: "piece",
  bottle: "piece",
  box: "piece",
  bag: "piece",
  pack: "piece",
}

function mapInsertToApiBody(input: PantryItemInsert): Record<string, unknown> {
  const rawUnit = input.unit ?? ("pieces" as const)
  const apiUnit =
    typeof rawUnit === "string" && rawUnit in UI_TO_API_UNIT
      ? UI_TO_API_UNIT[rawUnit as UnitEnum]
      : "piece"

  const body: Record<string, unknown> = {
    name: input.name,
    category: UI_TO_API_CATEGORY[input.category],
    quantity: input.quantity ?? 1,
    unit: apiUnit,
  }

  if (input.expiry_date) {
    body.expiry_date = input.expiry_date
  }

  return body
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

/** FastAPI `pantry_router.get("/get-my-items")` */
export const PANTRY_GET_MY_ITEMS_PATH = "/api/pantry-items/get-my-items" as const

/** FastAPI `pantry_router.get("/get-household-pantry")` */
export const PANTRY_GET_HOUSEHOLD_PATH =
  "/api/pantry-items/get-household-pantry" as const

async function getAccessToken(): Promise<string | null> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) return null
  return data.session?.access_token ?? null
}

async function callPantryApi(opts: {
  path: string
  method: HttpMethod
  body?: unknown
}): Promise<{ ok: boolean; status: number; data: unknown }> {
  const token = await getAccessToken()
  if (!token) {
    throw new Error("No Supabase session token found. Sign in first.")
  }

  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`
  const url = resolvePantryRequestUrl(path)

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  }

  let body: string | undefined
  if (opts.method !== "GET" && opts.method !== "DELETE" && opts.body != null) {
    body = JSON.stringify(opts.body)
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(url, { method: opts.method, headers, body })
  const text = await res.text()
  const data = text ? (JSON.parse(text) as unknown) : null
  return { ok: res.ok, status: res.status, data }
}

export async function addPantryItem(input: PantryItemInsert): Promise<{
  ok: boolean
  status: number
  data: unknown
}> {
  return await callPantryApi({
    path: "/api/pantry-items/add-single-item",
    method: "POST",
    body: mapInsertToApiBody(input),
  })
}

function mapBulkInsertToApiBody(input: PantryItemInsert): Record<string, unknown> {
  const body: Record<string, unknown> = {
    name: input.name,
    category: UI_TO_API_CATEGORY[input.category],
    quantity: input.quantity ?? 1,
  }

  if (input.expiry_date) {
    body.expiry_date = input.expiry_date
  }

  return body
}

export async function addBulkPantryItems(inputs: PantryItemInsert[]): Promise<{
  ok: boolean
  status: number
  data: unknown
}> {
  return await callPantryApi({
    path: "/api/pantry-items/add-bulk-items",
    method: "POST",
    body: {
      items: inputs.map(mapBulkInsertToApiBody),
    },
  })
}

function parsePantryItemsResponse(
  res: { ok: boolean; data: unknown },
): PantryItem[] | unknown {
  if (
    res.ok &&
    res.data &&
    typeof res.data === "object" &&
    "items" in res.data &&
    Array.isArray((res.data as { items: unknown }).items)
  ) {
    return (res.data as { items: PantryItem[] }).items
  }
  return res.data
}

export async function getMyPantryItems(): Promise<{
  ok: boolean
  status: number
  data: PantryItem[] | unknown
}> {
  const res = await callPantryApi({
    path: PANTRY_GET_MY_ITEMS_PATH,
    method: "GET",
  })
  return {
    ok: res.ok,
    status: res.status,
    data: parsePantryItemsResponse(res),
  }
}

export async function getHouseholdPantryItems(): Promise<{
  ok: boolean
  status: number
  data: PantryItem[] | unknown
}> {
  const res = await callPantryApi({
    path: PANTRY_GET_HOUSEHOLD_PATH,
    method: "GET",
  })

  return {
    ok: res.ok,
    status: res.status,
    data: parsePantryItemsResponse(res),
  }
}

export async function fetchHouseholdPantryItemsForSwr(): Promise<PantryItem[]> {
  const res = await getHouseholdPantryItems()
  if (!res.ok) {
    throw new Error(`Failed to load pantry items (${res.status})`)
  }
  return Array.isArray(res.data) ? res.data : []
}

/** Pantry rows attributed to the signed-in user (`owner_id`). */
export function filterMyPantryItems(
  items: PantryItem[],
  userId: string | null | undefined
): PantryItem[] {
  if (!userId) return []
  return items.filter((item) => item.owner_id === userId)
}

