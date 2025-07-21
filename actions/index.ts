"use server"

import { getPlayerBarChartData } from "@/data/graphs/player-bar-chart"
import type { BarChartParams } from "@/types/graphs"

export async function fetchBarChartData(params: BarChartParams) {
  return getPlayerBarChartData(params)
}

