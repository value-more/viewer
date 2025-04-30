import { createEffect, createEvent, createStore, sample } from 'effector';
import { api } from '../../../api/invData';

interface Price {
    price: number;
    symbol: string;
    timestamp: number;
    volume: number;
}

const $ticker = createStore<string>('');
const setTicker = createEvent<string>();
$ticker.on(setTicker, (_, state) => state);

const $priceData = createStore<Price | null>(null);
const priceFx = createEffect(async({ ticker }: { ticker: string }) => {
    try {
        return api(`invData/tickers/${ticker}/prices`);
    } catch(e) {
        return null;
    }
});
$priceData.on(priceFx.doneData, (_, data) => data);

sample({
    source: $ticker,
    filter: ticker => !!ticker,
    fn: ticker => ({ ticker }),
    target: priceFx
});

export const companyPriceStores = {
    $ticker,
    $priceData
}

export const companyPriceEvents = {
    setTicker
}