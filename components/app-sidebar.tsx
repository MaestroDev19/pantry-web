"use client";
import { User } from "@supabase/supabase-js";
import * as React from "react";
import {
  IconBasketFilled,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconReceipt,
  IconUsers,
} from "@tabler/icons-react";

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
import { Utensils } from "lucide-react";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Pantry",
      url: "/pantry",
      icon: IconBasketFilled,
    },
    {
      title: "Recipes",
      url: "/recipes",
      icon: IconReceipt,
    },
    {
      title: "Shopping Lists",
      url: "/shopping-lists",
      icon: IconListDetails,
    },
    {
      title: "Household",
      url: "/household",
      icon: IconUsers,
    },
  ],
} as const;

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Utensils className="size-4" />
                <span className="text-base font-semibold">Pantry</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
