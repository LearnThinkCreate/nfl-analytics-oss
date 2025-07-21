import { BarChartConfig } from "@/types/dashboard";
import { Position } from "@/types/filters";



const WR_TE_ADDITIONAL_CONFIG: BarChartConfig[] = [
    {
        valueField: "receivingYards",
        label: "Receiving Yards",
        tooltipFields: [
            { field: "receptions", label: "Receptions" },
            { field: "targets", label: "Targets" },
            { field: "games", label: "Games" }
        ]
    },
    {
        valueField: "explosiveCatchRate",
        label: "Explosive Catch Rate",
        tooltipFields: [
            { field: "explosiveReceptions", label: "Explosive Receptions" },
            { field: "yardsPerReception", label: "Yards per Reception" },
            { field: "receptions", label: "Receptions" }
        ]
    },
    {
        valueField: "receiverAdot",
        label: "Average Depth of Target",
        description: "Average yards downfield of targets",
        tooltipFields: [
            { field: "targets", label: "Targets" },
            { field: "receptions", label: "Receptions" },
            { field: "catchRate", label: "Catch Rate" }
        ]
    },
    {
        valueField: "yardsPerTarget",
        label: "Yards per Target",
        tooltipFields: [
            { field: "receivingYards", label: "Receiving Yards" },
            { field: "targets", label: "Targets" }
        ]
    },
    {
        valueField: "targetSuccessRate",
        label: "Target Success Rate",
        tooltipFields: [
            { field: "targets", label: "Targets" },
            { field: "receivingYards", label: "Receiving Yards" },
            { field: "receivingTds", label: "TDs" }
        ]
    },
    {
        valueField: "targetShare",
        label: "Target Share",
        tooltipFields: [
            { field: "targets", label: "Targets" },
            { field: "receivingYards", label: "Receiving Yards" },
            { field: "receivingTds", label: "TDs" }
        ]
    },
    {
        valueField: "receivingEpa",
        label: "EPA per Reception",
        tooltipFields: [
            { field: "receivingYards", label: "Receiving Yards" },
            { field: "receivingTds", label: "TDs" }
        ]
    },
    {
        valueField: "epaPerTarget",
        label: "EPA per Target",
        description: "Expected Points Added per Target",
        tooltipFields: [
            { field: "targets", label: "Targets", format: "integer" },
            { field: "receptions", label: "Receptions", format: "integer" },
            { field: "receivingYards", label: "Receiving Yards", format: "integer" }
        ]
    },
    {
        valueField: "yardsPerReception",
        label: "Yards per Reception",
        tooltipFields: [
            { field: "receivingYards", label: "Receiving Yards" },
            { field: "receptions", label: "Receptions" }
        ]
    },
    {
        valueField: "receivingYardsAfterCatch",
        label: "Receiving Yards After Catch",
        tooltipFields: [
            { field: "receivingYards", label: "Receiving Yards" },
            { field: "receptions", label: "Receptions" }
        ]
    },
    {
        valueField: "receivingTds",
        label: "Receiving TDs",
        tooltipFields: [
            { field: "games", label: "GP" },
            { field: "receivingYards", label: "Receiving Yards" }
        ]
    },
    {
        valueField: "receivingYardsPerGame",
        label: "Receiving Yards per Game",
        tooltipFields: [
            { field: "receivingYards", label: "Receiving Yards" },
            { field: "games", label: "Games" }
        ]
    },
]

export const BAR_CHART_CONFIG: Record<Position, BarChartConfig[]> = {
    QB: [
        {
            valueField: "epaPerQbPlay",
            label: "EPA per Pass Play",
            description: "Expected Points Added per Pass Play",
            tooltipFields: [
                { field: "qbPlays", label: "Plays", format: "integer" },
                { field: "passingYards", label: "Passing Yards", format: "integer" },
                { field: "passingTds", label: "TDs", format: "integer" }
            ]
        },
        {
            valueField: "explosivePassRate",
            label: "Explosive Pass Rate",
            tooltipFields: [
                { field: "explosivePasses", label: "Explosive Passes", format: "integer" },
                { field: "passingYards", label: "Passing Yards", format: "integer" },
                { field: "yardsPerAttempt", label: "Yards per Attempt", format: "decimal" }
            ]
        },
        {
            valueField: "totalEpa",
            label: "Total EPA",
            tooltipFields: [
                { field: "epaPerQbPlay", label: "EPA/Play" },
                { field: "qbPlays", label: "Plays", format: "integer" }
            ]
        },
        {
            valueField: "passingEpa",
            label: "Passing EPA",
            tooltipFields: [
                { field: "epaPerQbPlay", label: "EPA/Play" },
                { field: "qbPlays", label: "Plays", format: "integer" }
            ]
        },
        {
            valueField: "scrambleEpa",
            label: "Scramble EPA",
            tooltipFields: [
                { field: "scrambleRate", label: "Scramble Rate" },
                { field: "scrambleSuccessRate", label: "Success %" },
                { field: "epaPerScramble", label: "EPA/Scramble" },
            ]
        },
        {
            valueField: "epaPerDropback",
            label: "EPA per Dropback",
            tooltipFields: [
                { field: "dropbackRate", label: "Dropback Rate" },
                { field: "dropbackSuccessRate", label: "Success %" },
                { field: "dropbackEpa", label: "EPA", format: "decimal" },
            ]
        },
        {
            valueField: "sackRate",
            label: "Sack Rate",
            sortDir: "asc",
            tooltipFields: [
                { field: "sacks", label: "Sacks", format: "integer" },
                { field: "dropbacks", label: "Dropbacks", format: "integer" }
            ]
        },
        {
            valueField: "intPercentage",
            label: "Interception Rate",
            sortDir: "asc",
            tooltipFields: [
                { field: "interceptions", label: "Interceptions", format: "integer" },
                { field: "attempts", label: "Attempts", format: "integer" },
    
            ]
        },
        {
            valueField: "qbAdot",
            label: "Average Depth of Target",
            tooltipFields: [
                { field: "epaPerQbPlay", label: "EPA/Play" },
                { field: "passingSuccessRate", label: "Success %" }
            ]
        },
        {
            valueField: "passingYards",
            label: "Passing Yards",
            tooltipFields: [
                { field: "passingYards", label: "Passing Yards", format: "integer" }
            ]
        },
        {
            valueField: "yardsPerAttempt",
            label: "Yards per Attempt",
            tooltipFields: [
                { field: "passingYards", label: "Passing Yards", format: "integer" },
                { field: "attempts", label: "Attempts", format: "integer" }
            ]
        },
        {
            valueField: "passingTds",
            label: "Passing TDs",
            tooltipFields: [
                { field: "passingTds", label: "Passing TDs", format: "integer" }
            ]
        },
        {
            valueField: "cpoe",
            label: "Completion Percentage Over Expected",
            tooltipFields: [
                { field: "completionPercentage", label: "Completion %" },
                { field: "passingEpa", label: "EPA" },
                { field: "passingSuccessRate", label: "Success %" }
            ]
        },
        {
            valueField: "passingFirstDownRate",
            label: "Passing First Down Rate",
            tooltipFields: [
                { field: "passingFirstDowns", label: "First Downs", format: "integer" },
                { field: "dropbacks", label: "Dropbacks", format: "integer" }
            ]
        },
        {
            valueField: "completionPercentage",
            label: "Completion Rate",
            tooltipFields: [
                { field: "completions", label: "Completions", format: "integer" },
                { field: "attempts", label: "Attempts", format: "integer" }
            ]
        },
    ],


    RB: [
          {
            valueField: "rushingYards",
            label: "Rushing Yards",
            description: "Rushing Yards",
            tooltipFields: [
                { field: "carries", label: "Carries", format: "integer" },
                { field: "epaPerCarry", label: "EPA / Carry" },
                { field: "rushingTds", label: "TDs", format: "integer" }
            ]
        },
        {
            valueField: "rushingTds",
            label: "Rushing TDs",
            description: "Rushing TDs",
            tooltipFields: [
                { field: "rushingYards", label: "Rushing Yards", format: "integer" },
                { field: "carries", label: "Carries", format: "integer" }
            ]
        },
        {
            valueField: "explosiveRunRate",
            label: "Explosive Run Rate",
            description: "Explosive Run Rate",
            tooltipFields: [
                { field: "explosiveRuns", label: "Explosive Runs", format: "integer" },
                { field: "carries", label: "Carries", format: "integer" }
            ]
        },
        {
          valueField: "rushingSuccessRate",
          label: "Rushing Success Rate",
          tooltipFields: [
              { field: "rushingEpa", label: "EPA" },
              { field: "rushingYards", label: "Rushing Yards", format: "integer" },
              { field: "rushingTds", label: "TDs", format: "integer" }
          ]
      },
        {
            valueField: "epaPerCarry",
            label: "EPA per Carry",
            description: "Expected Points Added per Carry",
            tooltipFields: [
                { field: "carries", label: "Carries", format: "integer" },
                { field: "rushingYards", label: "Rushing Yards", format: "integer" },
                { field: "rushingTds", label: "TDs", format: "integer" }
            ]
        },
        {
            valueField: "yardsPerCarry",
            label: "Yards per Carry",
            tooltipFields: [
                { field: "rushingYards", label: "Rushing Yards", format: "integer" },
                { field: "carries", label: "Carries", format: "integer" }
            ]
        },
        {
            valueField: "rushingEpa",
            label: "Rushing EPA",
            tooltipFields: [
                { field: "rushingYards", label: "Rushing Yards", format: "integer" },
                { field: "rushingTds", label: "TDs", format: "integer" }
            ]
        },
        {
            valueField: "rushingYardsPerGame",
            label: "Rushing Yards per Game",
            tooltipFields: [
                { field: "rushingYards", label: "Rushing Yards", format: "integer" },
                { field: "games", label: "Games", format: "integer" }
            ]
        }
    ],


    WR: [
    ...WR_TE_ADDITIONAL_CONFIG
    ],


    TE: [
    ...WR_TE_ADDITIONAL_CONFIG
    ]
}