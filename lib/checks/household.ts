"use server"

import type { SupabaseClient } from '@supabase/supabase-js'

import {
	createPersonalHousehold,
	getMembershipByUserId,
	type MembershipError,
} from '@/lib/actions/household'
import { getApiBaseUrl } from '@/lib/utils/config'
import { getSafeSessionToken } from '@/lib/utils/session'
import { createClient } from '@/lib/supabase/server'

function logMembershipError(
	context: string,
	err: MembershipError,
): void {
	if (err.message ?? err.code ?? err.hint) {
		console.error(context, err)
	}
}

/**
 * Ensures the user has a household membership; creates a personal household via API if none.
 * Accepts optional Supabase client for dependency injection (one client per request).
 */
export async function checkForHouseholdMembership(
	userId: string,
	supabaseInstance?: SupabaseClient,
): Promise<void> {
	const apiBase = getApiBaseUrl()
	if (!apiBase) {
		console.error('API base URL not configured; skipping household check.')
		return
	}

	const supabase = supabaseInstance ?? (await createClient())

	const { data: membership, error: membershipError } =
		await getMembershipByUserId(supabase, userId)

	if (membershipError) {
		logMembershipError('Error checking membership:', membershipError)
		return
	}

	if (membership) return

	try {
		const token = await getSafeSessionToken()
		if (!token) return

		const result = await createPersonalHousehold(apiBase, token)

		if (!result.ok && !result.alreadyMember) {
			console.error('Failed to create household.')
		}
	} catch (err) {
		console.error('Failed to create household membership:', err)
	}
}
