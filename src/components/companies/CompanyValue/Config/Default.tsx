import React from 'react';
import { DefaultCompanyValueConfig } from '../types';
import { InputNumber } from 'primereact/inputnumber';
import { useTranslation } from 'react-i18next';
import { formatFromSymbol } from '../../../../utils/formatFromSymbol';
import { companyValuesEvents } from '../../../../models/company/values';
import { api } from '../../../../api/invData';
import { GlobalMetrics } from '../../../../models/types';

interface DefaultProps {
    cik: number;
    metrics: GlobalMetrics;
    config: DefaultCompanyValueConfig;
    onConfigChange: (config: DefaultCompanyValueConfig) => void;
}

let timeout: any = null;

export const Default: React.FC<DefaultProps> = ({
    cik,
    metrics,
    config,
    onConfigChange
}) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const save = async (
        cat: string,
        key: string,
        index: number,
        value: number
    ) => {
        const newConfig = { ...config };
        newConfig[cat].configs[key].values[index] = value;
        onConfigChange(newConfig);

        const body = JSON.stringify(
            Object.keys(newConfig).reduce((p: any, cat) => {
                p[cat] = Object.keys(newConfig[cat].configs).reduce(
                    (prev, k) => {
                        prev[k] = newConfig[cat].configs[k].values;
                        return prev;
                    },
                    {} as any
                );
                return p;
            }, {})
        );

        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            await api(`invData/companies/${cik}/values/configs`, {
                method: 'POST',
                body
            });
            companyValuesEvents.refresh();
        }, 750);
    };

    return (
        <>
            {Object.keys(config).map((cat) => {
                const { configs, display } = config[cat];
                return (
                    <div key={cat}>
                        <h4 className="mt-5 mb-2">
                            {t(`ticker.value.default.categories.${cat}.title`)}
                        </h4>
                        <table className="ml-5">
                            <thead>
                                <tr>
                                    <th></th>
                                    {configs[
                                        Object.keys(configs)[0]
                                    ].values.map((_v, i) => (
                                        <th key={i}>
                                            {t(`ticker.value.levels.${i}`)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(configs).map((k) => {
                                    return (
                                        <tr key={k}>
                                            <td className="w-15rem">
                                                {t(
                                                    `ticker.value.default.categories.${cat}.${k}`
                                                )}
                                            </td>
                                            {configs[k].values.map((v, i) => (
                                                <td key={`${cat}_${k}_${i}`}>
                                                    <InputNumber
                                                        value={v}
                                                        className="sm-input"
                                                        onValueChange={(
                                                            event
                                                        ) =>
                                                            save(
                                                                cat,
                                                                k,
                                                                i,
                                                                event.value ?? 0
                                                            )
                                                        }
                                                        minFractionDigits={
                                                            configs[k].decimals
                                                        }
                                                        maxFractionDigits={
                                                            configs[k].decimals
                                                        }
                                                        showButtons
                                                        buttonLayout="horizontal"
                                                        step={
                                                            configs[k].decimals
                                                                ? 0.25
                                                                : 1
                                                        }
                                                        incrementButtonIcon="pi pi-plus"
                                                        decrementButtonIcon="pi pi-minus"
                                                        locale={language}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {display &&
                            Object.keys(display).map((k) => {
                                return (
                                    <div key={k} className="flex ml-5 mt-2">
                                        <div className="w-15rem">
                                            {t(
                                                `ticker.value.default.categories.${cat}.display.${k}`
                                            )}
                                        </div>
                                        <div className="w-10rem text-center">
                                            {formatFromSymbol(
                                                language,
                                                display[k].symbol,
                                                metrics[display[k].metric]
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                );
            })}
        </>
    );
};
