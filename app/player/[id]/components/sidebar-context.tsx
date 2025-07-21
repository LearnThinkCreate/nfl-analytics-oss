"use client"

import React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useParams } from "next/navigation"

type SidebarContextType = {
  showSlider: boolean
  playerId: string | null
  currentSeason: number | null
  playerData: {
    primaryColor: string
    minSeason?: number
    maxSeason?: number
  } | null
}

const SidebarContext = createContext<SidebarContextType>({
  showSlider: false,
  playerId: null,
  currentSeason: null,
  playerData: null,
})

export const useSidebarContext = () => useContext(SidebarContext)

interface SidebarContextProviderProps {
  children: React.ReactNode
  playerData: {
    primaryColor: string
    minSeason?: number
    maxSeason?: number
  }
  playerId: string
}

export function SidebarContextProvider({ children, playerData, playerId }: SidebarContextProviderProps) {
  const pathname = usePathname()
  const params = useParams()
  const [showSlider, setShowSlider] = useState(false)
  const [currentSeason, setCurrentSeason] = useState<number | null>(null)

  useEffect(() => {

    // More reliable season page detection
    const isSeasonPage = Boolean(
      pathname?.includes(`/player/${playerId}/`) &&
        params.season &&
        !isNaN(Number(params.season)) &&
        !pathname?.includes("/career"),
    )

    setShowSlider(isSeasonPage)

    // Extract the season from the URL if it exists
    if (isSeasonPage && params.season) {
      const parsedSeason = Number.parseInt(params.season as string, 10)
      setCurrentSeason(parsedSeason)
    } else {
      setCurrentSeason(null)
    }
  }, [pathname, params, playerId])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      showSlider,
      playerId,
      currentSeason,
      playerData,
    }),
    [showSlider, playerId, currentSeason, playerData],
  )

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>
}
