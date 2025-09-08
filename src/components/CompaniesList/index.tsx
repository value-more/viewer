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
import { useUserRights } from '../../models/user/hooks';
import { StatusWorkflow } from '../../models/company/status/types';
import { SelectButton } from 'primereact/selectbutton';

interface CompaniesListProps {
    withHeader?: boolean;
    limit?: number;
    onFavoritesChange?: () => void;
    reload?: number;
    centerContent?: boolean;
    view?: 'list' | 'table';
    showTimestamp?: boolean;
    filter?: Filter;
    onReload?: ({ total }: { total: number }) => void;
}

export const CompaniesList: React.FC<CompaniesListProps> = ({
    withHeader,
    limit,
    onFavoritesChange,
    reload,
    centerContent,
    view = 'list',
    showTimestamp,
    filter,
    onReload
}) => {
    const {
        i18n: { language },
        t
    } = useTranslation();
    const urs = useUserRights();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [opts, setOpts] = useState({ first: 0, rows: limit ?? 25 });
    const [total, setTotal] = useState(0);
    const [totalFiltered, setTotalFiltered] = useState(0);
    const [, q, setQ] = useDebounce<string>('', 400);
    const [showFavorites, setShowFavorites] = useState<boolean>(
        filter?.favorites ?? false
    );
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [showConfidencesFilter, setShowConfidencesFilter] =
        useState<boolean>(false);
    const [metricsKeys, setMetricsKeys] = useState<
        { format: string; key: string }[] | null
    >(null);
    const [, filterStateDebounced, setFilter] = useDebounce<Filter | null>(
        filter ?? null,
        400
    );

    useEffect(() => {
        onReload?.({ total: companies.length });
    }, [companies, onReload]);

    useEffect(() => {
        (async () => {
            const data = await api(`invData/companies/search`, {
                method: 'POST',
                body: JSON.stringify({
                    ...opts,
                    filter: {
                        ...(filterStateDebounced ?? {}),
                        favorites: showFavorites ? limit ?? true : undefined,
                        withRecentData:
                            filterStateDebounced?.withRecentData ?? true,
                        q: q?.toLocaleLowerCase()
                    }
                })
            });
            setCompanies(data?.data || []);
            setTotal(data?.total);
            setTotalFiltered(data?.totalFiltered);
        })();
    }, [opts, filterStateDebounced, showFavorites, reload, q]);

    useEffect(() => {
        if (limit && limit !== opts.rows) {
            setOpts({ ...opts, rows: limit ?? 25 });
        }
    }, [limit]);

    useEffect(() => {
        if (showFilter && !metricsKeys) {
            (async () => {
                const dataKeys = await api('invData/companies/metrics/keys');
                setMetricsKeys(
                    dataKeys.map(({ format, cat, key }: any) => ({
                        format: format,
                        key: `${cat}.${key}`
                    }))
                );
            })();
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
            <>
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
                    <div className="ml-auto align-self-center flex align-items-center">
                        {!!urs?.['companies.edit'] && (
                            <>
                                <Dropdown
                                    showClear={true}
                                    className="mr-3 w-15rem"
                                    options={Object.keys(StatusWorkflow).map(
                                        (value) => ({
                                            label: t(`ticker.status.${value}`),
                                            value
                                        })
                                    )}
                                    value={filterStateDebounced?.status}
                                    placeholder="Status"
                                    onChange={(event) =>
                                        setFilter({
                                            ...filterStateDebounced,
                                            status: event.value
                                        })
                                    }
                                />
                                <i
                                    className={
                                        'cursor-pointer pi pi-verified mr-2'
                                    }
                                    onClick={() =>
                                        setShowConfidencesFilter(
                                            !showConfidencesFilter
                                        )
                                    }
                                />
                            </>
                        )}
                        <i
                            className={'cursor-pointer pi pi-filter mr-2'}
                            onClick={() => setShowFilter(true)}
                        />
                        {urs && (
                            <i
                                className={`cursor-pointer pi pi-bookmark${showFavorites ? '-fill' : ''} mr-3`}
                                onClick={() => setShowFavorites(!showFavorites)}
                            ></i>
                        )}
                        <InputText
                            placeholder={t('controls.search')}
                            type="text"
                            onChange={(event) =>
                                setQ(event.currentTarget.value)
                            }
                        />
                    </div>
                </div>
                {showConfidencesFilter && (
                    <div className="flex gap-4 align-items-center justify-content-end">
                        {['main', 'sure', 'unsure', 'sure_unsure'].map((k) => (
                            <div
                                className="flex gap-2 align-items-center"
                                key={k}
                            >
                                <div>{t(`ticker.confidence.${k}`)}</div>
                                <InputNumber
                                    size={3}
                                    locale={language}
                                    placeholder="min"
                                    value={
                                        (filterStateDebounced as any)
                                            ?.confidences?.[k]?.$gte
                                    }
                                    onChange={(event) => {
                                        const conf =
                                            (filterStateDebounced as any)
                                                ?.confidences ?? {};
                                        setFilter({
                                            ...filterStateDebounced,
                                            confidences: {
                                                ...conf,
                                                [k]: {
                                                    ...(conf[k] ?? {}),
                                                    $gte:
                                                        event.value ?? undefined
                                                }
                                            }
                                        });
                                    }}
                                />
                                <InputNumber
                                    size={3}
                                    locale={language}
                                    placeholder="max"
                                    value={
                                        (filterStateDebounced as any)
                                            ?.confidences?.[k]?.$lte
                                    }
                                    onChange={(event) => {
                                        const conf =
                                            (filterStateDebounced as any)
                                                ?.confidences ?? {};
                                        setFilter({
                                            ...filterStateDebounced,
                                            confidences: {
                                                ...conf,
                                                [k]: {
                                                    ...(conf[k] ?? {}),
                                                    $lte:
                                                        event.value ?? undefined
                                                }
                                            }
                                        });
                                    }}
                                />
                            </div>
                        ))}
                        <div className="flex gap-2 align-items-center">
                            <SelectButton
                                value={
                                    filterStateDebounced?.withRecentData ?? true
                                }
                                onChange={(event) =>
                                    setFilter({
                                        ...filterStateDebounced,
                                        withRecentData: event.value
                                    })
                                }
                                itemTemplate={(option) => (
                                    <i className={option.icon}></i>
                                )}
                                optionLabel="value"
                                options={[
                                    { icon: 'pi pi-check-circle', value: true },
                                    { icon: 'pi pi-times-circle', value: false }
                                ]}
                            />
                        </div>
                    </div>
                )}
            </>
        );
    };

    const renderFilter = (gmk: string, k: number) => {
        const splitGmk = gmk.split('.');
        const setF = (type: string, value?: number) => {
            setFilter({
                ...filterStateDebounced,
                [splitGmk[0]]: {
                    ...(filterStateDebounced as any)[splitGmk[0]],
                    [splitGmk[1]]: {
                        ...(filterStateDebounced as any)[splitGmk[0]][
                            splitGmk[1]
                        ],
                        [type]: value ?? undefined,
                        format: metricsKeys?.find((v) => v.key === gmk)?.format
                    }
                }
            });
        };
        return (
            <div
                key={k}
                className="flex gap-2 align-items-center mb-3 w-full overflow-hidden flex-wrap"
            >
                <Dropdown
                    className="flex-1"
                    options={(metricsKeys ?? []).map((v) => {
                        const key = v.key.split('.')[1];
                        return {
                            label: t(`ticker.metrics.globals.${key}`, {
                                defaultValue: key
                                    .match(/[A-Z][a-z]*|^[a-z]+/g)
                                    ?.join(' ')
                                    .toLocaleLowerCase()
                            }),
                            value: v.key
                        };
                    })}
                    value={gmk}
                    placeholder="criteria"
                    onChange={(event) => {
                        const split = event.target.value.split('.');
                        setFilter({
                            ...filterStateDebounced,
                            [split[0]]: {
                                ...(filterStateDebounced as any)[split[0]],
                                [split[1]]: {}
                            }
                        });
                    }}
                />
                <div className="flex gap-2 align-items-center">
                    <InputNumber
                        value={
                            (filterStateDebounced as any)?.[splitGmk[0]]?.[
                                splitGmk[1]
                            ]?.$gte
                        }
                        size={3}
                        locale={language}
                        placeholder="min"
                        onChange={(event) => {
                            setF('$gte', event.value ?? undefined);
                        }}
                    />
                    <InputNumber
                        value={
                            (filterStateDebounced as any)?.[splitGmk[0]]?.[
                                splitGmk[1]
                            ]?.$lte
                        }
                        size={3}
                        locale={language}
                        placeholder="max"
                        onChange={(event) => {
                            setF('$lte', event.value ?? undefined);
                        }}
                    />
                    <div className="w-1rem">
                        {gmk && (
                            <i
                                className="pi pi-trash cursor-pointer"
                                onClick={() => {
                                    delete (filterStateDebounced as any)?.[
                                        splitGmk[0]
                                    ]?.[splitGmk[1]];
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
                            (v, i) => renderFilter(`globalMetrics.${v}`, i)
                        )}
                    {filterStateDebounced?.yearlyMetrics &&
                        Object.keys(filterStateDebounced.yearlyMetrics).map(
                            (v, i) => renderFilter(`yearlyMetrics.${v}`, i)
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
