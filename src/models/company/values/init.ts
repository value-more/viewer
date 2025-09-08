import { sample } from 'effector';
import { companyValuesEvents } from '.';
import { companyScoresEffects } from '../scores';

sample({
    clock: companyScoresEffects.saveScoresFx,
    fn: () => ({}),
    target: companyValuesEvents.refresh
});
