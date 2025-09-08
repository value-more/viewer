import {
    attach,
    createEffect,
    createEvent,
    createStore,
    sample
} from 'effector';
import { api } from '../../../api/invData';
import { CompanyStatus, StatusWorkflow, workflows } from './types';

const $cik = createStore<number>(0);
const setCik = createEvent<number>();
$cik.on(setCik, (_, state) => state);

const getStatusForActiveCikFx = attach({
    source: $cik,
    mapParams: (_params: void, cik: number) => ({ cik }),
    effect: createEffect(async ({ cik }: { cik: number }) =>
        api(`invData/companies/${cik}/status`)
    )
});

const $status = createStore<CompanyStatus | null>(null);

const setApprovalFx = createEffect(
    async ({ cik, statusKey }: { cik: number; statusKey: StatusWorkflow }) => {
        const res = await api(`invData/companies/${cik}/status/approval`, {
            method: 'POST',
            body: JSON.stringify({ key: statusKey })
        });
        return res as CompanyStatus;
    }
);

const toggleApprovalFx = attach({
    source: { $cik },
    mapParams: (statusKey: StatusWorkflow, { $cik }) => ({
        statusKey,
        cik: $cik
    }),
    effect: setApprovalFx
});

$status
    .on(getStatusForActiveCikFx.doneData, (_, status) => ({
        ...status,
        index: workflows.indexOf(status.key)
    }))
    .on(setApprovalFx.doneData, (_, result) => ({
        ...result,
        index: workflows.indexOf(result.key)
    }));

sample({
    source: $cik,
    fn: (cik) => ({ cik }),
    target: getStatusForActiveCikFx
});

export const companyStatusStores = {
    $status
};

export const companyStatusEvents = {
    setCik
};

export const companyStatusEffects = {
    getStatusForActiveCikFx,
    toggleApprovalFx
};
