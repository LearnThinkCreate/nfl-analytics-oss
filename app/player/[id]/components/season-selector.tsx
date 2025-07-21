'use client'

import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function SeasonSelector({ 
  seasons, 
  currentSeason,
  playerId,
  primaryColor 
}: { 
  seasons: number[], 
  currentSeason: number,
  playerId: string,
  primaryColor: string
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSeasonChange = (season: number) => {
    router.push(`/player/${playerId}/${season}`, { scroll: false })
    setOpen(false)
  }

  return (
    <div className="relative inline-block text-left ml-2">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center rounded-md px-2 py-1 text-sm font-medium hover:bg-black/5 focus:outline-none"
        style={{ color: primaryColor }}
      >
        {currentSeason}
        <ChevronDown className="ml-1 h-4 w-4" />
      </button>
      
      {open && (
        <div 
          className="absolute right-0 z-10 mt-1 max-h-60 w-36 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          style={{ borderLeft: `2px solid ${primaryColor}` }}
        >
          <div className="py-1">
            {seasons.map((season) => (
              <button
                key={season}
                onClick={() => handleSeasonChange(season)}
                className={`block w-full px-4 py-2 text-left text-sm ${
                  season === currentSeason ? 'font-bold' : 'font-normal'
                }`}
                style={{ color: season === currentSeason ? primaryColor : '' }}
              >
                {season}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}