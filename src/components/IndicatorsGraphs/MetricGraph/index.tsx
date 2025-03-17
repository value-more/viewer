import React, { useEffect, useState } from 'react'
import { Chart } from 'primereact/chart'
import { formatFromSymbol, getDisplayedSymbol } from '../../../utils/formatFromSymbol'
import { VotingSelector } from '../VotingSelector'
import { ChartOptions, ChartSettings } from '../types'
import { InvData } from '../../../models/types'
import { getData } from './utils'
import { useTranslation } from 'react-i18next'
import { ProgressSpinner } from 'primereact/progressspinner'

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

    useEffect(() => {
        setValue(null);
        setError(null);
        try {
            setValue(getData({ config, data, t, language }))
        } catch( e: any ) {
            setError(e);
        }
    }, [config, data])

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
                        {!!value.additionalData &&
                            value.additionalData.map((ad, k) => (
                                <div key={k} className={`mt-4 mb-4 ml-3 ${data?.metricsErrors?.some( o => o?.key === ad?.key ) ? 'text-red-500': 'text-primary'}`}>
                                    <div className="font-bold">
                                        {ad.label}
                                    </div>
                                    <div>
                                        {formatFromSymbol(language, ad.symbol, ad.value)}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                {tableVisible && (
                    <div>
                        <table className="w-full m-3 mb-0" border={1}>
                            <thead>
                                <tr>
                                    <th className="p-1">Label</th>
                                    {value.data.labels.map((k) => (
                                        <th key={k} className="text-right p-1">
                                            {k}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {value.data.datasets.map((item: any, k) => (
                                    <tr key={k}>
                                        <td className="p-1">{item.label}</td>
                                        {item.data.map((v: any, i: number) => (
                                            <td
                                                key={i}
                                                className="text-right p-1"
                                            >
                                                {`${v?.toLocaleString(language, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}${getDisplayedSymbol(config.datasets[k].symbol)}`}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

