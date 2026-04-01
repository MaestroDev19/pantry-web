import { cache } from "react";

import {
  checkForHouseholdMembership,
  type HouseholdCheckResult,
} from "@/lib/checks/household";
import { getUserClaims, getUserProfile } from "@/lib/dal/auth";

export interface DashboardData {
  userProfile: NonNullable<Awaited<ReturnType<typeof getUserProfile>>>;
  householdCheck: HouseholdCheckResult;
}

export const getDashboardData = cache(
  async (): Promise<DashboardData | null> => {
    const userClaims = await getUserClaims();
    if (!userClaims) return null;

    const userId = userClaims.user.id;

    const [userProfile, householdCheck] = await Promise.all([
      getUserProfile(userId),
      checkForHouseholdMembership(userId),
    ]);

    if (!userProfile) return null;

    return { userProfile, householdCheck };
  },
);
