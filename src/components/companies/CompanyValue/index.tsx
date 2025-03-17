import React from 'react'
import { useTranslation } from 'react-i18next';
import { CompanyValueConfigs } from './Config';
import { CompanyValueSummary } from './Summary';
import { GlobalMetrics } from '../../../models/types';
import { useUnit } from 'effector-react';
import { companyValuesStores } from '../../../models/company/values';
import { InfoIcon } from '../../InfoIcon';

interface CompanyValueProps {
    cik: number;
    metrics?: GlobalMetrics;
    withSummary?: boolean;
    withConfig?: boolean;
    readonly?: boolean;
    withIcon?: boolean;
}

export const CompanyValue: React.FC<CompanyValueProps> = ({ cik, metrics, withSummary, withConfig, readonly, withIcon }) => {
    const { t } = useTranslation();
    const { timestamp, configTimestamp } = useUnit(companyValuesStores.$timestamps);

    return (
        <div>
            <h2 className={`${readonly ? '' : 'bg-primary p-2'} flex`}>
                <div>
                    {!!withIcon && (<i className='pi pi-tag mr-2' />)}{t('ticker.value.title')}
                </div>
                {!readonly && (<div className='ml-auto mr-2 '>
                    <InfoIcon syncTimestamp={timestamp} editTimestamp={configTimestamp} />
                </div>)}
            </h2>
            {(!!withSummary && !!withConfig) && (<h3 className='mt-5 mb-2'>{t(`ticker.value.summary`)}</h3>)}
            {!!withSummary && (<CompanyValueSummary />)}
            {(!!withConfig && metrics) && (<CompanyValueConfigs cik={cik} metrics={metrics} />)}
        </div>
    )
}