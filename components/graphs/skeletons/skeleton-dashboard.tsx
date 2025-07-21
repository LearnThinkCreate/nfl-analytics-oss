"use client";

import StatisticsCardsSkeleton from "@/components/graphs/skeletons/skeleton-position-leader-cards";
import TableSkeleton from "@/components/tables/skeletons/skeleton-table";
import ChartSkeleton from "@/components/graphs/skeletons/skeleton-bart-chart";
import { SkeletonCard } from "@/components/graphs/skeletons/skeleton-card";

export default function DashboardSkeleton() {
  return (
    <>
      <StatisticsCardsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard>
          <TableSkeleton />
        </SkeletonCard>
        <SkeletonCard>
          <ChartSkeleton />
        </SkeletonCard>
      </div>
    </>
  );
}
