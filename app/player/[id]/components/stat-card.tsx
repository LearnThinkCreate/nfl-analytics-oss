import type React from "react"

import { Kelly_Slab } from "next/font/google"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Initialize the Kelly Slab font
const kellySlabFont = Kelly_Slab({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

// Types for our stat card
export interface StatCardProps {
  value: string | number
  label: string
  rank?: number
  className?: string
  teamColors?: {
    primary: string
    secondary: string
  }
}

// Individual stat card component
export function StatCard({ value, label, rank, className, teamColors }: StatCardProps) {
  return (
    <Card
      className={cn(
        "border-0 shadow-none rounded-lg overflow-hidden relative",
        "transition-all duration-200 hover:shadow-md",
        className,
      )}
      style={{
        background: teamColors ? `linear-gradient(to right, ${teamColors.primary}10, transparent)` : undefined,
        borderLeft: teamColors ? `3px solid ${teamColors.primary}` : undefined,
      }}
    >
      {/* Diagonal stripes overlay - adds texture */}
      {teamColors && (
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${teamColors.secondary}, ${teamColors.secondary} 1px, transparent 1px, transparent 10px)`,
          }}
        />
      )}

      <CardContent className="p-4 relative">
        <div className="flex items-center justify-between mb-1">
          <span className={cn("text-4xl font-bold tracking-wider", kellySlabFont.className)}>{value}</span>
          {rank && (
            <span
              className="rounded-full px-3 py-1 text-sm font-medium"
              style={{
                backgroundColor: teamColors ? `${teamColors.primary}` : "rgb(74 222 128)",
                color: "white",
              }}
            >
              {rank}
              {getOrdinalSuffix(rank)}
            </span>
          )}
        </div>
        <span
          className={cn("text-sm uppercase tracking-wider block pt-1 border-t mt-2", kellySlabFont.className)}
          style={{
            borderColor: teamColors ? `${teamColors.primary}30` : undefined,
            color: teamColors ? teamColors.primary : "hsl(var(--muted-foreground))",
          }}
        >
          {label}
        </span>
      </CardContent>
    </Card>
  )
}

// Stats card layout component
export function StatsCardLayout({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "grid gap-x-8 gap-y-6",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        "max-w-full mx-auto",
        className,
      )}
    >
      {children}
    </div>
  )
}

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(num: number): string {
  const j = num % 10
  const k = num % 100
  if (j === 1 && k !== 11) {
    return "st"
  }
  if (j === 2 && k !== 12) {
    return "nd"
  }
  if (j === 3 && k !== 13) {
    return "rd"
  }
  return "th"
}

