import React, { useEffect, useState } from 'react'
import { Chart } from 'primereact/chart'
import { formatFromSymbol, getDisplayedSymbol } from '../../../utils/formatFromSymbol'
import { VotingSelector } from '../VotingSelector'
import { ChartOptions, ChartSettings, ChartTableData } from '../types'
import { InvData } from '../../../models/types'
import { getData } from './utils'
import { useTranslation } from 'react-i18next'
import { ProgressSpinner } from 'primereact/progressspinner'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

interface MetricsGraphProps {
    config: ChartOptions;
    data: InvData;
    readonly?: boolean;
}

export const MetricsGraph: React.FC<MetricsGraphProps> = ({ config, data, readonly }) => {
    const { t, i18n: { language } } = useTranslation();
    const [value, setValue] = useState<ChartSettings | null>(null)
    const [error, setError] = useState<string | null>(null);
    const [tableVisible, setTableVisible] = useState<boolean>(false)
    const [tableData, setTableData] = useState<ChartTableData[]>([]);

    useEffect(() => {
        setValue(null);
        setError(null);
        try {
            const chartData = getData({ config, data, t, language });
            setValue(chartData);
            setTableData(chartData.data.datasets.map((item: any, k) => ({
                label: item.label,
                ...item.data.reduce((p: {[key: string]: string}, v: number, i: number) => {
                    p['y'+i] = `${v?.toLocaleString(language, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}${getDisplayedSymbol(config.datasets[k].symbol)}`;
                    return p;
                }, {} as {[key: string]: string})
            })));
        } catch( e: any ) {
            setError(e);
        }
    }, [config, data, t])

    if ( error || data?.metricsErrors?.some( o => o?.key === config?.key ) ) {
        return (<div className='text-center'>
            <div>{t('ticker.metrics.error')} ~ <b>{config?.key}</b></div>
            <div>{error}</div>
        </div>);
    }

    if (!value) {
        return (
            <div className='text-center'><ProgressSpinner /></div>
        );
    }

    return (
        <div className="w-full">
            <div>
                <div className="flex flex-wrap">
                    <div className="relative flex-auto">
                        <Chart
                            type="line"
                            data={value.data}
                            options={value.options}
                        />
                        <div
                            className="absolute hover:text-primary cursor-pointer"
                            style={{ right: '15px', top: '15px' }}
                            onClick={() => setTableVisible(!tableVisible)}
                        >
                            <i className="pi pi-table" />
                        </div>
                        {!readonly && (<div
                            className="absolute"
                            style={{ left: '15px', top: '10px' }}
                        >
                            <VotingSelector graphKey={config.key} />
                        </div>)}
                    </div>
                    <div className="flex-none align-self-center">
                        <div className='border-1 ml-3 p-1 border-primary-alpha'>
                        {!!value.additionalData && (<>
                            <div className='text-primary m-1 font-bold'>{t(`ticker.metrics.charts.${config.key}.additionalDataTitle`)}</div>
                            {
                                value.additionalData.map((ad, k) => (
                                    <div key={k} className={`flex m-1 ${data?.metricsErrors?.some( o => o?.key === ad?.key ) ? 'text-red-500': 'text-primary'}`}>
                                        <div className='mr-1'>{t(`ticker.metrics.chartsAdditionalData.${ad.key}`)}:</div>  
                                        <div className='ml-auto'>{formatFromSymbol(language, ad.symbol, ad.value)}</div>
                                    </div>
                                ))
                            }
                        </>)}
                        </div>
                    </div>
                </div>
                {tableVisible && (
                    <div className='overflow-auto mt-5'>
                        <DataTable value={tableData} scrollable showGridlines stripedRows pt={{ column: { headerContent: { className: 'justify-content-center text-primary' } },bodyRow: { className: 'p-row-odd' } }}>
                            <Column field='label' />
                            {value.data.labels.map((k: string, i) => (<Column key={k} field={'y'+i} header={k} className='text-center' />))}
                        </DataTable>
                    </div>
                )}
            </div>
        </div>
    )
}

