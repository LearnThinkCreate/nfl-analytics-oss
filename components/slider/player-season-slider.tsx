"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BaseSeasonSlider } from "./base-season-slider"

export function PlayerSeasonSlider({
  playerId,
  currentSeason,
  minSeason = 1999,
  maxSeason = 2024,
}: {
  playerId: string
  currentSeason: number
  minSeason?: number
  maxSeason?: number
}) {
  const router = useRouter()
  
  // Handler for when season changes after debounce
  const handleSeasonChange = React.useCallback(
    (season: number) => {
      router.push(`/player/${playerId}/${season}`, { scroll: false }) // Prevent scroll reset
    },
    [playerId, router],
  )

  return (
    <BaseSeasonSlider
      initialSeason={currentSeason}
      minSeason={minSeason}
      maxSeason={maxSeason}
      onSeasonChange={handleSeasonChange}
    />
  )
}
