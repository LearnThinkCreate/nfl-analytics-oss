import "server-only"

import { db } from "@/lib/db"
import { playerSeasonStats } from "@/lib/db/schema"
import { unstable_cache as cache } from "next/cache"
import { getCacheDuration } from "@/lib/utils"
import { eq, desc } from "drizzle-orm"

export const getLastSeasonPlayed = cache(
    async (playerId: string): Promise<number | null> => {
        const result = await db.select({ season: playerSeasonStats.season })
            .from(playerSeasonStats)
            .where(eq(playerSeasonStats.playerId, playerId))
            .orderBy(desc(playerSeasonStats.season))
            .limit(1)

        return result[0]?.season ?? null
    },
    ['last-season-played'],
    {
        revalidate: getCacheDuration(),
    }
)

export const getPlayerSeasons = cache(
    async (playerId: string): Promise<number[]> => {
        const result = await db.select({ season: playerSeasonStats.season })
            .from(playerSeasonStats)
            .where(eq(playerSeasonStats.playerId, playerId))
            .orderBy(desc(playerSeasonStats.season))

        if (result.length === 0) { 
            return []
        }
        return result.map((stat) => stat.season as number)
    },
    ['player-seasons'],
    {
        revalidate: getCacheDuration(),
    }
)