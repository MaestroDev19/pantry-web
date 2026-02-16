import { User, SupabaseClient } from '@supabase/supabase-js'

export function isRefreshTokenNotFound(error: unknown): boolean {
	const code =
		error && typeof error === 'object' && 'code' in error
			? (error as { code?: string }).code
			: undefined
	return code === 'refresh_token_not_found'
}

/** Build a User-like object from JWT claims (avoids calling getUser() and triggering refresh). */
export function getUserFromClaims(claims: Record<string, unknown>): User {
	const sub = claims.sub as string
	const email = (claims.email as string | undefined) ?? null
	const user_metadata = (claims.user_metadata as Record<string, unknown> | undefined) ?? {}
	return {
		id: sub,
		email,
		user_metadata,
	} as User
}

/**
 * Safely retrieves the session token, handling refresh token errors.
 * Returns undefined if no session is found, throws error if retrieval fails unexpectedly.
 * logic inspired by previous layout implementation.
 */
export async function getSafeSessionToken(supabase: SupabaseClient): Promise<string | undefined> {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
        if (isRefreshTokenNotFound(sessionError)) {
            // caller should handle redirect if needed, or we just return undefined?
            // The original logic redirected on this error. 
            // We can return null/undefined and let caller decide, or re-throw a specific error type.
            // For now, let's return undefined to indicate "no valid session" but we might need to communicate WHY.
            // Actually, the original code redirected. Let's throw the error so the caller can check `isRefreshTokenNotFound`.
             throw sessionError
        }
        // Log unexpected session errors
        console.error('Session error retrieving token:', sessionError)
        throw sessionError
    }

    return sessionData?.session?.access_token
}
