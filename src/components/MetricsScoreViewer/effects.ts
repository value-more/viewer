import { TFunction } from 'i18next';
import { MetricsScores, ScoreConfig } from '../../models/types';
import { MIN } from './constants';

export const getScoreChartData = ({
    t,
    config,
    data
}: {
    t: TFunction;
    config: ScoreConfig;
    data: MetricsScores;
}) => {
    const scores = Object.keys(data.details).map((k) => data.details[k]);
    const area1 = Object.keys(data.details).map((k) => config[k].areas[0]);
    const area2 = Object.keys(data.details).map((k) => config[k].areas[1]);
    return {
        labels: Object.keys(config).map((k) =>
            t(`ticker.metrics.categories.${k}`)
        ),
        options: {
            elements: {
                point: {
                    radius: 0
                }
            }
        },
        datasets: [
            {
                label: t('ticker.metrics.categories.score'),
                data: scores,
                backgroundColor: '#37576B66',
                borderColor: '#37576B66',
                fill: { value: MIN },
                pointRadius: 0,
                hitRadius: 0
            },
            {
                label: '',
                data: area1,
                fill: { value: MIN },
                pointRadius: 0,
                hitRadius: 0,
                backgroundColor: '#80808066',
                borderColor: '#80808066'
            },
            {
                label: '',
                data: area2,
                fill: '-1',
                pointRadius: 0,
                hitRadius: 0,
                backgroundColor: '#BBBBBB66',
                borderColor: '#BBBBBB66'
            }
        ]
    };
};
