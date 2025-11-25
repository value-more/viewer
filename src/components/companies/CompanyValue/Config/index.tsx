import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../../api/invData';
import { AssetsValueConfig, DefaultCompanyValueConfig } from '../types';
import { Data, GlobalMetrics } from '../../../../models/types';
import { Default } from './Default';
import { Assets } from './Assets';

interface CompanyValueConfigsProps {
    cik: number;
    metrics: GlobalMetrics;
    lyFunds?: Data;
    profile: string;
}

export const CompanyValueConfigs: React.FC<CompanyValueConfigsProps> = ({
    cik,
    metrics,
    lyFunds,
    profile
}) => {
    const { t } = useTranslation();
    const [config, setConfig] = useState<object | null>(null);

    useEffect(() => {
        const getConfig = async () => {
            const result = await api(`invData/companies/${cik}/values/configs`);
            setConfig(result);
        };
        getConfig();
    }, [cik]);

    return (
        <div>
            <h3 className="mt-5 mb-2">{t(`ticker.value.config.title`)}</h3>
            <div className="ml-5">
                {config &&
                    metrics &&
                    (profile === 'default' ? (
                        <Default
                            cik={cik}
                            metrics={metrics}
                            config={config as DefaultCompanyValueConfig}
                            onConfigChange={(c) => setConfig(c)}
                        />
                    ) : (
                        <Assets
                            cik={cik}
                            lyFunds={lyFunds}
                            config={config as AssetsValueConfig}
                            onConfigChange={(c) => setConfig(c)}
                        />
                    ))}
            </div>
        </div>
    );
};
