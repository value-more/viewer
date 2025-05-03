export interface TestConfig {
    _id?: string;
    name: string;
    data: object;
    results?: { [key: string]: TestConfigResult };
}

export interface TestConfigResult {
    pass: boolean;
    errors: {
        error?: string;
        errors?: { key: string; rawError?: string }[];
        compareMetrics?: { [key: string]: TestConfigResultCompare };
        compareMetricsYears?: {
            year: string;
            compare: { [key: string]: TestConfigResultCompare };
        }[];
    };
}

export interface TestConfigResultCompare {
    calc?: number | null;
    expected?: number | null;
}
