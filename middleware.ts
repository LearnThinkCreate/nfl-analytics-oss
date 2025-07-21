import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Redirect root path to /week
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/qb", request.url))
  }

  const playerIdPattern = /^\/player\/([^/]+)$/
  const match = request.nextUrl.pathname.match(playerIdPattern) 

  if (match) {
    const playerId = match[1]

    try {
      // Fetch the player data to determine where to redirect
      // Note: You'll need to adapt this to your data fetching method
      const response = await fetch(`${request.nextUrl.origin}/api/player/${playerId}/info`)

      if (!response.ok) {
        // If player not found, let the notFound() in the page component handle it
        return NextResponse.next()
      }

      const playerData = await response.json()

      // Determine where to redirect based on player status
      if (playerData.isActive) {
        return NextResponse.redirect(new URL(`/player/${playerId}/${playerData.latestSeason || 2024}`, request.url))
      } else {
        return NextResponse.redirect(new URL(`/player/${playerId}/career`, request.url))
      }
    } catch (error) {
      // If there's an error, continue to the page component
      console.error("Error in middleware:", error)
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

// Configure the paths that should invoke this middleware
export const config = {
  matcher: [
    "/",
     "/player/:id"
    ],
}

