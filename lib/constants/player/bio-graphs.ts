
import { Position } from '@/types/filters';
import { PlayerPageConfig } from '@/types/player';

// --- Configuration Data ---

const wr_te_config = () => {
    return {
        statCards: [
            { dbField: 'receivingYardsPerGame', rankField: 'recYdsPgRank', displayName: 'Receiving Yards/Game', formatOptions: { decimals: 1 }, rankSortDir: 'desc' },
            { dbField: 'receptions', rankField: 'recsRank', displayName: 'Receptions', rankSortDir: 'desc' },
            { dbField: 'receivingTds', rankField: 'recTdsRank', displayName: 'Receiving TDs', rankSortDir: 'desc' },
            { dbField: 'explosiveTargetRate', rankField: 'explosiveTargetRateRank', displayName: 'Explosive Play Rate', formatOptions: { decimals: 1, suffix: '%' }, rankSortDir: 'desc' },
            { dbField: 'receiverAdot', rankField: 'receiverAdotRank', displayName: 'ADoT', formatOptions: { decimals: 1 }, rankSortDir: 'desc' },
            { dbField: 'receivingFirstDownRate', rankField: 'receivingFirstDownRateRank', displayName: 'First Down Rate', formatOptions: { decimals: 1, suffix: '%' }, rankSortDir: 'desc' },
        ],
        donutCharts: [
            {
                chartLabel: 'Receiving Efficiency',
                baseMetric: {
                    dbValueField: 'epaPerTarget',
                    dbRankField: 'recEpaRank',
                    dbPercentileField: 'recEpaPct',
                    displayName: 'EPA/Target',
                    formatOptions: { decimals: 3 },
                    usePercentileForChart: true,
                    rankSortDir: 'desc'
                },
                altMetric: {
                    dbValueField: 'catchRate',
                    dbRankField: 'catchRateRank',
                    displayName: 'Catch Rate',
                    formatOptions: { decimals: 1},
                    usePercentileForChart: false,
                    rankSortDir: 'desc'
                },
            },
            {
                chartLabel: 'Player Usage',
                baseMetric: {
                    dbValueField: 'targetShare',
                    dbRankField: 'tgtShare',
                    dbPercentileField: 'tgtSharePct',
                    displayName: 'Target Share',
                    formatOptions: { decimals: 1 },
                    usePercentileForChart: true,
                    rankSortDir: 'desc'
                },
                altMetric: {
                    dbValueField: 'airYardsShare',
                    dbRankField: 'ayShare',
                    dbPercentileField: 'aySharePct',
                    displayName: 'Air Yards Share',
                    formatOptions: { decimals: 1 },
                    usePercentileForChart: true,
                    rankSortDir: 'desc'
                },
            },
        ],
    } as PlayerPageConfig
}

export const PLAYER_PAGE_CONFIG: Record<Position, PlayerPageConfig> = {
    QB: {
        statCards: [
            { dbField: 'passingYardsPerGame', rankField: 'yardsRank', displayName: 'Passing Yards/Game', formatOptions: { decimals: 1 }, rankSortDir: 'desc' },
            { dbField: 'passingTds', rankField: 'tdsRank', displayName: 'Passing TDs', rankSortDir: 'desc' },
            { dbField: 'intPercentage', rankField: 'intPercentageRank', displayName: 'Interception %', rankSortDir: 'asc', formatOptions: { isPercentage: true, decimals: 1, suffix: '%' } },
            { dbField: 'epaPerQbPlay', rankField: 'epaRank', displayName: 'EPA Per QB Play', formatOptions: { decimals: 3 }, rankSortDir: 'desc' },
            { dbField: 'sackRate', rankField: 'sackRateRank', displayName: 'Sack Rate', formatOptions: { isPercentage: true, decimals: 1, suffix: '%' }, rankSortDir: 'asc' },
            { dbField: 'qbAdot', rankField: 'adotRank', displayName: 'Average Depth of Target', formatOptions: { decimals: 1 }, rankSortDir: 'desc' },
        ],
        donutCharts: [
            {
                chartLabel: 'Dropback Performance',
                baseMetric: {
                    dbValueField: 'epaPerDropback',
                    dbRankField: 'dropbackEpaRank',
                    dbPercentileField: 'dropbackEpaPct',
                    displayName: 'EPA/Dropback',
                    formatOptions: { decimals: 3 },
                    usePercentileForChart: true,
                    rankSortDir: 'desc'
                },
                altMetric: {
                    dbValueField: 'dropbackSuccessRate',
                    dbRankField: 'dropbackSuccessRateRank',
                    displayName: 'Success Rate',
                    formatOptions: { decimals: 1 },
                    usePercentileForChart: false,
                    rankSortDir: 'desc'
                },
            },
            {
                chartLabel: 'Scramble Performance',
                baseMetric: {
                    dbValueField: 'epaPerScramble',
                    dbRankField: 'scrambleEpaRank',
                    dbPercentileField: 'scrambleEpaPct',
                    displayName: 'EPA/Scramble',
                    formatOptions: { decimals: 3 },
                    usePercentileForChart: true,
                    rankSortDir: 'desc'
                },
                altMetric: {
                    dbValueField: 'scrambleSuccessRate',
                    dbRankField: 'scrambleSuccessRank',
                    displayName: 'Success Rate',
                    formatOptions: { decimals: 1 },
                    usePercentileForChart: false,
                    rankSortDir: 'desc'
                },
            },
        ],
    },
    RB: {
        statCards: [
            { dbField: 'rushingYardsPerGame', rankField: 'rushYdsPgRank', displayName: 'Rushing Yards/Game', formatOptions: { decimals: 1 }, rankSortDir: 'desc' },
            { dbField: 'yardsPerCarry', rankField: 'yardsPerCarryRank', displayName: 'Yards Per Carry', formatOptions: { decimals: 1 }, rankSortDir: 'desc' },
            { dbField: 'rushingTds', rankField: 'rushTdsRank', displayName: 'Rushing TDs', rankSortDir: 'desc' },
            { dbField: 'rushingEpa', rankField: 'rushEpaRank', displayName: 'EPA/Rush', formatOptions: { decimals: 3 }, rankSortDir: 'desc' },
            { dbField: 'rushingFumbles', rankField: 'rushFumblesRank', displayName: 'Rushing Fumbles', rankSortDir: 'asc' },
            { dbField: 'rushTdPercentage', rankField: 'rushTdPercentageRank', displayName: 'Rushing TD %', formatOptions: { decimals: 1 }, rankSortDir: 'desc' },
        ],
        donutCharts: [
            {
                chartLabel: 'Rushing Efficiency',
                baseMetric: {
                    dbValueField: 'epaPerCarry',
                    dbRankField: 'rushEpaRank',
                    dbPercentileField: 'rushEpaPct',
                    displayName: 'EPA/Carry',
                    formatOptions: { decimals: 3 },
                    usePercentileForChart: true,
                    rankSortDir: 'desc'
                },
                altMetric: {
                    dbValueField: 'rushingSuccessRate',
                    dbRankField: 'rushSuccessRank',
                    displayName: 'Success Rate',
                    formatOptions: { decimals: 1 },
                    usePercentileForChart: false,
                    rankSortDir: 'desc'
                },
            },
            {
                chartLabel: 'Rushing Effectiveness',
                baseMetric: {
                    dbValueField: 'explosiveRunRate',
                    dbRankField: 'explosiveRunRateRank',
                    dbPercentileField: 'explosiveRunRatePct',
                    displayName: 'Explosive Run Rate',
                    formatOptions: { decimals: 1 },
                    usePercentileForChart: true,
                    rankSortDir: 'desc'
                },
                altMetric: {
                    dbValueField: 'rushingFirstDownRate',
                    dbRankField: 'rushingFirstDownRateRank',
                    dbPercentileField: 'rushingFirstDownRatePct',
                    displayName: 'First Down Rate',
                    formatOptions: { decimals: 1 },
                    usePercentileForChart: true,
                    rankSortDir: 'desc'
                },
            },
        ],
    },
    WR: wr_te_config(),
    TE: wr_te_config(),
};