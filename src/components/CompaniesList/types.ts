import { ReactNode } from 'react';
import { StatusWorkflow } from '../../models/company/status/types';

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
    loading: boolean;
}

export interface Filter {
    favorites?: boolean;
    recommended?: boolean;
    recommendedDiscovery?: boolean;
    withRecentData?: boolean;
    hasRoe?: boolean;
    random?: boolean;
    status?: StatusWorkflow;
    lastVisited?: boolean;
    globalMetrics?: { [key: string]: FilterItem };
    yearlyMetrics?: { [key: string]: FilterItem };
    confidences?: { main?: FilterItem; sure?: FilterItem; unsure?: FilterItem };
}

export interface FilterItem {
    $gte?: number;
    $lte?: number;
    format?: string;
}
