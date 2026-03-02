const API_URL_KEY = "NEXT_PUBLIC_API_URL";

export function getApiBaseUrl(): string | undefined {
  const url = process.env[API_URL_KEY];
  if (!url || typeof url !== "string") return undefined;
  return url.trim() || undefined;
}
