// File: lib/data/stats/season-leaders/utils.ts

import { 
    BarChartResult, 
    BarChartBaseFields, 
    TooltipField,
    TooltipData,
    StatsTable,
} from "@/types/graphs";
import { BAR_CHART_FIELDS } from "@/types/graphs/fields";
import { playerGameStatsWithMetrics } from "@/lib/db/schema";
import { formatters } from "@/lib/utils";
import { playerSeasonStatsWithMetrics } from "@/lib/db/schema";
import { playerCareerStatsWithMetrics } from "@/lib/db/schema";
import { Level } from "@/types/filters";

export function transformChartItem(
    rawItem: any,
    tooltipFields?: TooltipField[]
): BarChartResult {
    // Use constant fields from types
    const baseObject = BAR_CHART_FIELDS.reduce((acc, key) => {
        acc[key] = rawItem[key];
        return acc;
    }, {} as BarChartBaseFields);

    // Create the core result with value as string
    const core: BarChartResult = {
        ...baseObject,
        value: Number(rawItem['value'])
    };

    // Inject tooltip fields if any
    if (tooltipFields && tooltipFields.length > 0) {
        const tooltipData: TooltipData = {};
        tooltipFields.forEach(({ field, label, format }) => {
            if (rawItem[field] !== undefined) {
                if (format) {
                    tooltipData[label] = formatters[format as keyof typeof formatters](rawItem[field]);
                } else {
                    tooltipData[label] = rawItem[field];
                }
            }
        });
        
        // Only assign if we have tooltip data
        if (Object.keys(tooltipData).length > 0) {
            core.tooltipData = tooltipData;
        }
    }

    return core;
}




export const getTableForLevel = <L extends Level>(
    level?: L,
    sql?: boolean
): StatsTable<L> | string => {
    
    switch (level) {
        case 'game':
            return sql ? 'player_game_stats_with_metrics' : playerGameStatsWithMetrics as StatsTable<L>;
        case 'season':
            return sql ? 'player_season_stats_with_metrics' : playerSeasonStatsWithMetrics as StatsTable<L>;
        case 'career':
            return sql ? 'player_career_stats_with_metrics' : playerCareerStatsWithMetrics as StatsTable<L>;
        default:
            throw new Error(`Invalid level: ${level}`);
    }
};