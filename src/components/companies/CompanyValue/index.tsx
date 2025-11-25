import React from 'react';
import { useTranslation } from 'react-i18next';
import { CompanyValueConfigs } from './Config';
import { CompanyValueSummary } from './Summary';
import { Data, GlobalMetrics } from '../../../models/types';
import { useUnit } from 'effector-react';
import {
    companyValuesEffects,
    companyValuesStores
} from '../../../models/company/values';
import { InfoIcon } from '../../InfoIcon';
import { Dropdown } from 'primereact/dropdown';

interface CompanyValueProps {
    cik: number;
    metrics?: GlobalMetrics;
    lyFunds?: Data;
    withProfileSelector?: boolean;
    withSummary?: boolean;
    withConfig?: boolean;
    readonly?: boolean;
    withIcon?: boolean;
}

export const CompanyValue: React.FC<CompanyValueProps> = ({
    cik,
    metrics,
    lyFunds,
    withSummary,
    withConfig,
    withProfileSelector,
    readonly,
    withIcon
}) => {
    const { t } = useTranslation();
    const { timestamp, configTimestamp } = useUnit(
        companyValuesStores.$timestamps
    );
    const profile = useUnit(companyValuesStores.$profile);
    const profileUpdatePending = useUnit(
        companyValuesEffects.updateProfileActiveCikFx.pending
    );
    const getValuesForActiveCikPending = useUnit(
        companyValuesEffects.getValuesForActiveCikFx.pending
    );

    if (profileUpdatePending || getValuesForActiveCikPending) {
        return null;
    }

    return (
        <div>
            <h2 className={`${readonly ? '' : 'bg-primary p-2'} flex`}>
                <div>
                    {!!withIcon && <i className="pi pi-tag mr-2" />}
                    {t('ticker.value.title')}
                </div>
                {!readonly && (
                    <div className="ml-auto mr-2 ">
                        <InfoIcon
                            syncTimestamp={timestamp}
                            editTimestamp={configTimestamp}
                        />
                    </div>
                )}
            </h2>
            {!!withProfileSelector && (
                <div>
                    {t('ticker.value.config.profile.title')}
                    <Dropdown
                        className="ml-2"
                        options={[
                            {
                                label: t('ticker.value.config.profile.default'),
                                value: 'default'
                            },
                            {
                                label: t('ticker.value.config.profile.assets'),
                                value: 'assets'
                            }
                        ]}
                        value={profile}
                        onChange={(e) =>
                            companyValuesEffects.updateProfileActiveCikFx({
                                profile: e.value
                            })
                        }
                    />
                </div>
            )}
            {!!withSummary && profile === 'default' && !!withConfig && (
                <h3 className="mt-5 mb-2">{t(`ticker.value.summary`)}</h3>
            )}
            {!!withSummary && profile === 'default' && <CompanyValueSummary />}
            {!!withConfig && metrics && (
                <CompanyValueConfigs
                    cik={cik}
                    lyFunds={lyFunds}
                    metrics={metrics}
                    profile={profile}
                />
            )}
        </div>
    );
};
