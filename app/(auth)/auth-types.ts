export interface AuthActionResult {
  ok: boolean
  message?: string
}

export const INITIAL_AUTH_ACTION_RESULT: AuthActionResult = {
  ok: false,
}
