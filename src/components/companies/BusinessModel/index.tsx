import { Dropdown } from 'primereact/dropdown';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { QuestionsAnswers } from '../../QuestionsAnswers';
import { useUnit } from 'effector-react';
import {
    companyScoresEffects,
    companyScoresStores
} from '../../../models/company/scores';
import { InfoIcon } from '../../InfoIcon';
import { Skeleton } from 'primereact/skeleton';
import { ApproveButton } from '../CompanyStatus/ApproveButton';
import { StatusWorkflow } from '../../../models/company/status/types';

interface BusinessModelProps {
    cik: number;
    readonly?: boolean;
    withIcon?: boolean;
}

export const BusinessModel: React.FC<BusinessModelProps> = ({
    cik,
    readonly,
    withIcon
}) => {
    const { t } = useTranslation();
    const businessModel = useUnit(companyScoresStores.$scores)?.businessModel;
    const companyScoreFxPending = useUnit(
        companyScoresEffects.getScoresForActiveCikFx.pending
    );

    return (
        <div>
            <h2 className={`${!readonly && 'bg-primary p-2'} flex`}>
                <div>
                    {!!withIcon && <i className="pi pi-briefcase mr-2" />}
                    {t('ticker.businessmodel.title')}
                </div>
                {!readonly && (
                    <div className="ml-auto">
                        <ApproveButton
                            statusKey={StatusWorkflow.BUSINESS_MODEL_APPROVED}
                        />
                    </div>
                )}
            </h2>
            {companyScoreFxPending ? (
                <Skeleton className="max-w-30rem h-2rem mb-2" />
            ) : (
                <>
                    {readonly ? (
                        <span>
                            {t(
                                `ticker.businessmodel.options.${businessModel?.val}`
                            )}
                        </span>
                    ) : (
                        <div className="text-center">
                            <span>{t('ticker.businessmodel.select')}</span>
                            <Dropdown
                                className="ml-2"
                                value={businessModel?.val}
                                readOnly={readonly}
                                options={[...Array(5)].map((_, k) => ({
                                    value: k - 2,
                                    label: t(
                                        `ticker.businessmodel.options.${k - 2}`
                                    )
                                }))}
                                onChange={(event) =>
                                    companyScoresEffects.saveScoresFx({
                                        businessModel: { val: event.value }
                                    })
                                }
                            />
                            <span className="ml-2">
                                <InfoIcon
                                    editTimestamp={businessModel?.timestamp}
                                />
                            </span>
                        </div>
                    )}
                </>
            )}
            <QuestionsAnswers
                apiUrls={{
                    questions: 'invData/companies/businessmodels/questions',
                    answers: `invData/companies/${cik}/businessmodels/questions/answers`
                }}
                readonly={readonly}
                cik={cik}
            />
        </div>
    );
};
