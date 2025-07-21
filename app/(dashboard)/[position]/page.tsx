import Nav from "@/app/(dashboard)/components/nav";

import { Suspense } from "react";
import { notFound } from "next/navigation";

import DashboardSkeleton from "@/components/graphs/skeletons/skeleton-dashboard";
import DashboardContent from "@/app/(dashboard)/components/dashboard-content";
import { Disclaimer } from "@/components/disclaimer";

import { fetchDashboardData } from "@/data/index";

import { POSITIONS } from "@/lib/constants/common";
import { Position } from "@/types/filters";
import { formatQualifer } from "@/lib/utils";

export default async function PositionPage({
  params,
  searchParams,
}: {
  params: Promise<{ position: string }>;
  searchParams: Promise<{ season: string }>;
}) {
  // Fix: Await params before accessing properties
  const positionKey = (await params).position.toUpperCase() as Position;

  const season = (await searchParams).season
    ? Number.parseInt((await searchParams).season)
    : 2024;

  // Validate position
  if (!Object.keys(POSITIONS).includes(positionKey)) {
    return notFound();
  }

  const data = await fetchDashboardData({
    position: positionKey,
    season: season,
    level: "season",
    seasonType: "REG",
  });

  const qualifier = formatQualifer(data.qualifiers);

  return (
    <div className="@container/page flex flex-1 flex-col gap-8 p-6 relative">
      {qualifier && <Disclaimer qualifier={qualifier} />}
      <Nav className="block md:hidden" displayValue={true} />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent
          data={data}
          level="season"
          params={Promise.resolve({ position: positionKey.toUpperCase() })}
          searchParams={Promise.resolve({ season: season.toString() })}
        />
      </Suspense>
    </div>
  );
}
