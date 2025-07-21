import type { Level, Position, SeasonType } from "@/types/filters";
import { checkMinQualifiers } from "@/lib/utils";

export const POSITIONS = {
  QB: "Quarterback",
  RB: "Running Back",
  WR: "Wide Receiver",
  TE: "Tight End",
} as const;

export const SEASONS = Array.from({length: 2024 - 1999 + 1}, (_, i) => i + 1999);

export const SEASON_TYPES = {
  REG: "Regular Season",
  POST: "Postseason",
  ALL: "All Games",
} as const;

export const LEVELS = ["game", "season", "career"] as const;

export const NFL_STRUCTURE = {
  AFC: {
    name: "American Football Conference",
    divisions: {
      "AFC East": ["BUF", "MIA", "NE", "NYJ"],
      "AFC North": ["BAL", "CIN", "CLE", "PIT"],
      "AFC South": ["HOU", "IND", "JAX", "TEN"],
      "AFC West": ["DEN", "KC", "LV", "LAC"],
    },
  },
  NFC: {
    name: "National Football Conference",
    divisions: {
      "NFC East": ["DAL", "NYG", "PHI", "WAS"],
      "NFC North": ["CHI", "DET", "GB", "MIN"],
      "NFC South": ["ATL", "CAR", "NO", "TB"],
      "NFC West": ["ARI", "LAR", "SF", "SEA"],
    },
  },
} as const;

export const NON_SORTABLE_COLUMNS = ["logo"]

export const tableSortBy = {
  QB: 'totalEpa',
  RB: 'rushingYards',
  WR: 'receivingYards',
  TE: 'receivingYards'
}


export const positionQualifiers = ({
  position,
  level,
  season,
  seasonType,
}: {
  position: Position;
  level: Level;
  season?: number;
  seasonType?: SeasonType;
}) => {

  if (level === 'game') {
    return {}
  }

  const baseQualifiers = {
    QB: {
      field: 'qbPlays',
      season: 200,
      career: 1000,
      post: 20
    },
    RB: {
      field: 'carries',
      season: 100,
      career: 800,
      post: 10
    },
    WR: {
      field: 'targets',
      season: 75,
      career: 500,
      post: 5
    },
    TE: {
      field: 'targets',
      season: 50,
      career: 250,
      post: 5
    }
  }
  const getQualifiers = (position: Position, level: Level, field: string, season?: number, seasonType?: SeasonType) => {
    let value;
    if (level === 'season' && seasonType === 'REG') {
      value = baseQualifiers[position].season
    } else if (seasonType === 'POST' && level === 'season' ) {
      value = baseQualifiers[position].post
    } else {
      value = baseQualifiers[position].career
    }

    const qualifiers = {
      [field]: value
    }
    return level === 'season' ? checkMinQualifiers(position, season, qualifiers) : qualifiers
  }
  
  return getQualifiers(position, level, baseQualifiers[position].field, season, seasonType)
}