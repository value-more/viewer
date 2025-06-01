import React, { useEffect, useState } from 'react';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { api } from '../../api/invData';
import { Company } from './types';
import { ListView } from './ListView';
import { TableView } from './TableView';

interface CompaniesListProps {
    recommended?: boolean;
    random?: boolean;
    hasRoe?: boolean;
    favorites?: boolean;
    withHeader?: boolean;
    limit?: number;
    onFavoritesChange?: () => void;
    reload?: number;
    centerContent?: boolean;
    view?: 'list' | 'table';
    showTimestamp?: boolean;
}

export const CompaniesList: React.FC<CompaniesListProps> = ({
    recommended,
    random,
    hasRoe,
    favorites,
    withHeader,
    limit,
    onFavoritesChange,
    reload,
    centerContent,
    view = 'list',
    showTimestamp
}) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [opts, setOpts] = useState({ first: 0, rows: limit ?? 25 });
    const [total, setTotal] = useState(0);
    const [totalFiltered, setTotalFiltered] = useState(0);
    const [filter, setFilter] = useState('');
    const [showFavorites, setShowFavorites] = useState<boolean>(
        favorites ?? false
    );
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            const data = await api(
                `invData/companies?first=${opts.first}&rows=${opts.rows}${showFavorites ? `&favorites=${limit ?? true}` : ''}${recommended ? '&recommended=true' : ''}${hasRoe ? '&hasRoe=true' : ''}${random ? '&random=true' : ''}&q=${filter.toLocaleLowerCase()}`
            );
            setCompanies(data?.data || []);
            setTotal(data?.total);
            setTotalFiltered(data?.totalFiltered);
        })();
    }, [opts, filter, showFavorites, reload]);

    const onPageChange = async ({
        first,
        rows
    }: {
        first: number;
        rows: number;
    }) => setOpts({ first, rows });

    const header = () => {
        return (
            <div className="flex align-items-center">
                <Paginator
                    className="w-max border-none"
                    first={opts.first}
                    rows={opts.rows}
                    totalRecords={totalFiltered}
                    rowsPerPageOptions={[25, 50, 100, 200]}
                    onPageChange={onPageChange}
                />
                <div className="text-bluegray-600 text-sm font-normal">
                    {totalFiltered}/{total}
                </div>
                <div className="ml-auto h-2rem align-self-center">
                    <i
                        className={`cursor-pointer pi pi-bookmark${showFavorites ? '-fill' : ''} mr-3`}
                        onClick={() => setShowFavorites(!showFavorites)}
                    ></i>
                    <InputText
                        placeholder={t('controls.search')}
                        type="text"
                        onChange={(event) =>
                            setFilter(event.currentTarget.value)
                        }
                    />
                </div>
            </div>
        );
    };

    const Comp = view === 'list' ? ListView : TableView;
    return (
        <Comp
            companies={companies}
            opts={opts}
            centerContent={centerContent}
            header={withHeader ? header : undefined}
            onFavoritesChange={onFavoritesChange}
            showTimestamp={showTimestamp}
        />
    );
};
