import { attach, createEffect, createEvent, createStore, sample } from 'effector';
import { api } from '../../../api/invData';
import { CompanyValues } from './types';

const $cik = createStore<number>(0);
const setCik = createEvent<number>();
$cik.on(setCik, (_, state) => state);

const getValuesForActiveCikFx = attach({
    source: $cik,
    mapParams: ( _params: unknown, cik: number ) => ({ cik }),
    effect: createEffect(async ({ cik }: { cik: number }) => api(`invData/companies/${cik}/values`))
})

const $values = createStore<CompanyValues | null>(null);
const setValues = createEvent<CompanyValues>();
$values
    .on(setValues, (_, state) => state)
    .on(getValuesForActiveCikFx.doneData, (_, state) => state);

const $timestamps = createStore<{ timestamp?: number; configTimestamp?: number; }>({});
$timestamps
    .on(getValuesForActiveCikFx.doneData, (_, { timestamp, configTimestamp }) => ({ timestamp, configTimestamp }));

const refresh = createEvent<void>();

sample({
    source: $cik, 
    fn: cik => ({ cik }),
    target: getValuesForActiveCikFx
});

sample({
    clock: refresh,
    target: getValuesForActiveCikFx
})

export const companyValuesStores = {
    $values,
    $timestamps
}

export const companyValuesEvents = {
    setCik,
    refresh
}