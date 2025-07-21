import { StatCard, StatsCardLayout } from "./stat-card";
import { ToggleableDonutChart } from "./toggleable-donut-chart";
import { PlayerBioTable } from "@/components/tables/player-bio-table";
// import SeasonSelector from "./season-selector";

import { PLAYER_PAGE_CONFIG } from "@/lib/constants/player/bio-graphs";

import { DonutChartMetric, PlayerStatsResult } from "@/types/graphs";
import { Level, Position } from "@/types/filters";
import { PlayerBio, PlayerMetrics } from "@/types/player";


export default async function PlayerStats({
  playerData,
  season,
  position,
  availableSeasons,
  playerStats,
  playerMetrics,
  level
}: {
  playerData: PlayerBio;
  position: Position;
  season?: number;
  availableSeasons?: number[];
  playerStats: PlayerStatsResult<Position, Level>[];
  playerMetrics?: PlayerMetrics;
  level: Level;
}) {
  // const position = playerData.position as Position;
  // const playerStats = await getPlayerMetrics(playerData.gsisId, season, "REG", position); 

  if (!playerMetrics) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="mb-16 text-muted-foreground">
          Player statistics are currently unavailable.
        </p>
      </div>
    );
  }
  
  // Get the configuration for the player's position
  const config = playerStats ? PLAYER_PAGE_CONFIG[position] : null;

  // Dynamically create toggleable metrics based on config
  const toggleableMetrics =
    config?.donutCharts.map((chartConfig) => {
      const baseDbValue = playerMetrics[
        chartConfig.baseMetric.dbValueField.toLowerCase()
      ] as number | null;

      const baseDbRank = playerMetrics[
        chartConfig.baseMetric.dbRankField.toLowerCase()
      ] as number | null;

      const baseDbPercentile = chartConfig.baseMetric.dbPercentileField
        ? (playerMetrics[
            chartConfig.baseMetric.dbPercentileField.toLowerCase()
          ] as number | null)
        : null;

      const altDbValue = playerMetrics[
        chartConfig.altMetric.dbValueField.toLowerCase()
      ] as number | null;

      const altDbRank = playerMetrics[
        chartConfig.altMetric.dbRankField.toLowerCase()
      ] as number | null;

      const altDbPercentile = chartConfig.altMetric.dbPercentileField
        ? (playerMetrics[
            chartConfig.altMetric.dbPercentileField.toLowerCase()
          ] as number | null)
        : null;

      const baseMetric: DonutChartMetric = {
        value: baseDbValue ?? 0, 
        percentage:
          chartConfig.baseMetric.usePercentileForChart &&
          baseDbPercentile !== null
            ? Math.round(baseDbPercentile * 100)
            : baseDbValue ?? 0,
        rank: baseDbRank ?? 0, // Provide default
        label: chartConfig.baseMetric.displayName,
        astrick: chartConfig.baseMetric.usePercentileForChart
          ? "*chart represents percentile"
          : undefined,
      };

      const altMetric: DonutChartMetric = {
        value: altDbValue ?? 0, // Provide default
        percentage:
          chartConfig.altMetric.usePercentileForChart &&
          altDbPercentile !== null
            ? Math.round(altDbPercentile * 100)
            : altDbValue ?? 0, // Handle potential % values
        rank: altDbRank ?? 0, // Provide default
        label: chartConfig.altMetric.displayName,
        astrick: chartConfig.altMetric.usePercentileForChart
          ? "*chart represents percentile"
          : undefined,
      };

      return {
        baseMetric: baseMetric,
        altMetric: altMetric,
        label: chartConfig.chartLabel,
      };
    }) ?? []; // Default to empty array if config fails

  return (
    <div className="container mx-auto px-4 py-12">
      <SectionHeader
        title="Player Statistics"
        description={`${playerData.teamName} • ${playerData.position} • ${playerData.jerseyNumber}`}
        primaryColor={playerData.primaryColor}
        secondaryColor={playerData.secondaryColor}
      >
        {
          availableSeasons && availableSeasons.length > 1 && season && false && (
            <></>
          //   <SeasonSelector
          //   seasons={availableSeasons}
          //   currentSeason={season}
          //   playerId={playerData.gsisId}
          //   primaryColor={playerData.primaryColor}
          // />
          )
        }
      </SectionHeader>

      {/* Dynamically render Stat Cards */}
      {config && playerMetrics ? (
        <StatsCardLayout className="mb-16">
          {config.statCards.map((statConfig) => {
            const value =
            playerMetrics[statConfig.dbField.toLowerCase() as keyof PlayerMetrics];
            const rank = playerMetrics[
              statConfig.rankField.toLowerCase() as keyof PlayerMetrics
            ] as number | null;

            return (
              <StatCard
                key={statConfig.rankField}
                value={formatStatValue(value, statConfig.formatOptions)}
                label={statConfig.displayName}
                rank={rank ?? undefined} // Pass undefined if rank is null
                teamColors={{
                  primary: playerData.primaryColor,
                  secondary: playerData.secondaryColor,
                }}
              />
            );
          })}
        </StatsCardLayout>
      ) : (
        <p className="mb-16 text-muted-foreground">
          Player statistics cards are currently unavailable.
        </p>
      )}

      {/* Dynamically render Performance Metrics (Donut Charts) */}
      {toggleableMetrics.length > 0 && playerMetrics ? (
        <>
          <SectionHeader
            title="Performance Metrics"
            description={`Advanced analytics for ${playerData.displayName}`}
            primaryColor={playerData.primaryColor}
            secondaryColor={playerData.secondaryColor}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-14 mb-12">
            {toggleableMetrics.map((metric) => (
              <div
                key={metric.label} // Use the id from config
                className="flex flex-col rounded-xl p-6 relative overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${playerData.primaryColor}08, ${playerData.primaryColor}02)`,
                  borderLeft: `3px solid ${playerData.primaryColor}`,
                }}
              >
                <ToggleableDonutChart
                  baseMetric={metric.baseMetric}
                  altMetric={metric.altMetric}
                  teamColors={{
                    primary: playerData.primaryColor,
                    secondary: playerData.secondaryColor,
                  }}
                  chartLabel={metric.label}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="mb-12 text-muted-foreground">
          Advanced performance metrics are currently unavailable.
        </p>
      )}

      <SectionHeader
        title="Game Logs"
        description={`Season Stats`}
        primaryColor={playerData.primaryColor}
        secondaryColor={playerData.secondaryColor}
      />

      {/* Keep the table rendering */}
      {/* <Card className="gap-0">
        <CardContent>
          <PlayerBioTable data={playerStats} level={level} className="mb-16" />
        </CardContent>
      </Card> */}
      <div className="flex flex-col">
      <PlayerBioTable data={playerStats} level={level} className="" />
      </div>
    </div>
  );
}

const SectionHeader = ({
  title,
  description,
  primaryColor,
  secondaryColor,
  children
}: {
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="mb-8 pb-2 border-b-2 w-full" style={{ borderColor: primaryColor }}>
      <div className="flex-1">
        <h2
          className="text-2xl font-bold flex"
          style={{ color: primaryColor }}
        >
          <div className="flex items-center">
            <div
              className="h-6 w-2 mr-3 rounded-full"
              style={{ backgroundColor: secondaryColor }}
            />
            {title}
          </div>
          <div className="flex-1 flex justify-end">
          {children}
          </div>
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mt-1 ml-5">{description}</p>
    </div>
  );
};

// Helper function for formatting stat values
function formatStatValue(
  value: any,
  options?: { isPercentage?: boolean; decimals?: number; suffix?: string }
): string {
  if (value === null || value === undefined) return "-";

  const numValue = Number(value);
  if (isNaN(numValue)) return "-";

  const decimals = options?.decimals ?? 0;
  if (options?.isPercentage) {
    return `${numValue.toFixed(decimals)}${options.suffix || "%"}`;
  }

  return `${numValue.toFixed(decimals)}${options?.suffix || ""}`;
}
