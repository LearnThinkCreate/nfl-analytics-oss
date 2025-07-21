import { PlayerSeasonStatsWithMetrics } from "@/lib/db/schema/select-types";
import { SortDirection } from "@/types/filters";

export interface TooltipField {
    field: string;
    label: string;
    format?: string;
}

export interface BarChartConfig {
    valueField: string;
    label: string;
    description?: string;
    tooltipFields?: Array<TooltipField>;
    sortDir?: SortDirection;
}


export interface StatConfig {
    valueField: keyof PlayerSeasonStatsWithMetrics;
    displayName: string;
    isPercentage?: boolean; // Only needed for percentage values
    sortDir?: SortDirection;
}
type ValueFormatter = (value: any) => React.ReactNode

export interface ColumnConfig {
    [key: string]: {
        header: string;
        width: ColumnWidth
        format?: ValueFormatter
    }
}

export type ColumnWidth = "extraSmall" | "small" | "medium" | "large" | "extraLarge"