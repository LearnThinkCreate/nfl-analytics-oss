"use client";

import { DonutChart } from "@/app/player/[id]/components/donut-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ToggleableDonutChartParams, TeamColors } from "@/types/graphs";


export function ToggleableDonutChart({
  baseMetric,
  altMetric,
  size = 200,
  className,
  teamColors,
  chartLabel,
}: ToggleableDonutChartParams) {
  const [selectedMetric, setSelectedMetric] = useState<string>("base");
  const astrick = selectedMetric === "base" ? baseMetric.astrick : altMetric.astrick;
  return (
    <>
    <div className={cn("flex flex-col items-center", className)}>
      <Tabs defaultValue="base" className="w-auto mx-auto mb-2">
        <div className="relative mb-4">
          <TabsList className="flex p-1 bg-gray-100/50 rounded-full">
            <Toggle
              value="base"
              label={baseMetric.label}
              teamColors={teamColors}
              setSelectedMetric={setSelectedMetric}
            />
            <Toggle
              value="alt"
              label={altMetric.label}
              teamColors={teamColors}
              setSelectedMetric={setSelectedMetric}
            />
          </TabsList>
        </div>

        <TabsContent value="base" className="mt-2">
          <DonutChart
            percentage={baseMetric.percentage}
            rank={baseMetric.rank}
            value={baseMetric.value}
            label=""
            size={size}
            teamColors={teamColors}
          />
        </TabsContent>
        <TabsContent value="alt" className="mt-2">
          <DonutChart
            value={altMetric.value}
            percentage={altMetric.percentage}
            rank={altMetric.rank}
            label=""
            size={size}
            teamColors={teamColors}
          />
        </TabsContent>
      </Tabs>
    </div>
    <ChartLabel label={chartLabel} astrick={astrick} primaryColor={teamColors.primary} />
    </>
  );
}


const Toggle = ({
  value,
  label,
  teamColors,
  setSelectedMetric,
}: {
  value: string;
  label: string;
  teamColors: TeamColors;
  setSelectedMetric: (value: string) => void;
}) => {
  return (
    <TabsTrigger
      value={value}
      className="flex-1 px-4 py-1.5 text-sm font-medium rounded-full transition-all data-[state=active]:shadow-sm relative overflow-hidden"
      style={
        {
          ["--active-bg" as any]: teamColors
            ? teamColors.primary
            : "hsl(var(--primary))",
          ["--active-text" as any]: "white",
          color: teamColors ? `${teamColors.primary}` : undefined,
        } as React.CSSProperties
      }
      onClick={() => setSelectedMetric(value)}
    >
      {/* Text with z-index to stay above the background */}
      <span className="relative z-10">{label}</span>

      {/* Active state background pill */}
      <span
        className="absolute inset-0 rounded-full opacity-0 data-[state=active]:opacity-100 transition-opacity duration-200 ease-out"
        style={{ backgroundColor: "var(--active-bg)" }}
        data-state="inactive"
      />
    </TabsTrigger>
  );
};


const ChartLabel = ({ label, astrick, primaryColor }: { label: string, astrick?: string, primaryColor: string }) => {
  return (
    <div className="relative">
      <div
        className="text-center text-sm font-medium uppercase tracking-wider mt-2 py-2 rounded-md"
        style={{
          backgroundColor: `${primaryColor}15`,
          color: primaryColor,
        }}
      >
        {label}
      </div>

      {astrick && (
        <div className="absolute bottom-[-16px] left-2 text-xs text-muted-foreground">
          {astrick}
        </div>
      )}
    </div>
  );
};