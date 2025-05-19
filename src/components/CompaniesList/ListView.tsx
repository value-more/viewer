import React from 'react';
import { BaseViewProps, Company } from './types';
import { DataView } from 'primereact/dataview';
import { Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { CompanyFavorite } from '../CompanyFavorite';
import { CompanyScoreBase } from '../companies/CompanyScore/base';
import { displayMetricField } from './utils';
import { useTranslation } from 'react-i18next';

export const ListView: React.FC<BaseViewProps> = ({
    companies,
    opts,
    header,
    onFavoritesChange,
    centerContent,
    showTimestamp
}) => {
    const {
        i18n: { language }
    } = useTranslation();

    const itemTemplate = (company: Company) => {
        if (!company) return null;

        const {
            title,
            cik,
            timestamp,
            favorite,
            tickers,
            score,
            lastYearMetrics
        } = company;
        return (
            <Card
                className="hover:surface-hover relative w-20rem h-8rem pl-2 pr-4"
                key={cik}
                pt={{
                    body: { className: 'p-0 h-full' },
                    content: { className: 'p-0 pt-1 pb-1 h-full' }
                }}
            >
                <div className="flex align-items-center h-full">
                    <div
                        className={`companyLogo48 ${tickers?.map((t) => 't-logo-' + t).join(' ')}`}
                    ></div>
                    <div className="flex flex-column flex-1 h-full ml-3">
                        <div className="flex-1 mt-1 text-primary align-content-center line-height-2">
                            {title ?? ''}
                        </div>
                        <div className="flex mb-2">
                            {(score ?? undefined) !== undefined ? (
                                <CompanyScoreBase score={score} />
                            ) : (
                                <div className="flex gap-4 text-sm">
                                    {(lastYearMetrics?.roe ?? 0) > 0 && (
                                        <div>
                                            ROE:{' '}
                                            {displayMetricField(
                                                language,
                                                lastYearMetrics?.roe
                                            )}
                                        </div>
                                    )}
                                    {(lastYearMetrics?.operatingMargin ?? 0) >
                                        0 && (
                                        <div>
                                            EBIT-Marge:{' '}
                                            {displayMetricField(
                                                language,
                                                lastYearMetrics?.operatingMargin
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 mt-auto">
                            <Link
                                style={{ textDecoration: 'none' }}
                                className="text-gray-400 hover:text-primary"
                                to={`/company/${cik}`}
                            >
                                <i className="pi pi-eye mr-1" />
                                View
                            </Link>
                            <Link
                                style={{ textDecoration: 'none' }}
                                className="text-gray-400 hover:text-primary"
                                to={`/company/${cik}/edit`}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <i className="pi pi-pencil mr-1" />
                                Edit
                            </Link>
                            <Link
                                style={{ textDecoration: 'none' }}
                                className="text-gray-400 hover:text-primary"
                                to={`/company/${cik}`}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <i className="pi pi-external-link mr-1" />
                                Tab
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 pr-1 pt-1 hover:text-primary">
                    <CompanyFavorite
                        cik={cik}
                        favorite={favorite}
                        onFavoriteChange={() => onFavoritesChange?.()}
                    />
                </div>
                {!!showTimestamp && !!timestamp && (
                    <div className="text-sm flex align-items-center mt-2">
                        <i className="pi pi-sync mr-2"></i>
                        {new Date(timestamp).toLocaleString()}
                    </div>
                )}
            </Card>
        );
    };

    return (
        <DataView
            value={companies}
            rows={opts.rows}
            itemTemplate={itemTemplate}
            pt={{
                grid: {
                    className: `gap-4 align-content-start overflow-auto overflow-x-hidden p-1 ${centerContent ? 'justify-content-center' : ''}`
                },
                header: { className: 'border-none' }
            }}
            header={header ? header() : null}
        />
    );
};
