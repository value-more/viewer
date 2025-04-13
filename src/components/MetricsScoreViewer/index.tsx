import { Chart } from 'primereact/chart';
import React, { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';
import { chartOptions } from './constants';
import { api } from '../../api/invData';
import { getScoreChartData } from './effects';
import { metricsScoresStores, metricsScoresEvents } from '../../models/company/metricsScores';
import { ProgressSpinner } from 'primereact/progressspinner';
import { $chartData, setChartData, $globalScore, setGlobalScore } from './stores';
import { MetricsScores } from '../../models/types';
import { ScoreText } from '../ScoreText';

interface MetricsScoreViewerProps {
    cik: number;
    displayDetails?: boolean;
}

export const MetricsScoreViewer: React.FC<MetricsScoreViewerProps> = ({ cik, displayDetails = true }) => {
    const { t } = useTranslation()
    const reloadGlobalScore = useUnit(metricsScoresStores.$reloadGlobalScore);
    const chartData = useUnit($chartData);
    const globalScore = useUnit($globalScore);
    
    useEffect(() => {
        if ( !reloadGlobalScore ) return;

        const exec = async () => {
            const config = (await api(`invData/companies/metrics/scores/rules?limit=1`))[0].rules;
            const data: MetricsScores = await api(`invData/companies/${cik}/metrics/globalScores`);
            
            setChartData(getScoreChartData({ t, config, data }));
            setGlobalScore(data.value);

            metricsScoresEvents.setReloadGlobalScore(false);
        }
        exec()        
    }, [reloadGlobalScore])

    if ( !chartData ) return <div className='text-center'><ProgressSpinner /></div>;

    const values = chartData.datasets[0].data;

    return (<div className='flex justify-content-center gap-7 p-3'>
        <Chart type='radar' data={chartData} options={chartOptions} className='flex-1' pt={{ canvas: { className: 'w-full', style: { maxHeight: '480px' } }}} />
        {displayDetails && (
        <>
        <div className='flex-none align-content-center'>
            {
                chartData.labels.map( (k: string, i: number) => (<div key={k} className='flex m-4'>
                    <div className='w-8rem'>{k}</div>
                    <div className='text-primary font-bold'>{values[i] !== null ? values[i] : 'undefined'}</div>
                </div>))
            }
        </div>
        <div className='flex-none align-content-center text-3xl'>
            {globalScore !== null && <ScoreText value={globalScore} />}
        </div>
        </>
        )}
    </div>)
}