const REFRESH_TOKEN_NOT_FOUND_KEY = "NEXT_PUBLIC_REFRESH_TOKEN_NOT_FOUND_CODE";

export function isRefreshTokenNotFound(err: unknown): boolean {
  const expectedCode = process.env[REFRESH_TOKEN_NOT_FOUND_KEY];
  if (!expectedCode) return false;
  return (
    err !== null &&
    typeof err === "object" &&
    "code" in err &&
    (err as { code?: string }).code === expectedCode
  );
}
