"use server";
import { getSafeSessionToken } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { PantryItemInsert } from "@/types/pantrytypes";

const PANTY_ITEMS_CREATE_PATH = "/pantry/add_item";

export async function addPantryItem(
  item: PantryItemInsert,
  apiBaseUrl: string,
) {
  const sessionToken = await getSafeSessionToken();
  if (!sessionToken) {
    return {
      message: "Please reauthenticate to add a pantry item",
      redirect: "/",
    };
  }
  const url = `${apiBaseUrl}${PANTY_ITEMS_CREATE_PATH}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const errorText = await res.text();
    return { message: errorText || "Failed to add pantry item" };
  }
  revalidatePath("/", "layout");
  return { message: "Pantry item added successfully" };
}
