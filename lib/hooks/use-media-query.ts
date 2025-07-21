"use client"

import { useState, useEffect } from "react"

/**
 * Hook that returns whether a media query matches
 * @param query The media query to check
 * @returns Boolean indicating if the media query matches, or null during SSR
 */
export function useMediaQuery(query: string): boolean | null {
  // Initialize with null for SSR
  const [matches, setMatches] = useState<boolean | null>(null)

  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window !== "undefined") {
      // Create the media query
      const mediaQuery = window.matchMedia(query)

      // Set initial value
      setMatches(mediaQuery.matches)

      // Handler function for media query changes
      const handler = (event: MediaQueryListEvent) => {
        setMatches(event.matches)
      }

      // Add event listener
      mediaQuery.addEventListener("change", handler)

      // Clean up
      return () => {
        mediaQuery.removeEventListener("change", handler)
      }
    }

    // Empty dependency array ensures this only runs on mount/unmount
  }, [query])

  return matches
}

