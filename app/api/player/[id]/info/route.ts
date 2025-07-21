import { NextResponse } from "next/server"
import { getPlayerBio, getLastSeasonPlayed } from "@/data/player"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: playerId } = await params

  try {
    const [playerData, latestSeason] = await Promise.all([getPlayerBio(playerId), getLastSeasonPlayed(playerId)])

    if (!playerData) {
      return new NextResponse(null, { status: 404 })
    }

    const isActive = latestSeason && latestSeason === 2024

    return NextResponse.json({
      ...playerData,
      isActive,
      latestSeason,
    })
  } catch (error) {
    console.error("Error fetching player info:", error)
    return new NextResponse(null, { status: 500 })
  }
}
