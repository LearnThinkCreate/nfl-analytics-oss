// lib/api-helpers.ts
import { z, ZodError } from 'zod';
import { POSITIONS, LEVELS, SEASON_TYPES, SEASONS } from '@/lib/constants/common';
import type { StatsFilterParams } from '@/types/filters';

// Preprocessor to coerce string->number
const coerceNumber = (val: unknown) => {
  if (typeof val === 'string') {
    const n = parseInt(val, 10);
    return isNaN(n) ? val : n;
  }
  return val;
};

// Define literal arrays for Zod enums
const positionEnum = Object.keys(POSITIONS) as [keyof typeof POSITIONS, ...(keyof typeof POSITIONS)[]];;
const seasonTypeEnum = Object.keys(SEASON_TYPES) as [keyof typeof SEASON_TYPES, ...(keyof typeof SEASON_TYPES)[]];

/**
 * Zod schema to validate and coerce filter params
 */
export const statsFilterSchema = z.object({
  // Required parameters
  position: z.enum(positionEnum, {
    errorMap: () => ({ message: `Invalid position. Must be one of: ${positionEnum.join(', ')}` }),
  }),
  level: z.enum(LEVELS, {
    errorMap: () => ({ message: `Invalid level. Must be one of: ${LEVELS.join(', ')}` }),
  }),
  valueField: z.string().min(1, { message: 'valueField is required' }),

  // Optional filters with defaults
  seasonType: z.enum(seasonTypeEnum).default('REG'),
  season: z.preprocess(coerceNumber, z.number().int().refine((v) => SEASONS.includes(v), {
    message: `Invalid season. Supported: ${SEASONS.join(', ')}`,
  })).optional(),
  week: z.preprocess(coerceNumber, z.number().int().min(1)).optional(),
  gameId: z.string().optional(),
  playerId: z.string().optional(),
  teamAbbr: z.string().optional(),
  minQualifiers: z.record(z.preprocess(coerceNumber, z.number())).optional(),

  // Sorting & pagination
  sortBy: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
  limit: z.preprocess(coerceNumber, z.number().int().min(1).max(50).default(10)),
  offset: z.preprocess(coerceNumber, z.number().int().min(0).default(0)),
});

/**
 * Parses incoming params (URLSearchParams or JSON body) against Zod schema,
 * applies defaults, and returns a typed StatsFilterParams.
 */
export function parseStatsFiltersFromParams(
  params: URLSearchParams | Record<string, any>
): StatsFilterParams {
  const raw: Record<string, any> = {};

  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => {
      raw[key] = key === 'minQualifiers' ? JSON.parse(value) : value;
    });
  } else {
    Object.assign(raw, params);
  }

  try {
    const parsed = statsFilterSchema.parse(raw);
    // Dynamic default: if sortBy not provided, use valueField
    return {
      ...parsed,
      sortBy: parsed.sortBy ?? parsed.valueField,
    };
  } catch (err) {
    if (err instanceof ZodError) throw err;
    throw new Error(
      `Validation error: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
