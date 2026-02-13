import type React from 'react'
import type { User } from '@supabase/supabase-js'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const API_BASE =
	process.env.NEXT_PUBLIC_PANTRY_API_URL ?? 'http://127.0.0.1:8000'

function isRefreshTokenNotFound(error: unknown): boolean {
	const code =
		error && typeof error === 'object' && 'code' in error
			? (error as { code?: string }).code
			: undefined
	return code === 'refresh_token_not_found'
}

/** Build a User-like object from JWT claims (avoids calling getUser() and triggering refresh). */
function userFromClaims(claims: Record<string, unknown>): User {
	const sub = claims.sub as string
	const email = (claims.email as string | undefined) ?? null
	const user_metadata = (claims.user_metadata as Record<string, unknown> | undefined) ?? {}
	return {
		id: sub,
		email,
		user_metadata,
	} as User
}

interface DashboardLayoutProps {
	children: React.ReactNode
}

/**
 * Authenticated dashboard layout.
 * Uses getClaims() (like the proxy) to avoid triggering a refresh on the server.
 * Ensures user is signed in, syncs profile and household membership,
 * then renders sidebar and main content area.
 */
export default async function DashboardLayout(props: DashboardLayoutProps) {
	const { children } = props
	const supabase = await createClient()

	let claims: Record<string, unknown> | undefined
	try {
		const { data } = await supabase.auth.getClaims()
		claims = data?.claims as Record<string, unknown> | undefined
	} catch (err) {
		if (isRefreshTokenNotFound(err)) {
			redirect('/login')
		}
		throw err
	}
	if (!claims?.sub) {
		redirect('/')
	}

	const user = userFromClaims(claims)

	const fullName =
		(user.user_metadata?.full_name as string | undefined) ?? null
	const email = user.email ?? null

	await supabase.from('profiles').upsert(
		{
			id: user.id,
			full_name: fullName,
			email,
			updated_at: new Date().toISOString(),
		},
		{ onConflict: 'id' },
	)

	const { data: membership } = await supabase
		.from('household_members')
		.select('id')
		.eq('user_id', user.id)
		.limit(1)
		.maybeSingle()

	if (!membership) {
		let token: string | undefined
		try {
			const { data: sessionData, error: sessionError } =
				await supabase.auth.getSession()
			if (sessionError && isRefreshTokenNotFound(sessionError)) {
				redirect('/login')
			}
			token = sessionData?.session?.access_token
		} catch (err) {
			if (isRefreshTokenNotFound(err)) {
				redirect('/login')
			}
			throw err
		}
		if (token) {
			await fetch(`${API_BASE}/households/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ name: 'Personal', is_personal: true }),
			})
		}
	}

	const sidebarStyle = {
		'--sidebar-width': 'calc(var(--spacing) * 72)',
		'--header-height': 'calc(var(--spacing) * 12)',
	} as React.CSSProperties

	return (
		<SidebarProvider style={sidebarStyle}>
			<AppSidebar variant="inset" user={user} />
			<SidebarInset>
				<SiteHeader />
				{children}
			</SidebarInset>
		</SidebarProvider>
	)
}
