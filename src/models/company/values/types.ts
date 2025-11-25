export interface CompanyValues {
    values?: CompanyValue[] | CompanyAssetValue;
    areas?: number[][];
    preselectedLevel?: number;
}

export type CompanyValue = { [key: string]: number };

export interface CompanyAssetValue {
    adjustedAssetValue?: number;
    assetValuePerShare?: number;
    priceInclSafetyMargin?: number;
}
