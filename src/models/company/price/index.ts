import { createEffect, createEvent, createStore, sample } from 'effector';
import { api } from '../../../api/invData';

interface Price {
    price: number;
}

const $cik = createStore<number>(0);
const setCik = createEvent<number>();
$cik.on(setCik, (_, state) => state);

const $priceData = createStore<Price | null>(null);
const priceFx = createEffect(async ({ cik }: { cik?: number }) => {
    if (!cik) return null;
    try {
        const data = await api(`invData/companies/${cik}/prices`);
        return {
            price: data?.marketPrice
        };
    } catch (e) {
        return null;
    }
});
$priceData.on(priceFx.doneData, (_, data) => data);

sample({
    source: $cik,
    fn: (cik) => ({ cik }),
    target: priceFx
});

export const companyPriceStores = {
    $priceData
};

export const companyPriceEvents = {
    setCik
};

export const companyPriceEffects = {
    priceFx
};
