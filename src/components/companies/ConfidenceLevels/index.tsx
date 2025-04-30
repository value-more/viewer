import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { api } from '../../../api/invData'
import { useTranslation } from 'react-i18next'
import { ProgressSpinner } from 'primereact/progressspinner'
import { InfoIcon } from '../../InfoIcon'

interface Data {
    data: { cat: string; key: string; main: number; sure: number; unsure: number;  }[];
    global: { main: number; sure: number; unsure: number; }
    years: { year: number; n: number; p: number; }[]
}

interface Timeframe {
    startYear: number;
    endYear: number;
}

interface ConfidenceLevelsProps {
    timeframe: Timeframe;
    overwriteTimestamp?: number;
}

export const ConfidenceLevels: React.FC<ConfidenceLevelsProps> = ({ timeframe: parentTimeframe, overwriteTimestamp }) => {
    const { t, i18n: { language } } = useTranslation();
    const { cik } = useParams()
    const [data, setData] = useState<Data | null>();
    const [displayDetails, setDisplayDetails] = useState<string | null>(null);
    const [displayYears, setDisplayYears] = useState<boolean>(false);
    const [timeframe, setTimeframe] = useState<Timeframe>(parentTimeframe);

    useEffect(() => {
        if (!cik) return;
        (async () => {
            const data = await api(`invData/companies/${cik}/fundamentals/confidences?startYear=${timeframe.startYear}&endYear=${timeframe.endYear}`);
            const result = data.data.reduce((p: any, entry: any) => {
                p.main += entry.main;
                p.sure += entry.sure;
                p.unsure += entry.unsure;
                return p;
            }, { main: 0, sure: 0, unsure: 0 });
            data.global = { main: result.main / data.total, sure: result.sure / data.total, unsure: result.unsure / data.total };
            setData(data);
        })();
    }, [cik, timeframe.startYear, timeframe.endYear])

    return (
        <div>
            <h3 className="bg-primary p-2 flex align-items-center">
                <div><i className='pi pi-check-circle mr-2' />{t('ticker.confidence.title')}</div>
                <div className='ml-2 flex gap-1'>
                    <input className='w-4rem text-center' type='number' value={timeframe.startYear} onChange={e => setTimeframe({ ...timeframe, startYear: parseInt(e.currentTarget.value as any || 0) }) } />
                    <div>/</div>
                    <input className='w-4rem text-center' type='number' value={timeframe.endYear} onChange={e => setTimeframe({ ...timeframe, endYear: parseInt(e.currentTarget.value as any || 0)})} />
                </div>
                <div className='ml-auto mr-2 '>
                    <InfoIcon editTimestamp={overwriteTimestamp} />
                </div>
            </h3>
            {!data && (
                <div className='text-center'>
                    <ProgressSpinner />
                </div>
            )}
            {!!data?.global && (
                <div>
                    <div className='flex gap-4 justify-content-center'>
                        {Object.keys(data.global).map( key => (
                            <div 
                                key={key} 
                                className={'cursor-pointer select-none ' + (key === 'sure' ? 'text-green-500' : key === 'unsure' ? 'text-yellow-500' : '') + (key === displayDetails ? ' font-bold' : '')}
                                onClick={() => { setDisplayDetails(displayDetails === key ? null : key); setDisplayYears(false); }}
                            >
                                {t(`ticker.confidence.${key}`)}: {(data.global as any)[key].toLocaleString( language, { minimumFractionDigits: 2, maximumFractionDigits: 2 } )}% 
                                <i className='pi pi-angle-down'></i>
                            </div>
                        ))}
                        {!!data.years?.length && (
                        <div 
                            className={'cursor-pointer select-none' + ('years' === displayDetails ? ' font-bold' : '')}
                            onClick={() => { setDisplayDetails(null); setDisplayYears(!displayYears); }}
                        >
                            {t(`ticker.confidence.years`)}
                            <i className='pi pi-angle-down'></i>
                        </div>)}
                    </div>
                </div>
            )}
            {!!displayDetails && !!data && (
                <div className='flex gap-4 flex-wrap ml-4 mr-4 mt-3'>
                    {data.data.map( d => (<div key={d.key} className='text-center bg-blue-50 pt-2 pb-2 pr-4 pl-4'>
                        <div>{t(`ticker.fundamentals.${d.cat}.${d.key}`)}</div>
                        <div className={`font-bold ${(d as any)[displayDetails] !== 100 ? 'text-red-600' : 'text-gray-300'}`}>{(d as any)[displayDetails]?.toLocaleString( language, { minimumFractionDigits: 2, maximumFractionDigits: 2 } )}%</div>
                    </div>))}
                </div>
            )}
            {displayYears && !!data && (
                <div className='flex gap-4 flex-wrap ml-4 mr-4 mt-3 justify-content-center'>
                    {data.years.map( d => (<div key={d.year} className='text-center bg-blue-50 pt-2 pb-2 pr-4 pl-4'>
                        <div>{d.year}</div>
                        <div className='font-bold'>{d.n} | {d.p?.toLocaleString( language, { minimumFractionDigits: 2, maximumFractionDigits: 2 } )}%</div>
                    </div>))}
                </div>
            )}
        </div>
    )
}
