import { Position } from "@/types/filters"
import { BarChartConfig } from "@/types/dashboard"

import {
    BAR_CHART_CONFIG
} from "./bar-chart"

import {
    SEASON_LEADERS_CONFIG
} from "./season-leaders"

import {
    COLUMN_CONFIG
} from "./table"

export const getPlayerBarChartFilters = <P extends Position>(
    position: P
): BarChartConfig[] => {
    return BAR_CHART_CONFIG[position] as BarChartConfig[];
}

export const getPlayerSeasonLeadersConfig = (position: Position) => {
    return SEASON_LEADERS_CONFIG[position]
}

export const getPlayerTableConfig = () => {
    return COLUMN_CONFIG
}