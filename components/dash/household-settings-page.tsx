"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  Copy,
  Home,
  KeyRound,
  Mail,
  Pencil,
  UserPlus,
} from "lucide-react"
import { toast } from "sonner"

import type { UserProfile } from "@/lib/dal/auth"
import {
  EXPECTED_INVITE_CODE_LENGTH,
  joinHousehold,
  normalizeInviteCodeForApi,
  PERSONAL_HOUSEHOLD_NAME,
} from "@/lib/actions/household"
import { renameHouseholdAction } from "@/lib/actions/household-rename"
import { usePantryAccessToken } from "@/lib/hooks/use-pantry-access-token"
import { copyToClipboard } from "@/lib/utils/browser"
import { getApiBaseUrl } from "@/lib/utils/config"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { TypographyH2, TypographyP } from "@/components/ui/typography"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
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
import { InviteMemberFlow } from "@/components/dash/invite-member-flow"
import { LeaveHouseholdConfirm } from "@/components/dash/leave-household-confirm"

export interface HouseholdSettingsPageProps {
  user: UserProfile
  householdId: string | null
  /** When the API returns a stored name, pass it here; otherwise the default label is used. */
  initialHouseholdName?: string
  /** From Supabase `households.is_personal`; when false, show invite code instead of join-by-code UI. */
  householdIsPersonal: boolean
  initialInviteCode: string | null
}

const RENAME_NAME_MAX = 120

export function HouseholdSettingsPage({
  user,
  householdId,
  initialHouseholdName,
  householdIsPersonal,
  initialInviteCode,
}: HouseholdSettingsPageProps) {
  const router = useRouter()
  const getAccessToken = usePantryAccessToken()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const [householdName, setHouseholdName] = React.useState(
    () => initialHouseholdName ?? PERSONAL_HOUSEHOLD_NAME
  )
  const [renameOpen, setRenameOpen] = React.useState(false)
  const [renameSaving, setRenameSaving] = React.useState(false)
  const [draftName, setDraftName] = React.useState(householdName)
  const [joinCode, setJoinCode] = React.useState("")
  const [joinSubmitting, setJoinSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (renameOpen) setDraftName(householdName)
  }, [renameOpen, householdName])

  React.useEffect(() => {
    if (initialHouseholdName !== undefined) {
      setHouseholdName(initialHouseholdName || PERSONAL_HOUSEHOLD_NAME)
    }
  }, [initialHouseholdName])

  const handleRenameOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open && renameSaving) return
      setRenameOpen(open)
    },
    [renameSaving]
  )

  const handleRenameSave = React.useCallback(async () => {
    const next = draftName.trim().slice(0, RENAME_NAME_MAX)
    if (!next) {
      toast.error("Enter a household name.")
      return
    }
    setRenameSaving(true)
    try {
      const result = await renameHouseholdAction(next)
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      setHouseholdName(next)
      setRenameOpen(false)
      toast.success("Household name updated.")
    } finally {
      setRenameSaving(false)
    }
  }, [draftName])

  const renameTrigger = (
    <Button type="button" variant="outline" size="sm">
      <Pencil className="size-4" data-icon="inline-start" />
      Rename
    </Button>
  )

  const renameForm = (
    <FieldGroup className="gap-4">
      <Field>
        <FieldLabel htmlFor="rename-household-name">Household name</FieldLabel>
        <Input
          id="rename-household-name"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          maxLength={RENAME_NAME_MAX}
          autoComplete="off"
          disabled={renameSaving}
        />
        <FieldDescription>
          This label is saved to your household and appears across your workspace.
        </FieldDescription>
      </Field>
    </FieldGroup>
  )

  const handleCopyId = React.useCallback(async () => {
    if (!householdId) return
    try {
      await copyToClipboard(householdId)
      toast.success("Household ID copied to clipboard.")
    } catch {
      toast.error("Could not copy. Try again.")
    }
  }, [householdId])

  const handleCopyInviteCode = React.useCallback(async () => {
    if (!initialInviteCode) return
    try {
      await copyToClipboard(initialInviteCode)
      toast.success("Invite code copied to clipboard.")
    } catch {
      toast.error("Could not copy. Try again.")
    }
  }, [initialInviteCode])

  const handleJoinHousehold = React.useCallback(async () => {
    const normalized = normalizeInviteCodeForApi(joinCode)
    if (!normalized) {
      toast.error("Enter an invite code.")
      return
    }
    if (normalized.length !== EXPECTED_INVITE_CODE_LENGTH) {
      toast.error(
        `Invite codes are ${EXPECTED_INVITE_CODE_LENGTH} characters. Check the code and try again.`,
      )
      return
    }
    setJoinSubmitting(true)
    try {
      const token = await getAccessToken()
      if (!token) {
        toast.error("Sign in again to join a household.")
        return
      }
      const result = await joinHousehold(getApiBaseUrl(), token, joinCode)
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      const moved = result.data.items_moved
      const movedLine =
        moved === 0
          ? "Your pantry items stayed with this account."
          : moved === 1
            ? "1 of your pantry items was moved into this household."
            : `${moved} of your pantry items were moved into this household.`
      toast.success("You joined the household.", {
        description: movedLine,
        duration: 8000,
      })
      setJoinCode("")
      router.refresh()
    } finally {
      setJoinSubmitting(false)
    }
  }, [getAccessToken, joinCode, router])

  const handleShareInviteByEmail = React.useCallback(() => {
    if (!initialInviteCode) return
    const origin =
      typeof window !== "undefined" ? window.location.origin : ""
    const path = "/dashboard/settings/household"
    const link = origin ? `${origin}${path}` : path
    const subject = encodeURIComponent("Join my Pantry household")
    const body = encodeURIComponent(
      `I'm sharing our pantry household with you.\n\nInvite code: ${initialInviteCode}\n\nOpen ${link} in Pantry and use Settings → Household to join with this code.`,
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }, [initialInviteCode])

  const initials =
    user.full_name
      ?.split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"

  return (
    <div className="@container/main mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6">
      <nav aria-label="Breadcrumb" className="pt-4 md:pt-10 lg:pt-20">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <li>
            <Link
              href="/dashboard/settings"
              className="transition-colors hover:text-foreground"
            >
              Settings
            </Link>
          </li>
          <li className="flex items-center gap-1">
            <ChevronRight className="size-4" aria-hidden />
            <span className="font-medium text-foreground">Household</span>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col gap-2">
        <TypographyH2 className="pb-0">Household</TypographyH2>
        <TypographyP className="text-sm text-muted-foreground">
          Name, members, and identifiers for the pantry you share.
        </TypographyP>
      </div>

      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Home className="size-4" aria-hidden />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle>Household details</CardTitle>
              <CardDescription>
                This name appears in your workspace. Rename to change how the
                household is labeled in the app.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="household-name">Household name</FieldLabel>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <Input
                  id="household-name"
                  readOnly
                  value={householdName}
                  className="bg-muted/50 sm:min-w-0 sm:flex-1"
                />
                {isDesktop ? (
                  <Dialog
                    open={renameOpen}
                    onOpenChange={handleRenameOpenChange}
                  >
                    <DialogTrigger asChild>{renameTrigger}</DialogTrigger>
                    <DialogContent
                      className="sm:max-w-md"
                      showCloseButton={!renameSaving}
                      onPointerDownOutside={(e) =>
                        renameSaving && e.preventDefault()
                      }
                      onEscapeKeyDown={(e) =>
                        renameSaving && e.preventDefault()
                      }
                    >
                      <DialogHeader>
                        <DialogTitle>Rename household</DialogTitle>
                        <DialogDescription>
                          Choose a name your household will recognize in Pantry.
                        </DialogDescription>
                      </DialogHeader>
                      {renameForm}
                      <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <DialogClose asChild>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={renameSaving}
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          type="button"
                          disabled={renameSaving}
                          onClick={() => void handleRenameSave()}
                        >
                          {renameSaving && <Spinner data-icon="inline-start" />}
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Drawer
                    open={renameOpen}
                    onOpenChange={handleRenameOpenChange}
                  >
                    <DrawerTrigger asChild>{renameTrigger}</DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader className="text-start">
                        <DrawerTitle>Rename household</DrawerTitle>
                        <DrawerDescription>
                          Choose a name your household will recognize in Pantry.
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="px-4">{renameForm}</div>
                      <DrawerFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <DrawerClose asChild>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={renameSaving}
                          >
                            Cancel
                          </Button>
                        </DrawerClose>
                        <Button
                          type="button"
                          disabled={renameSaving}
                          onClick={() => void handleRenameSave()}
                        >
                          {renameSaving && <Spinner data-icon="inline-start" />}
                          Save changes
                        </Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                )}
              </div>
              <FieldDescription>
                New households default to &quot;{PERSONAL_HOUSEHOLD_NAME}&quot;
                until you rename.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <UserPlus className="size-4" aria-hidden />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle>Members</CardTitle>
              <CardDescription>
                People who can see and edit this household pantry.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ItemGroup className="gap-2">
            <Item variant="outline" size="sm" className="flex flex-wrap">
              <ItemMedia variant="image">
                <Avatar className="size-10 rounded-md">
                  <AvatarImage src={user.avatar_url ?? undefined} alt="" />
                  <AvatarFallback className="rounded-md text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="no-underline">{user.full_name}</ItemTitle>
                <ItemDescription>{user.email}</ItemDescription>
              </ItemContent>
              <Badge variant="secondary" className="ms-auto shrink-0">
                You
              </Badge>
            </Item>
          </ItemGroup>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <TypographyP className="text-xs text-muted-foreground">
              Invite teammates by email. Delivery will work once your backend
              supports invitations.
            </TypographyP>
            <InviteMemberFlow householdIsPersonal={householdIsPersonal} />
          </div>
        </CardContent>
      </Card>

      {!householdIsPersonal ? (
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <KeyRound className="size-4" aria-hidden />
              </div>
              <div className="flex flex-col gap-1">
                <CardTitle>Your invite code</CardTitle>
                <CardDescription>
                  Share this code so others can join this household pantry. Only
                  send it to people you trust.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="household-share-code">Invite code</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="household-share-code"
                    readOnly
                    value={initialInviteCode ?? "—"}
                    className="font-mono text-xs uppercase"
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-md"
                      disabled={!initialInviteCode}
                      onClick={() => void handleCopyInviteCode()}
                      aria-label="Copy invite code"
                    >
                      <Copy className="size-4" />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Copy the code or open your email app with a pre-filled message.
                </FieldDescription>
              </Field>
            </FieldGroup>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant="outline"
                disabled={!initialInviteCode}
                onClick={() => void handleCopyInviteCode()}
              >
                <Copy className="size-4" data-icon="inline-start" />
                Copy code
              </Button>
              <Button
                type="button"
                disabled={!initialInviteCode}
                onClick={handleShareInviteByEmail}
              >
                <Mail className="size-4" data-icon="inline-start" />
                Share by email
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <KeyRound className="size-4" aria-hidden />
              </div>
              <div className="flex flex-col gap-1">
                <CardTitle>Join a household</CardTitle>
                <CardDescription>
                  Paste an invite code from a household admin to link your account
                  to their pantry.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="household-join-code">Invite code</FieldLabel>
                <Input
                  id="household-join-code"
                  name="household-join-code"
                  autoComplete="off"
                  placeholder={`e.g. ${"X".repeat(EXPECTED_INVITE_CODE_LENGTH)}`}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  disabled={joinSubmitting}
                  maxLength={32}
                  className="font-mono uppercase"
                />
                <FieldDescription>
                  Codes are {EXPECTED_INVITE_CODE_LENGTH} letters or numbers (spaces are
                  ignored). Joining moves your personal pantry items into the shared
                  household when the server applies a move policy.
                </FieldDescription>
              </Field>
            </FieldGroup>
            <div className="mt-4">
              <Button
                type="button"
                disabled={joinSubmitting || !joinCode.trim()}
                onClick={() => void handleJoinHousehold()}
              >
                {joinSubmitting && <Spinner data-icon="inline-start" />}
                Join household
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle>Household ID</CardTitle>
          <CardDescription>
            Share this ID with support if you need help linking accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {householdId ? (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="household-id">Identifier</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="household-id"
                    readOnly
                    value={householdId}
                    className="font-mono text-xs"
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-md"
                      onClick={handleCopyId}
                      aria-label="Copy household ID"
                    >
                      <Copy className="size-4" />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </FieldGroup>
          ) : (
            <TypographyP className="text-sm text-muted-foreground">
              No household is linked to your account yet. Complete onboarding or
              refresh after signing in.
            </TypographyP>
          )}
        </CardContent>
      </Card>

      {householdId && !householdIsPersonal ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Leave household</CardTitle>
            <CardDescription>
              Leave this shared household and continue in a new personal one. Pantry
              items you added here are moved, not deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeaveHouseholdConfirm householdName={householdName} />
          </CardContent>
        </Card>
      ) : householdId ? (
        <Card>
          <CardHeader>
            <CardTitle>Leave household</CardTitle>
            <CardDescription>
              You can only leave a <span className="font-medium">shared</span>{" "}
              household. Your current space is a personal household; use{" "}
              <span className="font-medium">Join a household</span> above if you want
              to link to someone else&apos;s pantry.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  )
}
