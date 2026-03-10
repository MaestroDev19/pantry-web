export interface MembershipRow {
  household_id: string;
}

export interface MembershipError {
  message?: string;
  code?: string;
  hint?: string;
}
export interface HouseholdCreateRequest {
  name: string;
  is_personal?: boolean;
}
