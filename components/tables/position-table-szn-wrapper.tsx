"use client"

import { use } from "react";
import { ExpandableCard, type RenderContext, type RenderFunction } from "@/components/ui/expandable-card"  
import { PlayerSummaryTable } from "@/components/tables/player-summary-table"
import type { PlayerStatsResult } from "@/types/graphs"
import type { Position, Level } from "@/types/filters"
import { POSITIONS } from "@/lib/constants/common";
import TableSkeleton from "@/components/tables/skeletons/skeleton-table"



interface PositionTableWrapperProps {
  tableData: PlayerStatsResult<Position, Level>[]
  params: Promise<{ position: string }>;
}

export function PositionTableWrapper({ tableData, params }: PositionTableWrapperProps) {
  const { position } = use(params);

  const formattedPosition = POSITIONS[position as Position];
  
  // Function to generate description based on context
  const getDescription = (context: RenderContext) => {
    const { isLargeScreen } = context
    if (isLargeScreen === null) return ""
    return isLargeScreen
      ? "Showing key metrics. Click expand to see all statistics."
      : `This table shows various performance metrics for NFL ${formattedPosition}s. Use the pagination controls to navigate through the data.`
  }

  // Define render functions explicitly with the correct type
  const renderMainContent: RenderFunction = (context) => {
    return <PlayerSummaryTable data={tableData} isReduced={context.isLargeScreen === true} isDialog={context.isDialog} />
  }

  const renderDialogContent: RenderFunction = (context) => {
    return (
      <PlayerSummaryTable
        data={tableData}
        isReduced={false}
        isDialog={context.isDialog}
        className={`
          text-sm lg:text-sm xl:text-base [&_td]:font-medium [&_th]:text-rendering-optimizelegibility 
          [&_td:has(text)]:subpixel-antialiased [&_td]:tracking-tight md:[&_td]:tracking-normal
          tracking-tight subpixel-antialiased
          flex-grow [&>div]:flex-grow [&>div>div]:flex-grow
          [&_.overflow-x-auto]:flex-grow [&_table]:h-full
          [&_tbody_tr]:py-2 [&_tbody_td]:py-3 [&_thead_th]:py-3.5
        `}
      />
    )
  }

  return (
    <ExpandableCard
      title={`${formattedPosition} Data`}
      description={getDescription}
      expandedTitle={`Complete ${formattedPosition} Statistics`}
      dialogClassName={``}
      cardClassName="min-h-[600px]"
      dialogChildren={renderDialogContent}
      skeletonComponent={<TableSkeleton />}
    >
      {renderMainContent}
    </ExpandableCard>
  )
}

