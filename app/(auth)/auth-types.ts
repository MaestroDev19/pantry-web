/**
 * Result shape returned by auth server actions (sign-in, sign-up).
 */
export interface AuthActionResult {
	ok: boolean
	message?: string
}

/** Initial value for auth action state (e.g. useActionState). */
export const INITIAL_AUTH_ACTION_RESULT: AuthActionResult = {
	ok: false,
}
