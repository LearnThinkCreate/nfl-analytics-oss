import { Position } from "@/types/filters";
import { Player } from '@/lib/db/schema/select-types'
import { PlayerSeasonStatsWithMetrics } from "@/lib/db/schema/select-types";
/**
 * Parameters for searching players
 * @property query - The search text to match against player names
 * @property positions - Optional array of positions to filter by
 * @property limit - Optional maximum number of results to return
 */
export interface SearchPlayersParams {
    /** The search text to match against player names */
    query?: string;
    /** Optional array of positions to filter results by */
    positions?: Position[];
    /** Optional maximum number of results to return */
    limit?: number;

    top?: boolean;
}
// Extend with your custom field
export type PlayerSearchResult = Pick<Player, 'gsisId' | 'displayName' | 'position' | 'teamAbbr' | 'jerseyNumber' | 'headshot'>

export interface PlayerBio {
    gsisId: string;
    displayName: string;
    position: string;
    teamAbbr: string;
    teamName: string;
    teamNick: string;
    teamConf: string;
    teamDivision: string;
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
    quaternaryColor: string;
    logo: string;
    jerseyNumber: number;
    headshot: string;
    weight: number;
    collegeName: string;
    birthDate: string;
    entryYear: number;
    draftround: number;
    draftNumber: number;
    height: string;
    age: number;
    experience: string;
    draftInfo: string;
};


// Player Page Config
export interface PlayerStatCardConfig {
  dbField: keyof PlayerSeasonStatsWithMetrics; // The field name in the database result
  rankField: string; // The corresponding rank field name
  displayName: string; // Label displayed on the card
  formatOptions?: {
      isPercentage?: boolean; // Display value as percentage?
      decimals?: number;     // Number of decimal places
      suffix?: string;       // Suffix like '%'
  };
  rankSortDir?: 'asc' | 'desc'; // How the rank is calculated (important for display/understanding)
}

// Type for configuring a metric within a Donut Chart
export interface PlayerDonutMetricConfig {
  dbValueField: keyof PlayerSeasonStatsWithMetrics;
  dbRankField: string;
  dbPercentileField?: string; // Optional: If using percentile for the chart fill
  displayName: string; // Label for the toggle/tab
  formatOptions?: {
      decimals?: number;
      suffix?: string;
  };
  usePercentileForChart: boolean; // True = use dbPercentileField for chart, False = use raw value (likely needs scaling or interpretation)
  rankSortDir?: 'asc' | 'desc';
}

// Type for configuring a single Toggleable Donut Chart section
export interface PlayerDonutChartConfig {
  chartLabel: string; // Label displayed below the chart
  baseMetric: PlayerDonutMetricConfig;
  altMetric: PlayerDonutMetricConfig;
}

// The main configuration structure mapping Position to its page setup
export interface PlayerPageConfig {
  statCards: PlayerStatCardConfig[];
  donutCharts: PlayerDonutChartConfig[];
}

export type PlayerMetrics = Record<string, string | number | null>