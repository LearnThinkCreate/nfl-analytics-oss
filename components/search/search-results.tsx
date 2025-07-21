"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import type { PlayerSearchResult } from "@/types/player";
import { memo } from "react";
import { cn } from "@/lib/utils"
import Link from "next/link";
import Image from "next/image";

interface SearchResultsProps {
  results: PlayerSearchResult[]
  query: string
  isLoading?: boolean
  error?: Error | undefined
  showTopResults?: boolean
  className?: string
  cardClassName?: string
}

// Memoize the component to prevent unnecessary re-renders
const SearchResults = memo(function SearchResults({
  results,
  query,
  isLoading,
  error,
  showTopResults = false,
  className,
  cardClassName,
}: SearchResultsProps) {
  // If there's no query and not showing top results, show a prompt
  if (!query && !showTopResults) {
    return (
      <Card className={cn("border-none shadow-none bg-transparent", cardClassName)}>
        <CardContent className="p-4 text-center text-muted-foreground">Start typing to search...</CardContent>
      </Card>
    )
  }

  // If there's an error, show error message
  if (error) {
    return (
      <Card className={cn("border-none shadow-none bg-transparent", cardClassName)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center text-destructive gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Error loading results</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If loading, show loading spinner
  if (isLoading) {
    return (
      <Card className={cn("border-none shadow-none bg-transparent", cardClassName)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Searching...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If no results found and not showing top results, show message
  if (results.length === 0 && !showTopResults) {
    return (
      <Card className={cn("border-none shadow-none bg-transparent", cardClassName)}>
        <CardContent className="p-4 text-center text-muted-foreground">No results found for &quot;{query}&quot;</CardContent>
      </Card>
    )
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      <Card className={cn("border-none shadow-none bg-transparent overflow-hidden py-0", cardClassName)}>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {results.map((player) => (
              <Link
                key={player.gsisId}
                href={`/player/${player.gsisId}#top`}
                className="flex items-center px-3 py-3 hover:bg-muted cursor-pointer transition-colors duration-200"
                role="button"
                aria-label={`View profile for ${player.displayName}`}
              >
                {player.headshot ? (
                  <Image
                    src={player.headshot}
                    alt={player.displayName}
                    width={32}
                    height={32}
                    className="rounded-full mr-3 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-500 text-sm">
                    {player.displayName.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium">{player.displayName}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {player.position} {player.teamAbbr && `• ${player.teamAbbr}`} {player.jerseyNumber && `#${player.jerseyNumber}`}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

export default SearchResults
