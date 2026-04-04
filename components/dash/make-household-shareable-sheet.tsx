"use client"

import * as React from "react"
import Image from "next/image"
import { Info } from "lucide-react"
import { toast } from "sonner"

import { convertHouseholdToJoinable } from "@/lib/actions/household"
import { createClient } from "@/lib/supabase/client"
import { getApiBaseUrl } from "@/lib/utils/config"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { cn } from "@/lib/utils"

const KITCHEN_HERO =
  "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=900&q=80"

const SHAREABLE_DESCRIPTION =
  "By converting to a shared household, you will be able to invite family members or roommates to collaborate on your inventory, shopping lists, and meal plans. You must confirm that your inventory will be visible to invited members before continuing."

export interface MakeHouseholdShareableSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called after the user confirms and the short save delay finishes. */
  onConfirm: () => void
}

export function MakeHouseholdShareableSheet({
  open,
  onOpenChange,
  onConfirm,
}: MakeHouseholdShareableSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const [acknowledged, setAcknowledged] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setAcknowledged(false)
      setSubmitting(false)
    }
  }, [open])

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next && submitting) return
      onOpenChange(next)
    },
    [submitting, onOpenChange]
  )

  const handleMakeShareable = React.useCallback(async () => {
    if (!acknowledged) return
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()
      const token = sessionError
        ? null
        : (sessionData.session?.access_token ?? null)
      if (!token) {
        toast.error("Sign in again to update your household.")
        return
      }
      const result = await convertHouseholdToJoinable(getApiBaseUrl(), token)
      if (!result.ok) {
        const wait =
          result.retryAfterSeconds != null
            ? ` Try again in about ${result.retryAfterSeconds}s.`
            : ""
        toast.error(`${result.message}${wait}`)
        return
      }
      onOpenChange(false)
      queueMicrotask(() => onConfirm())
    } finally {
      setSubmitting(false)
    }
  }, [acknowledged, onConfirm, onOpenChange])

  const body = (
    <>
      <div className="relative min-h-44 w-full shrink-0 overflow-hidden sm:min-h-50">
        <Image
          src={KITCHEN_HERO}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 28rem"
          priority={open}
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/90 via-black/55 to-primary"
          aria-hidden
        />
        <DialogTitle className="absolute inset-x-4 bottom-4 z-1 text-center text-xl font-semibold tracking-tight text-balance text-muted-foreground sm:text-2xl">
          Make this household shareable?
        </DialogTitle>
      </div>

      <DialogDescription className="sr-only">
        {SHAREABLE_DESCRIPTION}
      </DialogDescription>

      <div className="grid gap-4 bg-background p-4 pt-5">
        <p className="text-sm leading-relaxed text-foreground/80">
          By converting to a shared household, you&apos;ll be able to invite
          family members or roommates to collaborate on your inventory, shopping
          lists, and meal plans.
        </p>

        <div className="rounded-xl border border-border/80 bg-muted/50 p-4">
          <label
            htmlFor="share-household-ack"
            className="flex cursor-pointer items-start gap-3"
          >
            <Checkbox
              id="share-household-ack"
              checked={acknowledged}
              onCheckedChange={(v) => setAcknowledged(v === true)}
              disabled={submitting}
              className="mt-0.5 border-border bg-background"
            />
            <span className="text-sm leading-snug text-foreground">
              I understand that my inventory will be visible to invited members.
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <Button
            type="button"
            disabled={!acknowledged || submitting}
            onClick={() => void handleMakeShareable()}
            className={cn("px-6 font-semibold")}
          >
            {submitting && <Spinner data-icon="inline-start" />}
            Make shareable
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              disabled={submitting}
              className="font-semibold"
            >
              Cancel
            </Button>
          </DialogClose>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-muted/50 px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <Info className="size-4 shrink-0 opacity-80" aria-hidden />
        <span>This action can be reverted in settings</span>
      </div>
    </>
  )

  const drawerBody = (
    <>
      <div className="relative min-h-44 w-full shrink-0 overflow-hidden">
        <Image
          src={KITCHEN_HERO}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority={open}
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-black/90 via-black/55 to-primary"
          aria-hidden
        />
        <DrawerTitle className="absolute inset-x-4 bottom-4 z-1 text-center text-xl font-semibold tracking-tight text-balance text-white">
          Make this household shareable?
        </DrawerTitle>
      </div>

      <DrawerDescription className="sr-only">
        {SHAREABLE_DESCRIPTION}
      </DrawerDescription>

      <div className="grid gap-4 bg-background px-4 pt-5 pb-2">
        <p className="text-sm leading-relaxed text-foreground/80">
          By converting to a shared household, you&apos;ll be able to invite
          family members or roommates to collaborate on your inventory, shopping
          lists, and meal plans.
        </p>

        <div className="rounded-xl border border-border/80 bg-muted/50 p-4">
          <label
            htmlFor="share-household-ack-mobile"
            className="flex cursor-pointer items-start gap-3"
          >
            <Checkbox
              id="share-household-ack-mobile"
              checked={acknowledged}
              onCheckedChange={(v) => setAcknowledged(v === true)}
              disabled={submitting}
              className="mt-0.5 border-border bg-background"
            />
            <span className="text-sm leading-snug text-foreground">
              I understand that my inventory will be visible to invited members.
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border bg-background px-4 py-3">
        <DrawerClose asChild>
          <Button
            type="button"
            variant="ghost"
            disabled={submitting}
            className="font-semibold text-emerald-700 hover:bg-emerald-500/10 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Cancel
          </Button>
        </DrawerClose>
        <Button
          type="button"
          disabled={!acknowledged || submitting}
          onClick={() => void handleMakeShareable()}
          className={cn(
            "rounded-full border-0 bg-linear-to-r from-emerald-900 to-emerald-500 font-semibold text-white shadow-md",
            "hover:from-emerald-950 hover:to-emerald-600 hover:opacity-[0.98]"
          )}
        >
          {submitting && (
            <Spinner data-icon="inline-start" className="text-white" />
          )}
          Make shareable
        </Button>
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-muted/50 px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        <Info className="size-4 shrink-0 opacity-80" aria-hidden />
        <span>This action can be reverted in settings</span>
      </div>
    </>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-h-[min(90vh,640px)] gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-md"
          showCloseButton={!submitting}
          onPointerDownOutside={(e) => submitting && e.preventDefault()}
          onEscapeKeyDown={(e) => submitting && e.preventDefault()}
        >
          {body}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[92vh] gap-0 overflow-hidden rounded-t-3xl p-0">
        {drawerBody}
      </DrawerContent>
    </Drawer>
  )
}
