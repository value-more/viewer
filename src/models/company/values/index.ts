import {
    attach,
    createEffect,
    createEvent,
    createStore,
    sample
} from 'effector';
import { api } from '../../../api/invData';
import { CompanyValues } from './types';

const $cik = createStore<number>(0);
const setCik = createEvent<number>();
$cik.on(setCik, (_, state) => state);

const getValuesForActiveCikFx = attach({
    source: $cik,
    mapParams: (_params: unknown, cik: number) => ({ cik }),
    effect: createEffect(async ({ cik }: { cik: number }) =>
        api(`invData/companies/${cik}/values`)
    )
});

const updateDefaultLevelForActiveCikFx = attach({
    source: $cik,
    mapParams: (
        { preselectedLevel }: { preselectedLevel: number },
        cik: number
    ) => ({ cik, preselectedLevel }),
    effect: createEffect(
        async ({
            cik,
            preselectedLevel
        }: {
            cik: number;
            preselectedLevel: number;
        }) => {
            await api(`invData/companies/${cik}/values`, {
                method: 'PUT',
                body: JSON.stringify({ preselectedLevel })
            });
        }
    )
});

const updateProfileActiveCikFx = attach({
    source: $cik,
    mapParams: ({ profile }: { profile: string }, cik: number) => ({
        cik,
        profile
    }),
    effect: createEffect(
        async ({ cik, profile }: { cik: number; profile: string }) => {
            await api(`invData/companies/${cik}/values`, {
                method: 'PUT',
                body: JSON.stringify({ profile })
            });
        }
    )
});

const $values = createStore<CompanyValues | null>(null);
const setValues = createEvent<CompanyValues>();
$values
    .on(setValues, (_, state) => state)
    .on(updateDefaultLevelForActiveCikFx.done, (v, state) => ({
        ...v,
        preselectedLevel: state.params.preselectedLevel
    }))
    .on(getValuesForActiveCikFx.doneData, (_, state) => state);

const $level = createStore<number>(0);
const setLevel = createEvent<number>();
$level
    .on(setLevel, (_, state) => state)
    .on(
        getValuesForActiveCikFx.doneData,
        (_, state) => state?.preselectedLevel ?? 0
    );

const $profile = createStore<string>('default');
const setProfile = createEvent<string>();
$profile
    .on(setProfile, (_, state) => state)
    .on(updateProfileActiveCikFx.done, (_, state) => state.params.profile)
    .on(
        getValuesForActiveCikFx.doneData,
        (_, state) => state?.profile ?? 'default'
    );

const $timestamps = createStore<{
    timestamp?: number;
    configTimestamp?: number;
}>({});
$timestamps.on(getValuesForActiveCikFx.doneData, (_, state) =>
    state ? { ...state } : {}
);

const refresh = createEvent<void>();

sample({
    source: $cik,
    fn: (cik) => ({ cik }),
    target: getValuesForActiveCikFx
});

sample({
    clock: refresh,
    target: getValuesForActiveCikFx
});

sample({
    source: updateProfileActiveCikFx.done,
    target: refresh
});

export const companyValuesStores = {
    $values,
    $timestamps,
    $level,
    $profile
};

export const companyValuesEvents = {
    setCik,
    refresh,
    setLevel,
    setProfile
};

export const companyValuesEffects = {
    updateDefaultLevelForActiveCikFx,
    getValuesForActiveCikFx,
    updateProfileActiveCikFx
};
