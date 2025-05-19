import React from 'react';
import { BaseViewProps } from './types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CompanyScoreBase } from '../companies/CompanyScore/base';
import { displayMetricField } from './utils';
import { CompanyFavorite } from '../CompanyFavorite';
import { useTranslation } from 'react-i18next';

export const TableView: React.FC<BaseViewProps> = ({
    companies,
    opts,
    header,
    onFavoritesChange
}) => {
    const {
        i18n: { language }
    } = useTranslation();

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
        >
            <Column
                field="timestamp"
                header="Date"
                frozen
                body={(row) => new Date(row.timestamp).toLocaleDateString()}
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
