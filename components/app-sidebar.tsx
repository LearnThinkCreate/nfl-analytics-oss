"use client";

import * as React from "react";
import { ChartLineIcon, WandSparklesIcon, UserIcon } from "lucide-react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export const navData = [
  {
    title: "Season Leaders",
    url: "/qb",
    icon: UserIcon,
  },
  {
    title: "Career Leaders",
    url: "/career-leaders/qb",
    icon: ChartLineIcon,
  },
  {
    title: "AI",
    url: "https://www.nflcompanion.com/",
    icon: WandSparklesIcon,
  },
];

export function AppSidebar({
  children,
  displayGroupLabel = true,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  displayGroupLabel?: boolean;
}) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="">
            <a href="/" className="flex items-center gap-2">
                  <Image
                    src="/musashi_x.png"
                    alt="Soulshine Inc logo"
                    width={24}
                    height={24}
                    className="size-6 rounded-md"
                    priority
                    loading="eager"
                  />
                  <span className="truncate">Soulshine Inc</span>
                </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {children}

        <SidebarGroup>
            {displayGroupLabel && <SidebarGroupLabel>Stats</SidebarGroupLabel>}
            <SidebarMenu>
          {navData.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        </SidebarGroup>
    </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
