import { getSessionToken } from '@/lib/dal/auth'

export async function getSafeSessionToken(): Promise<string | null> {
	const result = await getSessionToken()
	if (result.ok) return result.token
	return null
}
