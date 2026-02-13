import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_PREFIX = "sb-";

function clearAuthCookiesAndRedirect(request: NextRequest, pathname = "/login") {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.redirect(url);
  request.cookies.getAll().forEach(({ name }) => {
    if (name.startsWith(AUTH_COOKIE_PREFIX)) {
      response.cookies.set(name, "", { maxAge: 0, path: "/" });
    }
  });
  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  let user: unknown = null;
  try {
    const { data } = await supabase.auth.getClaims();
    user = data?.claims;
  } catch (err) {
    const isInvalidRefreshToken =
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code?: string }).code === "refresh_token_not_found";
    if (isInvalidRefreshToken) {
      return clearAuthCookiesAndRedirect(request);
    }
    throw err;
  }

  const isAuthPath =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname === "/";
  if (!user && !isAuthPath) {
    return clearAuthCookiesAndRedirect(request);
  }

  return supabaseResponse;
}
