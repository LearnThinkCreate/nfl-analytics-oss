'server only'

import { db } from "@/lib/db"
import { sql } from "drizzle-orm"
import { Position, Level, SeasonType } from "@/types/filters"; // Import Position
import { PLAYER_PAGE_CONFIG } from '@/lib/constants/player/bio-graphs'; // Import the new config
import { PlayerSeasonStatsWithMetrics } from "@/lib/db/schema/select-types";
import { PlayerMetrics } from "@/types/player";
import { formatQualiferForMetrics } from "@/lib/utils";
import { positionQualifiers } from "@/lib/constants/common";

import { unstable_cache as cache } from "next/cache";
import { getCacheDuration } from "@/lib/utils";

// Keep the comprehensive PlayerMetrics type defined above

// Helper function to generate DENSE_RANK() clauses
const generateRankClause = (field: keyof PlayerSeasonStatsWithMetrics, rankAlias: string, sortDir: 'asc' | 'desc' = 'desc', level: Level): string => {
    const order = sortDir === 'asc' ? 'ASC NULLS LAST' : 'DESC NULLS LAST';
    // Important: Use backticks or quotes if field names have capitals or special chars in SQL
    // Assuming snake_case for SQL columns based on original query
    const sqlField = camelToSnake(field as string);
    return `DENSE_RANK() OVER (PARTITION BY ${level === 'season' ? 'season, ' : ''} season_type ORDER BY ${sqlField} ${order}) AS ${rankAlias}`;
};

// Helper function to generate PERCENT_RANK() clauses
const generatePercentileClause = (field: keyof PlayerSeasonStatsWithMetrics, percentileAlias: string, sortDir: 'asc' | 'desc' = 'asc', level: Level): string => {
    const order = sortDir === 'asc' ? 'ASC' : 'DESC'; // PERCENT_RANK typically uses ASC for "percentile below"
    const sqlField = camelToSnake(field as string);
    return `PERCENT_RANK() OVER (PARTITION BY ${level === 'season' ? 'season, ' : ''} season_type ORDER BY ${sqlField} ${order}) AS ${percentileAlias}`;
};

// Basic camelCase to snake_case helper (adjust if your naming differs)
function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}


export const getPlayerMetrics =
    cache(
        async (
            playerId: string,
            seasonType: SeasonType,
            position: Position,
            level: Level,
            season?: number,
        ): Promise<PlayerMetrics | null> => {

            const config = PLAYER_PAGE_CONFIG[position];
            const qualifiers = formatQualiferForMetrics(positionQualifiers({
                position,
                level,
                season,
                seasonType
            }))
            
            if (!config) {
                console.error(`No player page config found for position: ${position}`);
                return null;
            }

            // --- Dynamically build SELECT clauses ---
            const selectFields = new Set<string>([
                'player_id',
                'player_name',
                'season_type',
                camelToSnake(qualifiers?.minQualifierField as string) + ` AS ${qualifiers?.minQualifierField}` // Select the qualifier field itself
            ]);
            if (level === 'season') {
                selectFields.add('season');
            }

            const table = level === 'season' ? 'player_season_stats_with_metrics' : 'player_career_stats_with_metrics';

            const rankClauses: string[] = [];
            const percentileClauses: string[] = [];

            // Add fields and ranks for Stat Cards
            config.statCards.forEach(sc => {
                selectFields.add(camelToSnake(sc.dbField as string) + ` AS ${sc.dbField}`);
                rankClauses.push(generateRankClause(sc.dbField, camelToSnake(sc.rankField as string), sc.rankSortDir, level));
            });

            // Add fields, ranks, and percentiles for Donut Charts
            config.donutCharts.forEach(dc => {
                // Base Metric
                selectFields.add(camelToSnake(dc.baseMetric.dbValueField as string) + ` AS ${dc.baseMetric.dbValueField}`);
                rankClauses.push(generateRankClause(dc.baseMetric.dbValueField, camelToSnake(dc.baseMetric.dbRankField as string), dc.baseMetric.rankSortDir, level));
                if (dc.baseMetric.dbPercentileField) {
                    // Use ASC for standard percentile calculation (percent below)
                    percentileClauses.push(generatePercentileClause(dc.baseMetric.dbValueField, camelToSnake(dc.baseMetric.dbPercentileField as string), 'asc', level));
                }

                // Alt Metric
                selectFields.add(camelToSnake(dc.altMetric.dbValueField as string) + ` AS ${dc.altMetric.dbValueField}`);
                rankClauses.push(generateRankClause(dc.altMetric.dbValueField, camelToSnake(dc.altMetric.dbRankField as string), dc.altMetric.rankSortDir, level));
                if (dc.altMetric.dbPercentileField) {
                    // Use ASC for standard percentile calculation (percent below)
                    percentileClauses.push(generatePercentileClause(dc.altMetric.dbValueField, camelToSnake(dc.altMetric.dbPercentileField as string), 'asc', level));
                }
            });

            // Combine all SELECT parts
            const finalSelectClauses = Array.from(selectFields).join(',\n            ');
            const finalRankClauses = rankClauses.join(',\n            ');
            const finalPercentileClauses = percentileClauses.length > 0 ? `,\n            ${percentileClauses.join(',\n            ')}` : '';


            // --- Dynamic Threshold ---
            const minQualifierSqlField = camelToSnake(qualifiers?.minQualifierField as string);
            // Use the default threshold from config, allowing override by player's actual value IF it's higher
            const dynamicThresholdCTE = `
                WITH DynamicThreshold AS (
                    SELECT
                        LEAST(
                            ${qualifiers?.minQualifierValue}, -- Default/maximum threshold from config
                            COALESCE(
                                (SELECT pssm_lookup.${minQualifierSqlField}
                                FROM ${table} pssm_lookup
                                WHERE pssm_lookup.player_id = '${playerId}'
                                ${level === 'season' ? `AND pssm_lookup.season = ${season}` : ''}
                                AND pssm_lookup.season_type = '${seasonType}'
                                AND pssm_lookup.${minQualifierSqlField} > 0 -- Ensure player actually qualified
                                ),
                                ${qualifiers?.minQualifierValue || 0 + 1} -- Use value > default if player not found or has 0
                            )
                        ) AS min_qualifier_threshold
                )
            `;

            // --- Main Query Construction ---
            const rawSqlQuery = `
                ${dynamicThresholdCTE}
                , QualifiedPlayerPercentiles AS (
                    SELECT
                        ${finalSelectClauses}
                        ${finalRankClauses.length > 0 ? `,\n            ${finalRankClauses}` : ''}
                        ${finalPercentileClauses} -- Percentiles included here

                    FROM
                        ${table}
                    CROSS JOIN DynamicThreshold
                    WHERE
                        position = '${position}' -- Filter by position
                        AND ${minQualifierSqlField} >= min_qualifier_threshold -- Dynamic qualifier
                        ${level === 'season' ? `AND season = ${season}` : ''}
                        AND season_type = '${seasonType}' -- Use passed-in season type
                        -- Add NOT NULL checks for fields used in ranking/percentiles if necessary
                        -- Example (adapt based on required fields for the position):
                        -- AND ${camelToSnake(config.statCards[0].dbField as string)} IS NOT NULL
                        -- AND ${camelToSnake(config.donutCharts[0].baseMetric.dbValueField as string)} IS NOT NULL
                )
                -- Select the metrics and their calculated ranks/percentiles for the specific player
                SELECT
                    * -- Select all calculated fields from the CTE
                FROM
                    QualifiedPlayerPercentiles
                WHERE
                    player_id = '${playerId}' -- Filter for the specific player
                LIMIT 1;
            `;

            try {
                const result = await db.execute(sql.raw(rawSqlQuery));

                if (!result || result.length === 0) {
                    console.warn(`No metrics found for player ${playerId}, position ${position}, season ${season}, type ${seasonType}`);
                    return null;
                }

                // Drizzle `execute` might return rows differently depending on the driver
                // Assuming it returns an array of objects matching the SELECT list
                // Convert snake_case keys from SQL result back to camelCase for PlayerMetrics type
                const rawData = result[0] as Record<string, any>;
                const playerMetrics: Partial<PlayerMetrics> = {}; // Use Partial initially
                for (const key in rawData) {
                    const camelKey = key.replace(/(_\w)/g, k => k[1].toUpperCase()).toLowerCase() as keyof PlayerMetrics;
                    playerMetrics[camelKey] = rawData[key];
                }

                return playerMetrics as PlayerMetrics; // Cast to the full type

            } catch (error) {
                console.error("Error fetching player metrics:", error);
                console.error("Failed SQL:\n", rawSqlQuery); // Log SQL on error
                return null;
            }
        }
        ,
        ['player-metrics'],
        {
            revalidate: getCacheDuration(),
        }
    );
