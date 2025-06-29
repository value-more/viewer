import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStatusFromWorkflow } from './utils';

export const CompanyStatus: React.FC = () => {
    const { t } = useTranslation();
    const status = useStatusFromWorkflow();

    return (
        <span className="bg-primary px-3 py-2">
            <i className="pi pi-clipboard mr-2" />
            {t(`ticker.status.${status}`)}
        </span>
    );
};
