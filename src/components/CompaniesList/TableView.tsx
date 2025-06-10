import React from 'react';
import { BaseViewProps } from './types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CompanyScoreBase } from '../companies/CompanyScore/base';
import { displayMetricField } from './utils';
import { CompanyFavorite } from '../CompanyFavorite';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const TableView: React.FC<BaseViewProps> = ({
    companies,
    opts,
    header,
    onFavoritesChange
}) => {
    const {
        i18n: { language }
    } = useTranslation();
    const navigate = useNavigate();

    return (
        <DataTable
            value={companies}
            header={header}
            rows={opts.rows}
            scrollable
            scrollHeight="500px"
            stripedRows
            pt={{
                header: { style: { background: 'none', border: 'none' } }
            }}
            selectionMode="single"
            onRowSelect={(event) => {
                if ((event.originalEvent as any).ctrlKey) {
                    window.open(
                        `${window.location.origin}${process.env.PUBLIC_URL}#/company/${event.data.cik}`,
                        '_blank'
                    );
                } else {
                    navigate(`/company/${event.data.cik}`);
                }
            }}
        >
            <Column
                field="timestamp"
                header="Date"
                frozen
                body={(row) =>
                    new Date(row.timestamp).toLocaleDateString(language, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                }
            />
            <Column field="title" header="Company" frozen />
            <Column
                field="score"
                header="Score"
                body={(row) => <CompanyScoreBase score={row.score} />}
            />
            <Column
                field="lastYearMetricsRoe"
                header="ROE"
                body={(row) =>
                    displayMetricField(language, row.lastYearMetrics?.roe)
                }
            />
            <Column
                field="lastYearMetricsOperatingMargin"
                header="EBIT-Marge"
                body={(row) =>
                    displayMetricField(
                        language,
                        row.lastYearMetrics?.operatingMargin
                    )
                }
            />
            <Column
                field="tickers[0]"
                header="Ticker"
                body={(row) => row.tickers?.[0] ?? ''}
            />
            <Column
                field="price.diffFiftyTwoWeekLow"
                header="~52w"
                body={(row) => {
                    const diff = row.price?.diffFiftyTwoWeekLow;
                    return diff !== undefined
                        ? Math.round(row.price.diffFiftyTwoWeekLow)
                        : '';
                }}
            />
            <Column
                field="favorite"
                header="Favorite"
                body={(row) => (
                    <CompanyFavorite
                        cik={row.cik}
                        favorite={row.favorite}
                        onFavoriteChange={onFavoritesChange}
                    />
                )}
            />
        </DataTable>
    );
};
