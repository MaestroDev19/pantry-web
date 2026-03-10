export function isRefreshTokenNotFound(err: unknown): boolean {
	if (
		err === null ||
		typeof err !== 'object' ||
		!('code' in err) ||
		typeof (err as { code?: unknown }).code !== 'string'
	) {
		return false
	}

	return (err as { code: string }).code === 'refresh_token_not_found'
}
