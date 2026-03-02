import { cache } from "react";

import { getUserClaims, getUserProfile } from "@/lib/dal/auth";
import { checkForHouseholdMembership } from "@/lib/checks/household";

export const getDashboardData = cache(async () => {
  const userClaims = await getUserClaims();
  if (!userClaims) return null;

  const userId = userClaims.user.id;

  const [userProfile] = await Promise.all([
    getUserProfile(userId),
    checkForHouseholdMembership(userId),
  ]);

  if (!userProfile) return null;

  return { userClaims, userProfile };
});
