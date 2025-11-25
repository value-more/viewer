export type DefaultCompanyValueConfig = {
    [key: string]: {
        configs: { [key: string]: { values: number[]; decimals?: number } };
        display?: { [key: string]: { metric: string; symbol?: '%' } };
    };
};

export interface AssetsValueConfig {
    totalAssets: number;
    goodwill: number;
    intangibleAssets: number;
    otherAssets: number;
    totalLiabilities: number;
    marginSafetyStarRating: number;
}
