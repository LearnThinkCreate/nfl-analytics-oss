import { notFound } from "next/navigation"
import { getPlayerBio } from "@/data/player"
import PlayerStats from "../components/player-stats"
import { getPlayerStats } from "@/data/graphs/player-table"
import { Position } from "@/types/filters"
import { getPlayerMetrics } from "@/data/player/metrics"
import { formatQualifer } from "@/lib/utils"
import { positionQualifiers } from "@/lib/constants/common"
import { Disclaimer } from "@/components/disclaimer"

export default async function PlayerPage({ params }: { params: Promise<{ id: string, season: string }> }) {
    const { id: playerId, season } = await params

    const playerData = await getPlayerBio(playerId)

    if (!playerData) {
        return notFound()
    }

    const [ playerStats, playerMetrics] = await Promise.all([
        getPlayerStats({
            playerId: playerId,
            season: parseInt(season),
            seasonType: "REG",
            position: playerData.position as Position,
            level: "game",
            addTeamData: true
        }),
        getPlayerMetrics(
            playerId, 
            "REG", 
            playerData.position as Position, 
            "season", 
            parseInt(season)
        )
    ])

    playerData.teamName = (playerStats[0] as any)?.teamName
    playerData.logo = (playerStats[0] as any)?.logo
    playerData.primaryColor = (playerStats[0] as any)?.primaryColor
    playerData.secondaryColor = (playerStats[0] as any)?.secondaryColor

    const qualifier = formatQualifer(positionQualifiers({
        position: playerData.position as Position,
        level: "season",
        season: parseInt(season),
        seasonType: "REG"
    }));

  return (
    <>
        {qualifier && <Disclaimer qualifier={qualifier} />}
        <PlayerStats 
        playerData={playerData} 
        season={parseInt(season)} 
        position={playerData.position as Position} 
        playerStats={playerStats} 
        playerMetrics={playerMetrics || undefined} 
        level="game" 
        />
    </>
  )
}