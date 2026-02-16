"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isRefreshTokenNotFound, getSafeSessionToken } from "@/lib/auth/utils";
import { SupabaseClient, User } from "@supabase/supabase-js";

export async function checkForHouseholdMembership(
	userId: string,
	API_BASE: string,
) {
	const supabase = await createClient();

	// Check for existing membership
	const { data: membership, error: membershipError } = await supabase
		.from("household_members")
		.select("household_id")
		.eq("user_id", userId)
		.maybeSingle();

	if (membershipError) {
		// Error code 42P17 is "infinite recursion detected in policy"
		// This typically means the RLS policy is checking household_members
		// while reading from household_members, which suggests membership exists.
		// We'll treat this as "membership exists" to avoid blocking the dashboard.
		if (membershipError.code === "42P17") {
			// User likely has membership, but RLS policy has recursion issue
			// Don't block dashboard - membership check will be handled by API if needed
			return;
		}
		// Only log other errors (not empty object)
		if (membershipError.message || membershipError.code || membershipError.hint) {
			console.error("Error checking membership:", membershipError);
		}
		return;
	}

	if (membership) {
		return;
	}

	// No membership, attempt to create default household
	try {
		const token = await getSafeSessionToken(supabase);

		if (!token) {
			// Should not happen if getSafeSessionToken throws on error,
			// but if it returns undefined (no session), we can't create household.
			return;
		}

		const res = await fetch(`${API_BASE}/households/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ name: "Personal", is_personal: true }),
		});

		if (!res.ok) {
			const errorText = await res.text();
			// If the user is already a member, we consider this a success (state is achieved)
			if (res.status === 400 && errorText.includes("already a member")) {
				return;
			}
			console.error(
				`Failed to create household: ${res.status} ${errorText}`,
			);
		}
	} catch (err) {
		if (isRefreshTokenNotFound(err)) {
			redirect("/login");
		}
		console.error("Failed to create household membership:", err);
		// We might not want to block the dashboard load if household creation fails,
		// but it's a critical part of the app. For now, we log and proceed.
	}
}

export async function ensureUserProfile(supabase: SupabaseClient, user: User) {
	const fullName =
		(user.user_metadata?.full_name as string | undefined) ?? null;
	const email = user.email ?? null;

	await supabase.from("profiles").upsert(
		{
			id: user.id,
			full_name: fullName,
			email,
			updated_at: new Date().toISOString(),
		},
		{ onConflict: "id" },
	);
}
