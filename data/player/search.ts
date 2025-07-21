import "server-only"

import { playerCareerTeam, playerRelevance, players } from "@/lib/db/schema";
import { SearchPlayersParams, PlayerSearchResult } from "@/types/player";
import { desc, sql, and, inArray, eq } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";
import { getCacheDuration } from "@/lib/utils";
import { db } from "@/lib/db";



export const searchPlayers = async (params: SearchPlayersParams): Promise<PlayerSearchResult[]> => {
    const { query, positions, limit = 10, top = false } = params;

    if (!query && !top) {
        return [];
    }

    const queryBuilder = db
        .select({
            gsisId: players.gsisId,
            displayName: players.displayName,
            position: players.position,
            teamAbbr: playerCareerTeam.team,
            jerseyNumber: players.jerseyNumber,
            headshot: players.headshot,
        })
        .from(playerRelevance)
        .innerJoin(players, eq(playerRelevance.playerId, players.gsisId))
        .innerJoin(playerCareerTeam, eq(playerRelevance.playerId, playerCareerTeam.gsisId))


    if (top) {
        queryBuilder.orderBy(desc(playerRelevance.normalizedCompositeScore))
    } else {
        const whereClauses = and(
            sql`similarity(${players.displayName}, ${query}) > 0.1`,
            positions && positions.length > 0 ? inArray(players.position, positions) : undefined
        );
        queryBuilder.where(whereClauses)
        queryBuilder.orderBy(desc(sql`${playerRelevance.normalizedCompositeScore} * 0.5 + similarity(${players.displayName}, ${query}) * 0.8`))
    }

    const results = await queryBuilder
        .limit(limit);

    return results
}

export const getTopSearchResults = cache(
    async (limit: number): Promise<PlayerSearchResult[]> => {
        const results = await searchPlayers({ query: "", limit: limit, top: true });
        return results;
    },
    ['top-search-results'],
    {
        revalidate: getCacheDuration(),
    }
);

