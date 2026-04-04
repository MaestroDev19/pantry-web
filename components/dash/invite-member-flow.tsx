"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { InviteMemberSheet } from "@/components/dash/invite-member-sheet";
import { MakeHouseholdShareableSheet } from "@/components/dash/make-household-shareable-sheet";

export interface InviteMemberFlowProps {
  /** When false, the user must confirm conversion before opening the email invite sheet. */
  householdIsPersonal: boolean;
}

export function InviteMemberFlow({ householdIsPersonal }: InviteMemberFlowProps) {
  const router = useRouter();
  const [gateOpen, setGateOpen] = React.useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);

  const handleInviteClick = React.useCallback(() => {
    if (householdIsPersonal) setGateOpen(true);
    else setInviteOpen(true);
  }, [householdIsPersonal]);

  const handleShareableConfirmed = React.useCallback(() => {
    setInviteOpen(true);
    toast.success("Household is shareable. Add an email to send an invite.");
    router.refresh();
  }, [router]);

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={handleInviteClick}>
        <UserPlus className="size-4" data-icon="inline-start" />
        Invite member
      </Button>
      <MakeHouseholdShareableSheet
        open={gateOpen}
        onOpenChange={setGateOpen}
        onConfirm={handleShareableConfirmed}
      />
      <InviteMemberSheet open={inviteOpen} onOpenChange={setInviteOpen} />
    </>
  );
}
