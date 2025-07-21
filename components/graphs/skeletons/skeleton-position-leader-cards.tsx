"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function StatisticsCardsSkeleton() {
  // Pre-compute cards to avoid mapping during render
  const cards = Array.from({ length: 4 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((_, index) => (
        <Card
          key={`skeleton-card-${index}`}
          className="overflow-hidden rounded-lg shadow-sm p-0 relative"
          style={{
            borderTopWidth: "4px",
            borderColor: "#e2e8f0" // neutral color for skeleton
          }}
        >
          <CardContent className="p-0 h-full">
            <div className="p-4 h-full">
              {/* Category and Team */}
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="h-4 w-24" /> {/* Category */}
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Team abbreviation */}
              </div>

              {/* Value */}
              <Skeleton className="h-8 w-20 mb-4" />

              {/* Player */}
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" /> {/* Player image */}
                <Skeleton className="h-5 w-32 ml-2" /> {/* Player name */}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 