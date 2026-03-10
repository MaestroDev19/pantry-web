export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  name: string;
  confirmPassword: string;
}

export interface AuthActionResult {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  redirect?: string;
}

export const InitialAuthActionResult: AuthActionResult = { ok: false };

export interface AuthActionArgs {
  formData: FormData;
}

export interface SupabaseUser {
  id: string;
  email: string | null;
  user_metadata?: Record<string, unknown>;
}

export function getUserFromClaims(
  claims: Record<string, unknown>,
): SupabaseUser {
  return {
    id: claims.sub as string,
    email: (claims.email as string | undefined) ?? null,
    user_metadata:
      (claims.user_metadata as Record<string, unknown> | undefined) ?? {},
  };
}
