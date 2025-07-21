import { Position, Level } from "@/types/filters";

{/* Stat Card Fields */}
export const STAT_CARD_FIELDS = ['id', 'name', 'teamAbbr', 'teamColor', 'image'] as const;


{/* Bar Chart Fields */}
export const BAR_CHART_FIELDS = ['id', 'name', 'teamAbbr', 'fill', 'altFill'] as const;


{/* Player Table Fields */}
/**
 * Common fields that apply to all positions and levels
 */
export const COMMON_FIELDS = [
    "playerId",
    "seasonType",
  ] as const;
  
  /**
   * Position-specific fields for each position
   */
  export const POSITION_SPECIFIC_FIELDS: Record<Position, readonly string[]> = {
    QB: [
      "qbPlays",
      "totalEpa",
      "epaPerQbPlay",
      "epaPerDropback",
      "passingEpa",
      "rushingEpa",
      "dropbackEpa",
      "scrambleRate",
      "sackRate",
      "dropbackSuccessRate",
      "qbAdot",
      "completionPercentage",
      "passingYards",
      "passingTds",
      "interceptions",
      "yardsPerAttempt",
      "rushingYards",
      "rushingTds",
    ],
    RB: [
      "carries",
      "epaPerCarry",
      "rushingEpa",
      "rushingYards",
      "rushingTds",
      "yardsPerCarry",
      "rushingSuccessRate",
      "rushingFirstDownRate",
      "receptions",
      "receivingYards",
      "receivingTds",
      "receivingEpa",
      "totalYards",
    ],
    WR: [
      "receptions",
      "receivingYards",
      "targetShare",
      "receivingTds",
      "receivingYardsAfterCatch",
      "receiverAdot",
      "catchRate",
      "receivingEpa",
      "epaPerTarget",
      "targets",
      "airYardsShare"
    ],
    TE: [
      "receptions",
      "receivingYards",
      "targetShare",
      "receivingTds",
      "receivingYardsAfterCatch",
      "receiverAdot",
      "catchRate",
      "receivingEpa",
      "epaPerTarget",
      "targets",
      "airYardsShare"
    ]
  } as const;
  
  /**
   * Level-specific fields for each aggregation level
   */
  export const LEVEL_SPECIFIC_FIELDS: Record<Level, readonly string[]> = {
    game: [
      "week",
      "teamLogoEspn",
      "opponentLogo",
      "gameId",
      "opponentTeam",
      "season",
      "homeAway",
    ],
    season: [
      "playerName",
      "team",
      "gamesPlayed",
      "season",
      "teamColor",
      "teamLogoEspn"
    ],
    career: [
      "playerName",
      "seasonsPlayed",
      "gamesPlayed"
    ]
  } as const;