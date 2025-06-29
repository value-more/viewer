import {
    attach,
    createEffect,
    createEvent,
    createStore,
    sample
} from 'effector';
import { api } from '../../../api/invData';
import { CompanyStatus } from './types';

const $cik = createStore<number>(0);
const setCik = createEvent<number>();
$cik.on(setCik, (_, state) => state);

const getStatusForActiveCikFx = attach({
    source: $cik,
    mapParams: (_params: unknown, cik: number) => ({ cik }),
    effect: createEffect(async ({ cik }: { cik: number }) =>
        api(`invData/companies/${cik}/status`)
    )
});

const $status = createStore<CompanyStatus | null>(null);
const setStatus = createEvent<CompanyStatus>();

const setApprovalFx = createEffect(
    async ({
        cik,
        prop,
        status
    }: {
        cik: number;
        prop: string;
        status: CompanyStatus | null;
    }) => {
        const res = {
            [prop]: !status?.[prop]
        };
        await api(`invData/companies/${cik}/status`, {
            method: 'POST',
            body: JSON.stringify(res)
        });
        return res;
    }
);

const toggleApprovalFx = attach({
    source: { $cik, $status },
    mapParams: (prop: string, { $cik, $status }) => ({
        prop,
        cik: $cik,
        status: $status
    }),
    effect: setApprovalFx
});

$status
    .on(setStatus, (_, status) => status)
    .on(getStatusForActiveCikFx.doneData, (_, status) => status)
    .on(setApprovalFx.doneData, (status, result) => {
        const res = {
            ...(status ?? {}),
            ...result
        };
        return res;
    });

sample({
    source: $cik,
    fn: (cik) => ({ cik }),
    target: getStatusForActiveCikFx
});

export const companyStatusStores = {
    $status
};

export const companyStatusEvents = {
    setCik,
    setStatus
};

export const companyStatusEffects = {
    getStatusForActiveCikFx,
    toggleApprovalFx
};
