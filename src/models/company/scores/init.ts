import { sample } from 'effector';
import { companyScoresEffects } from '.';
import { metricsScoresEffects } from '../metricsScores';

sample({
    clock: metricsScoresEffects.saveScoreFx.done,
    fn: () => ({}),
    target: companyScoresEffects.saveScoresFx
});
