import { cache } from "react";

import { getUserClaims, getUserProfile } from "@/lib/dal/auth";
import { checkForHouseholdMembership } from "@/lib/checks/household";

export interface DashboardData {
  userProfile: NonNullable<Awaited<ReturnType<typeof getUserProfile>>>;
}

export const getDashboardData = cache(
  async (): Promise<DashboardData | null> => {
    const userClaims = await getUserClaims();
    if (!userClaims) return null;

    const userId = userClaims.user.id;

    const [userProfile] = await Promise.all([
      getUserProfile(userId),
      // best-effort side effect; dashboard data does not depend on its result
      checkForHouseholdMembership(userId),
    ]);

    if (!userProfile) return null;

    return { userProfile };
  },
);
