"use client";

import { PositionBarChart } from "@/components/graphs/position-bar-chart";
import {
  ExpandableCard,
  type RenderFunction,
} from "@/components/ui/expandable-card";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, use } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Level, Position, SeasonType } from "@/types/filters";
import { getPlayerBarChartFilters } from "@/lib/constants/player";
import { positionQualifiers } from "@/lib/constants/common";
import { BarChartParams } from "@/types/graphs";
import { Loader2 } from "lucide-react";
import ChartSkeleton from "./skeletons/skeleton-bart-chart";
import useSWR from "swr";
import { buildQueryString } from "@/lib/swr/utils";

const fetcherRoute = (url: string) => fetch(url).then((res) => res.json());

interface PositionBarChartWrapperProps {
  level: Level;
  params: Promise<{ position: string }>;
  searchParams?: Promise<{ season: string }>;
}

export function PositionBarChartWrapper({
  level,
  params,
  searchParams,
}: PositionBarChartWrapperProps) {
  const { position } = use(params);
  const { season } = searchParams ? use(searchParams) : { season: ""};

  const seasonFilter =
    level == "career" ? undefined : Number.parseInt(season) || 2024;

  const [displayCount, setDisplayCount] = useState(10);

  const [selectedConfigIndex, setSelectedConfigIndex] = useState<string>("0");

  const configs = getPlayerBarChartFilters(
    position.toUpperCase() as Position
  );

  const config = configs[Number.parseInt(selectedConfigIndex)];

  const { label, description } = config;

  const [chartData, setChartData] = useState<any[]>();

  const filters = {
    minQualifiers: positionQualifiers({
      position: position.toUpperCase() as Position,
      level: level,
      season: seasonFilter,
      seasonType: "REG" as SeasonType,
    }),
    position: position.toUpperCase() as Position,
    seasonType: "REG" as SeasonType,
    limit: 32,
    valueField: config.valueField,
    sortBy: config.valueField,
    sortDir: config.sortDir || "desc",
    level: level,
    tooltipFields: config.tooltipFields,
    season: seasonFilter,
  } as BarChartParams;

  const {
    data: swrData,
    error,
    isLoading,
  } = useSWR(
    `/api/player/bar-chart?${buildQueryString(filters, {
      skipKeys: ["tooltipFields"],
      jsonKeys: ["minQualifiers"],
    })}`,
    fetcherRoute,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      keepPreviousData: true,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (swrData) {
      const newData = swrData.map((item: any) => ({ ...item }));
      setChartData(newData);
    }
  }, [swrData]);

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      setDisplayCount(10);
    }
  };

  const renderChart: RenderFunction = (context) => {
    const { isDialog } = context;

    const effectiveCount = isDialog ? displayCount : 10;

    const displayData = chartData?.slice(0, effectiveCount);

    return (
      <div
        className={`flex flex-col h-full relative ${
          isLoading ? "opacity-90" : ""
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-20 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
          </div>
        )}
        {isDialog && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6 px-4">
            <div className="w-full md:w-1/2 order-2 md:order-1 flex flex-col justify-center">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  Number of players to display
                </span>
                <span className="text-sm font-medium">{displayCount}</span>
              </div>
              <div className="py-2.5">
                <Slider
                  value={[displayCount]}
                  min={5}
                  max={Math.min(32, chartData?.length || 0)}
                  step={1}
                  onValueChange={(values) => setDisplayCount(values[0])}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Chart metric</span>
              </div>
              <Select
                value={selectedConfigIndex}
                onValueChange={(value) => setSelectedConfigIndex(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"0"}>{configs[0].label} (Default)</SelectItem>
                  {configs.slice(1).map((config, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <PositionBarChart data={displayData || []} description={description} height={isDialog ? 500 : undefined} />
      </div>
    );
  };

  return (
    <ExpandableCard
      title={label}
      // description={getDescription}
      skeletonComponent={<ChartSkeleton />}
      expandedTitle={`${label} - Full View`}
      dialogClassName="tracking-tight"
      cardClassName="min-h-[600px]"
      dialogChildren={renderChart}
      onDialogOpenChange={handleDialogOpenChange}
    >
      {renderChart}
    </ExpandableCard>
  );
}
