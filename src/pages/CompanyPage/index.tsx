import React, { useEffect, useState, useRef } from 'react';
import '../../models/company/scores/init';
import '../../models/company/values/init';
import { useParams } from 'react-router';
import { InvData } from '../../models/types';
import { api } from '../../api/invData';
import { useTranslation } from 'react-i18next';
import { metricsScoresEvents } from '../../models/company/metricsScores';
import { ProgressSpinner } from 'primereact/progressspinner';
import { companyScoresEvents } from '../../models/company/scores';
import { companyValuesEvents } from '../../models/company/values';
import { CompanyPageEdit } from './Edit';
import { CompanyPageView } from './View';
import { companyPriceEvents } from '../../models/company/price';
import { BaseLayout } from '../../BaseLayout';
import { viewerEvents } from '../../components/InvDataViewer/state';

export const CompanyPage: React.FC = () => {
    const { t } = useTranslation();
    const { cik, mode } = useParams();
    const [name, setName] = useState<string>('');
    const [data, setData] = useState<InvData | undefined | null>();
    const refs: { [key: string]: React.MutableRefObject<null> } = {
        overview: useRef(null),
        diagrams: useRef(null),
        businessModel: useRef(null),
        value: useRef(null),
        data: useRef(null)
    };

    useEffect(() => {
        document.title = 'Wait for it ...';
    }, []);

    useEffect(() => {
        if (!cik) return;

        setData(undefined);

        const getCompany = async () => {
            const data = await api(`invData/companies/${cik}`);
            setData(data);
            setName(data.name);

            if (!data) return;

            document.title = data.name;

            metricsScoresEvents.setCik(Number(cik));
            companyScoresEvents.setCik(Number(cik));
            companyValuesEvents.setCik(Number(cik));
            companyPriceEvents.setTicker(data?.tickers?.[0]?.ticker);
        };
        getCompany();
    }, [cik]);

    const items = [
        {
            label: t('ticker.overview'),
            command: () => scrollToItem('overview')
        },
        {
            label: t('ticker.metrics.title'),
            command: () => scrollToItem('diagrams')
        },
        {
            label: t('ticker.businessmodel.title'),
            command: () => scrollToItem('businessModel')
        },
        {
            label: t('ticker.value.title'),
            command: () => scrollToItem('value')
        },
        {
            label: t('ticker.fundamentals.title'),
            command: () => {
                viewerEvents.setIndexes([0]);
                setTimeout(() => scrollToItem('data'), 500);
            }
        }
    ];

    const scrollToItem = (key: string) => {
        (refs[key]?.current as any)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    if (data === undefined) {
        return (
            <div className="text-center">
                <ProgressSpinner />
                <div style={{ whiteSpace: 'pre-line' }}>
                    {t('ticker.loader')}
                </div>
            </div>
        );
    }

    if (data === null) {
        return (
            <div className="m-5 text-center">
                <h2>{cik}</h2>
                <div className="text-orange-500">Data not found</div>
            </div>
        );
    }

    return (
        <BaseLayout menu={items}>
            {mode === 'edit' && (
                <CompanyPageEdit cik={Number(cik)} name={name} data={data} />
            )}
            {mode !== 'edit' && (
                <CompanyPageView
                    cik={Number(cik)}
                    name={name}
                    data={data}
                    refs={refs}
                />
            )}
        </BaseLayout>
    );
};
