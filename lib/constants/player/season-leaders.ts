import { StatConfig } from "@/types/dashboard";
import { Position } from "@/types/filters";

export const SEASON_LEADERS_CONFIG: Record<Position, StatConfig[]> = {
    QB: [
        {
            // id: 'passing-yards-per-game',
            valueField: 'passingYardsPerGame',
            displayName: 'Passing Yards/Game',
        },
        {
            // id: 'dropback-success-rate',
            valueField: 'dropbackSuccessRate',
            displayName: 'Dropback Success Rate',
            isPercentage: true,
        },
        {
            // id: 'epa-per-dropback',
            valueField: 'epaPerDropback',
            displayName: 'EPA/Dropback',
        },
        {
            // id: 'sack-rate',
            valueField: 'sackRate',
            displayName: 'Sack Rate',
            isPercentage: true,
            sortDir: 'asc',
        },
    ],
    RB: [
        {
            // id: 'yards-per-carry',
            valueField: 'yardsPerCarry',
            displayName: 'Yards/Carry',
        },
        {
            // id: 'rushing-yards-per-game',
            valueField: 'rushingYardsPerGame',
            displayName: 'Rush Yards/Game',
        },
        {
            // id: 'carries',
            valueField: 'carries',
            displayName: 'Carries',
        },
        {
            // id: 'rushing-tds',
            valueField: 'rushingTds',
            displayName: 'Rush TDs',
        },
    ],
    WR: [
        {
            // id: 'receiving-yards',
            valueField: 'receivingYards',
            displayName: 'Receiving Yards',
        },
        {
            // id: 'receptions',
            valueField: 'receptions',
            displayName: 'Receptions',
        },
        {
            // id: 'receiving-tds',
            valueField: 'receivingTds',
            displayName: 'Receiving TDs',
        },
        {
            // id: 'yards-per-reception',
            valueField: 'yardsPerReception',
            displayName: 'Yards/Reception',
        },
    ],
    TE: [
        {
            // id: 'receiving-yards',
            valueField: 'receivingYards',
            displayName: 'Receiving Yards',
        },
        {
            // id: 'receptions',
            valueField: 'receptions',
            displayName: 'Receptions',
        },
        {
            // id: 'receiving-tds',
            valueField: 'receivingTds',
            displayName: 'Receiving TDs',
        },
        {
            // id: 'yards-per-reception',
            valueField: 'yardsPerReception',
            displayName: 'Yards/Reception',
        },
    ],
};