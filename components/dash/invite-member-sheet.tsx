"use client";

import * as React from "react";
import { Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVITE_SEND_MS = 1500;

export interface InviteMemberSheetProps {
  trigger?: React.ReactNode;
  /** Controlled mode (omit `trigger`). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InviteMemberSheet({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: InviteMemberSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled =
    controlledOpen !== undefined && controlledOnOpenChange !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (isControlled) controlledOnOpenChange(next);
      else setInternalOpen(next);
    },
    [isControlled, controlledOnOpenChange],
  );
  const [email, setEmail] = React.useState("");
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    if (open) setEmail("");
  }, [open]);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next && sending) return;
      setOpen(next);
    },
    [sending],
  );

  const handleSend = React.useCallback(async () => {
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Enter an email address.");
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      toast.error("Enter a valid email address.");
      return;
    }
    setSending(true);
    try {
      await new Promise<void>((r) => setTimeout(r, INVITE_SEND_MS));
      toast.message(
        "Invites are not connected yet. This will send when your API supports email invitations.",
      );
      setOpen(false);
    } finally {
      setSending(false);
    }
  }, [email]);

  const defaultTrigger = (
    <Button type="button" variant="outline" size="sm">
      <UserPlus className="size-4" data-icon="inline-start" />
      Invite member
    </Button>
  );

  const form = (
    <FieldGroup className="gap-4">
      <Field>
        <FieldLabel htmlFor="invite-member-email">Email address</FieldLabel>
        <Input
          id="invite-member-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={sending}
        />
        <FieldDescription>
          They will receive an invitation to join this household pantry.
        </FieldDescription>
      </Field>
    </FieldGroup>
  );

  const footer = (
    <>
      <DialogClose asChild>
        <Button type="button" variant="outline" disabled={sending}>
          Cancel
        </Button>
      </DialogClose>
      <Button
        type="button"
        disabled={sending}
        onClick={() => void handleSend()}
      >
        {sending && <Spinner data-icon="inline-start" />}
        Send invite
      </Button>
    </>
  );

  const drawerFooter = (
    <>
      <DrawerClose asChild>
        <Button type="button" variant="outline" disabled={sending}>
          Cancel
        </Button>
      </DrawerClose>
      <Button
        type="button"
        disabled={sending}
        onClick={() => void handleSend()}
      >
        {sending && <Spinner data-icon="inline-start" />}
        Send invite
      </Button>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {!isControlled ? (
          <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
        ) : null}
        <DialogContent
          className="sm:max-w-md"
          showCloseButton={!sending}
          onPointerDownOutside={(e) => sending && e.preventDefault()}
          onEscapeKeyDown={(e) => sending && e.preventDefault()}
        >
          <DialogHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="size-5" aria-hidden />
            </div>
            <DialogTitle>Invite member</DialogTitle>
            <DialogDescription>
              Send an email invite so someone can access this household pantry.
            </DialogDescription>
          </DialogHeader>
          {form}
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {footer}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      {!isControlled ? (
        <DrawerTrigger asChild>{trigger ?? defaultTrigger}</DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader className="text-start">
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="size-5" aria-hidden />
          </div>
          <DrawerTitle>Invite member</DrawerTitle>
          <DrawerDescription>
            Send an email invite so someone can access this household pantry.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{form}</div>
        <DrawerFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {drawerFooter}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
