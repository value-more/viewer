export type CompanyValueConfig = {
    [key: string]: { 
        configs: {[key: string]: { values: number[], decimals?: number }},
        display?: {[key: string]: { metric: string; symbol?: '%' }}
    }
};