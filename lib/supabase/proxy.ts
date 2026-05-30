import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

function getOptionalPublicEnv(value: string | undefined): string | undefined {
  if (!value) return undefined
  return value
}

function isPublicPathname(pathname: string): boolean {
  // Keep aligned with the list in this file that governs redirect behavior.
  const publicPaths = ["/", "/signup", "/confirm"]
  return publicPaths.includes(pathname)
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = getOptionalPublicEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabasePublishableKey = getOptionalPublicEnv(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )

  // This proxy runs for (almost) every request. If Supabase env vars aren't configured,
  // throwing here makes the entire app unloadable (including the login page).
  if (!supabaseUrl || !supabasePublishableKey) {
    console.error(
      "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
      {
        pathname: request.nextUrl.pathname,
        hasSupabaseUrl: Boolean(supabaseUrl),
        hasSupabasePublishableKey: Boolean(supabasePublishableKey),
      }
    )

    const pathname = request.nextUrl.pathname
    if (isPublicPathname(pathname)) {
      return supabaseResponse
    }

    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("error", "missing_supabase_env")
    return NextResponse.redirect(url)
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data, error: claimsError } = await supabase.auth.getClaims()

  if (
    claimsError &&
    "code" in claimsError &&
    (claimsError.code === "refresh_token_not_found" ||
      claimsError.code === "invalid_refresh_token")
  ) {
    await supabase.auth.signOut()
  }

  const user = claimsError ? undefined : data?.claims

  const pathname = request.nextUrl.pathname
  const isPublicPath = isPublicPathname(pathname)

  if (!user && !isPublicPath) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
