export type PriceAlertType = 'up' | 'down';

export interface PriceAlert {
    uuid?: string;
    cik: number;
    type?: PriceAlertType;
    price?: number;
    ticker: string;
    recurrent?: boolean;
}
