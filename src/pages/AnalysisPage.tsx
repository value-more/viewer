import React, { useEffect, useState } from 'react';
import { api } from '../api/invData';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { BaseLayout } from '../BaseLayout';

interface Company {
    title: string;
    cik: string;
    timestamp: number;
}

interface Data {
    total: number;
    totalMissing: number;
    data: { [key: string]: number[] };
    companies: { [key: string]: Company };
}

const getCompanies = ({ filter }: { filter: string }) =>
    api(
        `invData/companies/missingRequiredData?q=${filter.toLocaleLowerCase()}`
    );

export const AnalysisPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('');
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        document.title = 'ValueMore - Analysis';
    }, []);

    useEffect(() => {
        (async () => {
            const data = await getCompanies({ filter });
            setData(data);
        })();
    }, [filter]);

    const itemTemplate = (company: Company) => {
        if (!company) return null;

        const { title, cik, timestamp } = company;
        const name = title?.toLowerCase();
        return (
            <div
                className="w-20rem h-3rem pt-5 pb-5 pl-2 pr-2 hover:surface-hover text-center cursor-pointer align-items-center justify-content-center flex flex-column"
                key={cik}
                onClick={() => navigate({ pathname: `/company/${cik}` })}
            >
                <div>{name ? name[0].toUpperCase() + name.slice(1) : ''}</div>
                {!!timestamp && (
                    <div className="text-sm flex align-items-center mt-2">
                        <i className="pi pi-sync mr-2"></i>
                        {new Date(timestamp).toLocaleString()}
                    </div>
                )}
            </div>
        );
    };

    return (
        <BaseLayout>
            <div className="ml-2 m-auto flex flex-column w-full overflow-auto">
                <h3 className="text-center">{t('analysis.title')}</h3>
                <div className="ml-5">
                    <InputText
                        className="ml-auto h-2rem align-self-center"
                        placeholder={t('controls.search')}
                        type="text"
                        onChange={(event) =>
                            setFilter(event.currentTarget.value)
                        }
                    />
                    {!!data && (
                        <span className="ml-2">
                            {data.totalMissing} ouf of {data.total} ~{' '}
                            {((data.totalMissing * 100) / data.total).toFixed(
                                2
                            )}
                            %
                        </span>
                    )}
                </div>
                {!data && (
                    <h2 className="text-center">
                        ...Loading data please wait...
                    </h2>
                )}
                <div className="mt-2">
                    <Accordion multiple={true}>
                        {data?.totalMissing ? (
                            Object.keys(data.data).map((k) => (
                                <AccordionTab
                                    header={
                                        k
                                            .replace('.', ' ~ ')
                                            .replaceAll('_', ' ')
                                            .toLowerCase() +
                                        ` (${((data.data[k].length * 100) / data.totalMissing).toFixed(2)}%)`
                                    }
                                    key={k}
                                >
                                    <div className="flex gap-3 flex-wrap align-items-center justify-content-center max-h-16rem overflow-auto">
                                        {data.data[k].map((cik) =>
                                            itemTemplate(data.companies[cik])
                                        )}
                                    </div>
                                </AccordionTab>
                            ))
                        ) : (
                            <h2>
                                Great we could not find data we are perfect!
                            </h2>
                        )}
                    </Accordion>
                </div>
            </div>
        </BaseLayout>
    );
};
