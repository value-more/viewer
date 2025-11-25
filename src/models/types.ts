export interface Ticker {
    currencyCode?: string;
    exchange?: string;
    ticker: string;
}

export interface InvData {
    cik?: string;
    name?: string;
    type?: string;
    favorite: boolean;
    years?: { [key: string]: Data };
    metrics: GlobalMetrics;
    tickers: Ticker[];
    scores: Scores;
    timestamp: number;
    overwriteTimestamp: number;
    metricsTimestamp: number;
    metricsErrors?: { key: string }[];
}

export interface Data {
    INCOME_STATEMENT: IncomeStatement;
    BALANCE_SHEET: BalanceSheet;
    CASH_FLOW: CashFlow;
    metrics: Metrics;
}

export interface Metrics {
    [metricKey: string]: number;
}

export interface GlobalMetrics {
    [metricKey: string]: number;
}

export interface IncomeStatement {
    REVENUE?: number;
    OPERATING_INCOME?: number;
    WEIGHTED_AVERAGE_SHARES_OUTSTANDING_DILUTED?: number;
}

export interface BalanceSheet {
    CASH_AND_CASH_EQUIVALENTS?: number;
    TOTAL_CURRENT_LIABILITIES?: number;
    LONG_TERM_DEBT?: number;
    TOTAL_CURRENT_ASSETS?: number;
    TOTAL_ASSETS?: number;
    GOODWILL?: number;
    INTANGIBLE_ASSETS?: number;
    OTHER_LONG_TERM_ASSETS?: number;
    TOTAL_LIABILITIES?: number;
}

export interface CashFlow {
    NET_CASH_PROVIDED_BY_OPERATING_ACTIVITIES?: number;
}

export interface Scores {
    metrics: MetricsScores;
}

export interface MetricsScores {
    details: { [key: string]: number };
    value: number;
}

export interface ScoreDetailsConfig {
    value: number;
}

export interface ScoreCategoryConfig {
    value: number;
    details: { [key: string]: ScoreDetailsConfig };
    areas: number[];
}

export interface ScoreConfig {
    [key: string]: ScoreCategoryConfig;
}
