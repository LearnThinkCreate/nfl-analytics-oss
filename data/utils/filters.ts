import { StatsFilterParams } from "@/types/filters";
import { eq, gte, SQL, is, Column } from "drizzle-orm";

export const getFilterConditions = (
  table: any,
  filters: StatsFilterParams
): SQL[] => {
  const whereConditions: SQL[] = [];

  // Apply basic filters
  if (filters.playerId) {
    whereConditions.push(eq(table.playerId, filters.playerId));
  }

  if (filters.position) {
    whereConditions.push(eq(table.position, filters.position));
  }

  if (filters.teamAbbr) {
    whereConditions.push(eq(table.team, filters.teamAbbr));
  }

  if (filters.season && is(table['season' as keyof typeof table], Column)) {
    whereConditions.push(eq(table.season, filters.season));
  }

  if (filters.seasonType && filters.seasonType !== 'ALL') {
    whereConditions.push(eq(table.seasonType, filters.seasonType));
  }

  // Apply level-specific filters
  if (filters.level === 'game') {
    if (filters.week && is(table['week' as keyof typeof table], Column)) {
      whereConditions.push(eq(table.week, filters.week));
    }

    if (filters.gameId && is(table['gameId' as keyof typeof table], Column)) {
      whereConditions.push(eq(table.gameId, filters.gameId));
    }
  }

  // Apply qualification thresholds
  if (filters.minQualifiers) {
    Object.entries(filters.minQualifiers).forEach(([field, minValue]) => {
      if (table[field as keyof typeof table] && minValue !== undefined) {
        whereConditions.push(gte(table[field as keyof typeof table], minValue));
      }
    });
  }

  return whereConditions;
};

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export const applyPrefix = (field: string, prefix?: string) => prefix ? `${prefix}.${field}` : field;


export const getSqlSFilterConditions = (filters: StatsFilterParams, prefix?: string) => {
  const clauses: string[] = [];

  const levelsWithSeason = ['game', 'season'];

  const applyPrefix = (field: string) => prefix ? `${prefix}.${field}` : field;

  if (filters.playerId) {
      clauses.push(`${applyPrefix('player_id')} = '${filters.playerId}'`);
  }

  if (filters.position) {
      clauses.push(`${applyPrefix('position')} = '${filters.position}'`);
  }
  if (filters.season) {
      clauses.push(`${applyPrefix('season')} = ${filters.season}`);
  }
  
  if (filters.seasonType && filters.seasonType !== 'ALL') {
      clauses.push(`${applyPrefix('season_type')} = '${filters.seasonType}'`);
  }
  if (filters.teamAbbr) {
      clauses.push(`t.team_abbr = '${filters.teamAbbr}'`);
  }

  if (filters.season && levelsWithSeason.includes(filters.level || '')) {
      clauses.push(`${applyPrefix('season')} = ${filters.season}`);
  }

  if (filters.seasonType && filters.seasonType !== 'ALL') {
      clauses.push(`${applyPrefix('season_type')} = '${filters.seasonType}'`);
  }

  if (filters.level === 'game') {
      if (filters.week) {
          clauses.push(`${applyPrefix('week')} = ${filters.week}`);
      }

      if (filters.gameId) {
          clauses.push(`${applyPrefix('game_id')} = ${filters.gameId}`);
      }
  }

  // Apply qualification thresholds
  if (filters.minQualifiers) {
      Object.entries(filters.minQualifiers).forEach(([field, minValue]) => {
          if (minValue !== undefined) {
              clauses.push(`${applyPrefix(camelToSnake(field))} >= ${minValue}`);
          }
      });
  }

  return clauses.join(' AND ');
}