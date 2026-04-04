import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { BellIcon, MenuIcon, Utensils } from "lucide-react"
import Link from "next/link"

import { NavBarItem } from "./nav-items"
import { ThemeToggle } from "./theme-toggler"
import { Separator } from "./ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { DashboardData } from "@/lib/utils/dashboard"
import { signOut } from "@/lib/actions/authenticaton"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/pantry", label: "Pantry" },
  { href: "/dashboard/recipes", label: "Recipes" },
  { href: "/dashboard/shopping-list", label: "My shopping list" },
]

export function NavBar({ data }: { data: DashboardData }) {
  const profile = data.userProfile.user

  return (
    <>
      <div className="flex h-8 items-center justify-between sm:hidden">
        <MobileNavbar />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <BellIcon className="size-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar size="default">
                  <AvatarImage
                    src={profile.avatar_url ?? undefined}
                    alt={profile.full_name ?? "Account"}
                  />
                  <AvatarFallback>
                    {profile.full_name?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
              side="bottom"
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {profile.full_name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {profile.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings/household">Household</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <form action={signOut} className="w-full">
                  <DropdownMenuItem variant="destructive" asChild>
                    <button
                      type="submit"
                      className="w-full cursor-pointer text-left"
                    >
                      Log out
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="hidden sm:block">
        <DesktopNavbar data={data} />
      </div>
    </>
  )
}

function MobileNavbar() {
  return (
    <Drawer shouldScaleBackground setBackgroundColorOnScale={false}>
      <DrawerTrigger>
        <MenuIcon className="size-5" />
      </DrawerTrigger>
      <DrawerContent className="h-[60%]">
        <div className="space-y-4 px-8 py-8">
          <div className="flex justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-mono text-base font-medium tracking-tight"
            >
              <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Utensils className="size-4" />
              </div>
              <span>Pantry</span>
            </Link>
          </div>

          <Separator />
          <ul className="space-y-2">
            {navItems.map(({ href, label }) => (
              <li key={`${href}-${label}`}>
                <Link className="text-2xl font-[450]" href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <DrawerHeader>
          <DrawerTitle aria-hidden="true" className="hidden">
            Navigation Menu
          </DrawerTitle>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}

function DesktopNavbar({ data }: { data: DashboardData }) {
  const profile = data.userProfile.user

  return (
    <div className="grid h-8 grid-cols-3 items-center gap-4">
      <div className="flex items-center gap-16">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 font-mono text-sm font-medium tracking-tight"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Utensils className="size-4" />
          </div>
          <span>Pantry</span>
        </Link>
      </div>
      <ul className="flex items-center justify-center gap-4 text-sm">
        {navItems.map(({ href, label }) => (
          <li key={`${href}-${label}`}>
            <NavBarItem
              href={href}
              label={label}
              className="group text-muted-foreground transition-colors group-hover:text-primary data-[active=true]:text-primary"
            />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-end gap-1">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="rounded-full">
          <BellIcon className="size-4 text-muted-foreground" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar size="sm">
                <AvatarImage
                  src={profile.avatar_url ?? undefined}
                  alt={profile.full_name}
                />
                <AvatarFallback>
                  {profile.full_name?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side="bottom"
            align="end"
            alignOffset={4}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {profile.full_name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {profile.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings/household">Household</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <form action={signOut} className="w-full">
                <DropdownMenuItem variant="destructive" asChild>
                  <button
                    type="submit"
                    className="w-full cursor-pointer text-left"
                  >
                    Log out
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
