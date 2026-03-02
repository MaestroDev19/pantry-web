import { getSessionToken } from "@/lib/dal/auth";

export async function getSafeSessionToken(): Promise<string | null> {
  const result = await getSessionToken();
  if ("token" in result) return result.token;
  return null;
}
