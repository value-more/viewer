import {
    attach,
    createEffect,
    createEvent,
    createStore,
    sample
} from 'effector';
import { api } from '../../../api/invData';
import { CompanyScores, MoatScores } from './types';

const $cik = createStore<number>(0);
const setCik = createEvent<number>();
$cik.on(setCik, (_, state) => state);

const getScoresForActiveCikFx = attach({
    source: $cik,
    mapParams: (_params: unknown, cik: number) => ({ cik }),
    effect: createEffect(async ({ cik }: { cik: number }) =>
        api(`invData/companies/${cik}/scores`)
    )
});

const $scores = createStore<CompanyScores | null>(null);
const setScores = createEvent<CompanyScores>();
$scores
    .on(getScoresForActiveCikFx.doneData, (_, state) => state)
    .on(setScores, (_, state) => state);

sample({
    source: $cik,
    fn: (cik) => ({ cik }),
    target: getScoresForActiveCikFx
});

interface SaveScoreFxReq {
    businessModel?: number;
    moat?: MoatScores;
    cik: number;
}

const saveScoresFx = attach({
    source: $cik,
    mapParams: (params: CompanyScores, cik: number) => ({
        businessModel: params?.businessModel?.val,
        moat: params.moat,
        cik
    }),
    effect: createEffect(
        ({ cik, ...rest }: SaveScoreFxReq): Promise<CompanyScores> => {
            return api(`invData/companies/${cik}/scores`, {
                method: 'PUT',
                body: JSON.stringify(rest)
            });
        }
    )
});

sample({
    clock: saveScoresFx.doneData,
    target: setScores
});

export const companyScoresStores = {
    $scores
};

export const companyScoresEvents = {
    setCik
};

export const companyScoresEffects = {
    getScoresForActiveCikFx,
    saveScoresFx
};
