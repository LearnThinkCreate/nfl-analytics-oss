"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { StatCardResult } from "@/types/graphs"

export default function StatisticsCards({ stats }: { stats: StatCardResult[] }) {
  return (
    <div className="grid grid-cols-1 @3xl/page:grid-cols-2 @5xl/page:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.displayName}
          className="group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-0 relative"
          style={{
            borderColor: stat.teamColor,
            borderTopWidth: "4px",
          }}
        >
          {/* Colored overlay that appears on hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ backgroundColor: stat.teamColor }}
          />
          
          <CardContent className="p-0 h-full relative">
            <div className="p-4 transition-colors duration-200 h-full group-hover:text-white">
              {/* Category and Team */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-medium text-muted-foreground group-hover:text-white/90">
                  {stat.displayName}
                </h3>
                <div 
                  className="flex items-center justify-center rounded-full h-8 w-8 text-sm font-bold bg-ring group-hover:bg-white/20 transition-colors duration-200"
                  style={{ 
                    color: stat.teamColor
                  }}
                >
                  <span className="group-hover:text-white">{stat.teamAbbr}</span>
                </div>
              </div>

              {/* Value */}
              <p className="text-3xl font-bold mb-4">{stat.value}</p>

              {/* Player */}
              <div className="flex items-center">
                <div
                  className="relative h-10 w-10 overflow-hidden rounded-full border-2 flex-shrink-0"
                  style={{ borderColor: stat.teamColor }}
                >
                  <Image
                    src={stat.image || "/player-placeholder.png"}
                    alt={stat.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <p className="ml-2 font-semibold text-base">{stat.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

