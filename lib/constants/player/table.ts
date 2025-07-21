
import { ColumnConfig } from "@/types/dashboard";
import { formatters } from "@/lib/utils";

// Column configuration with display names and width categories
export const COLUMN_CONFIG: ColumnConfig = {

    playerName: { header: "Player", width: "extraLarge" },
    week: { header: "Week", width: "small" },
    logo: { header: "Team", width: "extraSmall" },
    season: { header: "Season", width: "small" },

    qbPlays: { header: "Plays", width: "small" },
    totalEpa: { header: "Total EPA", width: "medium", format: formatters.twoDecimals },
    epaPerQbPlay: { header: "EPA/Play", width: "medium", format: formatters.twoDecimals },
    passingEpa: { header: "Pass EPA", width: "medium", format: formatters.twoDecimals },
    rushingEpa: { header: "Rush EPA", width: "medium", format: formatters.twoDecimals },
    scrambleRate: { header: "Scramble %", width: "medium", format: formatters.percentage },
    sackRate: { header: "Sack %", width: "small", format: formatters.percentage },
    dropbackSuccessRate: { header: "Dropback Success %", width: "medium", format: formatters.percentage },
    qbAdot: { header: "ADoT", width: "small" },
    completionPercentage: { header: "Comp %", width: "medium", format: formatters.percentage },
    passingYards: { header: "Pass Yards", width: "medium" },
    passingTds: { header: "Pass TD", width: "small" },
    interceptions: { header: "INT", width: "extraSmall" },
    yardsPerAttempt: { header: "YPA", width: "extraSmall" },
    rushingYards: { header: "Rush Yards", width: "medium" },
    rushingTds: { header: "Rush TD", width: "small" },

    carries: { header: "Carries", width: "small" },
    epaPerCarry: { header: "EPA/Carry", width: "small", format: formatters.twoDecimals },
    yardsPerCarry: { header: "Yards/Carry", width: "small" },
    rushingSuccessRate: { header: "Success %", width: "small", format: formatters.percentage },
    rushingFirstDownRate: { header: "1st Down %", width: "small", format: formatters.percentage },
    receptions: { header: "REC", width: "small" },
    receivingYards: { header: "Rec Yards", width: "medium" },
    receivingTds: { header: "Rec TD", width: "small" },
    receivingEpa: { header: "Rec EPA", width: "small", format: formatters.twoDecimals },
    totalYards: { header: "Total Yards", width: "medium" },

    targetShare: { header: "Target Share", width: "small", format: formatters.percentage },
    receivingYardsAfterCatch: { header: "YAC", width: "medium" },
    receiverAdot: { header: "ADoT", width: "small" },
    catchRate: { header: "Catch %", width: "small", format: formatters.percentage },
    epaPerTarget: { header: "EPA/Target", width: "small", format: formatters.twoDecimals },
    targets: { header: "Targets", width: "small" },
    airYardsShare: { header: "AYS", width: "small", format: formatters.percentage },

}