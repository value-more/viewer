import React, { useRef } from 'react'
import '../../../models/company/scores/init';
import '../../../models/company/values/init';
import { InvData } from '../../../models/types';
import { useTranslation } from 'react-i18next';
import { BusinessModel } from '../../../components/companies/BusinessModel'
import { CompanyScore } from '../../../components/companies/CompanyScore'
import { InvDataViewer } from '../../../components/InvDataViewer'
import { IndicatorsGraph } from '../../../components/IndicatorsGraphs'
import { MetricsScoreViewer } from '../../../components/MetricsScoreViewer';
import { Price } from '../../../components/companies/Price';
import { BaseLayout } from '../../../BaseLayout';
import { CompanyFavorite } from '../../../components/CompanyFavorite';
import { CompanyValue } from '../../../components/companies/CompanyValue';
import { CompanyProfile } from '../../../components/CompanyProfile';
import { useNavigate } from 'react-router';
import { MetricsAssessment } from '../../../components/companies/MetricsAssessment';
import { viewerEvents } from '../../../components/InvDataViewer/state';
import { IntrinsicValue } from '../../../components/companies/IntrinsicValue';

interface CompanyPageEditProps {
    cik: number;
    name: string;
    data: InvData;
}

export const CompanyPageView: React.FC<CompanyPageEditProps> = ({ cik, name, data }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const refs: {[key: string]: React.MutableRefObject<null>} = {
        overview: useRef(null),
        diagrams: useRef(null),
        businessModel: useRef(null),
        value: useRef(null),
        data: useRef(null),
    };

    const items = [
        { label: t('ticker.overview'), command: () => scrollToItem('overview') },
        { label: t('ticker.metrics.title'), command: () => scrollToItem('diagrams') },
        { label: t('ticker.businessmodel.title'), command: () => scrollToItem('businessModel') },
        { label: t('ticker.value.title'), command: () => scrollToItem('value') },
        { label: t('ticker.fundamentals.title'), command: () => {
            viewerEvents.setIndexes([0]);
            setTimeout(() => scrollToItem('data'), 500);
        }}
    ];

    const scrollToItem = ( key: string ) => {
        (refs[key]?.current as any)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
    <BaseLayout menu={items}>
        <div className='h-full pl-5 pr-5 overflow-y-auto overflow-x-hidden'>
            <div ref={refs.overview}></div>
            <div className='flex flex-wrap align-items-center bg-default sticky top-0 z-5'>
                <h1 className='col-12 lg:col-7 scrollMarginTop'>
                    {name}
                    <i className='pi pi-pencil vertical-align-top text-xs cursor-pointer pl-1' onClick={() => navigate({ pathname: `/company/${cik}/edit` })} />    
                </h1>
                <div className='col-10 lg:col-2 lg:justify-content-end flex gap-3 align-items-center pr-5'>
                    <CompanyScore />
                    <CompanyFavorite favorite={data.favorite} cik={cik} size='xl' />
                </div>
                <div className='lg:col-3 col-2 flex align-items-center gap-3 p-0 mt-1 line-height-2'>
                    <div><i className='pi pi-bell text-xl' /></div>
                    <div className='text-xs'><Price ticker={data?.tickers?.[0]?.ticker} /></div>
                </div>
            </div>
            <div className='flex flex-wrap col-12' >
                <div className='lg:col-9 col-12 lg:pr-5'>
                    <div className='border-1 border-solid'>
                        <MetricsScoreViewer cik={cik} displayDetails={false} />
                    </div>
                </div>
                <div className='col-12 lg:col-3'>
                    <h2 className='mt-0'>Firmenprofil</h2>
                    <CompanyProfile cik={cik} />
                </div>
            </div>
            <div className='mb-5'>
                <h2>Aktuelle Einschatzung</h2>
                <MetricsAssessment cik={cik} readonly />
            </div>
            <div ref={refs.diagrams} className='scrollMarginTop mb-5'>
                <IndicatorsGraph data={data} readonly />
            </div>
            <div ref={refs.businessModel} className='scrollMarginTop mb-5'>
                <BusinessModel cik={cik} readonly />
            </div>
            <div ref={refs.value} className='scrollMarginTop mb-5'>
                <h2>{t('ticker.value.title')}</h2>
                <IntrinsicValue ticker={data?.tickers[0]?.ticker || ''} displayDetails />
            </div>
            <div ref={refs.data} className='scrollMarginTop mb-5'>
                <InvDataViewer cik={cik} readonly />
            </div>
        </div> 
    </BaseLayout>
    )
}
