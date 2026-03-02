import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { getUserFromClaims } from "@/types/authtypes";
import { PROFILES_TABLE } from "@/constants/tables";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

export interface SessionTokenResult {
  token: string;
}

export interface SessionTokenError {
  message: string;
  redirect: string;
}

export const getUserClaims = cache(async () => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) return null;
    return {
      user: getUserFromClaims(data.claims as Record<string, unknown>),
    };
  } catch {
    return null;
  }
});

export const getUserProfile = cache(
  async (userId: string): Promise<{ user: UserProfile } | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .select("id, email, full_name, avatar_url")
      .eq("id", userId)
      .single();

    if (error || !data) return null;

    return {
      user: {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
      },
    };
  },
);

export const getSessionToken = cache(
  async (): Promise<SessionTokenResult | SessionTokenError> => {
    const supabase = await createClient();
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session) {
        return {
          message: error?.message ?? "Failed to get session",
          redirect: "/",
        };
      }
      return { token: session.access_token };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { message: err.message, redirect: "/" };
      }
      return { message: "Unknown error", redirect: "/" };
    }
  },
);
