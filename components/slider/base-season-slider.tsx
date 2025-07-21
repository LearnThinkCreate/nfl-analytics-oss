"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

const DEBOUNCE_TIME = 500 // 500ms debounce time

export interface BaseSeasonSliderProps {
  initialSeason: number
  minSeason?: number
  maxSeason?: number
  onSeasonChange: (season: number) => void
}

export function BaseSeasonSlider({
  initialSeason,
  minSeason = 1999,
  maxSeason = 2024,
  onSeasonChange,
}: BaseSeasonSliderProps) {
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // State to hold the currently selected value for immediate visual feedback
  const [selectedSeason, setSelectedSeason] = React.useState(initialSeason)

  const updateSeason = React.useCallback(
    (season: number) => {
      // Ensure the season is within bounds
      const boundedSeason = Math.max(minSeason, Math.min(maxSeason, season))
      setSelectedSeason(boundedSeason)

      // Clear any existing debounce timer
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      // Set a new debounce timer to update the URL
      debounceTimeoutRef.current = setTimeout(() => {
        onSeasonChange(boundedSeason)
      }, DEBOUNCE_TIME)
    },
    [minSeason, maxSeason, onSeasonChange],
  )

  // Update the selected season state immediately when the slider moves
  const handleValueChange = React.useCallback(
    (values: number[]) => {
      updateSeason(values[0])
    },
    [updateSeason],
  )

  // Handle navigation with arrows
  const handlePreviousSeason = React.useCallback(() => {
    updateSeason(selectedSeason - 1)
  }, [selectedSeason, updateSeason])

  const handleNextSeason = React.useCallback(() => {
    updateSeason(selectedSeason + 1)
  }, [selectedSeason, updateSeason])

  // Effect to clear timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  // Update selectedSeason if the initialSeason prop changes
  React.useEffect(() => {
    setSelectedSeason(initialSeason)
  }, [initialSeason])

  return (
    <div className="w-full px-2 space-y-2">
      <div className="flex justify-between">
        <span className="text-sm text-primary">Season</span>
        {/* Display the live selected season */}
        <span className="text-sm font-medium text-primary">{selectedSeason}</span>
      </div>
      <Slider
        value={[selectedSeason]} // Control the slider value with state
        min={minSeason}
        max={maxSeason}
        step={1}
        onValueChange={handleValueChange} // Use onValueChange for live updates
      />
      <div className="flex justify-between items-center mt-2">
        <Button
          variant="outline"
          size="icon"
          className="h-4 w-4"
          onClick={handlePreviousSeason}
          disabled={selectedSeason <= minSeason}
          aria-label="Previous season"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-4 w-4"
          onClick={handleNextSeason}
          disabled={selectedSeason >= maxSeason}
          aria-label="Next season"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
