import "server-only"

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { StatsFilterParams, Level } from '@/types/filters';
import { StatConfig } from '@/types/dashboard';
import { StatCardResult } from '@/types/graphs';
import { applyPrefix, getSqlSFilterConditions, camelToSnake } from '@/data/utils/filters';
import { getTableForLevel } from './utils';
import { unstable_cache as cache } from 'next/cache'
import { getCacheDuration } from '@/lib/utils';


interface BatchParams {
    filters: StatsFilterParams;
    configs: StatConfig[];
}


export const getPlayerStatCardBatch = cache(
    async ({ filters, configs }: BatchParams): Promise<StatCardResult[]> => {

    const table = getTableForLevel(filters.level, true);
    
    const filterConditions = getSqlSFilterConditions(filters, 's');
    const whereSQL = filterConditions.length ? `WHERE ${filterConditions}` : '';

    // Build eligible_players CTE, selecting each metric as camelCase alias
    const selectMetrics = configs
        .map(cfg => `${applyPrefix(camelToSnake(cfg.valueField), 's')} AS ${cfg.valueField}`)
        .join(', ');

    // Build row_number clauses in ranked CTE
    const rankClauses = configs
        .map(cfg => `ROW_NUMBER() OVER (ORDER BY ${cfg.valueField} ${cfg.sortDir || 'DESC NULLS LAST'}) AS rn_${cfg.valueField}`)
        .join(', ');

    const teamJoin = filters.level === 'career' ? 
        `
        LEFT JOIN player_career_team pct ON s.player_id = pct.gsis_id
        LEFT JOIN teams t ON pct.team = t.team_abbr
        ` : 
        'LEFT JOIN teams t ON s.team = t.team_abbr';

    // Build final UNION ALL selects
    const unionSelects = configs
        .map(cfg => {
            const valueExpr = cfg.isPercentage
                ? `CAST(${cfg.valueField} AS VARCHAR) || '%'`
                : `CAST(${cfg.valueField} AS VARCHAR)`;
            return `
                SELECT
                    player_id     AS "id",
                    player_name   AS "name",
                    team          AS "teamAbbr",
                    team_color    AS "teamColor",
                    image,
                    ${valueExpr}  AS value,
                    '${cfg.displayName}' AS "displayName"
                FROM ranked
                WHERE rn_${cfg.valueField} = 1
                AND ${cfg.valueField} IS NOT NULL
            `;
            })
        .join('UNION ALL');

    const rawSql = `
    WITH eligible_players AS (
    SELECT
        s.player_id,
        s.player_name,
        t.team_abbr as team,
        t.team_color,
        pl.headshot    AS image,
        ${selectMetrics}
    FROM ${table} s
    ${teamJoin}
    LEFT JOIN players pl ON s.player_id = pl.gsis_id
    ${whereSQL}
    ), ranked AS (
    SELECT
        *,
        ${rankClauses}
    FROM eligible_players
    )
    ${unionSelects};
    `;
    
    // Execute raw SQL using Drizzle
    const result = await db.execute(sql.raw(rawSql));
    return result as unknown as StatCardResult[];
},
    ['player-stat-card-batch'],
    {
        revalidate: getCacheDuration(),
    }
);
