"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { useSidebarContext } from "./sidebar-context";
import { PlayerSeasonSlider } from "@/components/slider/player-season-slider";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function PlayerSidebar() {
  const { showSlider, playerId, currentSeason, playerData } =
    useSidebarContext();

  return (
    <AppSidebar>
      {/* Simplified condition for debugging */}
      {showSlider && playerId && currentSeason ? (
          <SidebarGroup>
            <SidebarGroupLabel className="mb-2">Filters</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem
                style={{
                  "--primary": playerData?.primaryColor || "#000000",
                } as React.CSSProperties}
              >
                {/* <SidebarMenuButton> */}
                <PlayerSeasonSlider
                  playerId={playerId}
                  currentSeason={currentSeason}
                  minSeason={playerData?.minSeason}
                  maxSeason={playerData?.maxSeason}
                />
                {/* </SidebarMenuButton> */}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
      ) : (
        <></>
      )}
    </AppSidebar>
  );
}
