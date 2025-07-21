"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useDebounce } from "./use-debounce"
import useSWR from "swr"
import type { PlayerSearchResult } from '@/types/player'

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch search results")
  }
  return res.json()
}

export function useSearch(initialQuery = "") {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fetch search results using SWR
  const { data, error, isLoading } = useSWR<PlayerSearchResult[]>(
    debouncedSearchQuery ? `/api/player/search?query=${encodeURIComponent(debouncedSearchQuery)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  // Fetch top results
  // const { data: topData } = useSWR<PlayerSearchResult[]>(
  //   "/api/player/search?top=true&limit=5", 
  //   fetcher, 
  //   {
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: false,
  //   }
  // )

  // Extract results from SWR data
  const results = data || []
  // const topResults = topData || []

  // Set typing state when search query changes
  useEffect(() => {
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    if (searchQuery) {
      setIsTyping(true)

      // Set a timeout to turn off typing state after a delay
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
      }, 300)
    } else {
      setIsTyping(false)
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Determine if we should show the loading state
  const showLoading = searchQuery !== "" && (isTyping || isLoading)

  // Update search query
  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Reset search query
  const resetSearchQuery = useCallback(() => {
    setSearchQuery("")
  }, [])

  return {
    searchQuery,
    results,
    // topResults,
    error,
    showLoading,
    updateSearchQuery,
    resetSearchQuery,
  }
}
