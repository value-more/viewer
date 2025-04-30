export interface ChartOptions {
    key: string;
    labels: string | string[];
    datasets: ChartDatasetsDef[];
    additionalData: ChartAdditionalDataDef[];
    type?: string;
    stacked?: boolean;
    hideScales?: boolean;
}

export interface ChartDatasetsDef {
    metric?: string;
    borderColor?: string;
    data?: string;
    formula?: string;
    constant?: number;
    symbol?: string;
}

export interface ChartAdditionalDataDef {
    key: string;
    metric?: string;
    symbol: string;
    formula?: string;
}

export type ChartsConfig = {[key: string]: ChartOptions[]};

export type ChartValueDataType = { labels: string[]; datasets: object[] }

export interface ChartAdditionalData {
    label: string
    value?: number
    symbol: string
    key: string
}

export interface ChartSettings {
    data: ChartValueDataType
    options: object
    additionalData?: ChartAdditionalData[]
}

export interface ChartTableData {
    label: string;
    [year: string]: string;
}