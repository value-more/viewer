import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import {
    Column,
    ColumnBodyOptions,
    ColumnEditorOptions,
    ColumnEvent
} from 'primereact/column';
import { formatLargeNumber } from '../../../utils/formatLargeNumber';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { LabelData } from '../types';
import { useTranslation } from 'react-i18next';
import { api } from '../../../api/invData';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputNumber } from 'primereact/inputnumber';
import { companyStatusEffects } from '../../../models/company/status';
import { Search } from './Search';
import { Sidebar } from 'primereact/sidebar';
import { HTMLSecViewers } from '../../HTMLSecViewers';

interface InvDataViewerTableProps {
    cik: number;
    dataKey: string;
    structure: LabelData[];
    readonly?: boolean;
}

type yearsType = {
    [year: string]: {
        [dataKey: string]: {
            [key: string]: {
                value: number | null | undefined;
                isValid?: boolean;
                ai?: { matching: boolean; value?: number };
            };
        };
    };
};

enum NumberFormat {
    K = 1,
    M = 2,
    B = 3,
    T = 4
}

const keysTitleValidate = [
    { prop: 'ai', label: 'Charlie' },
    { prop: 'edgartools', label: 'edgartools' }
];

type HTMLSecViewerPosType = 'left' | 'right' | 'bottom' | 'top';

export const InvDataViewerTable: React.FC<InvDataViewerTableProps> = ({
    cik,
    dataKey,
    structure,
    readonly
}) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [years, setYears] = useState<yearsType>();
    const dt: any = useRef(null);
    const [numberFormatIndex, setNumberFormatIndex] = useState<NumberFormat>(
        NumberFormat.K
    );
    const [structuredData, setStructuredData] = useState<any[]>([]);
    const [filteredStructuredData, setFilteredStructuredData] = useState<any[]>(
        []
    );
    const [search, setSearch] = useState<string | null>(null);
    const [isVisibleHTMLSecViewer, setIsVisibleHTMLSecViewer] =
        useState<boolean>(false);
    const [HTMLSecViewerPos, setHTMLSecViewerPos] =
        useState<HTMLSecViewerPosType>(
            (localStorage.getItem(
                'HTMLSecViewerPos'
            ) as HTMLSecViewerPosType) || 'left'
        );
    const [viewOnlyMain, setViewOnlyMain] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const yearsData = await api(
                `invData/companies/${cik}/fundamentals/${dataKey}`
            );
            setYears(yearsData);
        })();
    }, [cik, dataKey]);

    useEffect(() => {
        const yearsKeys = Object.keys(years || {}).slice(-11);
        if (!yearsKeys.length) return;
        const sData = structure.map((ld) => {
            return {
                ...ld,
                label: t(`ticker.fundamentals.${dataKey}.${ld.name}`),
                ...yearsKeys.reduce((prev: any, current) => {
                    const c: any = years?.[current];
                    const fundData = c?.[dataKey];
                    const v = fundData ? fundData?.[ld.name]?.value : undefined;
                    prev[current] = ld.avoidScaling
                        ? v?.toLocaleString(language, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                          })
                        : formatLargeNumber(language, v, numberFormatIndex);
                    return prev;
                }, {})
            };
        });
        setStructuredData(sData);
        setFilteredStructuredData(sData);
    }, [years, numberFormatIndex, language]);

    useEffect(() => {
        if (!Object.keys(years || {}).length) return;
        const lowerCaseSearch = search?.toLowerCase() ?? '';
        let filtered = structuredData;
        if (viewOnlyMain) {
            filtered = filtered.filter((d) => d.main);
        }
        if (search) {
            filtered = filtered.filter(
                (d) =>
                    !!Object.keys(d).filter(
                        (k) =>
                            typeof d[k] === 'string' &&
                            d[k].toLowerCase().includes(lowerCaseSearch)
                    ).length
            );
        }
        setFilteredStructuredData(filtered);
    }, [structuredData, search, viewOnlyMain]);

    if (!years) {
        return (
            <div className="text-center">
                <ProgressSpinner />
                <div style={{ whiteSpace: 'pre-line' }}>
                    {t('ticker.loader')}
                </div>
            </div>
        );
    }

    const changeHTMLSecViewerPos = (newPos: HTMLSecViewerPosType) => {
        localStorage.setItem('HTMLSecViewerPos', newPos);
        setHTMLSecViewerPos(newPos);
    };

    const updateValue = async (value: {
        [year: string]: {
            [dataKey: string]: {
                [key: string]: {
                    value: number | null | undefined;
                    isValid: 'SURE' | 'UNSURE' | undefined;
                };
            };
        };
    }) => {
        await api(`invData/companies/${cik}/fundamentals/${dataKey}`, {
            method: 'PUT',
            body: JSON.stringify(value)
        });
        companyStatusEffects.getStatusForActiveCikFx();
    };

    const removeOverwrite = async (value: {
        [year: string]: { [dataKey: string]: string[] };
    }) =>
        api(`invData/companies/${cik}/fundamentals/${dataKey}/overwrites`, {
            method: 'DELETE',
            body: JSON.stringify(value)
        });

    const renderLabel = (data: any) => {
        return (
            <span
                style={{
                    fontWeight: data.main ? 'bolder' : 'normal',
                    padding: `0 0 0 ${(data.level || 0) * 40 + 3}px`
                }}
            >
                {data.label}
            </span>
        );
    };

    const exportCSV = () => {
        dt.current?.exportCSV?.({ selectionOnly: false });
    };

    const getConfigFromOptions = ({
        field,
        rowIndex
    }: {
        field: string;
        rowIndex: number;
    }) =>
        (years[field] as any)?.[dataKey]?.[
            filteredStructuredData[rowIndex]?.name
        ];

    const header = (
        <div className="flex align-items-center gap-2">
            <div className="card flex justify-content-center">
                <SelectButton
                    value={numberFormatIndex}
                    onChange={(e) => setNumberFormatIndex(e.value)}
                    optionLabel="name"
                    options={[
                        { name: 'K', value: 1 },
                        { name: 'M', value: 2 },
                        { name: 'B', value: 3 },
                        { name: 'T', value: 4 }
                    ]}
                />
            </div>
            <div className="ml-auto flex gap-4">
                {!readonly && (
                    <Button
                        onClick={() => setViewOnlyMain(!viewOnlyMain)}
                        severity={viewOnlyMain ? 'success' : undefined}
                    >
                        Main
                    </Button>
                )}
                {!readonly && (
                    <Button onClick={() => setIsVisibleHTMLSecViewer(true)}>
                        SEC htmls
                    </Button>
                )}
                <Search onChange={(value) => setSearch(value)} />
                <Button
                    type="button"
                    icon="pi pi-file"
                    rounded
                    onClick={() => exportCSV()}
                    data-pr-tooltip="CSV"
                />
            </div>
        </div>
    );

    const body = (options: ColumnBodyOptions, row: any) => {
        const config = getConfigFromOptions(options);
        if ((config?.value ?? null) === null) {
            return null;
        }
        const title = `${config?.isValid === 'ROLLBACK' ? 'This value will be reloaded from rules with next refresh.' : ''}
        ${keysTitleValidate
            .map((k) =>
                config?.isValid === 'UNSURE' && config?.[k.prop]?.matching
                    ? `⚇ Validated by ${k.label}`
                    : config?.[k.prop]?.value !== undefined
                      ? `⚉ ${k.label} found ${config[k.prop].value}`
                      : ''
            )
            .join('\n')}
        `;
        return (
            <div
                className={`w-full h-full ${config?.isValid === 'ROLLBACK' ? 'line-through' : ''}`}
                title={title}
                style={{
                    borderBottom: readonly
                        ? 'none'
                        : config?.isValid === 'SURE'
                          ? `thin solid green`
                          : config?.isValid === 'UNSURE'
                            ? config?.ai?.matching ||
                              config?.edgartools?.matching
                                ? 'thin dashed orange'
                                : 'thin solid orange'
                            : config?.ai?.value !== undefined ||
                                config?.edgartools?.value !== undefined
                              ? 'thin dashed red'
                              : 'none'
                }}
            >
                {row?.[options.field]}
            </div>
        );
    };

    const cellEditor = (options: ColumnEditorOptions) => {
        const conf = getConfigFromOptions(options);
        const avoidScaling = structure[options.rowIndex]?.avoidScaling;
        const isValid = conf?.isValid;
        const value = conf?.value;
        const onClick = (isValid: string) => {
            if (typeof options.value === 'string') {
                options?.editorCallback?.(
                    avoidScaling
                        ? value
                        : value / Math.pow(10, numberFormatIndex * 3)
                );
            }
            dt.current.validated = {
                rowIndex: options.rowIndex,
                year: options.field,
                isValid
            };
            dt.current.getTable().click();
        };

        return (
            <div>
                {!!isValid && (
                    <span
                        className="pi pi-history mr-2 text-red-400"
                        onClick={() => {
                            onClick('ROLLBACK');
                        }}
                    ></span>
                )}
                {isValid === 'UNSURE' && (
                    <span
                        className="pi pi-check mr-2 text-green-400"
                        onClick={() => {
                            onClick('SURE');
                        }}
                    ></span>
                )}
                {!isValid && (
                    <span
                        className="pi pi-asterisk mr-2 text-orange-400"
                        onClick={() => {
                            onClick('UNSURE');
                        }}
                    ></span>
                )}
                <InputNumber
                    className="w-7rem p-0 text-right md-input"
                    value={
                        value
                            ? avoidScaling
                                ? value
                                : value / Math.pow(10, numberFormatIndex * 3)
                            : null
                    }
                    onKeyDown={(e) => e.stopPropagation()}
                    disabled={isValid === 'SURE'}
                    onValueChange={(e) => options?.editorCallback?.(e.value)}
                    minFractionDigits={0}
                    maxFractionDigits={2}
                    locale={language}
                />
            </div>
        );
    };

    const onCellEditComplete = async (e: ColumnEvent) => {
        if (
            dt.current?.validated?.rowIndex !== e.rowIndex ||
            dt.current?.validated?.year !== e.field
        ) {
            dt.current.validated = undefined;
            return;
        }
        const config = structure[e.rowIndex];
        const key = config?.name;

        const newObj = {
            value: config.avoidScaling
                ? e.newValue
                : e.newValue * Math.pow(10, numberFormatIndex * 3),
            isValid: dt.current?.validated?.isValid
        };

        filteredStructuredData[e.rowIndex][e.field] = config.avoidScaling
            ? newObj.value?.toLocaleString(language, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
              })
            : formatLargeNumber(language, newObj.value, numberFormatIndex);

        if (!years[e.field]) years[e.field] = {};
        if (!years[e.field][dataKey]) years[e.field][dataKey] = {};
        years[e.field][dataKey][key] = newObj;

        if (newObj.isValid === 'ROLLBACK') {
            await removeOverwrite({
                [e.field]: {
                    [dataKey]: [key]
                }
            });
        } else {
            await updateValue({
                [e.field]: {
                    [dataKey]: {
                        [key]: newObj
                    }
                }
            });
        }
    };

    return (
        <div>
            <DataTable
                ref={dt}
                value={filteredStructuredData}
                scrollable={true}
                scrollHeight="500px"
                selectionMode="single"
                header={header}
                stripedRows={true}
                pt={{
                    header: { style: { background: 'none', border: 'none' } }
                }}
                editMode={
                    !readonly && numberFormatIndex === NumberFormat.K
                        ? 'cell'
                        : undefined
                }
            >
                <Column
                    field="label"
                    header=""
                    body={renderLabel}
                    bodyStyle={{ border: 0, padding: '3px' }}
                    headerStyle={{ border: 0 }}
                    frozen
                ></Column>
                {Object.keys(years || {})
                    .slice(-11)
                    .map((year) => (
                        <Column
                            key={year}
                            field={year}
                            header={year}
                            bodyStyle={{
                                borderLeft: 0,
                                borderRight: 0,
                                borderTop: 0,
                                padding: '4px 10px'
                            }}
                            body={(row, options) => body(options, row)}
                            headerStyle={{ border: 0, padding: '10px 10px' }}
                            alignHeader={'right'}
                            align={'right'}
                            editor={(options) => cellEditor(options)}
                            onCellEditComplete={onCellEditComplete}
                        ></Column>
                    ))}
            </DataTable>
            {!readonly && (
                <Sidebar
                    visible={isVisibleHTMLSecViewer}
                    onHide={() => setIsVisibleHTMLSecViewer(false)}
                    position={HTMLSecViewerPos}
                    className={
                        HTMLSecViewerPos === 'bottom' ||
                        HTMLSecViewerPos === 'top'
                            ? 'h-20rem'
                            : 'w-3'
                    }
                    modal={false}
                    dismissable={false}
                    icons={
                        <div className="mr-2 flex gap-2">
                            <Button
                                icon="pi pi-arrows-v"
                                onClick={() =>
                                    changeHTMLSecViewerPos(
                                        HTMLSecViewerPos === 'bottom'
                                            ? 'top'
                                            : 'bottom'
                                    )
                                }
                            />
                            <Button
                                icon="pi pi-arrows-h"
                                onClick={() =>
                                    changeHTMLSecViewerPos(
                                        HTMLSecViewerPos === 'left'
                                            ? 'right'
                                            : 'left'
                                    )
                                }
                            />
                        </div>
                    }
                    fullScreen
                >
                    <HTMLSecViewers
                        cik={cik}
                        years={Object.keys(years || {})}
                    />
                </Sidebar>
            )}
        </div>
    );
};
