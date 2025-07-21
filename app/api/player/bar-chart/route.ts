import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { parseStatsFiltersFromParams } from '@/lib/api-helpers';
import { getPlayerBarChartData } from '@/data/graphs';
import type { BarChartParams, BarChartResult, TooltipField } from '@/types/graphs';
import { getPlayerBarChartFilters } from '@/lib/constants/player';
import { Position } from '@/types/filters';
import { BarChartConfig } from '@/types/dashboard';

export async function GET(request: NextRequest): Promise<NextResponse<BarChartResult[] | { error: string }>> {
  try {
    // 1. Parse and validate all params in one call
    const filters = parseStatsFiltersFromParams(request.nextUrl.searchParams);
    const { position, valueField } = filters as { position: Position; valueField: string };

    const chartConfig = findBarChartConfig(position, valueField);
    if (!chartConfig) {
        return NextResponse.json({ error: `Configuration not found for valueField '${valueField}' for position '${position}'` }, { status: 400 });
    }
    const tooltipFields: TooltipField[] = chartConfig.tooltipFields || [];

    // 2. Delegate to data layer
    const data = await getPlayerBarChartData({
        ...filters,
        tooltipFields: tooltipFields as TooltipField[]
    } as BarChartParams);

    return NextResponse.json(data);
  } catch (err) {
    // 3. Handle validation errors gracefully
    if (err instanceof ZodError) {
      const message = err.errors.map((e) => e.message).join(', ');
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function findBarChartConfig(position: Position, valueField: string): BarChartConfig | undefined {
    const configs = getPlayerBarChartFilters(position);
    return configs.find(config => config.valueField === valueField);
}