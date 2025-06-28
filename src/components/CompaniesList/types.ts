import { ReactNode } from 'react';

export interface Company {
    cik: number;
    title: string;
    timestamp?: number;
    favorite: boolean;
    tickers?: string[];
    lastYearMetrics?: { roe?: number; operatingMargin?: number };
    score?: number;
}

export interface BaseViewProps {
    companies: Company[];
    opts: {
        first: number;
        rows: number;
    };
    header?: () => ReactNode;
    onFavoritesChange?: () => void;
    centerContent?: boolean;
    showTimestamp?: boolean;
}

export interface Filter {
    favorites?: boolean;
    recommended?: boolean;
    recommendedDiscovery?: boolean;
    hasRoe?: boolean;
    random?: boolean;
    globalMetrics?: { [key: string]: { $gte?: number; $lte?: number } };
    yearlyMetrics?: { [key: string]: { $gte?: number; $lte?: number } };
}
