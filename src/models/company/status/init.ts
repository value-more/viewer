import { sample } from 'effector';
import { companyStatusEffects } from '.';
import { companyValuesEvents } from '../values';
import { companyScoresEffects } from '../scores';

sample({
    clock: companyValuesEvents.refresh,
    target: companyStatusEffects.getStatusForActiveCikFx
});

sample({
    clock: companyScoresEffects.saveScoresFx.done,
    target: companyStatusEffects.getStatusForActiveCikFx
});
