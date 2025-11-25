import React from 'react';
import { useTranslation } from 'react-i18next';
import { AssetsValueConfig } from '../types';
import { InputNumber } from 'primereact/inputnumber';
import { useUnit } from 'effector-react';
import {
    companyValuesEvents,
    companyValuesStores
} from '../../../../models/company/values';
import { CompanyAssetValue } from '../../../../models/company/values/types';
import { Data } from '../../../../models/types';
import { formatLargeNumber } from './../../../../utils/formatLargeNumber';
import { api } from '../../../../api/invData';

interface AssetsProps {
    cik: number;
    lyFunds?: Data;
    config: AssetsValueConfig;
    onConfigChange: (config: AssetsValueConfig) => void;
}

let timeout: any = null;

const calculate = (language: string, a?: number, coef?: number) => {
    a = a ?? 0;
    coef = coef ?? 0;
    return formatLargeNumber(language, a - (coef / 100) * a, -1);
};

export const Assets: React.FC<AssetsProps> = ({
    cik,
    lyFunds,
    config,
    onConfigChange
}) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const values =
        (useUnit(companyValuesStores.$values)?.values as CompanyAssetValue) ||
        [];

    const save = async (key: string, value: number) => {
        const newConfig = { ...config, [key]: value };
        onConfigChange(newConfig);

        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            await api(`invData/companies/${cik}/values/configs`, {
                method: 'POST',
                body: JSON.stringify(newConfig)
            });
            companyValuesEvents.refresh();
        }, 750);
    };

    const renderInput = (key: string) => {
        return (
            <InputNumber
                value={(config as any)?.[key]}
                className="sm-input"
                onValueChange={(event) => save(key, event.value ?? 0)}
                showButtons
                buttonLayout="horizontal"
                step={5}
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                locale={language}
            />
        );
    };

    return (
        <>
            <table className="ml-5 table-space table-results">
                <thead>
                    <tr>
                        <th></th>
                        <th className="text-center">
                            {t('ticker.value.assets.header.originalValue')}
                        </th>
                        <th className="text-center">
                            {t('ticker.value.assets.header.adjustement')}
                        </th>
                        <th className="text-right">
                            {t('ticker.value.assets.header.result')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="font-bold">
                            {t(
                                'ticker.fundamentals.BALANCE_SHEET.TOTAL_ASSETS'
                            )}
                        </td>
                        <td>
                            {formatLargeNumber(
                                language,
                                lyFunds?.BALANCE_SHEET?.TOTAL_ASSETS,
                                -1
                            )}
                        </td>
                        <td>{renderInput('totalAssets')}</td>
                        <td>
                            {calculate(
                                language,
                                lyFunds?.BALANCE_SHEET?.TOTAL_ASSETS,
                                config?.totalAssets
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">Intangibles</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="text-right">
                            {t('ticker.fundamentals.BALANCE_SHEET.GOODWILL')}
                        </td>
                        <td>
                            {formatLargeNumber(
                                language,
                                lyFunds?.BALANCE_SHEET?.GOODWILL,
                                -1
                            )}
                        </td>
                        <td>{renderInput('goodwill')}</td>
                        <td>
                            {calculate(
                                language,
                                lyFunds?.BALANCE_SHEET?.GOODWILL,
                                config?.goodwill
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-right">
                            {t(
                                'ticker.fundamentals.BALANCE_SHEET.INTANGIBLE_ASSETS'
                            )}
                        </td>
                        <td>
                            {formatLargeNumber(
                                language,
                                lyFunds?.BALANCE_SHEET?.INTANGIBLE_ASSETS,
                                -1
                            )}
                        </td>
                        <td>{renderInput('intangibleAssets')}</td>
                        <td>
                            {calculate(
                                language,
                                lyFunds?.BALANCE_SHEET?.INTANGIBLE_ASSETS,
                                config?.intangibleAssets
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-right">
                            {t(
                                'ticker.fundamentals.BALANCE_SHEET.OTHER_LONG_TERM_ASSETS'
                            )}
                        </td>
                        <td>
                            {formatLargeNumber(
                                language,
                                lyFunds?.BALANCE_SHEET?.OTHER_LONG_TERM_ASSETS,
                                -1
                            )}
                        </td>
                        <td>{renderInput('otherAssets')}</td>
                        <td>
                            {calculate(
                                language,
                                lyFunds?.BALANCE_SHEET?.OTHER_LONG_TERM_ASSETS,
                                config.otherAssets
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">
                            {t(
                                'ticker.fundamentals.BALANCE_SHEET.TOTAL_LIABILITIES'
                            )}
                        </td>
                        <td>
                            {formatLargeNumber(
                                language,
                                lyFunds?.BALANCE_SHEET?.TOTAL_LIABILITIES,
                                -1
                            )}
                        </td>
                        <td>{renderInput('totalLiabilities')}</td>
                        <td>
                            {calculate(
                                language,
                                lyFunds?.BALANCE_SHEET?.TOTAL_LIABILITIES,
                                config.totalLiabilities
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">
                            {t('ticker.value.assets.adjustedAssetsValue')}
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                            {formatLargeNumber(
                                language,
                                values.adjustedAssetValue,
                                -1
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">
                            {t('ticker.value.assets.numberOfSharesOutstanding')}
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                            {formatLargeNumber(
                                language,
                                lyFunds?.INCOME_STATEMENT
                                    ?.WEIGHTED_AVERAGE_SHARES_OUTSTANDING_DILUTED,
                                -1
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">
                            {t('ticker.value.assets.assetValuePerShare')}
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                            {formatLargeNumber(
                                language,
                                values.assetValuePerShare,
                                -1
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="font-bold">
                            {t('ticker.value.assets.marginSafetyStarRating')}
                        </td>
                        <td></td>
                        <td></td>
                        <td>{renderInput('marginSafetyStarRating')}</td>
                    </tr>
                    <tr>
                        <td className="font-bold">
                            {t('ticker.value.assets.priceInclSafetyMargin')}
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                            {formatLargeNumber(
                                language,
                                values.priceInclSafetyMargin,
                                -1
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};
