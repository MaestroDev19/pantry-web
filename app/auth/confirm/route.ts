import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { getUserClaims } from "@/lib/dal/auth";
import { ensureUserProfile } from "@/lib/checks/profile";
import { checkForHouseholdMembership } from "@/lib/checks/household";
import { createClient } from "@/lib/supabase/server";

function getSafeNextPath(nextParam: string | null): string {
  if (!nextParam) return "/dashboard";
  return nextParam.startsWith("/") ? nextParam : "/kitchen";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = getSafeNextPath(searchParams.get("next"));

  if (tokenHash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      const userClaims = await getUserClaims();
      if (!userClaims) {
        redirect("/");
      }

      await Promise.all([
        ensureUserProfile(userClaims.user),
        checkForHouseholdMembership(userClaims.user.id),
      ]);

      redirect(next);
    }
  }

  redirect("/auth/auth-code-error");
}
