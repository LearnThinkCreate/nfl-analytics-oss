import "server-only"

import { PlayerStatsResult, TableField, StatsTable, PlayerTableParams } from "@/types/graphs"
import { COMMON_FIELDS, LEVEL_SPECIFIC_FIELDS, POSITION_SPECIFIC_FIELDS } from "@/types/graphs/fields"
import { Position, Level } from "@/types/filters"
import { alias } from 'drizzle-orm/pg-core';
import { getCacheDuration } from '@/lib/utils';

import { getFilterConditions } from "@/data/utils/filters"

import { db } from "@/lib/db";
import { teams, playerGameStatsWithMetrics, playerSeasonStatsWithMetrics, playerCareerStatsWithMetrics } from "@/lib/db/schema";
import { eq, asc, desc, and, is, Column } from "drizzle-orm";

import { unstable_cache as cache } from 'next/cache'

export const getPlayerStats = cache(
    async <P extends Position, L extends Level = 'season'>(
    params: PlayerTableParams
): Promise<PlayerStatsResult<P, L>[]> => {

    const { position, level, ...filters } = params;

    const sortDir = filters.sortDir === 'asc' ? asc : desc;
    const sortField = filters.sortBy || 'playerId';
    const limit = filters.limit ? filters.limit : 200;
    const offset = filters.offset ? filters.offset : 0;

    const table = getTableForLevel(level);

    // Get fields for the position and level
    const fields = getFieldsForPosition(position, level);

    // Build selection object
    const selectionObj = buildSelectionObject(fields, level, params.addTeamData);

    if (level === 'game') {
        const awayTeam = alias(teams, 'opponent');
        selectionObj['opponentLogo'] = awayTeam.teamLogoEspn;
    }

    // Build query
    const query = db
        .select(selectionObj)
        .from(table as any)
        .leftJoin(teams, eq(table.team, teams.teamAbbr))

    if (level === 'game') {
        const awayTeam = alias(teams, 'opponent');
        query.leftJoin(awayTeam, eq(playerGameStatsWithMetrics.opponentTeam, awayTeam.teamAbbr));
    }

    const whereConditions = getFilterConditions(table, { ...filters, position, level });

    let orderByCondition;
    if (level === 'game') {
        orderByCondition = asc(table['week' as keyof typeof table] as any);
    } else {
        orderByCondition = sortDir(table[sortField as keyof typeof table] as any);
    }

    const finalQuery = query
        .where(and(...whereConditions))
        .orderBy(orderByCondition)
        .limit(limit)
        .offset(offset);

    // Execute query
    const results = await finalQuery;
    return results as unknown as PlayerStatsResult<P, L>[];

},
    ['player-table-stats'],
    {
        revalidate: getCacheDuration(),
    }
);


const getFieldsForPosition = (
    position: Position,
    level: Level = 'season'
): TableField[] => {
    return [
        ...COMMON_FIELDS,
        ...LEVEL_SPECIFIC_FIELDS[level],
        ...POSITION_SPECIFIC_FIELDS[position]
    ] as TableField[];
};


const getTableForLevel = <L extends Level>(
    level: L
): StatsTable<L> => {
    switch (level) {
        case 'game':
            return playerGameStatsWithMetrics as StatsTable<L>;
        case 'season':
            return playerSeasonStatsWithMetrics as StatsTable<L>;
        case 'career':
            return playerCareerStatsWithMetrics as StatsTable<L>;
        default:
            throw new Error(`Invalid level: ${level}`);
    }
};

const buildSelectionObject = (
    fields: TableField[],
    level: Level,
    addTeamData: boolean = false
): Record<string, any> => {
    const selectionObj: Record<string, any> = {}
    const table = getTableForLevel(level);
    for (const field of fields) {
        if (is(teams[field as keyof typeof teams], Column)) {
            // For logo fields, use 'logo' as the selection key
            if (field.includes('Logo')) {
                selectionObj['logo'] = teams[field as keyof typeof teams];
            } else {
                selectionObj[field] = teams[field as keyof typeof teams];
            }
        } else if (is(table[field as keyof typeof table], Column)) {
            selectionObj[field] = table[field as keyof typeof table];
        }
    }
    if (addTeamData) {
        selectionObj['teamName'] = teams.teamName;
        selectionObj['logo'] = teams.teamLogoEspn;
        selectionObj['primaryColor'] = teams.teamColor;
        selectionObj['secondaryColor'] = teams.teamColor2;
    }
    return selectionObj;
};