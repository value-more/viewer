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

interface CompanyPageEditProps {
    cik: number;
    name: string;
    data: InvData;
}

export const CompanyPageView: React.FC<CompanyPageEditProps> = ({ cik, name, data }) => {
    const { t } = useTranslation();
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
        { label: t('ticker.fundamentals.title'), command: () => scrollToItem('data') }
    ];

    const scrollToItem = ( key: string ) => {
        (refs[key]?.current as any)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
    <BaseLayout menu={items}>
        <div className='overflow-auto h-full pl-5 pr-5'>
            <div ref={refs.overview}></div>
            <div className='flex flex-wrap align-items-center bg-default sticky top-0 z-5'>
                <h1 className='col-7 scrollMarginTop'>{name}</h1>
                <div className='col-2 flex gap-3 align-items-center'>
                    <CompanyScore />
                    <CompanyFavorite favorite={data.favorite} cik={cik} size='xl' />
                </div>
                <div className='col-3 flex align-items-center gap-3 p-0 mt-1'>
                    <div><i className='pi pi-bell text-xl' /></div>
                    <div className='text-xs'><Price ticker={data?.tickers?.[0]?.ticker} /></div>
                </div>
            </div>
            <div className='flex flex-wrap col-12' >
                <div className='lg:col-9 md:col-12 pr-5'>
                    <div className='border-1 border-solid'>
                        <MetricsScoreViewer cik={cik} displayDetails={false} />
                    </div>
                </div>
                <div className='lg:col-3 md:col-12'>
                    <h2 className='mt-0'>Firmenprofil</h2>
                    <CompanyProfile cik={cik} />
                </div>
            </div>
            <div>
                <h2>Aktuelle Einschatzung</h2>
                <div>
                    Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla <br />
                    Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla Bla bbla bla bla
                </div>
            </div>
            <div ref={refs.diagrams} className='scrollMarginTop'>
                <IndicatorsGraph data={data} readonly />
            </div>
            <div ref={refs.businessModel} className='scrollMarginTop'>
                <BusinessModel cik={cik} readonly />
            </div>
            <div ref={refs.value} className='scrollMarginTop'>
                <CompanyValue cik={cik} withSummary readonly />
            </div>
            <div ref={refs.data} className='scrollMarginTop'>
                <InvDataViewer cik={cik} readonly />
            </div>
        </div> 
    </BaseLayout>
    )
}
