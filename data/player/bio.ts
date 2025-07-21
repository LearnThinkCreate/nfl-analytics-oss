import "server-only"

import { formatHeight, calculateAge, calculateExperience, formatDraftInfo } from "./utils";
import { getCacheDuration } from "@/lib/utils";
import { unstable_cache as cache } from 'next/cache'
import { db } from "@/lib/db";
import { playerCareerStatsWithMetrics, playerCareerTeam, players, teams } from "@/lib/db/schema";
import { PlayerBio } from "@/types/player";
import { and, eq, gte, sql } from "drizzle-orm";
import { Position, SeasonType, Level } from "@/types/filters";
import { positionQualifiers } from "@/lib/constants/common";

export const getPlayerBio = cache(
    async (playerId: string): Promise<PlayerBio | null> => {
        const result = await db
            .select({
                gsisId: players.gsisId,
                displayName: players.displayName,
                position: players.position,
                teamAbbr: playerCareerTeam.team,
                teamName: teams.teamName,
                teamNick: teams.teamNick,
                teamConf: teams.teamConf,
                teamDivision: teams.teamDivision,
                primaryColor: teams.teamColor,
                secondaryColor: teams.teamColor2,
                tertiaryColor: teams.teamColor3,
                quaternaryColor: teams.teamColor4,
                logo: teams.teamLogoEspn,
                jerseyNumber: players.jerseyNumber,
                headshot: players.headshot,
                height: players.height,
                weight: players.weight,
                collegeName: players.collegeName,
                birthDate: players.birthDate,
                entryYear: players.entryYear,
                draftround: players.draftround,
                draftNumber: players.draftNumber,
                lastSeason: playerCareerTeam.lastSeason
            })
            .from(players)
            .leftJoin(playerCareerTeam, sql`${players.gsisId} = ${playerCareerTeam.gsisId}`)
            .leftJoin(teams, sql`${playerCareerTeam.team} = ${teams.teamAbbr}`)
            .where(sql`${players.gsisId} = ${playerId}`)
            .limit(1);

        if (!result.length) return null;

        const player = result[0];
        const birthDateObj = player.birthDate ? new Date(player.birthDate) : null;

        return {
            ...player,
            height: formatHeight(player.height),
            age: calculateAge(birthDateObj),
            experience: calculateExperience(player.entryYear, player.lastSeason),
            draftInfo: formatDraftInfo(player.entryYear, player.draftround, player.draftNumber)
        } as PlayerBio;
    },
    ['player-bio', 'bio-stats', 'all-stats'],
    {
        revalidate: getCacheDuration(),
    }
);

export const getPlayerQualified = cache(
    async (playerId: string, position: Position, seasonType: SeasonType, level: Level = "career") => {
        const qualifier = positionQualifiers({
            position,
            level,
            season: undefined,
            seasonType: seasonType
    })

    if (!qualifier) {
        return false;
    }

    const [[field, value]] = Object.entries(qualifier);

    const qualified = await db
    .select({
        playerId: playerCareerStatsWithMetrics.playerId,
        field: (playerCareerStatsWithMetrics as any)[field]
    })
    .from(playerCareerStatsWithMetrics)
    .where(and(
        eq(playerCareerStatsWithMetrics.playerId, playerId),
        eq(playerCareerStatsWithMetrics.seasonType, seasonType),
        gte((playerCareerStatsWithMetrics as any)[field], value)
    ))
    .limit(1)

        return qualified.length > 0;
    },
    ['player-bio-qualified', 'bio-stats', 'all-stats'],
    {
        revalidate: getCacheDuration(),
    }
);