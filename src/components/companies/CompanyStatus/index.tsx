import React from 'react';
import { useTranslation } from 'react-i18next';
import { companyStatusStores } from '../../../models/company/status';
import { useUnit } from 'effector-react';
import { StatusWorkflow } from '../../../models/company/status/types';

export const CompanyStatus: React.FC = () => {
    const { t } = useTranslation();
    const status = useUnit(companyStatusStores.$status) ?? {
        key: StatusWorkflow.INIT
    };

    return (
        <span className="bg-primary px-3 py-2">
            <i className="pi pi-clipboard mr-2" />
            {t(`ticker.status.${status.key}`)}
        </span>
    );
};
