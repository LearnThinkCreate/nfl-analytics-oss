import { relations } from "drizzle-orm/relations";
import { teams, players, games, snapCounts } from "./";

export const playersRelations = relations(players, ({one, many}) => ({
	team: one(teams, {
		fields: [players.teamAbbr],
		references: [teams.teamAbbr]
	}),
	games_awayQbId: many(games, {
		relationName: "games_awayQbId_players_gsisId"
	}),
	games_homeQbId: many(games, {
		relationName: "games_homeQbId_players_gsisId"
	}),
	snapCounts: many(snapCounts),
}));

export const teamsRelations = relations(teams, ({many}) => ({
	players: many(players),
	games_awayTeam: many(games, {
		relationName: "games_awayTeam_teams_teamAbbr"
	}),
	games_homeTeam: many(games, {
		relationName: "games_homeTeam_teams_teamAbbr"
	}),
}));

export const gamesRelations = relations(games, ({one, many}) => ({
	player_awayQbId: one(players, {
		fields: [games.awayQbId],
		references: [players.gsisId],
		relationName: "games_awayQbId_players_gsisId"
	}),
	team_awayTeam: one(teams, {
		fields: [games.awayTeam],
		references: [teams.teamAbbr],
		relationName: "games_awayTeam_teams_teamAbbr"
	}),
	player_homeQbId: one(players, {
		fields: [games.homeQbId],
		references: [players.gsisId],
		relationName: "games_homeQbId_players_gsisId"
	}),
	team_homeTeam: one(teams, {
		fields: [games.homeTeam],
		references: [teams.teamAbbr],
		relationName: "games_homeTeam_teams_teamAbbr"
	}),
	snapCounts: many(snapCounts),
}));

export const snapCountsRelations = relations(snapCounts, ({one}) => ({
	game: one(games, {
		fields: [snapCounts.gameId],
		references: [games.gameId]
	}),
	player: one(players, {
		fields: [snapCounts.gsisId],
		references: [players.gsisId]
	}),
}));