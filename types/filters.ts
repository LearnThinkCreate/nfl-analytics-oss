import { POSITIONS, SEASON_TYPES, SEASONS, LEVELS } from "@/lib/constants/common";

export type Position = keyof typeof POSITIONS;

export type PositionFields = {
  [key in Position]: readonly string[];
};

export type Level = typeof LEVELS[number];

export type LevelFields = {
  [key in Level]: readonly string[];
};

export type SeasonType = keyof typeof SEASON_TYPES;

export type Season = typeof SEASONS[number];

export type SortDirection = 'asc' | 'desc';

/**
 * Interface for statistics filter parameters
 * Used to filter player statistics across different positions and levels
 */
export interface StatsFilterParams {
  position?: Position;
  level?: Level;
  playerId?: string;
  teamAbbr?: string;
  season?: Season;
  seasonType?: SeasonType;
  week?: number;
  gameId?: string;
  
  // Generic qualification threshold
  minQualifiers?: Record<string, number>;
  
  // Sorting and pagination
  sortBy?: string;
  sortDir?: SortDirection;
  limit?: number;
  offset?: number;
}