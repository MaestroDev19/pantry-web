import type React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { checkForHouseholdMembership, ensureUserProfile } from '@/lib/auth/checks/actions'
import { getUserFromClaims, isRefreshTokenNotFound } from '@/lib/auth/utils'

const API_BASE =
	process.env.NEXT_PUBLIC_PANTRY_API_URL ?? 'http://127.0.0.1:8000'

interface DashboardLayoutProps {
	children: React.ReactNode
}

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

	const user = getUserFromClaims(claims)

	await Promise.all([
		ensureUserProfile(supabase, user),
		checkForHouseholdMembership(user.id, API_BASE),
	])
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
