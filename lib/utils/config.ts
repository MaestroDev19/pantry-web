const API_URL_KEYS = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_PANTRY_API_URL'] as const

export function getApiBaseUrl(): string | undefined {
	for (const key of API_URL_KEYS) {
		const url = process.env[key]
		if (!url || typeof url !== 'string') continue
		const trimmed = url.trim()
		if (trimmed) return trimmed
	}
	return undefined
}
