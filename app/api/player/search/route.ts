// Create file: app/api/player/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { searchPlayers, getTopSearchResults } from '@/data/player'; // Corrected import path
import { POSITIONS } from '@/lib/constants/common';
import type { Position } from '@/types/filters';
import type { SearchPlayersParams, PlayerSearchResult } from '@/types/player';

const DEFAULT_SEARCH_LIMIT = 10;
const MAX_SEARCH_LIMIT = 20; 

// Get valid position keys for validation
const positionKeys = Object.keys(POSITIONS) as [Position, ...Position[]];

// Zod schema for validating search query parameters
const searchQuerySchema = z.object({
    query: z.string().optional(),
    limit: z.string()
        .default(DEFAULT_SEARCH_LIMIT.toString())
        .transform((val) => parseInt(val, 10))
        .pipe(z.number()
            .int({ message: "Limit must be an integer." })
            .positive({ message: "Limit must be positive." })
            .max(MAX_SEARCH_LIMIT, { message: `Limit cannot exceed ${MAX_SEARCH_LIMIT}.` })
        ),
    positions: z.string()
        .default(positionKeys.join(','))
        .transform((val) => 
            val.split(',').map(p => p.trim()).filter(Boolean)
        )
        .pipe(z.array(
                z.enum(positionKeys, {
                    message: "Invalid position provided. Must be one of: " + positionKeys.join(', '),
                }))
            .nonempty({ message: "At least one valid position must be provided." })
        ),
    top: z.string()
        .optional()
        .transform((val) => val === 'true')
        .pipe(z.boolean())
});


export async function GET(request: NextRequest): Promise<NextResponse<PlayerSearchResult[] | { error: string }>> {
    const searchParams = request.nextUrl.searchParams;

    try {
        // 1. Validate and Parse Query Params using Zod
        const validationResult = searchQuerySchema.safeParse({
            query: searchParams.get('query') ?? undefined,
            limit: searchParams.get('limit') ?? undefined,
            positions: searchParams.get('positions') ?? undefined,
            top: searchParams.get('top') ?? undefined,
        });

        if (!validationResult.success) {
            const errorMessage = validationResult.error.errors.map(e => e.message).join(', ');
            return NextResponse.json({ error: `Invalid query parameters: ${errorMessage}` }, { status: 400 });
        }

        // 2. Construct SearchPlayersParams with defaults
        const { query, limit, positions, top } = validationResult.data;

        const params: SearchPlayersParams = {
            query: query,
            limit: limit,
            positions: positions,
            top: top,
        };

        if (top) {
            const results = await getTopSearchResults(limit);
            return NextResponse.json(results);
          }

        // 3. Fetch Data
        const results: PlayerSearchResult[] = await searchPlayers(params);

        // 4. Return Success Response
        return NextResponse.json(results);

    } catch (error) {
        console.error("API Error searching players:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        // 5. Return Error Response
        return NextResponse.json({ error: `Failed to search players: ${errorMessage}` }, { status: 500 });
    }
}