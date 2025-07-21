import { InferSelectModel } from 'drizzle-orm';
import { 
  teams, 
  players, 
  games, 
  playerGameStats, 
  snapCounts,
  playerGameStatsWithMetrics, 
  playerSeasonStats, 
  playerSeasonStatsWithMetrics, 
  playerCareerStats, 
  playerCareerStatsWithMetrics,
  playerRelevance,
  playerCareerTeam
} from '@/lib/db/schema';

// Infer types directly from schema definitions
export type Team = InferSelectModel<typeof teams>;
export type Player = InferSelectModel<typeof players>;
export type Game = InferSelectModel<typeof games>;
export type SnapCount = InferSelectModel<typeof snapCounts>;
// For views and materialized views, use a direct type extraction
// This bypasses the Table constraint error by directly using the return type
export type PlayerGameStats = typeof playerGameStats.$inferSelect;
export type PlayerGameStatsWithMetrics = typeof playerGameStatsWithMetrics.$inferSelect;
export type PlayerSeasonStats = typeof playerSeasonStats.$inferSelect;
export type PlayerSeasonStatsWithMetrics = typeof playerSeasonStatsWithMetrics.$inferSelect;
export type PlayerCareerStats = typeof playerCareerStats.$inferSelect;
export type PlayerCareerStatsWithMetrics = typeof playerCareerStatsWithMetrics.$inferSelect;
export type PlayerRelevance = typeof playerRelevance.$inferSelect;
export type PlayerCareerTeam = typeof playerCareerTeam.$inferSelect;