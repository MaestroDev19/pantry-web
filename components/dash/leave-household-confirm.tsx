"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import {
  leaveHousehold,
  type LeaveHouseholdSuccessBody,
} from "@/lib/actions/household"
import { createClient } from "@/lib/supabase/client"
import { getApiBaseUrl } from "@/lib/utils/config"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Spinner } from "@/components/ui/spinner"

export interface LeaveHouseholdConfirmProps {
  householdName: string
  onLeaveSuccess?: (data: LeaveHouseholdSuccessBody) => void
}

async function getBrowserAccessToken(): Promise<string | null> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) return null
  return data.session?.access_token ?? null
}

function buildSuccessToastDescription(data: LeaveHouseholdSuccessBody): string {
  const moved = data.items_deleted
  const movedLine =
    moved === 1
      ? "1 pantry item was moved to your new household."
      : `${moved} pantry items were moved to your new household.`
  const lines: string[] = []
  if (data.new_household_name) {
    lines.push(`Your new household: ${data.new_household_name}`)
  }
  if (data.new_household_id) {
    lines.push(`Household ID: ${data.new_household_id}`)
  }
  lines.push(movedLine)
  return lines.join("\n")
}

export function LeaveHouseholdConfirm({
  householdName,
  onLeaveSuccess,
}: LeaveHouseholdConfirmProps) {
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  const displayName = householdName.trim() || "this household"

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next && submitting) return
      setOpen(next)
    },
    [submitting],
  )

  const runLeave = React.useCallback(async () => {
    setSubmitting(true)
    try {
      const token = await getBrowserAccessToken()
      if (!token) {
        toast.error("Sign in again to leave this household.")
        return
      }
      const result = await leaveHousehold(getApiBaseUrl(), token)
      if (!result.ok) {
        const wait =
          result.retryAfterSeconds != null
            ? ` Try again in about ${result.retryAfterSeconds}s.`
            : ""
        toast.error(`${result.message}${wait}`)
        return
      }
      onLeaveSuccess?.(result.data)
      setOpen(false)
      const title =
        result.data.message.trim() || "You left the household"
      toast.success(title, {
        description: buildSuccessToastDescription(result.data),
        duration: 10_000,
      })
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }, [onLeaveSuccess, router])

  const trigger = (
    <Button type="button" variant="destructive">
      Leave household
    </Button>
  )

  const warningBlock = (
    <div className="flex flex-col items-center gap-3 text-center">
      <div
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
        aria-hidden
      >
        <AlertTriangle className="size-7" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          You&apos;re about to leave &quot;{displayName}&quot;. You will lose
          access to this household&apos;s shared grocery lists and other
          members&apos; pantry data. Your personal contribution history in this
          household is archived.
        </p>
        <div className="space-y-2 pt-1 text-start">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            What happens when you confirm
          </p>
          <ul className="list-disc space-y-1.5 ps-4 text-sm text-muted-foreground">
            <li>
              Pantry items you added here are moved into a new personal
              household for you — they are not deleted.
            </li>
            <li>
              You can keep using Pantry from that new household right away.
            </li>
          </ul>
        </div>
        <p className="pt-1 text-xs text-muted-foreground">
          This action is rate-limited. If you are blocked, wait a few minutes
          before trying again.
        </p>
      </div>
    </div>
  )

  const cancelButton = (
    <Button
      type="button"
      variant="ghost"
      className="text-primary hover:text-primary"
      disabled={submitting}
    >
      Cancel
    </Button>
  )

  const footer = (
    <div className="flex w-full flex-row justify-end gap-2">
      {isDesktop ? (
        <DialogClose asChild>{cancelButton}</DialogClose>
      ) : (
        <DrawerClose asChild>{cancelButton}</DrawerClose>
      )}
      <Button
        type="button"
        variant="destructive"
        disabled={submitting}
        onClick={() => void runLeave()}
      >
        {submitting && <Spinner data-icon="inline-start" />}
        Leave household
      </Button>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className="sm:max-w-md"
          showCloseButton={!submitting}
          onPointerDownOutside={(e) => submitting && e.preventDefault()}
          onEscapeKeyDown={(e) => submitting && e.preventDefault()}
        >
          <DialogHeader className="space-y-2 text-center sm:text-center">
            <DialogTitle>Leave household confirmation</DialogTitle>
            <DialogDescription className="sr-only">
              Confirm leaving {displayName}. Items move to a new personal
              household.
            </DialogDescription>
          </DialogHeader>
          {warningBlock}
          <DialogFooter className="sm:justify-end">{footer}</DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle>Leave household confirmation</DrawerTitle>
          <DrawerDescription className="sr-only">
            Confirm leaving {displayName}. Items move to a new personal household.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-2">{warningBlock}</div>
        <DrawerFooter className="pt-2">{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
