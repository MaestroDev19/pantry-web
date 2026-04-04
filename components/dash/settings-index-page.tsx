"use client";

import Link from "next/link";
import { Building2, ChevronRight, Home, Palette, UserRound } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggler";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export function SettingsIndexPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 @container/main">
      <div className="flex flex-col gap-2 pt-4 md:pt-10 lg:pt-20">
        <TypographyH2 className="pb-0">Settings</TypographyH2>
        <TypographyP className="text-sm text-muted-foreground">
          Manage your workspace, appearance, and account.
        </TypographyP>
      </div>

      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Building2 className="size-4" aria-hidden />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle>Workspace</CardTitle>
              <CardDescription>
                Household name, members, invites, and identifiers.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ItemGroup className="gap-2">
            <Item variant="outline" size="sm" asChild>
              <Link
                href="/dashboard/settings/household"
                className="flex min-w-0 flex-wrap items-center gap-3 no-underline"
              >
                <ItemMedia variant="icon">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Home className="size-4" aria-hidden />
                  </div>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="no-underline">Household</ItemTitle>
                  <ItemDescription>
                    Name, members, invites, join codes, and household ID.
                  </ItemDescription>
                </ItemContent>
                <ChevronRight
                  className="ms-auto size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Link>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Palette className="size-4" aria-hidden />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Match Pantry to your environment or preference.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-between gap-4 pt-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Theme</span>
            <span className="text-xs text-muted-foreground">
              Light or dark mode
            </span>
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <UserRound className="size-4" aria-hidden />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Your profile comes from your sign-in provider.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <TypographyP className="text-sm text-muted-foreground">
            Use the avatar menu in the header to sign out. More account options
            will appear here when available.
          </TypographyP>
        </CardContent>
      </Card>
    </div>
  );
}
