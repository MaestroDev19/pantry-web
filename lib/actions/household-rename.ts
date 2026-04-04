"use server";

import { revalidatePath } from "next/cache";

import {
	getMembershipByUserId,
	PERSONAL_HOUSEHOLD_NAME,
} from "@/lib/actions/household";
import { HOUSEHOLDS_TABLE } from "@/lib/constants/tables";
import { createClient } from "@/lib/supabase/server";

const NAME_MAX = 120;

export type RenameHouseholdActionResult =
	| { ok: true }
	| { ok: false; message: string };

/**
 * Updates the current user's household name in Supabase (same source as settings read).
 */
export async function renameHouseholdAction(
	name: string,
): Promise<RenameHouseholdActionResult> {
	const trimmed = name.trim();
	if (!trimmed) {
		return { ok: false, message: "Enter a household name." };
	}
	if (trimmed.length > NAME_MAX) {
		return { ok: false, message: `Use at most ${NAME_MAX} characters.` };
	}

	const supabase = await createClient();
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		return { ok: false, message: "You need to be signed in to rename the household." };
	}

	const { data: membership, error: membershipError } =
		await getMembershipByUserId(supabase, user.id);

	if (membershipError?.message) {
		return { ok: false, message: "Could not verify your household membership." };
	}

	const householdId = membership?.household_id;
	if (!householdId) {
		return {
			ok: false,
			message: `No household is linked yet. If you just signed in, try refreshing. Otherwise create a household (default name: ${PERSONAL_HOUSEHOLD_NAME}).`,
		};
	}

	const { error: updateError } = await supabase
		.from(HOUSEHOLDS_TABLE)
		.update({ name: trimmed })
		.eq("id", householdId);

	if (updateError) {
		return {
			ok: false,
			message:
				updateError.message ||
				"Could not save the household name. You may not have permission to change it.",
		};
	}

	revalidatePath("/dashboard/settings/household");
	revalidatePath("/dashboard", "layout");
	return { ok: true };
}
