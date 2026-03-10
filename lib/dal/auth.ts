import { cache } from 'react'

import { createClient } from '@/lib/supabase/server'
import { getUserFromClaims } from '@/lib/types/authtypes'
import { PROFILES_TABLE } from '@/lib/constants/tables'

export interface UserProfile {
	id: string
	email: string
	full_name: string
	avatar_url: string
}

export interface SessionTokenSuccess {
	ok: true
	token: string
}

export interface SessionTokenFailure {
	ok: false
	message: string
	redirect: string
}

export type SessionTokenResponse = SessionTokenSuccess | SessionTokenFailure

/**
 * Returns the authenticated user's claims derived from the Supabase session.
 * Used as the single source of truth for user identity in server components.
 */
export const getUserClaims = cache(async () => {
	const supabase = await createClient()
	try {
		const { data, error } = await supabase.auth.getClaims()
		if (error || !data?.claims) return null

		return {
			user: getUserFromClaims(data.claims as Record<string, unknown>),
		}
	} catch {
		return null
	}
})

/**
 * Loads the user's profile row from the `profiles` table.
 * Returns `null` when the profile does not exist or cannot be loaded.
 */
export const getUserProfile = cache(
	async (userId: string): Promise<{ user: UserProfile } | null> => {
		const supabase = await createClient()
		const { data, error } = await supabase
			.from(PROFILES_TABLE)
			.select('id, email, full_name, avatar_url')
			.eq('id', userId)
			.single()

		if (error || !data) return null

		return {
			user: {
				id: data.id,
				email: data.email,
				full_name: data.full_name,
				avatar_url: data.avatar_url,
			},
		}
	},
)

/**
 * Retrieves the current session access token.
 * On success returns `{ ok: true, token }`, otherwise an error
 * object with a redirect target for callers that need to enforce auth.
 */
export const getSessionToken = cache(
	async (): Promise<SessionTokenResponse> => {
		const supabase = await createClient()
		try {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession()

			if (error || !session) {
				return {
					ok: false,
					message: error?.message ?? 'Failed to get session',
					redirect: '/',
				}
			}

			return {
				ok: true,
				token: session.access_token,
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				return {
					ok: false,
					message: err.message,
					redirect: '/',
				}
			}

			return {
				ok: false,
				message: 'Unknown error',
				redirect: '/',
			}
		}
	},
)

