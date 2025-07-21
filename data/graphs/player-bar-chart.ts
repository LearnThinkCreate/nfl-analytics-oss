import "server-only"

import { BarChartResult, BarChartParams, StatsTable } from "@/types/graphs"
import { Level } from "@/types/filters"
import { transformChartItem, getTableForLevel } from "./utils"
import { getFilterConditions } from "@/data/utils/filters"
import { getCacheDuration } from "@/lib/utils"
import { db } from '@/lib/db'
import { teams, playerCareerTeam } from '@/lib/db/schema'
import { eq, desc, and, sql, SQL, asc } from 'drizzle-orm'

// import { cache } from 'react'
import { unstable_cache as cache } from 'next/cache'



export const getPlayerBarChartData = cache(
    async (params: BarChartParams): Promise<BarChartResult[]> => {    
    
    const { valueField, tooltipFields, ...filters } = params;
    const limit = filters.limit ?? 10;

    const table = getTableForLevel(filters.level) as StatsTable<Level>;

    const barChartSelection = {
        id: table.playerId,
        name: table.playerName,
        teamAbbr: teams.teamAbbr,
        fill: teams.teamColor,
        altFill: teams.teamColor2
    };

    const selection: Record<string, any> = {
        ...barChartSelection,
        value: table[valueField as keyof typeof table]
    };

    tooltipFields?.forEach(({ field }) => {
        if (table[field as keyof typeof table]) {
            selection[field] = table[field as keyof typeof table];
        }
    });

    const query = db
        .select(selection)
        .from(table)
        // .leftJoin(teams, eq(table.team, teams.teamAbbr));

    if (filters.level === 'career') {
        query.leftJoin(playerCareerTeam, eq(table.playerId, playerCareerTeam.gsisId));
        query.leftJoin(teams, eq(playerCareerTeam.team, teams.teamAbbr));
    } else {
        query.leftJoin(teams, eq(table.team, teams.teamAbbr));
    }

    // Apply filters
    const whereConditions = getFilterConditions(table, filters)
        .filter((condition): condition is SQL<unknown> => condition !== undefined);

    const whereClause = and(
        sql`${selection.value} IS NOT NULL`,
        whereConditions.length > 0 ? and(...whereConditions) : sql`TRUE`
    );

    const results = await query
        .where(whereClause)
        .orderBy(
            params.sortDir === "asc" ? asc(selection.value) : desc(selection.value)
        )
        .limit(limit);

    return results.map(item => transformChartItem(item, tooltipFields));
},
    ['player-bar-chart-data'],
    {
        revalidate: getCacheDuration(),
    }
);
