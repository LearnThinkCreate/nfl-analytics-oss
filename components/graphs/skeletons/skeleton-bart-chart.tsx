"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function ChartSkeleton() {
  // Pre-define widths to ensure consistency between server and client
  const barWidths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3', 'w-1/2', 'w-1/3', 'w-1/4', 'w-1/5', 'w-1/6']

  return (
    <div className="flex flex-col h-full w-full">

      {/* Chart content */}
      <div className="flex-grow flex w-full h-full min-h-[470px] gap-4">

        {/* Y-axis labels (player names) */}
        <div className="flex flex-col justify-between py-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={`y-label-${i}`} className="h-6 w-[70px]" />
          ))}
        </div>

        {/* Bars */}
        <div className="flex-grow flex flex-col justify-between py-4">
          {barWidths.map((width, i) => (
            <div key={`bar-${i}`} className="flex items-center h-6">
              <Skeleton className={`h-4 ${width}`} />
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between px-[80px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={`x-label-${i}`} className="h-2 w-[30px]" />
        ))}
      </div>
    </div>
  )
}

