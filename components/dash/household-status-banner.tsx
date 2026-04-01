import type { HouseholdCheckResult } from "@/lib/checks/household";

function messageForCheck(check: HouseholdCheckResult): string {
  if (check.ok) return "";

  switch (check.code) {
    case "MEMBERSHIP_QUERY_FAILED":
      return `Could not verify household membership.${check.message ? ` ${check.message}` : ""}`;
    case "NO_SESSION_FOR_CREATE":
      return "Session token was unavailable; household setup was skipped. Try signing out and back in.";
    case "HOUSEHOLD_CREATE_FAILED":
      return "Could not create your personal household. Check that the API is running and reachable.";
  }
}

export function HouseholdStatusBanner({
  check,
}: {
  check: HouseholdCheckResult;
}) {
  if (check.ok) return null;

  const message = messageForCheck(check);

  return (
    <div
      role="status"
      className="border-b border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-foreground md:px-10 lg:px-20"
    >
      <p className="font-medium text-amber-950 dark:text-amber-100">
        Household setup
      </p>
      <p className="mt-1 text-muted-foreground">{message}</p>
    </div>
  );
}
