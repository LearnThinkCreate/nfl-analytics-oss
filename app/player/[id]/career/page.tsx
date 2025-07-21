import { notFound } from "next/navigation"
import { getPlayerBio, getPlayerQualified } from "@/data/player"
import PlayerStats from "../components/player-stats"
import { getPlayerStats } from "@/data/graphs/player-table"
import { Position, SeasonType } from "@/types/filters"
import { getPlayerMetrics } from "@/data/player/metrics"
import { positionQualifiers } from "@/lib/constants/common";
import { Disclaimer } from "@/components/disclaimer";
import { formatQualifer } from "@/lib/utils"



export default async function PlayerPage({ params }: { params: Promise<{ id: string}> }) {
    const { id: playerId } = await params

    const playerData = await getPlayerBio(playerId)

    if (!playerData) {
        return notFound()
    }

    const qualified = await getPlayerQualified(playerId, playerData.position as Position, "REG", "career")

    if (!qualified) {
        return (
            <div className="container mx-auto px-4 py-12">
                <p className="mb-16 text-muted-foreground">
                    Player Doesn&apos;t Qualify for Career Stats
                </p>
            </div>
        )
    }

    const [playerStats, playerMetrics] = await Promise.all([
        getPlayerStats({
            playerId: playerId,
            seasonType: "REG",
            position: playerData.position as Position,
            level: "season"
        }),
        getPlayerMetrics(
            playerId, 
            "REG", 
            playerData.position as Position, 
            "career"
        ),
    ])

    const qualifier = formatQualifer(positionQualifiers({
        position: playerData.position as Position,
        level: "career",
        season: undefined,
        seasonType: "REG"
    }));

  return (
    <>
        {qualifier && <Disclaimer qualifier={qualifier} />}
        <PlayerStats 
        playerData={playerData} 
        position={playerData.position as Position} 
        playerStats={playerStats} 
        playerMetrics={playerMetrics || undefined} 
        level="season" 
        />
    </>
  )
}

// const playerQualified = async (playerId: string, position: Position, seasonType: SeasonType) => {
//     const qualifier = positionQualifiers({
//         position,
//         level: "career",
//         season: undefined,
//         seasonType: seasonType
//     })

//     if (!qualifier) {
//         return false;
//     }

//     const [[field, value]] = Object.entries(qualifier);

//     const qualified = await db
//     .select({
//         playerId: playerCareerStatsWithMetrics.playerId,
//         field: (playerCareerStatsWithMetrics as any)[field]
//     })
//     .from(playerCareerStatsWithMetrics)
//     .where(and(
//         eq(playerCareerStatsWithMetrics.playerId, playerId),
//         eq(playerCareerStatsWithMetrics.seasonType, seasonType),
//         gte((playerCareerStatsWithMetrics as any)[field], value)
//     ))
//     .limit(1)

//     return qualified.length > 0;
// }