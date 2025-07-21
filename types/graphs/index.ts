import {
    STAT_CARD_FIELDS,
    BAR_CHART_FIELDS,
    COMMON_FIELDS,
    POSITION_SPECIFIC_FIELDS,
    LEVEL_SPECIFIC_FIELDS
} from "./fields";
import { StatsFilterParams, SortDirection } from "@/types/filters"; // Added SortDirection
import { Position, Level } from "@/types/filters";
import {
    PlayerGameStatsWithMetrics,
    PlayerSeasonStatsWithMetrics,
    PlayerCareerStatsWithMetrics
} from "@/lib/db/schema/select-types";
import {
    playerGameStatsWithMetrics,
    playerSeasonStatsWithMetrics,
    playerCareerStatsWithMetrics,
    teams
} from "@/lib/db/schema";


{/* Stat Cards */ }
export type StatCardFieldName = typeof STAT_CARD_FIELDS[number];

export type StatCardBaseFields = {
    [K in StatCardFieldName]: string;
};

export interface StatCardParams extends StatsFilterParams {
    valueField: keyof PlayerSeasonStatsWithMetrics;
    isPercentage?: boolean; // Optional flag for percentage formatting
    // minQualifier is removed as it's part of StatsFilterParams now
}

export interface StatCardResult extends StatCardBaseFields {
    value: string | null;
    displayName: string;
}


{/* Bar Charts */ }
export type BarChartFieldName = typeof BAR_CHART_FIELDS[number];
export type BarChartBaseFields = {
    [K in BarChartFieldName]: string;
};

export interface BarChartParams extends StatsFilterParams {
    valueField: string; // Keep as string, API handles validation
    tooltipFields?: TooltipField[];
}

export interface BarChartResult extends BarChartBaseFields {
    value: number;
    tooltipData?: TooltipData;
}

export interface TooltipField {
    field: string;
    label: string;
    format?: string;
}

export interface TooltipData {
    [label: string]: string | number;
}


{/* Player Table */ }

export interface PlayerTableParams extends StatsFilterParams {
    position: Position;
    level: Level;
    addTeamData?: boolean;
}

export type TableField = keyof PlayerGameStatsWithMetrics | keyof PlayerSeasonStatsWithMetrics | keyof PlayerCareerStatsWithMetrics | keyof typeof teams;

export type StatsTable<L extends Level = Level> =
    L extends 'game' ? typeof playerGameStatsWithMetrics :
    L extends 'season' ? typeof playerSeasonStatsWithMetrics :
    typeof playerCareerStatsWithMetrics;

type ExtractField<T extends readonly any[]> = T[number];

// Helper type to get a union of field names based on position and level
type FieldNames<P extends Position, L extends Level> =
    | ExtractField<typeof COMMON_FIELDS>
    | ExtractField<typeof LEVEL_SPECIFIC_FIELDS[L]>
    | ExtractField<typeof POSITION_SPECIFIC_FIELDS[P]>;

// Get the appropriate stats type based on the level
type StatsType<L extends Level> =
    L extends 'game' ? PlayerGameStatsWithMetrics :
    L extends 'season' ? PlayerSeasonStatsWithMetrics :
    PlayerCareerStatsWithMetrics;

// Define the result type with just the fields we need
export type PlayerStatsResult<P extends Position, L extends Level> =
    Pick<StatsType<L>, Extract<FieldNames<P, L>, keyof StatsType<L>>> &
    { teamColor: string | null; teamColor2: string | null };


{/* Donut Chart */ }
export type TeamColors = {
    primary: string;
    secondary: string;
}

export type DonutChartMetric = {
    value: number;
    percentage: number;
    rank: number;
    label: string;
    astrick?: string;
}

export interface ToggleableDonutChartParams {
    baseMetric: DonutChartMetric;
    altMetric: DonutChartMetric;
    size?: number;
    className?: string;
    teamColors: TeamColors;
    chartLabel: string;
}