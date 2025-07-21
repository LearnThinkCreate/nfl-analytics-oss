"use client"

import { useMediaQuery } from "./use-media-query"

// Define breakpoints (can be moved to a constants file)
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

/**
 * Hook that returns whether the screen is at least the specified size
 * @param size The minimum size to check for
 * @returns Boolean indicating if the screen is at least the specified size, or null during SSR
 */
export function useMinWidth(size: keyof typeof breakpoints): boolean | null {
  return useMediaQuery(`(min-width: ${breakpoints[size]}px)`)
}

/**
 * Hook that returns whether the screen is large
 * @returns Boolean indicating if the screen is large (≥1024px), or null during SSR
 */
export function useLargeScreen(): boolean | null {
  return useMinWidth("lg")
}

/**
 * Hook that returns whether the screen is mobile-sized
 * @returns Boolean indicating if the screen is mobile-sized (<768px), or null during SSR
 */
export function useMobileScreen(): boolean | null {
  const isAtLeastMd = useMediaQuery(`(min-width: ${breakpoints.md}px)`)
  // Only return a boolean if we have a definite answer
  return isAtLeastMd === null ? null : !isAtLeastMd
}

