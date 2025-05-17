import React from 'react';
import '../../../models/company/scores/init';
import '../../../models/company/values/init';
import { InvData } from '../../../models/types';
import { useTranslation } from 'react-i18next';
import { BusinessModel } from '../../../components/companies/BusinessModel';
import { CompanyScore } from '../../../components/companies/CompanyScore';
import { InvDataViewer } from '../../../components/InvDataViewer';
import { IndicatorsGraph } from '../../../components/IndicatorsGraphs';
import { MetricsScoreViewer } from '../../../components/MetricsScoreViewer';
import { Price } from '../../../components/companies/Price';
import { CompanyFavorite } from '../../../components/CompanyFavorite';
import { CompanyProfile } from '../../../components/companies/CompanyProfile';
import { useNavigate } from 'react-router';
import { MetricsAssessment } from '../../../components/companies/MetricsAssessment';
import { IntrinsicValue } from '../../../components/companies/IntrinsicValue';
import {
    useIsMediumScreen,
    useIsXLargeScreen,
    useIsXXLargeScreen
} from '../../../utils/breakpointsHook';

interface CompanyPageViewProps {
    cik: number;
    name: string;
    data: InvData;
    refs: { [key: string]: React.MutableRefObject<null> };
}

export const CompanyPageView: React.FC<CompanyPageViewProps> = ({
    cik,
    name,
    data,
    refs
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMedium = useIsMediumScreen();
    const isXLarge = useIsXLargeScreen();
    const isXXLarge = useIsXXLargeScreen();

    return (
        <div className="h-full xl:pl-5 xl:pr-5 pl-2 pr-2 overflow-y-auto overflow-x-hidden">
            <div ref={refs.overview}></div>
            <div className="flex flex-wrap align-items-center bg-default sticky top-0 z-5">
                <h1 className="col-12 md:col-7 scrollMarginTop">
                    {name}
                    <i
                        className="pi pi-pencil vertical-align-top text-xs cursor-pointer pl-1"
                        onClick={() =>
                            navigate({ pathname: `/company/${cik}/edit` })
                        }
                    />
                </h1>
                {isMedium && (
                    <>
                        <div className="col-5 xl:col-2 justify-content-end flex gap-3 align-items-center xl:pr-5">
                            <CompanyScore />
                            <CompanyFavorite
                                favorite={data.favorite}
                                cik={cik}
                                size="xl"
                            />
                        </div>
                        {isXLarge && (
                            <div className="col-3 flex align-items-center gap-3 p-0 mt-1 line-height-2">
                                <div>
                                    <i className="pi pi-bell text-xl" />
                                </div>
                                <div className="text-xs">
                                    <Price
                                        ticker={data?.tickers?.[0]?.ticker}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="flex flex-wrap">
                <div className={`${isXXLarge ? 'col-9 pr-5' : 'col-12'}`}>
                    <div className="border-1 border-solid">
                        <MetricsScoreViewer cik={cik} displayDetails={false} />
                    </div>
                </div>
                {isXXLarge && (
                    <div className="col-3">
                        <CompanyProfile cik={cik} />
                    </div>
                )}
            </div>
            <div className="mb-5">
                <h2>Aktuelle Einschatzung</h2>
                <MetricsAssessment cik={cik} readonly />
            </div>
            {!isXXLarge && (
                <div>
                    <CompanyProfile cik={cik} />
                </div>
            )}
            <div ref={refs.diagrams} className="scrollMarginTop mb-5">
                <IndicatorsGraph data={data} readonly />
            </div>
            <div ref={refs.businessModel} className="scrollMarginTop mb-5">
                <BusinessModel cik={cik} readonly />
            </div>
            <div ref={refs.value} className="scrollMarginTop mb-5">
                <h2>{t('ticker.value.title')}</h2>
                <IntrinsicValue
                    ticker={data?.tickers[0]?.ticker || ''}
                    displayDetails
                />
            </div>
            <div ref={refs.data} className="scrollMarginTop mb-5">
                <InvDataViewer cik={cik} readonly />
            </div>
        </div>
    );
};
