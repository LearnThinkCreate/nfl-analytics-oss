import "server-only"

import { unstable_cache as cache } from 'next/cache'
import { getCacheDuration } from "@/lib/utils"


type PlayerRankingParams = {
    valueField: string,
    playerId: string,    
    position: string,
    season?: number,
    seasonType?: string,
    minQualifiers?: Record<string, number>,
}

export const getPlayerRankings = cache(
    async (params: PlayerRankingParams) => {
    const { valueField, playerId, position, season, seasonType, minQualifiers } = params;


    const selection = [
        'player_id',
        'player_name',
        'season',
        'season_type',   
    ]


    
    const whereConditions = [
       `position = '${position}'`,
    ]

    if (season) {
        whereConditions.push(`season = ${season}`)
    }

    if (seasonType) {
        whereConditions.push(`season_type = '${seasonType}'`)
    }

    if (minQualifiers) {
        Object.entries(minQualifiers).forEach(([field, value]) => {
            whereConditions.push(`${field} >= ${value}`)
        });
    }

    const selectionString = selection.join(', ')
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
    const query = `
        WITH QualifiedQBRankings AS (
            SELECT
                ${selectionString},
                ${valueField},		-- value field
                DENSE_RANK() OVER (
                    PARTITION BY season, season_type
                    ORDER BY ${valueField} DESC NULLS LAST
                ) AS rank
            FROM
                player_season_stats_with_metrics
            ${whereClause}
        )
        -- Now, filter the rankings to find only Jalen Hurts' records
        SELECT
            ${selectionString},
            ROUND(${valueField}::numeric, 2) AS value, -- Value Field
            rank
        FROM
            QualifiedQBRankings
        WHERE
            player_id = '${playerId}'
        ORDER BY
            season DESC,
            season_type DESC
    `

    return query
},
    ['player-rankings'],
    {
        revalidate: getCacheDuration(),
    }
);
