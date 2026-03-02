"use server";

import { PROFILES_TABLE } from "@/constants/tables";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseUser } from "@/types/authtypes";
import { redirect } from "next/navigation";

export async function ensureUserProfile(
  user: SupabaseUser | undefined,
): Promise<void> {
  if (!user?.id) {
    redirect("/");
  }
  const supabase = await createClient();
  const metadata = user.user_metadata ?? {};
  const fullName =
    (metadata.full_name as string | undefined) ??
    (metadata.name as string | undefined) ??
    null;
  const email = user.email ?? null;

  const { error } = await supabase.from(PROFILES_TABLE).upsert(
    {
      id: user.id,
      full_name: fullName,
      email,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(error.message);
  }
}
