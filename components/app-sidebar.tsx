"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChefHatIcon,
  CommandIcon,
  DashboardSquare01Icon,
  KitchenUtensilsIcon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
interface AppSidebarUser {
  name: string;
  email: string;
  avatar: string;
}

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />,
  },
  {
    title: "Pantry",
    url: "/dashboard/pantry",
    icon: <HugeiconsIcon icon={KitchenUtensilsIcon} strokeWidth={2} />,
  },
  {
    title: "Recipes",
    url: "/dashboard/recipes",
    icon: <HugeiconsIcon icon={ChefHatIcon} strokeWidth={2} />,
  },
  {
    title: "Shopping List",
    url: "/dashboard/shopping-list",
    icon: <HugeiconsIcon icon={ShoppingCart01Icon} strokeWidth={2} />,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: AppSidebarUser;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/dashboard" />}
            >
              <HugeiconsIcon
                icon={CommandIcon}
                strokeWidth={2}
                className="size-5!"
              />
              <span className="text-base font-semibold">Acme Inc.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
