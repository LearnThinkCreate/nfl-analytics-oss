import 'server-only'

import { positionQualifiers, tableSortBy } from "@/lib/constants/common";
import { getPlayerSeasonLeadersConfig } from "@/lib/constants/player";
import { getPlayerStats, getPlayerStatCardBatch } from "@/data/graphs";
import { Position, Level, SeasonType } from "@/types/filters";
import { PlayerStatsResult } from '@/types/graphs';
import { StatCardResult } from '@/types/graphs';


interface FetchDashboardDataProps {
    position: Position;
    level: Level;
    season?: number;
    seasonType?: SeasonType;
}

export interface DashoardData {
    tableData: PlayerStatsResult<Position, Level>[];
    cardData: StatCardResult[];
    qualifiers: Record<string, number> | undefined;
}

export const fetchDashboardData = async (params: FetchDashboardDataProps): Promise<DashoardData> => {
    const statCardConfig = getPlayerSeasonLeadersConfig(params.position);
    const qualifiers = positionQualifiers({
        position: params.position,
        level: params.level,
        season: params.season,
        seasonType: params.seasonType
    });

    const filters = {
        minQualifiers: qualifiers,
        position: params.position,
        level: params.level,
        season: params.season,
        seasonType: params.seasonType
    }

    const [tableData, cardData] = await Promise.all([
        getPlayerStats({
            ...filters,
            sortBy: tableSortBy[params.position]
        }),
        getPlayerStatCardBatch({
            filters: filters,
            configs: statCardConfig
        })
    ])

    return {
        tableData,
        cardData,
        qualifiers
    }
}

