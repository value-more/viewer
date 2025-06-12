import React, { useEffect, useState } from 'react';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';
import { api } from '../../api/invData';
import { Company, Filter } from './types';
import { ListView } from './ListView';
import { TableView } from './TableView';
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { useDebounce } from 'primereact/hooks';

interface CompaniesListProps {
    withHeader?: boolean;
    limit?: number;
    onFavoritesChange?: () => void;
    reload?: number;
    centerContent?: boolean;
    view?: 'list' | 'table';
    showTimestamp?: boolean;
    filter?: Filter;
}

export const CompaniesList: React.FC<CompaniesListProps> = ({
    withHeader,
    limit,
    onFavoritesChange,
    reload,
    centerContent,
    view = 'list',
    showTimestamp,
    filter
}) => {
    const {
        i18n: { language },
        t
    } = useTranslation();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [opts, setOpts] = useState({ first: 0, rows: limit ?? 25 });
    const [total, setTotal] = useState(0);
    const [totalFiltered, setTotalFiltered] = useState(0);
    const [q, setQ] = useState('');
    const [showFavorites, setShowFavorites] = useState<boolean>(
        filter?.favorites ?? false
    );
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [metricsKeys, setMetricsKeys] = useState<string[] | null>(null);
    const [, filterStateDebounced, setFilter] = useDebounce<Filter | null>(
        filter ?? null,
        400
    );

    useEffect(() => {
        (async () => {
            const data = await api(`invData/companies/search`, {
                method: 'POST',
                body: JSON.stringify({
                    ...opts,
                    filter: {
                        ...(filterStateDebounced ?? {}),
                        favorites: showFavorites ? limit ?? true : undefined,
                        q: q?.toLocaleLowerCase()
                    }
                })
            });
            setCompanies(data?.data || []);
            setTotal(data?.total);
            setTotalFiltered(data?.totalFiltered);
        })();
    }, [opts, filterStateDebounced, showFavorites, reload]);

    useEffect(() => {
        if (limit && limit !== opts.rows) {
            setOpts({ ...opts, rows: limit ?? 25 });
        }
    }, [limit]);

    useEffect(() => {
        if (showFilter && !metricsKeys) {
            (async () =>
                setMetricsKeys(
                    (await api('invData/companies/metrics/keys')).globalMetrics
                ))();
        }
    }, [showFilter]);

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
                        className={'cursor-pointer pi pi-filter mr-2'}
                        onClick={() => setShowFilter(true)}
                    />
                    <i
                        className={`cursor-pointer pi pi-bookmark${showFavorites ? '-fill' : ''} mr-3`}
                        onClick={() => setShowFavorites(!showFavorites)}
                    ></i>
                    <InputText
                        placeholder={t('controls.search')}
                        type="text"
                        onChange={(event) => setQ(event.currentTarget.value)}
                    />
                </div>
            </div>
        );
    };

    const renderFilter = (gmk: string, k: number) => {
        return (
            <div
                key={k}
                className="flex gap-2 align-items-center mb-3 w-full overflow-hidden flex-wrap"
            >
                <Dropdown
                    className="flex-1"
                    options={(metricsKeys ?? []).map((v) => ({
                        label: t(`ticker.metrics.globals.${v}`, {
                            defaultValue: v
                                .match(/[A-Z][a-z]*|^[a-z]+/g)
                                ?.join(' ')
                                .toLocaleLowerCase()
                        }),
                        value: v
                    }))}
                    value={gmk}
                    placeholder="criteria"
                    onChange={(event) => {
                        setFilter({
                            ...filterStateDebounced,
                            globalMetrics: {
                                ...filterStateDebounced?.globalMetrics,
                                [event.target.value]: {}
                            }
                        });
                    }}
                />
                <div className="flex gap-2 align-items-center">
                    <InputNumber
                        value={filterStateDebounced?.globalMetrics?.[gmk]?.$gte}
                        size={3}
                        locale={language}
                        placeholder="min"
                        onChange={(event) => {
                            setFilter({
                                ...filterStateDebounced,
                                globalMetrics: {
                                    ...filterStateDebounced?.globalMetrics,
                                    [gmk]: {
                                        ...filterStateDebounced
                                            ?.globalMetrics?.[gmk],
                                        $gte: event.value ?? undefined
                                    }
                                }
                            });
                        }}
                    />
                    <InputNumber
                        value={filterStateDebounced?.globalMetrics?.[gmk]?.$lte}
                        size={3}
                        locale={language}
                        placeholder="max"
                        onChange={(event) => {
                            setFilter({
                                ...filterStateDebounced,
                                globalMetrics: {
                                    ...filterStateDebounced?.globalMetrics,
                                    [gmk]: {
                                        ...filterStateDebounced
                                            ?.globalMetrics?.[gmk],
                                        $lte: event.value ?? undefined
                                    }
                                }
                            });
                        }}
                    />
                    <div className="w-1rem">
                        {gmk && (
                            <i
                                className="pi pi-trash cursor-pointer"
                                onClick={() => {
                                    delete filterStateDebounced
                                        ?.globalMetrics?.[gmk];
                                    setFilter({ ...filterStateDebounced });
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const Comp = view === 'list' ? ListView : TableView;

    return (
        <>
            {showFilter && (
                <Sidebar
                    visible={showFilter}
                    onHide={() => setShowFilter(false)}
                    className="w-30rem"
                >
                    <h2>Filter</h2>
                    {filterStateDebounced?.globalMetrics &&
                        Object.keys(filterStateDebounced.globalMetrics).map(
                            renderFilter
                        )}
                    {renderFilter('', -1)}
                </Sidebar>
            )}
            <Comp
                companies={companies}
                opts={opts}
                centerContent={centerContent}
                header={withHeader ? header : undefined}
                onFavoritesChange={onFavoritesChange}
                showTimestamp={showTimestamp}
            />
        </>
    );
};
