import type React from "react"
import { cookies } from "next/headers"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"
import { PlayerSidebar } from "./components/sidebar"
import { SiteHeader } from "@/components/site-header"
import PlayerBioHeader from "./components/player-bio-header"
import Nav from "./components/nav"
import { getPlayerBio, getPlayerSeasons} from "@/data/player"
import { notFound } from "next/navigation"
import { SidebarContextProvider } from "./components/sidebar-context"

export default async function PlayerLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>
  children: React.ReactNode
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  const [playerData, seasons] = await Promise.all([getPlayerBio(id), getPlayerSeasons(id)])

  if (!playerData) {
    return notFound()
  }

  const latestSeason = seasons[0]

  // Extract the player data needed for the slider
  const sliderPlayerData = {
    primaryColor: playerData.primaryColor,
    // You can add min/max season logic here based on player career
    minSeason: seasons[seasons.length - 1], // Default or calculate from player data
    maxSeason: latestSeason ?? 2024, // Current year - 1 or from player data
  }

  return (
    <main 
    className="[--header-height:calc(theme(spacing.14))]"
    style={
      {
        "--team-primary": playerData.primaryColor,
        "--team-secondary": playerData.secondaryColor,
        "--team-tertiary": playerData.tertiaryColor,
        "--team-quaternary": playerData.quaternaryColor || playerData.primaryColor,
        "--muted-foreground": "oklch(0.556 0 0)",
      } as React.CSSProperties
    }
    >
      <SidebarContextProvider playerData={sliderPlayerData} playerId={id}>
        <SidebarProvider defaultOpen={defaultOpen} className="flex flex-col">
          <SiteHeader>
            <Nav className="hidden md:block" playerId={id} latestSeason={latestSeason ?? undefined} />
          </SiteHeader>
          <div className="flex flex-1">
            <PlayerSidebar />
            <SidebarInset>
              <div
                className="min-h-screen flex flex-col @container/page overflow-auto"
                id="top"
              >
                <PlayerBioHeader player={playerData} />
                <Nav
                  className="w-fit mx-auto mt-4 mb-4 block md:hidden"
                  playerId={id}
                  latestSeason={latestSeason ?? undefined}
                />
                <section className="flex-1 flex flex-col p-4 md:p-6 relative">{children}</section>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </SidebarContextProvider>
    </main>
  )
}
