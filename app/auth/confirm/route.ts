import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Handles email OTP confirmation (e.g. magic link, email verification).
 * Verifies token_hash and type from query, then redirects to next or error.
 */
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)

	const tokenHash = searchParams.get('token_hash')
	const type = searchParams.get('type') as EmailOtpType | null
	const next = searchParams.get('next') ?? '/'

	if (tokenHash && type) {
		const supabase = await createClient()

		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash: tokenHash,
		})

		if (!error) {
			redirect(next)
		}
	}

	redirect('/auth/auth-code-error')
}
